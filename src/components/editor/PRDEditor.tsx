import { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { ArrowLeft, Download, Copy, Check, Eye, Edit3, FileText } from 'lucide-react'
import { exportToPDF, exportToMarkdown } from '../../services/export'
import type { PRDParams } from '../../types/prd'

interface LocationState {
  params?: PRDParams
  content?: string
}

const DEFAULT_CONTENT = `# Product Requirements Document

## Overview

*No PRD generated yet. Go back to create one.*

## Objectives

- Define project goals
- Outline key features
- Set timeline and milestones
`

export function PRDEditor() {
  const location = useLocation()
  const state = location.state as LocationState

  const [content, setContent] = useState(state?.content || DEFAULT_CONTENT)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('preview')

  useEffect(() => {
    if (state?.content) {
      setContent(state.content)
      localStorage.setItem('prd-content', state.content)
    }
  }, [state?.content])

  useEffect(() => {
    const saved = localStorage.getItem('prd-content')
    if (saved && !state?.content) {
      setContent(saved)
    }
  }, [state?.content])

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('prd-content', content)
    }, 1000)
    return () => clearTimeout(timer)
  }, [content])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleExportPDF = () => {
    const projectName = state?.params?.projectName || 'prd'
    exportToPDF(content, `${projectName}.pdf`)
  }

  const handleExportMarkdown = () => {
    const projectName = state?.params?.projectName || 'prd'
    exportToMarkdown(content, `${projectName}.md`)
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface-base">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-surface-base/80 backdrop-blur-xl border-b border-border-default">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="h-5 w-px bg-border-default" />
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-text-tertiary" />
              <span className="text-sm font-medium">
                {state?.params?.projectName || 'Untitled PRD'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface-card rounded-md transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-400" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy
                </>
              )}
            </button>
            <button
              onClick={handleExportMarkdown}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface-card rounded-md transition-all"
            >
              <FileText className="w-3.5 h-3.5" />
              MD
            </button>
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-text-primary text-surface-base hover:bg-text-primary/90 rounded-md transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              PDF
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Tab Toggle */}
      <div className="sticky top-[53px] z-20 bg-surface-base/80 backdrop-blur-xl border-b border-border-default">
        <div className="max-w-5xl mx-auto px-6 py-3">
          <div className="inline-flex items-center bg-surface-card rounded-lg p-1">
            <button
              onClick={() => setActiveTab('edit')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === 'edit'
                  ? 'bg-surface-base text-text-primary shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${
                activeTab === 'preview'
                  ? 'bg-surface-base text-text-primary shadow-sm'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-6">
        {activeTab === 'edit' ? (
          <div className="min-h-[calc(100vh-180px)]">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-full min-h-[calc(100vh-180px)] bg-transparent text-text-primary font-mono text-sm leading-relaxed focus:outline-none resize-none"
              placeholder="Write your PRD in Markdown..."
              spellCheck={false}
            />
          </div>
        ) : (
          <div className="min-h-[calc(100vh-180px)]">
            <div className="prd-preview">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
