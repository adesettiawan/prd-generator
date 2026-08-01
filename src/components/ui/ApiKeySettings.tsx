import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Settings, Key, Check, X, Trash2, TestTube } from 'lucide-react'
import { getApiKey, setApiKey, clearApiKey } from '../../services/apiKey'
import { testApiKey } from '../../services/testApiKey'
import { Button } from './Button'
import { Input } from './Input'

export function ApiKeySettings() {
  const [isOpen, setIsOpen] = useState(false)
  const [apiKey, setApiKeyState] = useState(getApiKey())
  const [saved, setSaved] = useState(false)
  const [cleared, setCleared] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{
    success: boolean
    message: string
    details?: string
  } | null>(null)

  const handleSave = () => {
    setApiKey(apiKey.trim())
    setSaved(true)
    setCleared(false)
    setTestResult(null)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleClear = () => {
    clearApiKey()
    setApiKeyState('')
    setCleared(true)
    setSaved(false)
    setTestResult(null)
    setTimeout(() => setCleared(false), 2000)
  }

  const handleTest = async () => {
    setTesting(true)
    setTestResult(null)
    // Save first
    if (apiKey.trim()) {
      setApiKey(apiKey.trim())
    }
    try {
      const result = await testApiKey()
      setTestResult(result)
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Test failed',
        details: error instanceof Error ? error.message : String(error),
      })
    } finally {
      setTesting(false)
    }
  }

  return (
    <>
      {/* Settings Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-text-secondary hover:text-text-inverse transition-colors duration-fast text-sm"
        aria-label="Open API settings"
      >
        <Settings className="w-4 h-4" />
        <span className="hidden sm:inline">Settings</span>
      </button>

      {/* Modal */}
      {isOpen && createPortal(
        <div className="fixed inset-0" style={{ zIndex: 9999 }}>
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Dialog wrapper - scrollable */}
          <div className="absolute inset-0 flex items-center justify-center p-4 overflow-y-auto">
          {/* Dialog */}
          <div className="relative bg-surface-card border border-border-default rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-text-tertiary" />
                <h2 className="text-lg font-semibold">API Settings</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-text-secondary hover:text-text-inverse transition-colors"
                aria-label="Close settings"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-text-secondary">
                Enter your Google Gemini API key. Get a free key at{' '}
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-tertiary hover:underline"
                >
                  aistudio.google.com
                </a>
              </p>

              <Input
                label="Gemini API Key"
                type="text"
                placeholder="Paste your API key here..."
                value={apiKey}
                onChange={(e) => setApiKeyState(e.target.value)}
              />

              {/* Test Result */}
              {testResult && (
                <div
                  className={`p-3 rounded-sm text-sm ${
                    testResult.success
                      ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                      : 'bg-red-500/10 border border-red-500/30 text-red-400'
                  }`}
                >
                  <p className="font-medium">{testResult.message}</p>
                  {testResult.details && (
                    <pre className="mt-2 text-xs whitespace-pre-wrap opacity-80">
                      {testResult.details}
                    </pre>
                  )}
                </div>
              )}

              <div className="flex gap-2 justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                >
                  {cleared ? (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Cleared!
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear
                    </>
                  )}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleTest}
                  isLoading={testing}
                  disabled={!apiKey.trim() || testing}
                >
                  <TestTube className="w-4 h-4 mr-2" />
                  Test Key
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={!apiKey.trim()}
                >
                  {saved ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Saved!
                    </>
                  ) : (
                    'Save Key'
                  )}
                </Button>
              </div>
            </div>
          </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
