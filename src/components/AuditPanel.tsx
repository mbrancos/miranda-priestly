import { useMemo } from 'react'
import { Scale, Layers, Zap, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import type { AuditResult, BrandingData } from '../types'
import { calculateContrastRatio, getContrastLevel } from '../utils/contrast'

interface AuditPanelProps {
    audit: AuditResult | undefined
    branding: BrandingData
}

// ─── Miranda's Verdicts ───────────────────────────────────────────────────────

const UI_LIB_VERDICTS: Record<string, { label: string; verdict: string; color: string }> = {
    'tailwind': {
        label: 'Tailwind CSS',
        verdict: '"Tailwind. Funcional, previsível. Exatamente o tipo de escolha que não me surpreende."',
        color: 'text-cyan-400',
    },
    'material-ui': {
        label: 'Material UI',
        verdict: '"Material Design. Eficiente, seguro e completamente sem uma única gota de personalidade."',
        color: 'text-blue-400',
    },
    'bootstrap': {
        label: 'Bootstrap',
        verdict: '"Bootstrap. Em 2026. Que coragem… ou uma falta de orçamento verdadeiramente comovente."',
        color: 'text-purple-400',
    },
    'radix': {
        label: 'Radix UI',
        verdict: '"Radix. Acessível por padrão. Ao menos alguém aqui se importa com os usuários."',
        color: 'text-green-400',
    },
    'custom': {
        label: 'CSS Customizado',
        verdict: '"CSS Customizado. Ou temos um gênio aqui, ou uma catástrofe prestes a acontecer. Descubra isto."',
        color: 'text-amber-400',
    },
    'unknown': {
        label: 'Desconhecida',
        verdict: '"Não consegui identificar nada. Ou estão reinventando a roda, ou escondendo algo."',
        color: 'text-text-muted',
    },
}

const MOTION_VERDICTS: Record<string, { label: string; verdict: string }> = {
    'framer-motion': {
        label: 'Framer Motion',
        verdict: '"Animações fluidas. Ao menos tentaram disfarçar a ausência de conteúdo com movimento elegante."',
    },
    'gsap': {
        label: 'GSAP',
        verdict: '"GSAP. A escolha dos que levam motion design a sério. Impressionante — desta vez."',
    },
    'aos': {
        label: 'AOS (Animate on Scroll)',
        verdict: '"Tudo aparece deslizando ao rolar a página. Adorável. Eram os anos 2010."',
    },
    'css-native': {
        label: 'CSS Nativo',
        verdict: '"Transições em CSS puro. Subtil. Funciona. Não vou reclamar desta vez."',
    },
    'none': {
        label: 'Nenhuma',
        verdict: '"Tão estático e sem vida quanto a carreira da sua ex-assistente. That\'s all."',
    },
    'unknown': {
        label: 'Não detectado',
        verdict: '"Não encontrei rastros de animação. Ou é minimalismo radical, ou esqueceram."',
    },
}

const CONTRAST_VERDICTS = {
    AAA: '"Contraste exemplar. O mínimo de decência que eu esperava para hoje. Aprovado."',
    AA: '"Contraste aceitável. Passa no básico. Não vai para a lista negra, por ora."',
    FAIL: '"Cinza claro sobre fundo claro? Vocês odeiam os usuários que usam óculos, não é? Reprovado."',
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function ContrastCard({ branding }: { branding: BrandingData }) {
    const bg = branding.colors?.background
    const fg = branding.colors?.textPrimary

    const ratio = useMemo(() => {
        if (!bg || !fg) return null
        return calculateContrastRatio(fg, bg)
    }, [bg, fg])

    const level = getContrastLevel(ratio)

    const levelConfig = {
        AAA: { icon: <CheckCircle className="w-5 h-5" />, badge: 'AAA', bg: 'bg-emerald-500/10', border: 'border-emerald-500/25', color: 'text-emerald-400' },
        AA: { icon: <AlertTriangle className="w-5 h-5" />, badge: 'AA', bg: 'bg-amber-500/10', border: 'border-amber-500/25', color: 'text-amber-400' },
        FAIL: { icon: <XCircle className="w-5 h-5" />, badge: 'FAIL', bg: 'bg-red-500/10', border: 'border-red-500/25', color: 'text-red-400' },
    }[level]

    return (
        <div className={`glass-card p-8 relative overflow-hidden border ${levelConfig.border}`}>
            <div className={`absolute inset-0 ${levelConfig.bg} pointer-events-none`} />

            <div className="flex items-start justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${levelConfig.bg} border ${levelConfig.border} flex items-center justify-center ${levelConfig.color}`}>
                        <Scale className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Acessibilidade</p>
                        <h4 className="text-lg font-black text-text-primary">Contraste WCAG 2.1</h4>
                    </div>
                </div>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${levelConfig.bg} border ${levelConfig.border}`}>
                    <span className={levelConfig.color}>{levelConfig.icon}</span>
                    <span className={`font-black text-sm font-mono ${levelConfig.color}`}>{levelConfig.badge}</span>
                </div>
            </div>

            <div className="flex items-end gap-6 mb-6 relative z-10">
                <div>
                    <p className={`text-5xl font-black font-mono ${levelConfig.color}`}>
                        {ratio !== null ? `${ratio}:1` : '—'}
                    </p>
                    <p className="text-xs text-text-muted mt-1">razão de contraste</p>
                </div>
                {bg && fg && (
                    <div className="flex gap-2 mb-2">
                        <div className="flex flex-col items-center gap-1">
                            <div className="w-8 h-8 rounded-lg border border-border-default shadow-xs" style={{ background: bg }} />
                            <span className="text-[9px] font-mono text-text-muted">BG</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <div className="w-8 h-8 rounded-lg border border-border-default shadow-xs" style={{ background: fg }} />
                            <span className="text-[9px] font-mono text-text-muted">FG</span>
                        </div>
                    </div>
                )}
            </div>

            <blockquote className="relative z-10 border-l-2 border-border-default pl-4">
                <p className="text-sm text-text-secondary italic font-light leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                    {CONTRAST_VERDICTS[level]}
                </p>
                <footer className="text-[10px] text-text-muted mt-2 font-mono tracking-wider">— Miranda Priestly</footer>
            </blockquote>

            {(!bg || !fg) && (
                <p className="text-xs text-text-muted mt-4 relative z-10 opacity-60 italic">
                    Cores insuficientes para calcular. O site não forneceu dados de cor completos.
                </p>
            )}
        </div>
    )
}

function UiLibraryCard({ audit }: { audit: AuditResult }) {
    const config = UI_LIB_VERDICTS[audit.uiLibrary] || UI_LIB_VERDICTS.unknown

    return (
        <div className="glass-card p-8 relative overflow-hidden">
            <div className="flex items-start gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-accent-surface border border-border-default flex items-center justify-center">
                    <Layers className="w-5 h-5 text-accent" />
                </div>
                <div>
                    <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Stack Visual</p>
                    <h4 className="text-lg font-black text-text-primary">UI Library</h4>
                </div>
            </div>

            <div className="mb-6">
                <p className={`text-3xl font-black ${config.color}`}>{config.label}</p>
                {audit.uiLibraryConfidence > 0 && (
                    <div className="mt-3 flex items-center gap-3">
                        <div className="h-1.5 flex-1 rounded-full bg-white/5 overflow-hidden">
                            <div
                                className={`h-full rounded-full bg-current ${config.color} transition-all duration-1000`}
                                style={{ width: `${audit.uiLibraryConfidence}%` }}
                            />
                        </div>
                        <span className="text-xs font-mono text-text-muted">{audit.uiLibraryConfidence}% confiança</span>
                    </div>
                )}
            </div>

            <blockquote className="border-l-2 border-border-default pl-4">
                <p className="text-sm text-text-secondary italic font-light leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                    {config.verdict}
                </p>
                <footer className="text-[10px] text-text-muted mt-2 font-mono tracking-wider">— Miranda Priestly</footer>
            </blockquote>
        </div>
    )
}

function MotionCard({ audit }: { audit: AuditResult }) {
    const config = MOTION_VERDICTS[audit.motionLib] || MOTION_VERDICTS.unknown

    return (
        <div className="glass-card p-8 relative overflow-hidden">
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent-surface border border-border-default flex items-center justify-center">
                        <Zap className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Motion Design</p>
                        <h4 className="text-lg font-black text-text-primary">Animações</h4>
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-lg text-[10px] font-bold font-mono uppercase tracking-wider border ${audit.motionDetected
                    ? 'bg-violet-500/10 border-violet-500/25 text-violet-400'
                    : 'bg-white/5 border-white/10 text-text-muted'}`}>
                    {audit.motionDetected ? '● Animado' : '◌ Estático'}
                </span>
            </div>

            <p className="text-3xl font-black text-text-primary mb-6">{config.label}</p>

            <blockquote className="border-l-2 border-white/10 pl-4">
                <p className="text-sm text-text-secondary italic font-light leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                    {config.verdict}
                </p>
                <footer className="text-[10px] text-text-muted mt-2 font-mono tracking-wider">— Miranda Priestly</footer>
            </blockquote>
        </div>
    )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AuditPanel({ audit, branding }: AuditPanelProps) {
    return (
        <div className="space-y-8 w-full animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-accent-surface border border-border-default flex items-center justify-center shadow-xs">
                    <Scale className="w-6 h-6 text-accent" />
                </div>
                <div>
                    <h3 className="text-3xl font-black text-text-primary tracking-tight">O Julgamento</h3>
                    <p className="text-sm text-text-muted mt-1 font-light">
                        Acessibilidade, stack visual e motion — avaliados com a gentileza habitual.
                    </p>
                </div>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ContrastCard branding={branding} />
                {audit ? (
                    <>
                        <UiLibraryCard audit={audit} />
                        <MotionCard audit={audit} />
                    </>
                ) : (
                    <div className="glass-card p-8 col-span-full flex items-center justify-center">
                        <p className="text-text-muted italic text-sm" style={{ fontFamily: 'Georgia, serif' }}>
                            "Sem dados de auditoria. O servidor estava com preguiça. That's all."
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
