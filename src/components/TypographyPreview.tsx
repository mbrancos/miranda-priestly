import { useState, useEffect } from 'react'
import { Type, Check, Copy, ExternalLink, AlertTriangle } from 'lucide-react'
import type { BrandingData, TypographyScale, TypographyScaleEntry } from '../types'

interface TypographyPreviewProps {
    branding: BrandingData
    typographyScale?: TypographyScale
}

const PANGRAM = 'The quick brown fox jumps over the lazy dog'
const PANGRAM_PT = 'À noite, vovô Kowalsky vê o ímã cair no pé do pingüim queixoso e vê-Loss'

const SCALE_LABELS: { key: keyof TypographyScale; label: string; defaultWeight: number }[] = [
    { key: 'h1', label: 'H1', defaultWeight: 700 },
    { key: 'h2', label: 'H2', defaultWeight: 700 },
    { key: 'h3', label: 'H3', defaultWeight: 600 },
    { key: 'h4', label: 'H4', defaultWeight: 600 },
    { key: 'h5', label: 'H5', defaultWeight: 500 },
    { key: 'h6', label: 'H6', defaultWeight: 500 },
    { key: 'p_normal', label: 'Body', defaultWeight: 400 },
    { key: 'p_small', label: 'Small', defaultWeight: 400 },
]

// Miranda Priestly's typographic judgements
function getMirandaWarnings(scale: TypographyScale): string[] {
    const warnings: string[] = []
    const entries = SCALE_LABELS.map(s => ({ ...s, entry: scale[s.key] }))

    // Check for skipped heading levels
    let lastFound: string | null = null
    for (const { key, label, entry } of entries) {
        if (key.startsWith('h')) {
            if (entry) {
                if (lastFound) {
                    const lastNum = parseInt(lastFound.replace('H', ''))
                    const curNum = parseInt(label.replace('H', ''))
                    if (curNum - lastNum > 1) {
                        warnings.push(`Pulando do ${lastFound} para o ${label}? A semântica mandou lembranças.`)
                    }
                }
                lastFound = label
            }
        }
    }

    // Check for identical H1/H2
    const h1 = scale.h1
    const h2 = scale.h2
    if (h1 && h2 && h1.fontSize === h2.fontSize && h1.fontWeight === h2.fontWeight) {
        warnings.push('H1 e H2 com o mesmo peso e tamanho. Por que você simplesmente não grita logo com o usuário?')
    }

    return warnings
}

