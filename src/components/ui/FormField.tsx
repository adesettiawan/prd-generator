import type { ReactNode } from 'react'

interface FormFieldProps {
  label: string
  required?: boolean
  error?: string
  children: ReactNode
}

export function FormField({ label, required, error, children }: FormFieldProps) {
  const fieldId = label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={fieldId}
        className="block text-sm font-medium text-text-primary"
      >
        {label}
        {required && <span className="text-text-tertiary ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p id={`${fieldId}-error`} className="text-xs text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
