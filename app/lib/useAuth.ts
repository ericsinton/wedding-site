export function saveCode(code: string, isRetro: boolean = false) {
  sessionStorage.setItem('weddingCode', code)
  sessionStorage.setItem('weddingTheme', isRetro ? 'retro' : 'normal')
}

export function getCode(): string | null {
  if (typeof window === 'undefined') return null
  return sessionStorage.getItem('weddingCode')
}

export function getTheme(): string {
  if (typeof window === 'undefined') return 'normal'
  return sessionStorage.getItem('weddingTheme') || 'normal'
}

export function clearCode() {
  sessionStorage.removeItem('weddingCode')
  sessionStorage.removeItem('weddingTheme')
}