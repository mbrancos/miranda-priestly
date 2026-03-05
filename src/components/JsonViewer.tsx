import { useState, useMemo } from 'react'
import { Copy, Check, Code2, Download, FileJson, Hash, Settings } from 'lucide-react'
import { brandingToDesignTokens, generateTailwindConfig, generateCSSVariables, downloadFile } from '../utils'
import type { ExtractResult } from '../types'

interface JsonViewerProps {
    result: ExtractResult
    sourceUrl: string
}

type ExportFormat = 'json' | 'tailwind' | 'css'

export default function JsonViewer({ result, sourceUrl }: JsonViewerProps) {
    const [copied, setCopied] = useState(false)
    const [format, setFormat] = useState<ExportFormat>('json')

    const designTokens = useMemo(() => brandingToDesignTokens(result.branding, sourceUrl), [result.branding, sourceUrl])

    const code = useMemo(() => {
        switch (format) {
            case 'tailwind': return generateTailwindConfig(designTokens)
            case 'css': return generateCSSVariables(designTokens)
            default: return JSON.stringify(designTokens, null, 2)
        }
    }, [format, designTokens])

    const handleCopy = () => {
        navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleDownload = () => {
        const filenames = {
            json: 'design-tokens.json',
            tailwind: 'tailwind.config.js',
            css: 'variables.css'
        }
        const mimes = {
            json: 'application/json',
            tailwind: 'application/javascript',
            css: 'text/css'
        }
        downloadFile(code, filenames[format], mimes[format])
    }

    // Basic syntax highlighting
    const highlighted = code
        .replace(
            /("(?:\$schema|\$type|\$value|\$description|name|sourceUrl|extractedAt)")/g,
            '<span style="color: #c084fc;">$1</span>'
        )
        .replace(
            /("colors"|"typography"|"spacing"|"components"|theme|extend)/g,
            '<span style="color: #f472b6;">$1</span>'
        )
        .replace(
            /:\s*("(?:#[0-9a-fA-F]{3,8})")/g,
            ': <span style="color: #4ade80;">$1</span>'
        )
        .replace(
            /:\s*("(?!#)[^"]*")/g,
            ': <span style="color: #fbbf24;">$1</span>'
        )
        .replace(
            /:\s*(\d+(?:\.\d+)?)/g,
            ': <span style="color: #60a5fa;">$1</span>'
        )
        .replace(
            /(:root|import|export|default)/g,
            '<span style="color: #a78bfa; font-weight: 600;">$1</span>'
        )

    return (
        <div className="glass-card overflow-hidden">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 border-b border-[var(--color-border-default)] bg-[var(--color-surface-1)] gap-3">
                <div className="flex items-center gap-3">
                    <div className="flex bg-[var(--color-surface-2)] p-1 rounded-lg border border-[var(--color-border-default)]">
                        <button
                            onClick={() => setFormat('json')}
                            className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] uppercase font-bold transition-all ${format === 'json' ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'}`}
                        >
                            <FileJson className="w-3 h-3" />
                            JSON
                        </button>
                        <button
                            onClick={() => setFormat('tailwind')}
                            className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] uppercase font-bold transition-all ${format === 'tailwind' ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'}`}
                        >
                            <Settings className="w-3 h-3" />
                            Tailwind
                        </button>
                        <button
                            onClick={() => setFormat('css')}
                            className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] uppercase font-bold transition-all ${format === 'css' ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'}`}
                        >
                            <Hash className="w-3 h-3" />
                            CSS
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleDownload}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] border border-[var(--color-border-default)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-primary)]"
                    >
                        <Download className="w-3.5 h-3.5" />
                        Baixar
                    </button>
                    <button
                        onClick={handleCopy}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${copied
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                            : 'bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] border border-[var(--color-border-default)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-primary)]'
                            }`}
                    >
                        {copied ? (
                            <>
                                <Check className="w-3.5 h-3.5" />
                                Copiado!
                            </>
                        ) : (
                            <>
                                <Copy className="w-3.5 h-3.5" />
                                Copiar Código
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Code Block */}
            <div className="overflow-x-auto max-h-[600px] overflow-y-auto bg-[var(--color-surface-0)]">
                <pre className="p-5 text-sm leading-relaxed font-mono">
                    <code dangerouslySetInnerHTML={{ __html: highlighted }} />
                </pre>
            </div>
        </div>
    )
}
