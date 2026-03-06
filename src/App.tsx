import { useState, useCallback } from 'react'
import Header from './components/Header'
import InputSection from './components/InputSection'
import LoadingState from './components/LoadingState'
import ResultTabs from './components/ResultTabs'
import EmptyState from './components/EmptyState'
import type { ExtractResult } from './types'

export default function App() {
    const [theme, setTheme] = useState<'dark' | 'light'>('dark')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<ExtractResult | null>(null)
    const [sourceUrl, setSourceUrl] = useState('')
    const [error, setError] = useState<string | null>(null)

    const toggleTheme = useCallback(() => {
        setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
    }, [])

    const handleExtract = useCallback(async (url: string) => {
        setLoading(true)
        setError(null)
        setResult(null)
        setSourceUrl(url)

        try {
            const res = await fetch('/api/extract', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || `Erro ${res.status}`)
            }

            setResult(data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido ao extrair tokens.')
        } finally {
            setLoading(false)
        }
    }, [])

    return (
        <div className={theme}>
            <div className="min-h-screen bg-[var(--color-surface-0)] text-[var(--color-text-primary)] transition-colors duration-300">
                <Header theme={theme} onToggleTheme={toggleTheme} />

                <main className="w-full max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 pb-32 flex flex-col items-center gap-16">
                    <InputSection onExtract={handleExtract} loading={loading} />

                    {loading && <LoadingState />}

                    {!loading && !result && !error && <EmptyState />}

                    {error && (
                        <div className="animate-fade-in glass-card p-10 border-l-4 border-l-[var(--color-error)] w-full max-w-3xl rounded-[var(--radius-lg)]">
                            <p className="text-[var(--color-error)] font-medium text-lg text-center">{error}</p>
                        </div>
                    )}

                    {result && !loading && (
                        <div className="animate-fade-in w-full">
                            <ResultTabs result={result} sourceUrl={sourceUrl} />
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}
