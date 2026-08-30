'use client';

// --- vvv CHANGE IS HERE vvv ---
// We now import both hooks from 'react' instead of 'react-dom'
import { useActionState, useEffect, useState } from 'react';
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

  const [isAttending, setIsAttending] = useState<string | null>(null);

  useEffect(() => {
    if (state.message && state.message.includes('Thank you')) {
      toast.success(state.message);
    } else if (state.message && state.message !== '') {
      toast.error(state.message);
    }
  }, [state]);

  if (state.message?.includes('Thank you')) {
    return (
        <div className={`text-center p-8 border rounded-2xl shadow-sm ${isDark ? 'bg-gray-800/80 backdrop-blur border-gray-700' : 'bg-white/80 backdrop-blur border-slate-100'}`}>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-green-100 text-green-600">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>Thank You!</h3>
            <p className={isDark ? 'text-gray-300' : 'text-slate-500'}>Your response has been gracefully recorded.</p>
        </div>
    );
  }

  const labelClass = `block text-sm font-semibold mb-2 ${isDark ? 'text-gray-200' : 'text-slate-700'}`;
  const inputClass = `block w-full px-4 py-3.5 border rounded-xl text-sm focus:ring-2 focus:border-transparent outline-none transition-all ${isDark ? 'bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:ring-gray-400' : 'bg-white/50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-slate-900'}`;
  
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
          <div className="grid grid-cols-2 gap-4">
            <label className={`relative flex flex-col items-center justify-center p-4 cursor-pointer border rounded-xl transition-all ${isAttending === 'yes' ? (isDark ? 'bg-gray-700 border-gray-500 ring-2 ring-gray-400' : 'bg-slate-900 border-slate-900 text-white shadow-md') : (isDark ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-700' : 'bg-white/50 border-slate-200 hover:bg-slate-50 text-slate-700')} `}>
              <input type="radio" name="is_attending" value="yes" className="sr-only" required onChange={(e) => setIsAttending(e.target.value)} />
              <svg className={`w-8 h-8 mb-2 ${isAttending === 'yes' ? (isDark ? 'text-white' : 'text-white') : (isDark ? 'text-gray-400' : 'text-slate-400')}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className={`font-semibold text-sm ${isAttending === 'yes' ? 'text-current' : ''}`}>Joyfully Attending</span>
            </label>
            
            <label className={`relative flex flex-col items-center justify-center p-4 cursor-pointer border rounded-xl transition-all ${isAttending === 'no' ? (isDark ? 'bg-gray-700 border-gray-500 ring-2 ring-gray-400' : 'bg-slate-900 border-slate-900 text-white shadow-md') : (isDark ? 'bg-gray-800/50 border-gray-700 hover:bg-gray-700' : 'bg-white/50 border-slate-200 hover:bg-slate-50 text-slate-700')} `}>
              <input type="radio" name="is_attending" value="no" className="sr-only" onChange={(e) => setIsAttending(e.target.value)} />
              <svg className={`w-8 h-8 mb-2 ${isAttending === 'no' ? (isDark ? 'text-white' : 'text-white') : (isDark ? 'text-gray-400' : 'text-slate-400')}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className={`font-semibold text-sm text-center ${isAttending === 'no' ? 'text-current' : ''}`}>Regretfully Decline</span>
            </label>
          </div>
          {state.errors?.is_attending && <p className="text-red-500 text-sm mt-1">{state.errors.is_attending[0]}</p>}
        </fieldset>
      </div>

      <div className={`transition-all duration-300 overflow-hidden ${isAttending === 'yes' ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}>
        <label htmlFor="guest_count" className={labelClass}>Number of Guests</label>
        <input type="number" name="guest_count" id="guest_count" defaultValue="1" min="1" className={inputClass} />
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