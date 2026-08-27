'use client';

// --- vvv CHANGE IS HERE vvv ---
// We now import both hooks from 'react' instead of 'react-dom'
import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
// --- ^^^ CHANGE IS HERE ^^^ ---
import { submitRsvp, type RsvpFormState } from '@/app/actions';
import toast from 'react-hot-toast';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit"
      disabled={pending}
      className="w-full bg-slate-900 text-white font-medium py-3 px-6 rounded-xl hover:bg-slate-800 transition-all duration-300 shadow-sm hover:shadow-md disabled:bg-slate-300 disabled:cursor-not-allowed"
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
        <div className="text-center p-8 bg-slate-50 border border-slate-100 rounded-2xl shadow-sm">
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Thank You!</h3>
            <p className="text-slate-500">Your response has been gracefully recorded.</p>
        </div>
    );
  }

  return (
    <form action={dispatch} className="space-y-6">
      <input type="hidden" name="invitation_id" value={invitationId} />
      <div>
        <label htmlFor="guest_name" className="block text-sm font-medium text-slate-700 mb-1">Your Full Name</label>
        <input type="text" name="guest_name" id="guest_name" required className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all placeholder:text-slate-400" placeholder="e.g. John Doe" />
        {state.errors?.guest_name && <p className="text-red-500 text-sm mt-1">{state.errors.guest_name[0]}</p>}
      </div>
      <div>
        <fieldset>
          <legend className="block text-sm font-medium text-slate-700 mb-2">Will you attend?</legend>
          <div className="space-y-3">
            <div className="flex items-center p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
              <input id="attending_yes" name="is_attending" type="radio" value="yes" required className="h-4 w-4 text-slate-900 focus:ring-slate-900 border-slate-300 cursor-pointer"/>
              <label htmlFor="attending_yes" className="ml-3 block w-full text-sm font-medium text-slate-800 cursor-pointer">Joyfully Attending</label>
            </div>
            <div className="flex items-center p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
              <input id="attending_no" name="is_attending" type="radio" value="no" className="h-4 w-4 text-slate-900 focus:ring-slate-900 border-slate-300 cursor-pointer"/>
              <label htmlFor="attending_no" className="ml-3 block w-full text-sm font-medium text-slate-800 cursor-pointer">Regretfully Decline</label>
            </div>
          </div>
          {state.errors?.is_attending && <p className="text-red-500 text-sm mt-1">{state.errors.is_attending[0]}</p>}
        </fieldset>
      </div>
      <div>
        <label htmlFor="guest_count" className="block text-sm font-medium text-slate-700 mb-1">Number of Guests</label>
        <input type="number" name="guest_count" id="guest_count" defaultValue="1" min="1" required className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all" />
        {state.errors?.guest_count && <p className="text-red-500 text-sm mt-1">{state.errors.guest_count[0]}</p>}
      </div>
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-1">Notes (Optional)</label>
        <textarea name="notes" id="notes" rows={3} className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all placeholder:text-slate-400" placeholder="e.g., dietary restrictions, well wishes..."></textarea>
      </div>
      <SubmitButton />
    </form>
  );
}