// src/app/(admin)/admin/templates/edit/[id]/page.tsx
'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import Link from 'next/link';

// Reusing our Template type, but making all fields optional for initial state
type Template = {
  id: number;
  name: string;
  category: string | null;
  preview_image_url: string | null;
  structure_json: any;
}

export default function EditTemplatePage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const supabase = createClient();

  const [template, setTemplate] = useState<Partial<Template>>({});
  const [structureJsonString, setStructureJsonString] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTemplate = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('id', params.id)
        .single();
      
      if (error || !data) {
        toast.error("Could not fetch template data.");
        console.error(error);
        router.push('/admin');
      } else {
        setTemplate(data);
        // Convert the JSON object back to a formatted string for the textarea
        setStructureJsonString(JSON.stringify(data.structure_json, null, 2));
      }
      setLoading(false);
    };

    fetchTemplate();
  }, [params.id, router, supabase]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'structure_json') {
      setStructureJsonString(value);
    } else {
      setTemplate(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let parsedStructureJson;
    try {
      parsedStructureJson = JSON.parse(structureJsonString);
    } catch (error) {
      toast.error("The 'Structure JSON' is not valid JSON.");
      setIsSubmitting(false);
      return;
    }
    
    // The key difference: .update() and .eq() instead of .insert()
    const { error } = await supabase
      .from('templates')
      .update({ 
        name: template.name,
        category: template.category,
        preview_image_url: template.preview_image_url,
        structure_json: parsedStructureJson,
      })
      .eq('id', params.id); // Specify which row to update

    if (error) {
      toast.error("Failed to update template.");
      console.error(error);
    } else {
      toast.success("Template updated successfully!");
      router.push('/admin');
      router.refresh();
    }
    setIsSubmitting(false);
  };
  
  if (loading) return <p>Loading template data...</p>;

  return (
    <div>
      <Link href="/admin" className="text-blue-500 hover:underline mb-4 inline-block">&larr; Back to Template List</Link>
      <h1 className="text-3xl font-bold mb-6">Edit Template (ID: {template.id})</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Template Name</label>
          <input type="text" name="name" value={template.name || ''} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-300 text-black" required />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <input type="text" name="category" value={template.category || ''} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-300 text-black" placeholder="e.g., wedding, corporate" />
        </div>
        <div>
          <label htmlFor="preview_image_url" className="block text-sm font-medium text-gray-700">Preview Image URL</label>
          <input type="text" name="preview_image_url" value={template.preview_image_url || ''} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-300 text-black" placeholder="https://placehold.co/..." />
        </div>
        <div>
          <label htmlFor="structure_json" className="block text-sm font-medium text-gray-700">Structure JSON</label>
          <textarea name="structure_json" rows={10} value={structureJsonString} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm placeholder-gray-300 text-black" required />
          <p className="mt-2 text-xs text-gray-500">This JSON defines the fields for the invitation editor.</p>
        </div>
        <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400">
          {isSubmitting ? 'Updating...' : 'Update Template'}
        </button>
      </form>
    </div>
  );
}