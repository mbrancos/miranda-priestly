import { useState, type FormEvent } from 'react'
import { Search, Sparkles } from 'lucide-react'

interface InputSectionProps {
    onExtract: (url: string) => void
    loading: boolean
}

export default function InputSection({ onExtract, loading }: InputSectionProps) {
    const [url, setUrl] = useState('')

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
        <section className="pt-32 sm:pt-44 pb-24 flex flex-col items-center justify-center text-center w-full">
            <div className="mb-6 inline-flex items-center gap-3 px-6 py-3 rounded-full bg-accent-surface border border-accent/20 shadow-sm animate-fade-in" style={{ animationDelay: '0.1s', opacity: 0 }}>
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-[14px] font-bold text-accent tracking-wider uppercase">
                    Powered by Firecrawl
                </span>
            </div>

            <h2 className="text-5xl sm:text-7xl font-black tracking-tight leading-[1.05] animate-fade-in" style={{ animationDelay: '0.2s', opacity: 0 }}>
                Extraia o{' '}
                <span className="gradient-text">Design System</span>
                <br />
                de qualquer site
            </h2>

            <p className="mt-12 mb-10 text-xl sm:text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.3s', opacity: 0 }}>
                Insira uma URL e receba os tokens de design prontos para
                <br className="hidden sm:block" />
                consumo humano e para suas ferramentas de IA.
            </p>

            <form onSubmit={handleSubmit} className="mt-16 w-full max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.4s', opacity: 0 }}>
                <div className="glass-card p-3 flex items-center gap-3 transition-all duration-300 hover:border-border-hover focus-within:border-accent/50 focus-within:shadow-[0_0_0_5px_var(--color-accent-glow)] rounded-xl">
                    <div className="flex items-center gap-4 flex-1 pl-5">
                        <Search className="w-6 h-6 text-text-muted shrink-0" />
                        <input
                            type="text"
                            value={url}
                            onChange={e => setUrl(e.target.value)}
                            placeholder="https://meuprojeto.com.br"
                            disabled={loading}
                            className="flex-1 bg-transparent text-text-primary placeholder-text-muted text-lg outline-none disabled:opacity-50 font-mono py-2"
                            autoFocus
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !url.trim()}
                        className="shrink-0 px-8 py-4 rounded-lg bg-linear-to-r from-accent to-blue-500 text-white font-bold text-base hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 shadow-(--color-accent-glow) cursor-pointer"
                    >
                        {loading ? (
                            <span className="flex items-center gap-3">
                                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Extraindo...
                            </span>
                        ) : (
                            'Extrair Tokens'
                        )}
                    </button>
                </div>
            </form>
        </section>
    )
}
