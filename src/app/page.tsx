// 'use client'

// import { useEffect, useState } from 'react'
// import { createClient } from '@/lib/supabase/client'
// import { Auth } from '@supabase/auth-ui-react'
// import { ThemeSupa } from '@supabase/auth-ui-shared'
// import type { Session } from '@supabase/supabase-js'

// export default function Home() {
//   const supabase = createClient()
//   const [session, setSession] = useState<Session | null>(null)

//   useEffect(() => {
//     // Check for an initial session
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setSession(session)
//     })

//     // Listen for changes in authentication state (login/logout)
//     const {
//       data: { subscription },
//     } = supabase.auth.onAuthStateChange((_event, session) => {
//       setSession(session)
//     })

//     // Cleanup subscription on component unmount
//     return () => subscription.unsubscribe()
//   }, [supabase.auth])

//   const handleSignOut = async () => {
//     await supabase.auth.signOut()
//     setSession(null) // Clear session in state immediately
//   }

//   // If the user is not logged in, show the Auth UI
//   if (!session) {
//     return (
//       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//         <div style={{ width: '380px' }}>
//             <Auth
//             supabaseClient={supabase}
//             appearance={{ theme: ThemeSupa }}
//             providers={['google']}
//             socialLayout="horizontal"
//             />
//         </div>
//       </div>
//     )
//   }

//   // If the user is logged in, show a welcome message and a sign out button
//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//       <h1>Welcome, {session.user.email}!</h1>
//       <p>You are now logged in.</p>
//       <button 
//         onClick={handleSignOut} 
//         style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}
//       >
//         Sign Out
//       </button>
//     </div>
//   )
// }

// src/app/page.tsx
'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useRouter } from 'next/navigation' // <-- Import the router

export default function Home() {
  const supabase = createClient()
  const router = useRouter() // <-- Initialize the router

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // If the user is logged in, redirect them to the dashboard
      if (session) {
        router.push('/dashboard')
      }
    })

    // Cleanup subscription on component unmount
    return () => subscription.unsubscribe()
  }, [supabase, router])

  // Show the login form if there is no active session
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ width: '380px' }}>
        <h1 className="text-2xl font-bold text-center mb-4">Digital Invitations</h1>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={['google']}
          socialLayout="horizontal"
        />
      </div>
    </div>
  )
}