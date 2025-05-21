'use client'

import { useUser } from '@/context/UserContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProtectedRouteAdmin({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading ) {
        if (user === null)
            router.replace('/auth')
        else if(user.email!=process.env.NEXT_PUBLIC_ADMIN_EMAIL) router.replace('/')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <div className="p-4 text-center">🔒 Đang kiểm tra đăng nhập...</div>
  }

  return <>{children}</>
}
