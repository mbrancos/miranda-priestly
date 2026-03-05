import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

interface FirecrawlBranding {
    colorScheme?: string
    logo?: string
    colors?: Record<string, string>
    fonts?: Array<{ family: string }>
    typography?: {
        fontFamilies?: Record<string, string>
        fontSizes?: Record<string, string>
        fontWeights?: Record<string, number>
        lineHeights?: Record<string, string>
    }
    spacing?: {
        baseUnit?: number
        borderRadius?: string
        padding?: Record<string, string>
        margins?: Record<string, string>
    }
    components?: Record<string, Record<string, string>>
}

interface FirecrawlResponse {
    success: boolean
    data?: {
        branding?: FirecrawlBranding
        markdown?: string
        metadata?: {
            title?: string
            sourceURL?: string
        }
    }
    error?: string
}

app.post('/api/extract', async (req, res) => {
    const { url } = req.body

    if (!url || typeof url !== 'string') {
        res.status(400).json({ error: 'URL é obrigatória.' })
        return
    }

    try {
        new URL(url)
    } catch {
        res.status(400).json({ error: 'URL inválida. Insira uma URL válida (ex: https://exemplo.com).' })
        return
    }

    const apiKey = process.env.FIRECRAWL_API_KEY
    if (!apiKey) {
        res.status(500).json({ error: 'FIRECRAWL_API_KEY não configurada no servidor.' })
        return
    }

    try {
        console.log(`[Extractor] Scraping: ${url}`)

        const firecrawlRes = await fetch('https://api.firecrawl.dev/v2/scrape', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                url,
                formats: ['branding', 'screenshot'],
                waitFor: 3000,
                timeout: 30000,
            }),
        })

        if (!firecrawlRes.ok) {
            let errText = ''
            try {
                errText = await firecrawlRes.text()
            } catch {
                errText = 'Sem resposta do servidor.'
            }
            console.error(`[Extractor] Firecrawl error ${firecrawlRes.status}:`, errText)
            res.status(firecrawlRes.status).json({
                error: `Erro ao conectar ao Firecrawl (${firecrawlRes.status}). ${firecrawlRes.status === 402 ? 'Limite de créditos atingido.' : 'Tente novamente.'}`,
            })
            return
        }

        const data: any = await firecrawlRes.json()

        if (!data.success || !data.data?.branding) {
            console.error('[Extractor] Firecrawl returned no branding data:', data)
            res.status(422).json({
                error: 'Não foi possível extrair tokens de design dessa URL. O site pode não ter tokens CSS detectáveis ou o acesso foi bloqueado.',
            })
            return
        }

        console.log(`[Extractor] Success for: ${url}`)

        res.json({
            branding: data.data.branding,
            metadata: data.data.metadata,
            screenshot: data.data.screenshot,
        })
    } catch (err) {
        console.error('[Extractor] Server error:', err)
        const errorMessage = err instanceof Error && err.name === 'AbortError'
            ? 'A extração demorou muito e foi cancelada.'
            : 'Erro interno do servidor. Verifique os logs.';

        res.status(500).json({
            error: errorMessage,
        })
    }
})

app.listen(PORT, () => {
    console.log(`[Extractor] Server running on http://localhost:${PORT}`)
})
