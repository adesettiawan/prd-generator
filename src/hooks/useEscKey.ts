import { useEffect } from 'react'

export function useEscKey(handler: () => void, enabled = true) {
  useEffect(() => {
    if (!enabled) return
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handler()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [handler, enabled])
}
