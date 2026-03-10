import { useState } from 'react'
import { Palette, Check, Copy } from 'lucide-react'
import type { BrandingData } from '../types'

interface ColorsGridProps {
    branding: BrandingData
}

const COLOR_LABELS: Record<string, string> = {
    primary: 'Primária',
    secondary: 'Secundária',
    accent: 'Destaque',
    background: 'Fundo',
    textPrimary: 'Texto Base',
    textSecondary: 'Texto Sec.',
    link: 'Link',
    success: 'Sucesso',
    warning: 'Aviso',
    error: 'Erro',
}

export default function ColorsGrid({ branding }: ColorsGridProps) {
    const [copiedColor, setCopiedColor] = useState<string | null>(null)

    if (!branding.colors || Object.keys(branding.colors).length === 0) {
        return null
    }

    const colors = Object.entries(branding.colors).filter(([, v]) => v)

    const copyColor = (hex: string) => {
        navigator.clipboard.writeText(hex)
        setCopiedColor(hex)
        setTimeout(() => setCopiedColor(null), 1500)
    }

    return (
        <section className="glass-card p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[80px] -z-10 pointer-events-none"></div>

            <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-accent-surface border border-border-default flex items-center justify-center shadow-xs">
                    <Palette className="w-6 h-6 text-accent" />
                </div>
                <div>
                    <h3 className="text-3xl font-black text-text-primary tracking-tight">Cores Extraídas</h3>
                    <p className="text-sm text-text-muted mt-1 font-light">
                        <span className="font-semibold text-accent">{colors.length} tokens</span> identificados no caos deste design.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                {colors.map(([key, value]) => (
                    <button
                        key={key}
                        onClick={() => copyColor(value!)}
                        className="group flex flex-col items-center gap-3.5 p-4 rounded-2xl hover:bg-surface-2 transition-all duration-300 cursor-pointer border border-transparent hover:border-border-default"
                        title={`Copiar ${value}`}
                    >
                        <div className="relative">
                            <div
                                className="w-16 h-16 rounded-[1.25rem] shadow-sm border border-border-default/50 group-hover:scale-110 group-hover:shadow-md transition-all duration-300"
                                style={{ backgroundColor: value }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 rounded-[1.25rem]">
                                {copiedColor === value ? (
                                    <Check className="w-6 h-6 text-white drop-shadow-md" />
                                ) : (
                                    <Copy className="w-5 h-5 text-white drop-shadow-md" />
                                )}
                            </div>
                        </div>

                        <div className="text-center">
                            <p className="text-[13px] font-semibold text-text-primary leading-tight mb-1">
                                {COLOR_LABELS[key] || key}
                            </p>
                            <p className="text-[11px] font-mono text-text-muted uppercase">
                                {value}
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </section>
    )
}
