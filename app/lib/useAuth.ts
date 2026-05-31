import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const router = useRouter()

  useEffect(() => {
    const code = localStorage.getItem('weddingCode')
    if (!code) {
      router.push('/')
    }
  }, [router])
}

export function saveCode(code: string) {
  localStorage.setItem('weddingCode', code)
}

export function getCode(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('weddingCode')
}

export function clearCode() {
  localStorage.removeItem('weddingCode')
}