import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { Sparkles, AlertCircle } from 'lucide-react'
import { useGeneratePRD } from '../../hooks/useGeneratePRD'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="Project Name"
        placeholder="e.g., E-commerce Platform"
        error={errors.projectName?.message}
        {...register('projectName')}
      />

      <Textarea
        label="Core Goals"
        rows={3}
        placeholder="What are the main objectives?"
        error={errors.coreGoals?.message}
        {...register('coreGoals')}
      />

      <Input
        label="Target Audience"
        placeholder="e.g., B2B SaaS customers"
        error={errors.targetAudience?.message}
        {...register('targetAudience')}
      />

      <Textarea
        label="Key Features"
        rows={4}
        placeholder="List the main features and functionality"
        error={errors.keyFeatures?.message}
        {...register('keyFeatures')}
      />

      <Textarea
        label="Out of Scope"
        rows={2}
        placeholder="What is NOT included?"
        {...register('outOfScope')}
      />

      <Input
        label="Deadlines"
        placeholder="e.g., MVP in 3 months"
        {...register('deadlines')}
      />

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
