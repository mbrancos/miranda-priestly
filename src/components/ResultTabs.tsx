import { useState } from 'react'
import { Eye, Code2, Globe, Image, Scale, Server } from 'lucide-react'
import ColorsGrid from './ColorsGrid'
import TypographyPreview from './TypographyPreview'
import SpacingPreview from './SpacingPreview'
import AssetsGrid from './AssetsGrid'
import AuditPanel from './AuditPanel'
import InfraPanel from './InfraPanel'
import JsonViewer from './JsonViewer'
import type { ExtractResult } from '../types'

interface ResultTabsProps {
    result: ExtractResult
    sourceUrl: string
}

export default function ResultTabs({ result, sourceUrl }: ResultTabsProps) {
    const [activeTab, setActiveTab] = useState<'visual' | 'assets' | 'audit' | 'infra' | 'json'>('visual')

    const assetsCount = (result.images?.length || 0) + (result.svgs?.length || 0)

    const tabs = [
        { id: 'visual' as const, label: 'Visual', icon: <Eye className="w-4 h-4" /> },
        { id: 'assets' as const, label: `Inventário Visual${assetsCount > 0 ? ` (${assetsCount})` : ''}`, icon: <Image className="w-4 h-4" /> },
        { id: 'audit' as const, label: 'O Julgamento', icon: <Scale className="w-4 h-4" /> },
        { id: 'infra' as const, label: 'Os Bastidores', icon: <Server className="w-4 h-4" /> },
        { id: 'json' as const, label: 'Código / Exportar', icon: <Code2 className="w-4 h-4" /> },
    ]

    return (
        <div className="flex flex-col w-full">
            {/* Site info */}
            {result.metadata?.title && (
                <div className="flex items-center justify-center gap-3 mb-8 text-sm text-text-secondary bg-surface-1/50 backdrop-blur-md w-fit mx-auto px-5 py-2.5 rounded-full border border-border-default shadow-sm shadow-black/5">
                    <Globe className="w-4 h-4 text-accent" />
                    <span className="font-semibold text-text-primary tracking-wide">{result.metadata.title}</span>
                    <span className="text-text-muted opacity-50">•</span>
                    <span className="text-text-muted font-mono text-xs truncate max-w-[200px] sm:max-w-md">{sourceUrl}</span>
                </div>
            )}

            {/* Tab Buttons */}
            <div className="flex justify-center mb-12">
                <div className="flex gap-1.5 p-1.5 rounded-2xl bg-surface-1/40 backdrop-blur-xl border border-border-default/50 w-fit shadow-md shadow-black/10">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer ${activeTab === tab.id
                                ? 'bg-surface-2/80 text-text-primary shadow-sm border border-white/10'
                                : 'text-text-secondary hover:text-text-primary hover:bg-surface-2/30 border border-transparent'
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
                {activeTab === 'visual' && (
                    <div className="space-y-12 animate-fade-in w-full">
                        <ColorsGrid branding={result.branding} />
                        <TypographyPreview branding={result.branding} typographyScale={result.typographyScale} />
                        <SpacingPreview branding={result.branding} />
                    </div>
                )}

                {activeTab === 'assets' && (
                    <div className="animate-fade-in w-full">
                        <AssetsGrid
                            images={result.images || []}
                            svgs={result.svgs || []}
                            sourceUrl={sourceUrl}
                        />
                    </div>
                )}

                {activeTab === 'audit' && (
                    <div className="animate-fade-in w-full">
                        <AuditPanel audit={result.audit} branding={result.branding} />
                    </div>
                )}

                {activeTab === 'infra' && (
                    <div className="animate-fade-in w-full">
                        <InfraPanel infrastructure={result.infrastructure} />
                    </div>
                )}

                {activeTab === 'json' && (
                    <div className="animate-fade-in w-full">
                        <JsonViewer result={result} sourceUrl={sourceUrl} />
                    </div>
                )}
            </div>
        </div>
    )
}
