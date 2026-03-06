import { useState } from 'react'
import { Ruler, Check, Copy } from 'lucide-react'
import type { BrandingData } from '../types'

interface SpacingPreviewProps {
    branding: BrandingData
}

export default function SpacingPreview({ branding }: SpacingPreviewProps) {
    const [copied, setCopied] = useState<string | null>(null)

    if (!branding.spacing) return null

    const { baseUnit, borderRadius, padding, margins } = branding.spacing
    const hasContent = baseUnit || borderRadius || padding || margins

    if (!hasContent) return null

    const handleCopy = (value: string | number) => {
        navigator.clipboard.writeText(String(value))
        setCopied(String(value))
        setTimeout(() => setCopied(null), 1500)
    }

    const spacingScale = baseUnit
        ? [
            { label: 'XS', value: baseUnit * 0.5 },
            { label: 'SM', value: baseUnit },
            { label: 'MD', value: baseUnit * 2 },
            { label: 'LG', value: baseUnit * 3 },
            { label: 'XL', value: baseUnit * 4 },
        ]
        : []

    return (
        <section className="glass-card p-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-accent-surface flex items-center justify-center">
                    <Ruler className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-text-primary">Espaçamento</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                {/* Base Unit Scale */}
                {spacingScale.length > 0 && (
                    <div>
                        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                            Escala Base ({baseUnit}px)
                        </p>
                        <div className="space-y-2.5">
                            {spacingScale.map(s => (
                                <button
                                    key={s.label}
                                    onClick={() => handleCopy(`${s.value}px`)}
                                    className="flex items-center gap-3 w-full group cursor-pointer"
                                >
                                    <span className="shrink-0 w-8 text-right text-xs font-mono text-text-muted group-hover:text-accent transition-colors">
                                        {s.label}
                                    </span>
                                    <div
                                        className="h-5 rounded bg-linear-to-r from-accent to-blue-500 opacity-60 transition-all duration-300 group-hover:opacity-100"
                                        style={{ width: `${Math.min(s.value * 2, 200)}px` }}
                                    />
                                    <div className="flex items-center gap-1.5 min-w-[60px]">
                                        <span className="text-xs font-mono text-text-muted">
                                            {s.value}px
                                        </span>
                                        {copied === `${s.value}px` ? (
                                            <Check className="w-3 h-3 text-success" />
                                        ) : (
                                            <Copy className="w-3 h-3 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Border Radius & Other */}
                <div className="space-y-4">
                    {borderRadius && (
                        <div>
                            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                                Raio de Borda
                            </p>
                            <button
                                onClick={() => handleCopy(borderRadius)}
                                className="flex items-center gap-4 group cursor-pointer"
                            >
                                <div
                                    className="w-20 h-20 border-2 border-accent bg-accent-surface transition-transform group-hover:scale-105"
                                    style={{ borderRadius }}
                                />
                                <div className="text-left">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium text-text-primary">{borderRadius}</p>
                                        {copied === borderRadius ? (
                                            <Check className="w-3.5 h-3.5 text-success" />
                                        ) : (
                                            <Copy className="w-3.5 h-3.5 text-text-muted opacity-0 group-hover:opacity-100" />
                                        )}
                                    </div>
                                    <p className="text-xs text-text-muted">border-radius</p>
                                </div>
                            </button>
                        </div>
                    )}

                    {padding && Object.keys(padding).length > 0 && (
                        <div>
                            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
                                Padding
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(padding).map(([key, value]) => (
                                    <button
                                        key={key}
                                        onClick={() => handleCopy(value!)}
                                        className="px-3 py-1.5 rounded-lg bg-surface-2 border border-border-default hover:border-accent transition-all cursor-pointer group flex items-center gap-2"
                                    >
                                        <span className="text-xs font-mono text-text-muted">{key}: </span>
                                        <span className="text-xs font-mono text-text-primary">{value}</span>
                                        {copied === value ? (
                                            <Check className="w-3 h-3 text-success" />
                                        ) : (
                                            <Copy className="w-3 h-3 text-text-muted opacity-0 group-hover:opacity-100" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
