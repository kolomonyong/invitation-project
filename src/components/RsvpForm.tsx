'use client';

// --- vvv CHANGE IS HERE vvv ---
// We now import both hooks from 'react' instead of 'react-dom'
import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
// --- ^^^ CHANGE IS HERE ^^^ ---
import { submitRsvp, type RsvpFormState } from '@/app/actions';
import toast from 'react-hot-toast';

function SubmitButton({ isDark }: { isDark: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit"
      disabled={pending}
      className={`w-full font-medium py-3 px-6 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md disabled:cursor-not-allowed ${isDark ? 'bg-white text-black hover:bg-gray-200 disabled:bg-gray-600' : 'bg-slate-900 text-white hover:bg-slate-800 disabled:bg-slate-300'}`}
    >
      {pending ? 'Submitting...' : 'Submit RSVP'}
    </button>
  );
}

export default function RsvpForm({ invitationId, theme = 'light' }: { invitationId: string, theme?: 'light' | 'dark' }) {
  const isDark = theme === 'dark';
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
        <div className={`text-center p-8 border rounded-2xl shadow-sm ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-slate-50 border-slate-100'}`}>
            <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>Thank You!</h3>
            <p className={isDark ? 'text-gray-400' : 'text-slate-500'}>Your response has been gracefully recorded.</p>
        </div>
    );
  }

  const labelClass = `block text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-slate-700'}`;
  const inputClass = `block w-full px-4 py-3 border rounded-xl text-sm focus:ring-2 focus:border-transparent outline-none transition-all ${isDark ? 'bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:ring-gray-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-slate-900'}`;
  const radioContainerClass = `flex items-center p-3 border rounded-xl transition-colors cursor-pointer ${isDark ? 'border-gray-700 hover:bg-gray-800' : 'border-slate-200 hover:bg-slate-50'}`;
  const radioInputClass = `h-4 w-4 cursor-pointer ${isDark ? 'text-white focus:ring-white border-gray-600 bg-gray-700' : 'text-slate-900 focus:ring-slate-900 border-slate-300'}`;
  const radioLabelClass = `ml-3 block w-full text-sm font-medium cursor-pointer ${isDark ? 'text-gray-300' : 'text-slate-800'}`;

  return (
    <form action={dispatch} className="space-y-6 text-left">
      <input type="hidden" name="invitation_id" value={invitationId} />
      <div>
        <label htmlFor="guest_name" className={labelClass}>Your Full Name</label>
        <input type="text" name="guest_name" id="guest_name" required className={inputClass} placeholder="e.g. John Doe" />
        {state.errors?.guest_name && <p className="text-red-500 text-sm mt-1">{state.errors.guest_name[0]}</p>}
      </div>
      <div>
        <fieldset>
          <legend className={labelClass}>Will you attend?</legend>
          <div className="space-y-3">
            <div className={radioContainerClass}>
              <input id="attending_yes" name="is_attending" type="radio" value="yes" required className={radioInputClass}/>
              <label htmlFor="attending_yes" className={radioLabelClass}>Joyfully Attending</label>
            </div>
            <div className={radioContainerClass}>
              <input id="attending_no" name="is_attending" type="radio" value="no" className={radioInputClass}/>
              <label htmlFor="attending_no" className={radioLabelClass}>Regretfully Decline</label>
            </div>
          </div>
          {state.errors?.is_attending && <p className="text-red-500 text-sm mt-1">{state.errors.is_attending[0]}</p>}
        </fieldset>
      </div>
      <div>
        <label htmlFor="guest_count" className={labelClass}>Number of Guests</label>
        <input type="number" name="guest_count" id="guest_count" defaultValue="1" min="1" required className={inputClass} />
        {state.errors?.guest_count && <p className="text-red-500 text-sm mt-1">{state.errors.guest_count[0]}</p>}
      </div>
      <div>
        <label htmlFor="notes" className={labelClass}>Notes (Optional)</label>
        <textarea name="notes" id="notes" rows={3} className={inputClass} placeholder="e.g., dietary restrictions, well wishes..."></textarea>
      </div>
      <SubmitButton isDark={isDark} />
    </form>
  );
}