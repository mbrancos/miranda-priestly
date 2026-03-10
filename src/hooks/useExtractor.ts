import { useState, useCallback } from 'react'
import type { ExtractResult } from '../types'

export function useExtractor() {
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<ExtractResult | null>(null)
    const [sourceUrl, setSourceUrl] = useState('')
    const [error, setError] = useState<string | null>(null)

    const extract = useCallback(async (url: string) => {
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

            if (!res.ok) {
                let errorMessage = `Erro ${res.status}.`
                try {
                    const data = await res.json()
                    errorMessage = data.error || errorMessage
                } catch {
                    if (res.status === 500) {
                        errorMessage = 'Erro interno no servidor de extração. Por favor, seja minimamente competente e verifique se o servidor está rodando.'
                    } else if (res.status === 404) {
                        errorMessage = 'Endpoint não encontrado. Uma tragédia de proporções épicas.'
                    }
                }
                throw new Error(errorMessage)
            }

            const data = await res.json()
            setResult(data)
        } catch (err) {
            console.error('[useExtractor] Error:', err)
            let finalErrorText = 'Isso não é um site válido, é um desastre de formatação.'

            if (err instanceof Error) {
                // If it's our custom thrown error from !res.ok, we can use it.
                // Or we can override completely to ensure the Miranda tone.
                finalErrorText = err.message.includes('Erro interno') || err.message.includes('Endpoint')
                    ? err.message
                    : `Detalhes terríveis da sua solicitação: ${err.message}. E não, isso não foi um elogio.`
            }

            setError(finalErrorText)
        } finally {
            setLoading(false)
        }
    }, [])

    const reset = useCallback(() => {
        setResult(null)
        setError(null)
        setLoading(false)
    }, [])

    return {
        loading,
        result,
        sourceUrl,
        error,
        extract,
        reset
    }
}
