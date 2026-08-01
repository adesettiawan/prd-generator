import type { PRDParams } from '../types/prd'
import { getApiKey } from './apiKey'

const API_BASE = 'https://generativelanguage.googleapis.com/v1beta'

const PRD_PROMPT_TEMPLATE = `You are a senior product manager. Create a comprehensive Product Requirements Document (PRD) based on the following information.

Project Name: {projectName}
Core Goals: {coreGoals}
Target Audience: {targetAudience}
Key Features: {keyFeatures}
Out of Scope: {outOfScope}
Deadlines: {deadlines}

Generate a well-structured PRD in Markdown format with the following sections:
1. Overview
2. Objectives and Success Criteria
3. Key Features and Functional Requirements
4. Technical Requirements
5. User Scenarios (User Stories)
6. Dependencies
7. Timeline & Milestones
8. Risks and Mitigations
9. Appendix

Make it professional, detailed, and implementation-ready. Use clear headings, bullet points, and tables where appropriate.`

async function listModels(apiKey: string): Promise<string[]> {
  console.log('[Gemini] Listing available models...')
  const response = await fetch(`${API_BASE}/models?key=${apiKey}`)

  if (!response.ok) {
    const error = await response.text()
    console.error('[Gemini] List models failed:', response.status, error)
    throw new Error(`Failed to list models: ${response.status} ${error}`)
  }

  const data = await response.json()
  const models = data.models || []

  // Filter models that support generateContent
  const generativeModels = models
    .filter((m: { supportedGenerationMethods?: string[] }) =>
      m.supportedGenerationMethods?.includes('generateContent')
    )
    .map((m: { name: string }) => m.name.replace('models/', ''))

  console.log('[Gemini] Available generative models:', generativeModels)
  return generativeModels
}

async function generateWithModel(
  apiKey: string,
  modelName: string,
  prompt: string
): Promise<string> {
  console.log(`[Gemini] Generating with model: ${modelName}`)

  const response = await fetch(
    `${API_BASE}/models/${modelName}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    console.error(`[Gemini] Generate failed for ${modelName}:`, response.status, error)
    throw new Error(`Generate failed: ${response.status} ${error}`)
  }

  const data = await response.json()

  if (!data.candidates || data.candidates.length === 0) {
    throw new Error('No response generated')
  }

  return data.candidates[0].content.parts[0].text
}

export async function generatePRD(params: PRDParams): Promise<string> {
  const apiKey = getApiKey()
  if (!apiKey) {
    throw new Error(
      'No API key configured. Click Settings (gear icon) in the top-right corner to add your Gemini API key.'
    )
  }

  // List available models
  const models = await listModels(apiKey)

  if (models.length === 0) {
    throw new Error(
      'No generative models available for your API key.\n\nPlease check:\n1. Your API key is valid\n2. Gemini API is enabled in your Google Cloud project\n3. Your region supports Gemini API'
    )
  }

  // Try models in order of preference (newest first)
  const preferredOrder = [
    'gemini-3.6-flash',
    'gemini-3.1-flash',
    'gemini-3.6-pro',
    'gemini-3.1-pro',
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-pro',
  ]

  // Find first available model from preferred list, or use first available
  const modelName =
    preferredOrder.find((m) => models.includes(m)) || models[0]

  console.log(`[Gemini] Using model: ${modelName}`)

  const prompt = PRD_PROMPT_TEMPLATE
    .replace('{projectName}', params.projectName)
    .replace('{coreGoals}', params.coreGoals)
    .replace('{targetAudience}', params.targetAudience)
    .replace('{keyFeatures}', params.keyFeatures)
    .replace('{outOfScope}', params.outOfScope)
    .replace('{deadlines}', params.deadlines)

  console.log('[Gemini] Generating PRD...')

  const text = await generateWithModel(apiKey, modelName, prompt)

  console.log('[Gemini] PRD generated, length:', text.length)

  return text
}
