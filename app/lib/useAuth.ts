import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const router = useRouter()

  useEffect(() => {
    const code = sessionStorage.getItem('weddingCode')
    if (!code) {
      router.push('/')
    }
  }, [router])
}

export function saveCode(code: string) {
  sessionStorage.setItem('weddingCode', code)
}

export function getCode(): string | null {
  if (typeof window === 'undefined') return null
  return sessionStorage.getItem('weddingCode')
}

export function clearCode() {
  sessionStorage.removeItem('weddingCode')
}