import { Sun, Moon, Layers } from 'lucide-react'

interface HeaderProps {
    theme: 'dark' | 'light'
    onToggleTheme: () => void
}

export default function Header({ theme, onToggleTheme }: HeaderProps) {
    const isLight = theme === 'light'

    return (
        <header className="fixed top-0 left-0 right-0 z-50">
            {/* Glass Navbar */}
            <div className="mx-4 mt-4 sm:mx-8 lg:mx-16">
                <div
                    className="flex items-center justify-between px-6 h-14 rounded-2xl border transition-all duration-500"
                    style={{
                        background: isLight ? 'rgba(255, 255, 255, 0.7)' : 'rgba(5, 5, 5, 0.7)',
                        backdropFilter: 'blur(24px)',
                        WebkitBackdropFilter: 'blur(24px)',
                        borderColor: isLight ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.08)',
                        boxShadow: isLight
                            ? '0 4px 24px rgba(0,0,0,0.04), inset 0 0 0 1px rgba(255,255,255,0.4)'
                            : '0 4px 24px rgba(0,0,0,0.2), inset 0 0 0 1px rgba(255,255,255,0.03)',
                    }}
                >
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-linear-to-br from-accent to-blue-500 flex items-center justify-center shadow-lg shadow-accent/20">
                            <Layers className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <span
                                className={`text-sm font-bold tracking-tight leading-none transition-colors duration-500 ${isLight ? 'text-slate-900' : 'text-white'}`}
                                style={{ fontFamily: 'var(--font-serif)' }}
                            >
                                Miranda Priestly
                            </span>
                            <p className={`text-[10px] font-mono uppercase tracking-widest leading-none mt-0.5 transition-colors duration-500 ${isLight ? 'text-slate-400' : 'text-white/30'}`}>
                                Design Intelligence
                            </p>
                        </div>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        <span className={`hidden sm:block text-[11px] font-mono transition-colors duration-500 ${isLight ? 'text-slate-400' : 'text-white/30'}`}>
                            powered by Firecrawl
                        </span>
                        <div className={`h-4 w-px hidden sm:block transition-colors duration-500 ${isLight ? 'bg-slate-200' : 'bg-white/10'}`} />

                        {/* Theme Toggle Button */}
                        <button
                            onClick={onToggleTheme}
                            className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-300 cursor-pointer ${isLight
                                    ? 'bg-white/50 border-slate-200 hover:border-slate-300 text-slate-600'
                                    : 'bg-white/5 border-white/10 hover:border-white/20 text-white/70'
                                }`}
                            aria-label={isLight ? 'Ativar tema escuro' : 'Ativar tema claro'}
                        >
                            {isLight ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                        </button>

                        <div
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all duration-500 border ${isLight
                                    ? 'bg-slate-50 border-slate-200 text-slate-500'
                                    : 'bg-white/5 border-white/10 text-white/40'
                                }`}
                        >
                            v2.0
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
