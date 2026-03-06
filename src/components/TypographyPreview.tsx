import { useState, useEffect } from 'react'
import { Type, Check, Copy, ExternalLink } from 'lucide-react'
import type { BrandingData } from '../types'

interface TypographyPreviewProps {
    branding: BrandingData
}

const PANGRAM = 'The quick brown fox jumps over the lazy dog'
const PANGRAM_PT = 'À noite, vovô Kowalsky vê o ímã cair no pé do pingüim queixoso e vê-Loss'

export default function TypographyPreview({ branding }: TypographyPreviewProps) {
    const [copied, setCopied] = useState<string | null>(null)

    const hasFonts = branding.fonts?.length || branding.typography?.fontFamilies
    const hasSizes = branding.typography?.fontSizes

    const fontFamilies: string[] = []

    if (branding.typography?.fontFamilies) {
        Object.values(branding.typography.fontFamilies).forEach(f => {
            if (f && !fontFamilies.includes(f)) fontFamilies.push(f)
        })
    }

    if (branding.fonts) {
        branding.fonts.forEach(f => {
            if (f.family && !fontFamilies.includes(f.family)) fontFamilies.push(f.family)
        })
    }

    // Try to load fonts from Google Fonts if they are common
    useEffect(() => {
        if (fontFamilies.length > 0) {
            const fontString = fontFamilies.map(f => f.replace(/\s+/g, '+')).join('|')
            const link = document.createElement('link')
            link.href = `https://fonts.googleapis.com/css2?family=${fontString}:wght@400;500;600;700&display=swap`
            link.rel = 'stylesheet'
            document.head.appendChild(link)
            return () => {
                if (document.head.contains(link)) {
                    document.head.removeChild(link)
                }
            }
        }
    }, [fontFamilies.join(',')])

    if (!hasFonts && !hasSizes) return null

    const handleCopy = (value: string | number) => {
        navigator.clipboard.writeText(String(value))
        setCopied(String(value))
        setTimeout(() => setCopied(null), 1500)
    }

    const sizes = branding.typography?.fontSizes || {}
    const weights = branding.typography?.fontWeights || {}
    const lineHeights = branding.typography?.lineHeights || {}

    const typographyRoles = [
        { tag: 'H1', size: sizes.h1, weight: weights.bold || 700, lineHeight: lineHeights.heading },
        { tag: 'H2', size: sizes.h2, weight: weights.bold || 600, lineHeight: lineHeights.heading },
        { tag: 'H3', size: sizes.h3, weight: weights.medium || 500, lineHeight: lineHeights.heading },
        { tag: 'Body', size: sizes.body, weight: weights.regular || 400, lineHeight: lineHeights.body },
    ]

    return (
        <section className="glass-card p-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-accent-surface flex items-center justify-center">
                    <Type className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-text-primary">Tipografia</h3>
            </div>

            {/* Font Families */}
            {fontFamilies.length > 0 && (
                <div className="mb-8">
                    <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-4">
                        Famílias de Fonte
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {fontFamilies.map(font => (
                            <button
                                key={font}
                                onClick={() => handleCopy(font)}
                                className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-2 border border-border-default hover:border-accent transition-all cursor-pointer"
                            >
                                <span className="text-sm font-medium" style={{ fontFamily: font }}>{font}</span>
                                {copied === font ? (
                                    <Check className="w-3 h-3 text-success" />
                                ) : (
                                    <Copy className="w-3 h-3 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Type Scale */}
            {Object.keys(sizes).length > 0 && (
                <div className="mb-8">
                    <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-5">
                        Escala Tipográfica
                    </p>
                    <div className="space-y-4">
                        {typographyRoles.map(role => {
                            if (!role.size) return null
                            const fontFamily = fontFamilies[0] || 'inherit'
                            return (
                                <button
                                    key={role.tag}
                                    onClick={() => handleCopy(role.size!)}
                                    className="w-full flex items-baseline gap-4 group cursor-pointer text-left"
                                >
                                    <span className="shrink-0 w-14 text-right text-xs font-mono text-accent font-semibold">
                                        {role.tag}
                                    </span>
                                    <div className="flex-1 border-b border-dashed border-border-default pb-3 group-hover:border-accent transition-colors">
                                        <p
                                            style={{
                                                fontFamily,
                                                fontSize: role.size,
                                                fontWeight: role.weight,
                                                lineHeight: role.lineHeight || 'normal',
                                            }}
                                            className="text-text-primary leading-tight truncate"
                                        >
                                            {PANGRAM}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <p className="text-[10px] font-mono text-text-muted">
                                                {role.size} • weight {role.weight}
                                                {role.lineHeight ? ` • line-height ${role.lineHeight}` : ''}
                                            </p>
                                            {copied === role.size && (
                                                <Check className="w-3 h-3 text-success" />
                                            )}
                                        </div>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Font weights */}
            {Object.keys(weights).length > 0 && (
                <div className="mb-8">
                    <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-4">
                        Pesos da Fonte
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {Object.entries(weights).map(([name, weight]) => {
                            if (weight === undefined) return null
                            return (
                                <button
                                    key={name}
                                    onClick={() => handleCopy(weight)}
                                    className="p-3 rounded-xl bg-surface-2 border border-border-default hover:border-accent transition-all cursor-pointer text-left group"
                                >
                                    <div className="flex justify-between items-start">
                                        <p
                                            style={{
                                                fontFamily: fontFamilies[0] || 'inherit',
                                                fontWeight: weight,
                                            }}
                                            className="text-lg text-text-primary"
                                        >
                                            Aa
                                        </p>
                                        {copied === String(weight) ? (
                                            <Check className="w-3 h-3 text-success" />
                                        ) : (
                                            <Copy className="w-3 h-3 text-text-muted opacity-0 group-hover:opacity-100" />
                                        )}
                                    </div>
                                    <p className="text-[10px] font-mono text-text-muted mt-1 capitalize">
                                        {name} ({weight})
                                    </p>
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Pangram Preview with all fonts */}
            {fontFamilies.length > 0 && (
                <div className="mt-6 p-4 rounded-xl bg-surface-1 border border-border-default">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                            Preview em Tempo Real
                        </p>
                        <div className="flex items-center gap-1.5 text-[10px] text-text-muted">
                            <ExternalLink className="w-3 h-3" />
                            <span>Fontes carregadas dinamicamente</span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {fontFamilies.map(font => (
                            <div key={font} className="border-l-2 border-accent-glow pl-4 py-1">
                                <p className="text-[10px] font-mono text-text-muted mb-1 uppercase tracking-tight">
                                    {font}
                                </p>
                                <p
                                    style={{ fontFamily: font }}
                                    className="text-lg text-text-primary leading-tight"
                                >
                                    {PANGRAM_PT}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    )
}
