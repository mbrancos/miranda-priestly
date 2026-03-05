import { useState } from 'react'
import { Eye, Code2, Globe } from 'lucide-react'
import ColorsGrid from './ColorsGrid'
import TypographyPreview from './TypographyPreview'
import SpacingPreview from './SpacingPreview'
import JsonViewer from './JsonViewer'
import type { ExtractResult } from '../types'

interface ResultTabsProps {
    result: ExtractResult
    sourceUrl: string
}

export default function ResultTabs({ result, sourceUrl }: ResultTabsProps) {
    const [activeTab, setActiveTab] = useState<'visual' | 'json'>('visual')

    const tabs = [
        { id: 'visual' as const, label: 'Visual', icon: <Eye className="w-4 h-4" /> },
        { id: 'json' as const, label: 'Código / Exportar', icon: <Code2 className="w-4 h-4" /> },
    ]

    return (
        <div className="flex flex-col w-full">
            {/* Site info */}
            {result.metadata?.title && (
                <div className="flex items-center justify-center gap-3 mb-8 text-sm text-[var(--color-text-secondary)] bg-[var(--color-surface-1)] w-fit mx-auto px-5 py-2.5 rounded-2xl border border-[var(--color-border-default)]">
                    <Globe className="w-4 h-4 text-[var(--color-accent)]" />
                    <span className="font-medium text-[var(--color-text-primary)]">{result.metadata.title}</span>
                    <span className="text-[var(--color-text-muted)] opacity-50">•</span>
                    <span className="text-[var(--color-text-muted)] font-mono text-xs truncate max-w-[200px] sm:max-w-md">{sourceUrl}</span>
                </div>
            )}

            {/* Tab Buttons */}
            <div className="flex justify-center mb-10">
                <div className="flex gap-1.5 p-1.5 rounded-2xl bg-[var(--color-surface-1)] border border-[var(--color-border-default)] w-fit shadow-sm">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer ${activeTab === tab.id
                                ? 'bg-[var(--color-accent)] text-white shadow-lg shadow-[var(--color-accent-glow)]'
                                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-2)]'
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="w-full">
                {activeTab === 'visual' ? (
                    <div className="space-y-12 animate-fade-in w-full">
                        <ColorsGrid branding={result.branding} />
                        <TypographyPreview branding={result.branding} />
                        <SpacingPreview branding={result.branding} />
                    </div>
                ) : (
                    <div className="animate-fade-in w-full">
                        <JsonViewer result={result} sourceUrl={sourceUrl} />
                    </div>
                )}
            </div>
        </div>
    )
}
