import { useEffect } from 'react'
import Header from './components/Header'
import InputSection from './components/InputSection'
import LoadingState from './components/LoadingState'
import ResultTabs from './components/ResultTabs'
import { useTheme } from './hooks/useTheme'
import { useExtractor } from './hooks/useExtractor'

export default function App() {
    const { theme, toggleTheme } = useTheme()
    const {
        loading,
        result,
        sourceUrl,
        error,
        extract,
    } = useExtractor()

    const hasResult = result && !loading

    // Sync theme with documentElement for global body background support
    useEffect(() => {
        document.documentElement.className = theme
    }, [theme])

    return (
        <div className="min-h-screen text-text-primary overflow-x-hidden transition-colors duration-500">
            <Header theme={theme} onToggleTheme={toggleTheme} />

            <main role="main">
                {/* Landing Hero — shown when no result yet */}
                {!hasResult && (
                    <InputSection onExtract={extract} loading={loading} theme={theme} />
                )}

                {/* Loading state */}
                {loading && !result && (
                    <div role="status" aria-live="polite" className="flex justify-center items-center min-vh-100 py-32">
                        <LoadingState />
                    </div>
                )}

                {/* Error banner */}
                {error && !loading && (
                    <div className="pt-32 px-6 flex justify-center">
                        <div
                            className="animate-fade-in relative overflow-hidden w-full max-w-2xl rounded-2xl p-10 text-center border border-red-500/20"
                            role="alert"
                            style={{ background: theme === 'dark' ? 'rgba(239,68,68,0.06)' : 'rgba(239,68,68,0.03)' }}
                        >
                            <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-red-500/60 to-transparent" />
                            <p className="text-red-500 font-medium text-xl leading-relaxed">
                                "{error}"
                            </p>
                            <p className="mt-4 text-sm text-text-muted italic" style={{ fontFamily: 'var(--font-serif)' }}>
                                That's all.
                            </p>
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-8 px-6 py-2.5 rounded-xl border border-border-default text-sm text-text-secondary hover:text-text-primary hover:border-border-hover transition-all duration-200 cursor-pointer"
                            >
                                Tentar novamente
                            </button>
                        </div>
                    </div>
                )}

                {/* Results — compact input bar at top + full results */}
                {hasResult && (
                    <div className="pt-24 animate-fade-in">
                        {/* Sticky compact input bar */}
                        <div
                            className="sticky top-20 z-40 mx-4 sm:mx-8 lg:mx-16 mb-8"
                        >
                            <form
                                onSubmit={e => {
                                    e.preventDefault()
                                    const input = (e.currentTarget.elements.namedItem('url') as HTMLInputElement)
                                    const val = input?.value.trim()
                                    if (val) extract(val.startsWith('http') ? val : 'https://' + val)
                                }}
                                className="flex items-center gap-2 p-2 rounded-2xl border transition-all duration-500"
                                style={{
                                    background: theme === 'dark' ? 'rgba(5,5,5,0.8)' : 'rgba(255,255,255,0.8)',
                                    backdropFilter: 'blur(24px)',
                                    WebkitBackdropFilter: 'blur(24px)',
                                    borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                                }}
                            >
                                <input
                                    name="url"
                                    type="text"
                                    defaultValue={sourceUrl}
                                    placeholder="Analisar outro site..."
                                    className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted text-sm outline-none font-mono px-4 py-2"
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="shrink-0 px-5 py-2 rounded-xl text-sm font-medium text-white disabled:opacity-30 transition-all cursor-pointer"
                                    style={{ background: theme === 'dark' ? 'rgba(139,92,246,0.7)' : 'rgba(43,91,132,0.8)' }}
                                >
                                    {loading ? 'Analisando...' : 'Analisar'}
                                </button>
                            </form>
                        </div>

                        {/* Result content */}
                        <div className="w-full max-w-6xl mx-auto px-4 sm:px-8 lg:px-16 pb-32">
                            <ResultTabs result={result} sourceUrl={sourceUrl} />
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}
