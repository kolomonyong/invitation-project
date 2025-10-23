'use client';

// --- vvv CHANGE IS HERE vvv ---
// We now import both hooks from 'react' instead of 'react-dom'
import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
// --- ^^^ CHANGE IS HERE ^^^ ---
import { submitRsvp } from '@/app/actions';
import toast from 'react-hot-toast';

// This type definition remains the same
type RsvpFormState = {
  message: string;
  errors?: {
    invitation_id?: string[];
    guest_name?: string[];
    is_attending?: string[];
    guest_count?: string[];
    notes?: string[];
  };
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit"
      disabled={pending}
      className="w-full bg-purple-600 text-white font-bold py-3 px-6 rounded-full hover:bg-purple-700 transition-colors duration-300 shadow-lg disabled:bg-gray-400"
    >
      {pending ? 'Submitting...' : 'Submit RSVP'}
    </button>
  );
}

export default function RsvpForm({ invitationId }: { invitationId: string }) {
  const initialState: RsvpFormState = { message: '', errors: {} };
  
  // --- vvv CHANGE IS HERE vvv ---
  // The hook is renamed from useFormState to useActionState
  const [state, dispatch] = useActionState(submitRsvp, initialState);
  // --- ^^^ CHANGE IS HERE ^^^ ---

  useEffect(() => {
    if (state.message && state.message.includes('Thank you')) {
      toast.success(state.message);
    } else if (state.message && state.message !== '') {
      toast.error(state.message);
    }
  }, [state]);

  if (state.message?.includes('Thank you')) {
    return (
        <div className="text-center p-8 bg-green-50 rounded-lg">
            <h3 className="text-2xl font-bold text-green-700">Thank You!</h3>
            <p className="text-gray-600">Your response has been recorded.</p>
        </div>
    );
  }

  return (
    <form action={dispatch} className="space-y-6">
      <input type="hidden" name="invitation_id" value={invitationId} />
      <div>
        <label htmlFor="guest_name" className="block text-sm font-medium text-gray-700">Your Full Name</label>
        <input type="text" name="guest_name" id="guest_name" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
        {state.errors?.guest_name && <p className="text-red-500 text-sm mt-1">{state.errors.guest_name[0]}</p>}
      </div>
      <div>
        <fieldset>
          <legend className="block text-sm font-medium text-gray-700">Will you attend?</legend>
          <div className="mt-2 space-y-2">
            <div className="flex items-center">
              <input id="attending_yes" name="is_attending" type="radio" value="yes" required className="h-4 w-4 text-purple-600 border-gray-300"/>
              <label htmlFor="attending_yes" className="ml-3 block text-sm text-gray-900">Joyfully Attending</label>
            </div>
            <div className="flex items-center">
              <input id="attending_no" name="is_attending" type="radio" value="no" className="h-4 w-4 text-purple-600 border-gray-300"/>
              <label htmlFor="attending_no" className="ml-3 block text-sm text-gray-900">Regretfully Decline</label>
            </div>
          </div>
          {state.errors?.is_attending && <p className="text-red-500 text-sm mt-1">{state.errors.is_attending[0]}</p>}
        </fieldset>
      </div>
      <div>
        <label htmlFor="guest_count" className="block text-sm font-medium text-gray-700">Number of Guests (including yourself)</label>
        <input type="number" name="guest_count" id="guest_count" defaultValue="1" min="1" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
        {state.errors?.guest_count && <p className="text-red-500 text-sm mt-1">{state.errors.guest_count[0]}</p>}
      </div>
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes (optional)</label>
        <textarea name="notes" id="notes" rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="e.g., dietary restrictions, well wishes..."></textarea>
      </div>
      <SubmitButton />
    </form>
  );
}