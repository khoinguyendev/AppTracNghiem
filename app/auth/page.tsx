// app/sign-in/page.tsx hoặc app/sign-in/SignIn.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useUser } from '@/context/UserContext'
import { useRouter } from 'next/navigation'
import { Session } from '@supabase/supabase-js'

export default function SignIn() {
const [session, setSession] = useState<Session | null>(null)
  const { setUser } = useUser()
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) setUser(session.user)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session?.user) setUser(session.user)
    })

    return () => subscription.unsubscribe()
  }, [setUser])

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-lg shadow-md bg-white p-6 space-y-4">
          <h2 className="text-2xl font-bold text-center">Chào mừng</h2>
          <p className="text-center text-sm text-gray-500">
            Chỉ đăng nhập bằng Google 😄
          </p>

          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={['google']}
            theme="dark"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <h2 className="text-xl font-semibold">✅ You are logged in!</h2>
      <button
        onClick={() => router.push('/')}
        className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        Về trang chủ
      </button>
    </div>
  )
}
