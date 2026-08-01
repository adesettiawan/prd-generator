import type { ReactNode } from 'react'

interface FormSectionProps {
  title: string
  description?: string
  optional?: boolean
  children: ReactNode
}

export function FormSection({ title, description, optional, children }: FormSectionProps) {
  return (
    <div className="bg-surface-card border border-border-default rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
        {optional && (
          <span className="text-xs text-text-secondary bg-surface-raised px-2 py-0.5 rounded-full">
            Optional
          </span>
        )}
      </div>
      {description && (
        <p className="text-xs text-text-secondary -mt-2">{description}</p>
      )}
      {children}
    </div>
  )
}
