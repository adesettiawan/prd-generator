import { useMutation } from '@tanstack/react-query'
import { generatePRD } from '../services/gemini'

export function useGeneratePRD() {
  return useMutation({
    mutationFn: generatePRD,
    onError: (error: Error) => {
      console.error('PRD generation failed:', error.message)
    },
  })
}
