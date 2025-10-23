// src/app/(admin)/admin/page.tsx
'use client'; // <-- ADD THIS to make the page interactive

import { useState, useEffect } from 'react'; // <-- Import hooks
import { createClient } from '@/lib/supabase/client'; // <-- Use client component version
import Link from 'next/link';
import toast from 'react-hot-toast';

// Define the type for our template data
type Template = {
  id: number;
  name: string;
  category: string | null;
  created_at: string;
  is_premium: boolean;
}

export default function AdminDashboardPage() {
  // Since this is now a Client Component, we manage state and loading
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // We fetch the data inside useEffect now
    const fetchTemplates = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching templates:", error);
        toast.error("Could not load templates.");
      } else {
        setTemplates(data);
      }
      setLoading(false);
    };

    fetchTemplates();
  }, [supabase]);

  // --- vvv NEW DELETE FUNCTION vvv ---
  const handleDelete = async (templateId: number) => {
    // Show a confirmation dialog before deleting
    if (window.confirm("Are you sure you want to delete this template? This action cannot be undone.")) {
      const { error } = await supabase
        .from('templates')
        .delete()
        .eq('id', templateId);

      if (error) {
        toast.error("Failed to delete template.");
        console.error("Delete error:", error);
      } else {
        toast.success("Template deleted successfully.");
        // Update the UI instantly by filtering out the deleted template
        setTemplates(currentTemplates => 
          currentTemplates.filter(template => template.id !== templateId)
        );
      }
    }
  };
  // --- ^^^ NEW DELETE FUNCTION ^^^ ---
  
  if (loading) return <p>Loading templates...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Template Management</h1>
        <Link href="/admin/templates/new" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors duration-300">
          + New Template
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {templates.map((template) => (
              <tr key={template.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{template.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{template.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{template.category || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(template.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link href={`/admin/templates/edit/${template.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                    Edit
                  </Link>
                  {/* Add the onClick handler to the delete button */}
                  <button 
                    onClick={() => handleDelete(template.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}