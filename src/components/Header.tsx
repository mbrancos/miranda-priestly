import { Sun, Moon, Layers } from 'lucide-react'

interface HeaderProps {
    theme: 'dark' | 'light'
    onToggleTheme: () => void
}

export default function Header({ theme, onToggleTheme }: HeaderProps) {
    return (
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-[var(--color-surface-0)]/80 border-b border-[var(--color-border-default)]">
            <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 h-16 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-blue-500 flex items-center justify-center shadow-lg shadow-[var(--color-accent-glow)]">
                        <Layers className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-base font-bold tracking-tight leading-none">
                            Design System Extractor
                        </h1>
                        <p className="text-[11px] text-[var(--color-text-muted)] font-medium tracking-wide uppercase mt-0.5">
                            AIA-Ready Tokens
                        </p>
                    </div>
                </div>

                <button
                    onClick={onToggleTheme}
                    className="w-9 h-9 rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-1)] flex items-center justify-center hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface-2)] transition-all duration-200 cursor-pointer"
                    aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
                >
                    {theme === 'dark' ? (
                        <Sun className="w-4 h-4 text-[var(--color-text-secondary)]" />
                    ) : (
                        <Moon className="w-4 h-4 text-[var(--color-text-secondary)]" />
                    )}
                </button>
            </div>
        </header>
    )
}
