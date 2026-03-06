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
        <section className="glass-card p-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-accent-surface flex items-center justify-center">
                    <Palette className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-text-primary">Cores Principais</h3>
                <span className="ml-2 text-[11px] font-semibold tracking-wide text-text-muted bg-surface-2 px-2.5 py-1 rounded-full uppercase border border-border-default">
                    {colors.length} tokens
                </span>
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
