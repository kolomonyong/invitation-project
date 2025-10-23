// src/app/(admin)/admin/templates/new/page.tsx
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function NewTemplatePage() {
  const router = useRouter();
  const supabase = createClient();

  // State for each form field
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [previewImageUrl, setPreviewImageUrl] = useState('');
  const [structureJson, setStructureJson] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let parsedStructureJson;
    try {
      // Validate that the structureJson is valid JSON before saving
      parsedStructureJson = JSON.parse(structureJson);
    } catch (error) {
      toast.error("The 'Structure JSON' is not valid JSON. Please check the format.");
      setIsSubmitting(false);
      return;
    }
    
    const { error } = await supabase
      .from('templates')
      .insert([
        { 
          name, 
          category,
          preview_image_url: previewImageUrl,
          structure_json: parsedStructureJson,
        }
      ]);

    if (error) {
      console.error("Error creating template:", error);
      toast.error("Failed to create template. Check console for details.");
    } else {
      toast.success("Template created successfully!");
      router.push('/admin'); // Redirect back to the admin dashboard
      router.refresh(); // Tell Next.js to refresh the data on the admin page
    }

    setIsSubmitting(false);
  };

  const exampleJson = `{
  "fields": [
    { "name": "guestName", "label": "Guest's Name", "type": "text" },
    { "name": "eventDate", "label": "Date of Event", "type": "date" },
    { "name": "eventLocation", "label": "Location", "type": "text" },
    { "name": "mainImage", "label": "Main Photo", "type": "image" }
  ]
}`;

  return (
    <div>
      <Link href="/admin" className="text-blue-500 hover:underline mb-4 inline-block">
        &larr; Back to Template List
      </Link>
      <h1 className="text-3xl font-bold mb-6">Create New Template</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Template Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 text-black"
            required
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-300 text-black"
            placeholder="e.g., wedding, corporate"
          />
        </div>
        <div>
          <label htmlFor="previewImageUrl" className="block text-sm font-medium text-gray-700">Preview Image URL</label>
          <input
            type="text"
            id="previewImageUrl"
            value={previewImageUrl}
            onChange={(e) => setPreviewImageUrl(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-300 text-black"
            placeholder="https://placehold.co/..."
          />
        </div>
        <div>
          <label htmlFor="structureJson" className="block text-sm font-medium text-gray-700">Structure JSON</label>
          <textarea
            id="structureJson"
            rows={10}
            value={structureJson}
            onChange={(e) => setStructureJson(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm placeholder-gray-300 text-black"
            placeholder={exampleJson}
            required
          />
           <p className="mt-2 text-xs text-gray-500">This JSON defines the fields for the invitation editor.</p>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
        >
          {isSubmitting ? 'Saving...' : 'Save Template'}
        </button>
      </form>
    </div>
  );
}