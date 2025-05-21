'use client'

import { useUser } from '@/context/UserContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user === null) {
      router.replace('/auth')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return <div className="p-4 text-center">🔒 Đang kiểm tra đăng nhập...</div>
  }

  return <>{children}</>
}