export default function TypographyPreview({ branding, typographyScale }: TypographyPreviewProps) {
    const [copied, setCopied] = useState<string | null>(null)

    const hasFonts = branding.fonts?.length || branding.typography?.fontFamilies
    const hasSizes = branding.typography?.fontSizes
    const hasScale = typographyScale && Object.values(typographyScale).some(v => v !== null)

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

    // Also collect font families from the typography scale
    if (typographyScale) {
        Object.values(typographyScale).forEach(entry => {
            if (entry?.fontFamily && !fontFamilies.includes(entry.fontFamily)) {
                fontFamilies.push(entry.fontFamily)
            }
        })
    }

    const LOCAL_FONTS = [
        'Arial', 'Helvetica', 'Times', 'Times New Roman', 'Courier', 'Courier New',
        'Verdana', 'Georgia', 'Palatino', 'Garamond', 'Bookman', 'Comic Sans MS',
        'Trebuchet MS', 'Arial Black', 'Impact', 'Tahoma', 'sans-serif', 'serif',
        'monospace', 'cursive', 'fantasy', 'system-ui', 'BlinkMacSystemFont', '-apple-system'
    ]

    useEffect(() => {
        const googleFonts = fontFamilies.filter(f => !LOCAL_FONTS.some(local => f.toLowerCase().includes(local.toLowerCase())))

        if (googleFonts.length > 0) {
            const fontString = googleFonts.map(f => f.replace(/\s+/g, '+')).join('|')
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

    if (!hasFonts && !hasSizes && !hasScale) return null

    const handleCopy = (value: string | number) => {
        navigator.clipboard.writeText(String(value))
        setCopied(String(value))
        setTimeout(() => setCopied(null), 1500)
    }

    const weights = branding.typography?.fontWeights || {}
    const mirandaWarnings = typographyScale ? getMirandaWarnings(typographyScale) : []

    return (
        <section className="glass-card p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] -z-10 pointer-events-none"></div>

            <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-accent-surface border border-border-default flex items-center justify-center shadow-xs">
                    <Type className="w-6 h-6 text-accent" />
                </div>
                <div>
                    <h3 className="text-3xl font-black text-text-primary tracking-tight">Tipografia</h3>
                    <p className="text-sm text-text-muted mt-1 font-light">As fontes que sustentam a interface.</p>
                </div>
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

            {/* Miranda Warnings */}
            {mirandaWarnings.length > 0 && (
                <div className="mb-8 space-y-2">
                    {mirandaWarnings.map((warning, i) => (
                        <div
                            key={i}
                            className="flex items-start gap-3 p-3 rounded-xl border border-amber-500/20 bg-amber-500/5"
                        >
                            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-sm text-amber-400 italic" style={{ fontFamily: 'var(--font-serif)' }}>
                                "{warning}"
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Typography Scale — Full H1-H6 + Paragraphs */}
            {hasScale && typographyScale && (
                <div className="mb-8">
                    <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-5">
                        Escala Tipográfica Completa
                    </p>
                    <div className="space-y-4">
                        {SCALE_LABELS.map(({ key, label, defaultWeight }) => {
                            const entry = typographyScale[key]
                            if (!entry) return null
                            const fontFamily = entry.fontFamily || fontFamilies[0] || 'inherit'
                            const weight = entry.fontWeight || String(defaultWeight)
                            const copyValue = `${entry.fontSize || '?'} / ${weight} / ${fontFamily}`
                            return (
                                <button
                                    key={key}
                                    onClick={() => handleCopy(copyValue)}
                                    className="w-full flex items-baseline gap-4 group cursor-pointer text-left"
                                >
                                    <span className="shrink-0 w-14 text-right text-xs font-mono text-accent font-semibold">
                                        {label}
                                    </span>
                                    <div className="flex-1 border-b border-dashed border-border-default pb-3 group-hover:border-accent transition-colors">
                                        <p
                                            style={{
                                                fontFamily,
                                                fontSize: entry.fontSize || 'inherit',
                                                fontWeight: parseInt(weight) || defaultWeight,
                                                lineHeight: entry.lineHeight || 'normal',
                                            }}
                                            className="text-text-primary leading-tight truncate"
                                        >
                                            {PANGRAM}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <p className="text-[10px] font-mono text-text-muted">
                                                {entry.fontSize || '?'} • weight {weight}
                                                {entry.lineHeight ? ` • line-height ${entry.lineHeight}` : ''}
                                                {entry.fontFamily ? ` • ${entry.fontFamily}` : ''}
                                            </p>
                                            {copied === copyValue && (
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

            {/* Fallback: Legacy type scale from branding (if no typographyScale) */}
            {!hasScale && hasSizes && (() => {
                const sizes = branding.typography?.fontSizes || {}
                const legacyRoles = [
                    { tag: 'H1', size: sizes.h1, weight: weights.bold || 700 },
                    { tag: 'H2', size: sizes.h2, weight: weights.bold || 600 },
                    { tag: 'H3', size: sizes.h3, weight: weights.medium || 500 },
                    { tag: 'Body', size: sizes.body, weight: weights.regular || 400 },
                ]
                return (
                    <div className="mb-8">
                        <p className="text-[11px] font-bold text-text-muted uppercase tracking-wider mb-5">
                            Escala Tipográfica
                        </p>
                        <div className="space-y-4">
                            {legacyRoles.map(role => {
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
                                                }}
                                                className="text-text-primary leading-tight truncate"
                                            >
                                                {PANGRAM}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <p className="text-[10px] font-mono text-text-muted">
                                                    {role.size} • weight {role.weight}
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
                )
            })()}

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
