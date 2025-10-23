'use client'

import { useState, useEffect, FormEvent } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import toast from 'react-hot-toast';

// Type definitions are the same
type Field = { name: string; label: string; type: 'text' | 'date' | 'image'; required?: boolean; };
type TemplateStructure = { fields: Field[]; };

export default function EditorPage() {
  const supabase = createClient()
  const router = useRouter()
  const params = useParams<{ id: string }>(); 
  
  const [user, setUser] = useState<User | null>(null);
  const [templateStructure, setTemplateStructure] = useState<TemplateStructure | null>(null)
  const [formData, setFormData] = useState<{ [key: string]: string }>({})
  const [imageFiles, setImageFiles] = useState<{ [key: string]: File }>({})
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (!user) {
        toast.error("Please log in to access this page.");
        router.push('/');
        return;
      }

      const { data, error } = await supabase
        .from('templates')
        .select('structure_json')
        .eq('id', params.id)
        .single();

      if (error || !data) {
        console.error('Error fetching template structure:', error)
        toast.error("Sorry, we couldn't find that template.");
        router.push('/dashboard')
      } else {
        setTemplateStructure(data.structure_json);
        const initialFormData: { [key: string]: string } = {};
        data.structure_json.fields.forEach((field: Field) => {
          if (field.type !== 'image') {
            initialFormData[field.name] = '';
          }
        });
        setFormData(initialFormData);
      }
      setLoading(false);
    }
    
    if (params.id) { 
      getData(); 
    }
  }, [params.id, supabase, router])
  // Form validation is handled during form submission
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Prevent any form submission behavior
    e.stopPropagation();
    
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const { name, type } = e.target;

    console.log('Input change detected:', { name, type, files: e.target.files?.length || 0 });

    if (type === 'file' && e.target.files) {
      const file = e.target.files[0];
      
      if (file && file.size > MAX_FILE_SIZE) {
        toast.error("File is too large! Maximum size is 5MB.");
        e.target.value = '';
        // Remove from state if it was previously set
        const newFiles = { ...imageFiles };
        delete newFiles[name];
        setImageFiles(newFiles);
        return; 
      }
      
      // Store the file in our object using the input's name as the key
      if (file) {
        console.log('Setting image file:', { name, fileName: file.name });
        setImageFiles(prev => ({ ...prev, [name]: file }));
        toast.success(`Image selected: ${file.name}`);
      } else {
        // If the user cancels file selection, remove it from state
        const newFiles = { ...imageFiles };
        delete newFiles[name];
        setImageFiles(newFiles);
      }
    } else {
      const { value } = e.target;
      console.log('Setting form data:', { name, value });
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to create an invitation.");
      return;
    }
    setIsSubmitting(true);

    // This is the full async action we want to track with one toast.
    const fullSavePromise = async () => {
        const finalFormData = { ...formData };

        // --- 1. UPLOAD IMAGES IN PARALLEL ---
        // We create an array of promises, one for each file upload.
        const uploadPromises = Object.entries(imageFiles).map(async ([fieldName, file]) => {
            const filePath = `${user.id}/${Date.now()}_${file.name}`;
            
            const { data, error } = await supabase.storage
              .from('invitation-images')
              .upload(filePath, file);

            // If a single upload fails, we throw an error to stop everything.
            if (error) {
              throw new Error(`Failed to upload ${file.name}: ${error.message}`);
            }

            const { data: { publicUrl } } = supabase.storage
              .from('invitation-images')
              .getPublicUrl(data.path);

            // Return the field name and its new URL
            return { fieldName, publicUrl };
        });
        
        // Promise.all runs all upload promises at the same time and waits for them all to finish.
        const uploadResults = await Promise.all(uploadPromises);

        // --- 2. POPULATE FORM DATA WITH NEW IMAGE URLS ---
        uploadResults.forEach(result => {
            finalFormData[result.fieldName] = result.publicUrl;
        });

        // --- 3. SAVE THE FINAL INVITATION DATA TO THE DATABASE ---
        const newInvitation = {
          user_id: user.id,
          template_id: params.id,
          custom_data: finalFormData,
        };
        const { error: insertError } = await supabase.from('invitations').insert([newInvitation]);

        if (insertError) {
          throw insertError;
        }
    };

    // --- WRAP THE ENTIRE PROCESS IN ONE TOAST.PROMISE ---
    await toast.promise(
        fullSavePromise(), // We call the function here to start the process
        {
            loading: 'Uploading images and saving invitation...',
            success: () => {
                router.push('/dashboard');
                return <b>Invitation created successfully!</b>;
            },
            error: (err) => {
                console.error("Error during save process:", err);
                return <b>An error occurred: {err.message}</b>;
            }
        }
    );
    
    setIsSubmitting(false);
}

  // Handle button clicks to prevent accidental form submission
  // const handleButtonClick = (e: React.MouseEvent) => {
  //   // Only allow form submission if this is the submit button
  //   if (e.currentTarget.type !== 'submit') {
  //     e.preventDefault();
  //     e.stopPropagation();
  //   }
  // };

  if (loading) return <p className="text-center p-8">Loading Editor...</p>
  if (!templateStructure) return <p className="text-center p-8">Template not found.</p>

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Customize Your Invitation</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
        {templateStructure.fields.map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            
            {field.type === 'image' ? (
              <div>
                <input
                  type="file"
                  id={field.name}
                  name={field.name}
                  onChange={handleInputChange}
                  // onClick={handleButtonClick} // Prevent accidental form submission
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  accept="image/*"
                  required={field.required}
                />
                {imageFiles[field.name] && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                    <p className="text-sm text-green-700 font-medium">
                      ✓ Selected: {imageFiles[field.name].name}
                    </p>
                    <p className="text-xs text-green-600">
                      Size: {(imageFiles[field.name].size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                value={formData[field.name] || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required={field.required}
              />
            )}
          </div>
        ))}
        
        {/* Debug info - remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-3 bg-gray-100 rounded text-sm">
            <p><strong>Debug Info:</strong></p>
            <p>Images selected: {Object.keys(imageFiles).length}</p>
            <p>Form fields filled: {Object.keys(formData).filter(key => formData[key]).length}</p>
          </div>
        )}
        
        <button 
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400 transition-colors duration-200"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Invitation'}
        </button>
      </form>
    </div>
  )
}