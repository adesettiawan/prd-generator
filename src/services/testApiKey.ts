import { getApiKey } from './apiKey'

const API_BASE = 'https://generativelanguage.googleapis.com/v1beta'

export async function testApiKey(): Promise<{
  success: boolean
  message: string
  details?: string
}> {
  const apiKey = getApiKey()

  if (!apiKey) {
    return {
      success: false,
      message: 'No API key configured',
      details: 'Please set your Gemini API key in Settings.',
    }
  }

  console.log('[API Test] Testing API key...')
  console.log('[API Test] Key length:', apiKey.length)

  try {
    // Step 1: List models
    console.log('[API Test] Step 1: Listing models...')
    const listResponse = await fetch(`${API_BASE}/models?key=${apiKey}`)

    if (!listResponse.ok) {
      const error = await listResponse.text()
      console.error('[API Test] List models failed:', listResponse.status, error)

      let userMessage = 'Failed to list models'
      if (listResponse.status === 400 || listResponse.status === 403) {
        userMessage = 'Invalid API key or access denied'
      }

      return {
        success: false,
        message: userMessage,
        details: `Status: ${listResponse.status}\n${error}`,
      }
    }

    const listData = await listResponse.json()
    const allModels = listData.models || []
    console.log('[API Test] Total models found:', allModels.length)

    // Filter generative models and sort by preference (newest first)
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

    const generativeModels = allModels
      .filter(
        (m: { supportedGenerationMethods?: string[] }) =>
          m.supportedGenerationMethods?.includes('generateContent')
      )
      .sort((a: { name: string }, b: { name: string }) => {
        const aName = a.name.replace('models/', '')
        const bName = b.name.replace('models/', '')
        const aIndex = preferredOrder.indexOf(aName)
        const bIndex = preferredOrder.indexOf(bName)
        return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex)
      })

    console.log('[API Test] Generative models:', generativeModels.length)

    if (generativeModels.length === 0) {
      return {
        success: false,
        message: 'No generative models available',
        details: `Found ${allModels.length} models but none support generateContent.\nYour API key may not have Gemini API access.`,
      }
    }

    // Step 2: Try to generate with first available model
    const testModel = generativeModels[0].name.replace('models/', '')
    console.log(`[API Test] Step 2: Testing generate with ${testModel}...`)

    const generateResponse = await fetch(
      `${API_BASE}/models/${testModel}:generateContent?key=${apiKey}`,
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
                  text: 'Say "test successful" in 3 words.',
                },
              ],
            },
          ],
        }),
      }
    )

    if (!generateResponse.ok) {
      const error = await generateResponse.text()
      console.error('[API Test] Generate failed:', generateResponse.status, error)

      return {
        success: false,
        message: `Generate failed with ${testModel}`,
        details: `Status: ${generateResponse.status}\n${error}`,
      }
    }

    const generateData = await generateResponse.json()
    const responseText = generateData.candidates?.[0]?.content?.parts?.[0]?.text

    console.log('[API Test] Success! Response:', responseText)

    return {
      success: true,
      message: 'API key is valid!',
      details: `Model: ${testModel}\nResponse: ${responseText}\nAvailable models: ${generativeModels.map((m: { name: string }) => m.name.replace('models/', '')).join(', ')}`,
    }
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : String(error)
    console.error('[API Test] Exception:', errorMsg)

    return {
      success: false,
      message: 'Test failed with exception',
      details: errorMsg,
    }
  }
}

// Expose to window for browser console testing
if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).testGeminiApiKey = testApiKey
}
