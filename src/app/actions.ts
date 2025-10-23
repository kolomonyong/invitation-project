// src/app/actions.ts
'use server';

import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Define the shape of our form data with Zod for validation
const RsvpSchema = z.object({
  invitation_id: z.string().uuid(),
  guest_name: z.string().min(2, "Name is required"),
  is_attending: z.enum(['yes', 'no'], { message: "Please select an option" }),
  guest_count: z.coerce.number().int().min(1, "At least one guest is required"),
  notes: z.string().optional(),
});

export async function submitRsvp(
  prevState: { 
    message?: string; 
    errors?: Record<string, string[]> 
  }, 
  formData: FormData
) {
  const supabase = createServerClient();

  // Extract and validate the form data
  const validatedFields = RsvpSchema.safeParse({
    invitation_id: formData.get('invitation_id'),
    guest_name: formData.get('guest_name'),
    is_attending: formData.get('is_attending'),
    guest_count: formData.get('guest_count'),
    notes: formData.get('notes'),
  });

  // If validation fails, return the errors
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please check your input.',
    };
  }
  
  // Convert validated data into the format for our database
  const { invitation_id, guest_name, is_attending, guest_count, notes } = validatedFields.data;
  
  const { error } = await supabase
    .from('rsvps')
    .insert([{
      invitation_id,
      guest_name,
      is_attending: is_attending === 'yes', // Convert 'yes'/'no' to true/false
      guest_count,
      notes,
    }]);

  if (error) {
    console.error("RSVP Insert Error:", error);
    return { message: 'Database error: Could not save your RSVP.', errors: {} };
  }

  // If successful, revalidate the path (for future use) and return a success message
  revalidatePath(`/invite/${invitation_id}`);
  return { message: 'Thank you for your response!', errors: {} };
}