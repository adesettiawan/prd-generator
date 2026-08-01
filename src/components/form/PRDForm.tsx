import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { Sparkles, AlertCircle } from 'lucide-react'
import { useGeneratePRD } from '../../hooks/useGeneratePRD'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import { FormSection } from '../ui/FormSection'
import { FormField } from '../ui/FormField'
import type { PRDParams } from '../../types/prd'

const prdSchema = z.object({
  projectName: z.string().min(1, 'Project name is required'),
  coreGoals: z.string().min(10, 'Core goals must be at least 10 characters'),
  targetAudience: z.string().min(5, 'Target audience is required'),
  keyFeatures: z.string().min(10, 'Key features must be at least 10 characters'),
  outOfScope: z.string().optional(),
  deadlines: z.string().optional(),
})

type PRDFormData = z.infer<typeof prdSchema>

export function PRDForm() {
  const navigate = useNavigate()
  const generatePRD = useGeneratePRD()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PRDFormData>({
    resolver: zodResolver(prdSchema),
  })

  const onSubmit = async (data: PRDFormData) => {
    const params: PRDParams = {
      projectName: data.projectName,
      coreGoals: data.coreGoals,
      targetAudience: data.targetAudience,
      keyFeatures: data.keyFeatures,
      outOfScope: data.outOfScope || 'None specified',
      deadlines: data.deadlines || 'Flexible',
    }

    try {
      const result = await generatePRD.mutateAsync(params)

      navigate('/editor', {
        state: {
          params,
          content: result,
        },
      })
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormSection title="Project Info" description="Basic details about your project">
        <FormField label="Project Name" required error={errors.projectName?.message}>
          <Input
            placeholder="e.g., E-commerce Platform"
            {...register('projectName')}
          />
        </FormField>
        <FormField label="Target Audience" required error={errors.targetAudience?.message}>
          <Input
            placeholder="e.g., B2B SaaS customers"
            {...register('targetAudience')}
          />
        </FormField>
      </FormSection>

      <FormSection title="Requirements" description="What should this PRD cover?">
        <FormField label="Core Goals" required error={errors.coreGoals?.message}>
          <Textarea
            rows={3}
            placeholder="What are the main objectives?"
            {...register('coreGoals')}
          />
        </FormField>
        <FormField label="Key Features" required error={errors.keyFeatures?.message}>
          <Textarea
            rows={4}
            placeholder="List the main features and functionality"
            {...register('keyFeatures')}
          />
        </FormField>
      </FormSection>

      <FormSection title="Additional" optional>
        <FormField label="Out of Scope" error={errors.outOfScope?.message}>
          <Textarea
            rows={2}
            placeholder="What is NOT included?"
            {...register('outOfScope')}
          />
        </FormField>
        <FormField label="Deadlines" error={errors.deadlines?.message}>
          <Input
            placeholder="e.g., MVP in 3 months"
            {...register('deadlines')}
          />
        </FormField>
      </FormSection>

      <div className="pt-2">
        <Button
          type="submit"
          size="lg"
          isLoading={generatePRD.isPending}
          className="w-full"
        >
          {generatePRD.isPending ? (
            'Generating...'
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate PRD
            </>
          )}
        </Button>
      </div>

      {generatePRD.isError && (
        <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-red-400 font-medium">
              Generation failed
            </p>
            <p className="text-xs text-red-400/70 mt-1">
              {generatePRD.error?.message || 'Check your API key in Settings and try again.'}
            </p>
          </div>
        </div>
      )}
    </form>
  )
}
