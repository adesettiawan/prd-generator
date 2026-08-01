import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkles, FileText, Zap, Download } from 'lucide-react'
import { PRDForm } from './components/form/PRDForm'
import { PRDEditor } from './components/editor/PRDEditor'
import { ApiKeySettings } from './components/ui/ApiKeySettings'
import { useEscKey } from './hooks/useEscKey'

function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-surface-base/80 backdrop-blur-xl border-b border-border-default">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-text-tertiary rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-surface-base" />
            </div>
            <span className="text-sm font-semibold tracking-tight">PRD Generator</span>
          </Link>
          <ApiKeySettings />
        </div>
      </header>

      {/* Hero */}
      <div className="max-w-3xl mx-auto px-6 pt-12 pb-16">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-surface-card rounded-full text-xs font-medium text-text-secondary mb-6">
            <Zap className="w-3 h-3 text-text-tertiary" />
            Powered by Gemini AI
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">
            Generate PRDs
            <br />
            <span className="text-text-tertiary">in seconds</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-xl mx-auto mb-10">
            Transform your project ideas into comprehensive product requirements documents.
            Fast, structured, and export-ready.
          </p>
          <Link
            to="/create"
            className="inline-flex items-center gap-2 bg-text-primary text-surface-base px-6 py-3 rounded-lg font-medium hover:bg-text-primary/90 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Start Creating
          </Link>
        </div>
      </div>

      {/* Minimal Features */}
      <div className="max-w-3xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: FileText, label: 'Structured Output', desc: 'Industry-standard format' },
            { icon: Zap, label: 'AI-Powered', desc: 'Google Gemini engine' },
            { icon: Download, label: 'Export Ready', desc: 'PDF & Markdown' },
          ].map((feature) => (
            <div
              key={feature.label}
              className="p-4 bg-surface-card rounded-xl border border-border-default"
            >
              <feature.icon className="w-5 h-5 text-text-tertiary mb-3" />
              <h3 className="text-sm font-medium mb-1">{feature.label}</h3>
              <p className="text-xs text-text-secondary">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CreatePage() {
  const navigate = useNavigate()
  useEscKey(() => navigate('/'))

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-surface-base/80 backdrop-blur-xl border-b border-border-default">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-text-tertiary rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-surface-base" />
            </div>
            <span className="text-sm font-semibold tracking-tight">PRD Generator</span>
          </Link>
          <ApiKeySettings />
        </div>
      </header>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6">
        {/* Sticky sub-header */}
        <div className="sticky top-[57px] z-[5] bg-surface-base/80 backdrop-blur-xl py-6 -mx-6 px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight mb-2">New PRD</h1>
            <p className="text-sm text-text-secondary">
              Fill in the details below to generate your product requirements document.
            </p>
          </div>
        </div>

        <div className="pb-12">
          <PRDForm />
        </div>
      </div>
    </div>
  )
}

function EditorPage() {
  return (
    <PRDEditor />
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/create" element={<CreatePage />} />
      <Route path="/editor" element={<EditorPage />} />
    </Routes>
  )
}

export default App
