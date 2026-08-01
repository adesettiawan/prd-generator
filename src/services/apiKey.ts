const API_KEY_STORAGE = 'gemini-api-key'

export function getApiKey(): string {
  const stored = localStorage.getItem(API_KEY_STORAGE)
  const envKey = import.meta.env.VITE_GEMINI_API_KEY
  
  console.log('API Key source:', stored ? 'localStorage' : 'env')
  console.log('API Key exists:', !!(stored || envKey))
  
  if (stored) return stored
  return envKey || ''
}

export function setApiKey(key: string): void {
  localStorage.setItem(API_KEY_STORAGE, key)
}

export function hasApiKey(): boolean {
  return !!getApiKey()
}

export function clearApiKey(): void {
  localStorage.removeItem(API_KEY_STORAGE)
}
