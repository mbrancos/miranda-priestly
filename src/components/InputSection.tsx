import { useState, type FormEvent } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'

interface InputSectionProps {
    onExtract: (url: string) => void
    loading: boolean
    theme: 'dark' | 'light'
}

const TECH_NAMES = [
    'React', 'WordPress', 'Wix', 'Framer', 'Webflow',
    'Shopify', 'Next.js', 'Bubble', 'Squarespace', 'Angular',
    'Bootstrap', 'Drupal', 'Nuxt', 'Ghost', 'Joomla',
]

const FEATURE_CARDS = [
    {
        number: '01',
        title: 'Extração Cirúrgica',
        description: 'Cores e tipografia mastigadas para o seu Tailwind. Inspecionar elemento é para estagiários.',
    },
    {
        number: '02',
        title: 'Inventário Visual',
        description: 'Baixe imagens e ícones instantaneamente. Roube como um artista — com elegância.',
    },
    {
        number: '03',
        title: 'Raio-X da Infraestrutura',
        description: 'Eles dizem ser customizado. Nós mostramos que é um template barato. CMS e hospedagem expostos.',
    },
]

export default function InputSection({ onExtract, loading, theme }: InputSectionProps) {
    const [url, setUrl] = useState('')
    const isLight = theme === 'light'

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        const trimmed = url.trim()
        if (!trimmed) return
        let finalUrl = trimmed
        if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
            finalUrl = 'https://' + finalUrl
        }
        onExtract(finalUrl)
    }

    return (
        <section className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 sm:px-8 overflow-hidden transition-colors duration-500">

            {/* ── Ambient glow layers ── */}
            <div
                className="absolute inset-0 pointer-events-none -z-10"
                aria-hidden="true"
            >
                {/* Central cerulean aura */}
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] transition-opacity duration-1000"
                    style={{
                        background: isLight
                            ? 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(43, 91, 132, 0.15) 0%, transparent 80%)'
                            : 'radial-gradient(ellipse 70% 60% at 50% 0%, #2b5b84 0%, transparent 70%)',
                        filter: 'blur(60px)',
                        opacity: isLight ? 0.9 : 0.3
                    }}
                />
                {/* Subtle accent glow */}
                <div
                    className="absolute top-1/2 -left-40 w-[600px] h-[600px] transition-opacity duration-1000"
                    style={{
                        background: isLight
                            ? 'radial-gradient(circle, rgba(152, 111, 238, 0.08) 0%, transparent 70%)'
                            : 'radial-gradient(circle, rgba(152, 111, 238, 0.4) 0%, transparent 70%)',
                        filter: 'blur(80px)',
                        opacity: isLight ? 0.7 : 0.2
                    }}
                />
            </div>

            {/* ── Hero Content ── */}
            <div className="w-full max-w-5xl mx-auto pt-32 pb-8 flex flex-col items-center text-center">

                {/* Eyebrow badge */}
                <div
                    className={`mb-10 inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[11px] font-mono uppercase tracking-widest animate-fade-in transition-all duration-500`}
                    style={{
                        animationDelay: '0.05s',
                        opacity: 0,
                        background: isLight ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.03)',
                        borderColor: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)',
                        color: isLight ? 'rgba(15, 23, 42, 0.5)' : 'rgba(255,255,255,0.4)',
                    }}
                >
                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isLight ? 'bg-blue-500' : 'bg-emerald-400'}`} />
                    Powered by Firecrawl &nbsp;·&nbsp; Julgamentos implacáveis desde 2025
                </div>

                {/* H1 — Serifada */}
                <h1
                    className={`text-[clamp(2.8rem,7vw,6rem)] font-bold leading-[1.05] tracking-tight animate-fade-in transition-colors duration-500 ${isLight ? 'text-slate-900' : 'text-white'}`}
                    style={{
                        fontFamily: 'var(--font-serif)',
                        animationDelay: '0.15s',
                        opacity: 0,
                        letterSpacing: '-0.01em',
                    }}
                >
                    Seu design é&nbsp;
                    <em className="not-italic text-gradient-hero">
                        alta‑costura
                    </em>
                    <br />
                    ou liquidação de fim de ano?
                </h1>

                {/* Subtitle */}
                <p
                    className={`mt-8 text-lg sm:text-xl max-w-2xl leading-relaxed font-light animate-fade-in transition-colors duration-500 ${isLight ? 'text-slate-600' : 'text-white/50'}`}
                    style={{ animationDelay: '0.25s', opacity: 0 }}
                >
                    Extraia o design system, audite a acessibilidade e descubra a infraestrutura
                    de qualquer site em segundos.{' '}
                    <span className={`${isLight ? 'text-slate-400' : 'text-white/30'} italic`} style={{ fontFamily: 'var(--font-serif)' }}>
                        That's all.
                    </span>
                </p>

                {/* ── URL Input — Liquid Glass ── */}
                <form
                    onSubmit={handleSubmit}
                    className="mt-12 w-full max-w-3xl animate-fade-in"
                    style={{ animationDelay: '0.35s', opacity: 0 }}
                >
                    <div
                        className="group flex items-center gap-2 p-2 rounded-2xl border transition-all duration-500"
                        style={{
                            background: isLight ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.04)',
                            backdropFilter: 'blur(32px)',
                            WebkitBackdropFilter: 'blur(32px)',
                            borderColor: isLight ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.1)',
                            boxShadow: isLight
                                ? '0 8px 48px rgba(0,0,0,0.03), inset 0 0 0 1px rgba(255,255,255,0.5)'
                                : '0 8px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
                        }}
                    >
                        <input
                            type="text"
                            value={url}
                            onChange={e => setUrl(e.target.value)}
                            placeholder="https://site-do-concorrente.com..."
                            disabled={loading}
                            className={`flex-1 bg-transparent placeholder:text-slate-400 placeholder:opacity-50 text-base sm:text-lg outline-none disabled:opacity-40 font-mono px-4 py-3 transition-colors duration-500 ${isLight ? 'text-slate-900' : 'text-white'}`}
                            autoFocus
                        />

                        <button
                            type="submit"
                            disabled={loading || !url.trim()}
                            className="shrink-0 flex items-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-sm sm:text-base text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer"
                            style={{
                                background: loading
                                    ? isLight ? 'rgba(43, 91, 132, 0.4)' : 'rgba(152, 111, 238, 0.4)'
                                    : isLight
                                        ? 'linear-gradient(135deg, #2b5b84 0%, #1e3f5a 100%)'
                                        : 'linear-gradient(135deg, rgba(96,165,250,0.8) 0%, rgba(139,92,246,0.9) 100%)',
                                boxShadow: !loading && url.trim()
                                    ? isLight ? '0 8px 32px rgba(43,91,132,0.15), inset 0 1px 0 rgba(255,255,255,0.2)' : '0 0 32px rgba(139,92,246,0.35), inset 0 1px 0 rgba(255,255,255,0.2)'
                                    : 'none',
                            }}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span className="hidden sm:inline">Analisando...</span>
                                </>
                            ) : (
                                <>
                                    Analisar Design
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>
                </form>

                {/* ── Marquee — Social Proof Sarcástico ── */}
                <div
                    className="mt-10 w-full max-w-3xl overflow-hidden animate-fade-in"
                    style={{ animationDelay: '0.45s', opacity: 0 }}
                >
                    <p className={`text-[11px] font-mono uppercase tracking-widest mb-3 text-center transition-colors duration-500 ${isLight ? 'text-slate-400' : 'text-white/25'}`}>
                        Julgando impiedosamente a estética de sites feitos em:
                    </p>
                    <div className="relative">
                        {/* Fade edges */}
                        <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none transition-all duration-500"
                            style={{ background: isLight ? 'linear-gradient(to right, #ffffff, transparent)' : 'linear-gradient(to right, #050505, transparent)' }} />
                        <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none transition-all duration-500"
                            style={{ background: isLight ? 'linear-gradient(to left, #ffffff, transparent)' : 'linear-gradient(to left, #050505, transparent)' }} />

                        <div className="flex gap-8 items-center" style={{ animation: 'marquee 20s linear infinite' }}>
                            {[...TECH_NAMES, ...TECH_NAMES].map((name, i) => (
                                <span
                                    key={i}
                                    className={`shrink-0 text-sm font-medium transition-colors duration-500 cursor-default select-none ${isLight ? 'text-slate-300 hover:text-slate-500' : 'text-white/20 hover:text-white/40'}`}
                                    style={{ fontFamily: 'var(--font-sans)' }}
                                >
                                    {name}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Feature Cards Grid ── */}
            <div
                className="w-full max-w-5xl mx-auto pb-24 grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 animate-fade-in"
                style={{ animationDelay: '0.55s', opacity: 0 }}
            >
                {FEATURE_CARDS.map(card => (
                    <div
                        key={card.number}
                        className={`group relative p-6 rounded-2xl border transition-all duration-500 glass-card`}
                    >
                        {/* Hover glow */}
                        <div
                            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                            style={{ background: isLight ? 'radial-gradient(circle at 50% 0%, rgba(43,91,132,0.03) 0%, transparent 70%)' : 'radial-gradient(circle at 50% 0%, rgba(96,165,250,0.06) 0%, transparent 70%)' }}
                        />

                        <span className={`block text-[11px] font-mono tracking-widest mb-4 transition-colors duration-500 ${isLight ? 'text-slate-300' : 'text-white/20'}`}>{card.number}</span>
                        <h3
                            className={`text-xl font-bold mb-2 leading-tight transition-colors duration-500 ${isLight ? 'text-slate-800' : 'text-white/90'}`}
                            style={{ fontFamily: 'var(--font-serif)' }}
                        >
                            {card.title}
                        </h3>
                        <p className={`text-sm leading-relaxed font-light transition-colors duration-500 ${isLight ? 'text-slate-500' : 'text-white/35'}`}>
                            {card.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    )
}
