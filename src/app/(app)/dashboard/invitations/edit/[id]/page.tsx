'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import Link from 'next/link';
import type { User } from '@supabase/supabase-js';

type Field = { 
  name: string; 
  label: string; 
  type: 'text' | 'date' | 'image'; 
  required?: boolean;
};

type TemplateStructure = { fields: Field[]; };

export default function EditInvitationPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const supabase = createClient();

  const [user, setUser] = useState<User | null>(null);
  const [templateStructure, setTemplateStructure] = useState<TemplateStructure | null>(null);
  const [formData, setFormData] = useState<{ [key: string]: string }>({});  // More specific type
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>(''); // Track current image
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (!user) {
        router.push('/');
        setLoading(false);
        return;
      }

      // 1. Fetch the invitation data, ensuring the current user owns it
      const { data: invitation, error: invError } = await supabase
        .from('invitations')
        .select('custom_data, template_id')
        .eq('id', params.id)
        .eq('user_id', user.id) // Security check!
        .single();

      if (invError || !invitation) {
        toast.error("Invitation not found or you don't have permission to edit it.");
        router.push('/dashboard');
        return;
      }

      // 2. Fetch the template structure based on the invitation's template_id
      const { data: template, error: tplError } = await supabase
        .from('templates')
        .select('structure_json')
        .eq('id', invitation.template_id)
        .single();
      
      if (tplError || !template) {
        toast.error("Could not load template structure.");
        router.push('/dashboard');
        return;
      }
      
      setTemplateStructure(template.structure_json);

      // 3. Initialize form data properly to avoid controlled/uncontrolled warnings
      const initialFormData: { [key: string]: string } = {};
      const imageFieldName = template.structure_json.fields.find((f: Field) => f.type === 'image')?.name;
      
      template.structure_json.fields.forEach((field: Field) => {
        if (field.type === 'image') {
          // Store current image URL separately
          if (invitation.custom_data[field.name]) {
            setCurrentImageUrl(invitation.custom_data[field.name]);
          }
        } else {
          // Initialize text/date fields with existing values or empty strings
          initialFormData[field.name] = invitation.custom_data[field.name] || '';
        }
      });
      
      setFormData(initialFormData);
      setLoading(false);
    };

    getData();
  }, [params.id, router, supabase]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    
    if (e.target.type === 'file' && e.target.files) {
      const file = e.target.files[0];
      
      if (file && file.size > MAX_FILE_SIZE) {
        toast.error("File is too large! Maximum size is 5MB.");
        e.target.value = '';
        setImageFile(null);
        return;
      }
      setImageFile(file || null);
    } else {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !templateStructure) return;
    
    setIsSubmitting(true);

    let finalFormData = { ...formData };

    // Handle image upload if a new file was selected
    if (imageFile) {
      const imageFieldName = templateStructure.fields.find(f => f.type === 'image')?.name;
      if (imageFieldName) {
        const filePath = `${user.id}/${params.id}-${Date.now()}_${imageFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from('invitation-images')
          .upload(filePath, imageFile);

        if (uploadError) {
          toast.error("Error uploading new image.");
          setIsSubmitting(false);
          return;
        }
        
        const { data: { publicUrl } } = supabase.storage
          .from('invitation-images')
          .getPublicUrl(filePath);
        
        finalFormData[imageFieldName] = publicUrl;
      }
    } else if (currentImageUrl) {
      // Keep the existing image if no new file was selected
      const imageFieldName = templateStructure.fields.find(f => f.type === 'image')?.name;
      if (imageFieldName) {
        finalFormData[imageFieldName] = currentImageUrl;
      }
    }

    // Update the invitation
    const { error } = await supabase
      .from('invitations')
      .update({ custom_data: finalFormData })
      .eq('id', params.id)
      .eq('user_id', user.id); // Additional security check

    if (error) {
      console.error('Update error:', error);
      toast.error("Failed to update invitation.");
    } else {
      toast.success("Invitation updated successfully!");
      router.push('/dashboard');
      router.refresh();
    }
    
    setIsSubmitting(false);
  };

  if (loading) return <p className="text-center p-8">Loading editor...</p>;
  if (!templateStructure) return <p className="text-center p-8">Could not load template structure.</p>;

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <Link href="/dashboard" className="text-blue-500 hover:underline mb-4 inline-block">
        &larr; Back to Dashboard
      </Link>
      <h1 className="text-3xl font-bold mb-6">Edit Invitation</h1>
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  accept="image/*"
                />
                {imageFile ? (
                  <p className="text-sm text-green-600 mt-1">
                    New image selected: {imageFile.name}
                  </p>
                ) : currentImageUrl ? (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-2">Current image:</p>
                    <img 
                      src={currentImageUrl} 
                      alt="Current invitation image" 
                      className="max-w-xs max-h-32 object-contain border rounded"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Choose a new file above to replace this image.
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mt-1">No image currently set.</p>
                )}
              </div>
            ) : (
              <input
                type={field.type}
                id={field.name}
                name={field.name}
                value={formData[field.name] || ''} // This will always be a string now
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required={field.required}
              />
            )}
          </div>
        ))}
        
        <button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400 transition-colors duration-300"
        >
          {isSubmitting ? 'Updating...' : 'Update Invitation'}
        </button>
      </form>
    </div>
  );
}