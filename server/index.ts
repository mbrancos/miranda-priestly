import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import * as cheerio from 'cheerio'

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
        html?: string
        markdown?: string
        metadata?: {
            title?: string
            sourceURL?: string
        }
    }
    error?: string
}

type UiLibrary = 'tailwind' | 'material-ui' | 'bootstrap' | 'radix' | 'custom' | 'unknown'
type MotionLib = 'framer-motion' | 'gsap' | 'aos' | 'css-native' | 'none' | 'unknown'

interface AuditResult {
    uiLibrary: UiLibrary
    uiLibraryConfidence: number
    motionLib: MotionLib
    motionDetected: boolean
}

// ─── Infrastructure Audit ─────────────────────────────────────────────────────

type CmsCategory = 'cms' | 'pagebuilder' | 'framework' | 'pure' | 'unknown'
type HostingCategory = 'cloud' | 'shared' | 'unknown'

interface InfrastructureResult {
    cms: string
    cmsCategory: CmsCategory
    hosting: string
    hostingCategory: HostingCategory
    trackers: string[]
}

/** Fetch only response headers from the target URL (HEAD request, 5s timeout). */
async function fetchHeaders(url: string): Promise<Record<string, string>> {
    try {
        const controller = new AbortController()
        const timer = setTimeout(() => controller.abort(), 5000)
        const res = await fetch(url, {
            method: 'HEAD',
            signal: controller.signal,
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MirandaPriestlyBot/1.0)' },
            redirect: 'follow',
        })
        clearTimeout(timer)
        const headers: Record<string, string> = {}
        res.headers.forEach((value, key) => { headers[key.toLowerCase()] = value.toLowerCase() })
        return headers
    } catch {
        return {}
    }
}

function detectHosting(headers: Record<string, string>): { hosting: string; hostingCategory: HostingCategory } {
    const has = (key: string, val?: string) =>
        val ? (headers[key] || '').includes(val) : key in headers

    if (has('x-vercel-id')) return { hosting: 'Vercel', hostingCategory: 'cloud' }
    if (has('x-nf-request-id')) return { hosting: 'Netlify', hostingCategory: 'cloud' }
    if (has('cf-ray') || has('server', 'cloudflare')) return { hosting: 'Cloudflare', hostingCategory: 'cloud' }
    if (has('x-amz-cf-id') || has('via', 'cloudfront')) return { hosting: 'AWS CloudFront', hostingCategory: 'cloud' }
    if (has('x-amzn-requestid') || has('x-amz-request-id')) return { hosting: 'AWS', hostingCategory: 'cloud' }
    if (has('x-github-request-id')) return { hosting: 'GitHub Pages', hostingCategory: 'cloud' }
    if (has('x-azure-ref')) return { hosting: 'Azure', hostingCategory: 'cloud' }

    const server = headers['server'] || ''
    if (server.includes('litespeed')) return { hosting: 'LiteSpeed (Locaweb/KingHost)', hostingCategory: 'shared' }
    if (has('x-hostinger-cache') || (headers['x-powered-by'] || '').includes('hostinger')) {
        return { hosting: 'Hostinger', hostingCategory: 'shared' }
    }
    if (server.includes('apache') && !server.includes('ubuntu')) {
        return { hosting: 'Apache (Shared Hosting)', hostingCategory: 'shared' }
    }
    if (server.includes('nginx')) return { hosting: 'Nginx (VPS/Cloud)', hostingCategory: 'cloud' }

    return { hosting: 'Desconhecido', hostingCategory: 'unknown' }
}

function detectCms(html: string, headers: Record<string, string>): { cms: string; cmsCategory: CmsCategory } {
    const h = html

    // Page builders / closed platforms
    if (h.includes('static.wixstatic.com') || h.includes('wix.com/') || h.includes('X-Wix-')) {
        return { cms: 'Wix', cmsCategory: 'pagebuilder' }
    }
    if (h.includes('bubble.io') || h.includes('bblbrry.com')) {
        return { cms: 'Bubble', cmsCategory: 'pagebuilder' }
    }
    if (h.includes('webflow.com') || h.includes('Webflow') || h.includes('data-wf-page')) {
        return { cms: 'Webflow', cmsCategory: 'pagebuilder' }
    }
    if (h.includes('builderall') || h.includes('builderall.com')) {
        return { cms: 'Builderall', cmsCategory: 'pagebuilder' }
    }
    if (h.includes('weweb.io') || h.includes('weweb-preview')) {
        return { cms: 'WeWeb', cmsCategory: 'pagebuilder' }
    }
    if (h.includes('sites.google.com') || h.includes('google-site-verification') && h.includes('gstatic')) {
        return { cms: 'Google Sites', cmsCategory: 'pagebuilder' }
    }

    // CMS
    if (h.includes('wp-content/') || h.includes('wp-includes/') || (headers['x-powered-by'] || '').includes('wordpress')) {
        return { cms: 'WordPress', cmsCategory: 'cms' }
    }
    if (h.includes('drupal') || h.includes('/sites/default/files/')) {
        return { cms: 'Drupal', cmsCategory: 'cms' }
    }
    if (h.includes('Joomla') || h.includes('/media/system/js/')) {
        return { cms: 'Joomla', cmsCategory: 'cms' }
    }
    if (h.includes('squarespace') || h.includes('Squarespace')) {
        return { cms: 'Squarespace', cmsCategory: 'pagebuilder' }
    }
    if (h.includes('shopify') || h.includes('myshopify.com') || h.includes('cdn.shopify')) {
        return { cms: 'Shopify', cmsCategory: 'cms' }
    }

    // JS Frameworks
    if (h.includes('__NEXT_DATA__') || h.includes('/_next/static/')) {
        return { cms: 'Next.js', cmsCategory: 'framework' }
    }
    if (h.includes('__NUXT__') || h.includes('/_nuxt/')) {
        return { cms: 'Nuxt.js', cmsCategory: 'framework' }
    }
    if (h.includes('ng-version=') || h.includes('angular')) {
        return { cms: 'Angular', cmsCategory: 'framework' }
    }
    if (h.includes('__vue_app__') || h.includes('data-v-')) {
        return { cms: 'Vue.js', cmsCategory: 'framework' }
    }
    if (h.includes('data-reactroot') || h.includes('__reactFiber') || h.includes('__react')) {
        return { cms: 'React (SPA)', cmsCategory: 'framework' }
    }

    // Pure HTML fallback
    return { cms: 'HTML Customizado/Puro', cmsCategory: 'pure' }
}

function detectTrackers(html: string): string[] {
    const trackers: { name: string; signals: string[] }[] = [
        { name: 'Google Analytics', signals: ['gtag/js', 'analytics.js', "ga('create'", 'googletagmanager.com'] },
        { name: 'Meta Pixel', signals: ['fbevents.js', "fbq('init'"] },
        { name: 'Hotjar', signals: ['hotjar.com', 'hjSVG', "hj('trigger'"] },
        { name: 'Microsoft Clarity', signals: ['clarity.ms/tag/'] },
        { name: 'TikTok Pixel', signals: ['analytics.tiktok.com'] },
        { name: 'Intercom', signals: ['intercom.io/', "Intercom('boot'"] },
        { name: 'LinkedIn Insight', signals: ['snap.licdn.com'] },
        { name: 'Twitter/X Pixel', signals: ['static.ads-twitter.com'] },
    ]
    return trackers
        .filter(t => t.signals.some(s => html.includes(s)))
        .map(t => t.name)
}

async function auditInfrastructure(html: string, url: string, headers: Record<string, string>): Promise<InfrastructureResult> {
    const { cms, cmsCategory } = detectCms(html, headers)
    const { hosting, hostingCategory } = detectHosting(headers)
    const trackers = detectTrackers(html)
    console.log(`[Infra] CMS: ${cms} | Hosting: ${hosting} | Trackers: ${trackers.length}`)
    return { cms, cmsCategory, hosting, hostingCategory, trackers }
}



function auditDesignFromHtml(html: string): AuditResult {
    const $ = cheerio.load(html)
    const fullHtml = html

    // ── UI Library Detection ──────────────────────────────────────────────────
    let uiLibrary: UiLibrary = 'unknown'
    let uiLibraryConfidence = 0

    // 1. Material UI: Emotion-generated classes (css-*) + Mui* classes
    const muiClassCount = (fullHtml.match(/\bMui[A-Z][a-zA-Z]+-\w+/g) || []).length
    const emotionCount = (fullHtml.match(/\bcss-[a-z0-9]{5,}/g) || []).length
    if (muiClassCount > 3 || (muiClassCount > 0 && emotionCount > 5)) {
        uiLibrary = 'material-ui'
        uiLibraryConfidence = Math.min(100, 50 + muiClassCount * 10)
    }

    // 2. Bootstrap: structural classes
    const bootstrapClasses = ['container', 'row', 'col-', 'btn btn-', 'navbar', 'card', 'd-flex', 'mt-', 'mb-', 'px-', 'py-']
    const bootstrapCount = bootstrapClasses.filter(c => fullHtml.includes(c)).length
    if (bootstrapCount >= 4 && uiLibrary === 'unknown') {
        uiLibrary = 'bootstrap'
        uiLibraryConfidence = Math.min(100, bootstrapCount * 15)
    }

    // 3. Radix UI: data-radix-* attributes
    const radixCount = (fullHtml.match(/data-radix-/g) || []).length
    if (radixCount > 2 && uiLibrary === 'unknown') {
        uiLibrary = 'radix'
        uiLibraryConfidence = Math.min(100, 40 + radixCount * 8)
    }

    // 4. Tailwind: Many diverse utility classes
    const tailwindPatterns = [
        /\b(flex|grid|block|inline)\b/g,
        /\b(text|bg|border|p|m|px|py|mx|my)-\w+/g,
        /\b(rounded|shadow|opacity|overflow|z|gap|space)-\w+/g,
        /\b(sm:|md:|lg:|xl:)\w+/g,
    ]
    let tailwindCount = 0
    const classAttrContent = ($('[class]').toArray()
        .map(el => $(el).attr('class') || '')
        .join(' '))
    tailwindPatterns.forEach(pat => {
        tailwindCount += (classAttrContent.match(pat) || []).length
    })
    if (tailwindCount > 80 && uiLibrary === 'unknown') {
        uiLibrary = 'tailwind'
        uiLibraryConfidence = Math.min(100, 40 + Math.floor(tailwindCount / 10))
    }

    // 5. Custom/CSS Modules: if nothing else matched but classes exist
    const anyClassCount = $('[class]').length
    if (uiLibrary === 'unknown' && anyClassCount > 10) {
        uiLibrary = 'custom'
        uiLibraryConfidence = 70
    }

    // ── Motion Detection ──────────────────────────────────────────────────────
    let motionLib: MotionLib = 'none'
    let motionDetected = false

    // Framer Motion: data-projection-id or data-framer-*
    if (fullHtml.includes('data-projection-id') || fullHtml.includes('data-framer-') || fullHtml.includes('framer-motion')) {
        motionLib = 'framer-motion'
        motionDetected = true
    }
    // GSAP
    else if (fullHtml.includes('gsap') && (fullHtml.includes('gsap.min.js') || fullHtml.includes('ScrollTrigger') || fullHtml.includes('gsap.to('))) {
        motionLib = 'gsap'
        motionDetected = true
    }
    // AOS (Animate on Scroll)
    else if (fullHtml.includes('data-aos') || fullHtml.includes('aos.js') || fullHtml.includes('aos.min.js')) {
        motionLib = 'aos'
        motionDetected = true
    }
    // CSS native transitions
    else {
        const transitionCount = (fullHtml.match(/\btransition(-\w+)?/g) || []).length
        const animateCount = (fullHtml.match(/\banimate-\w+/g) || []).length
        const keyframeCount = (fullHtml.match(/@keyframes/g) || []).length
        if (transitionCount > 10 || animateCount > 5 || keyframeCount > 0) {
            motionLib = 'css-native'
            motionDetected = true
        }
    }

    return { uiLibrary, uiLibraryConfidence, motionLib, motionDetected }
}

// ─── Typography Scale Extraction ──────────────────────────────────────────────

interface TypoEntry {
    fontFamily: string | null
    fontSize: string | null
    fontWeight: string | null
    lineHeight: string | null
}

interface TypographyScaleResult {
    h1: TypoEntry | null
    h2: TypoEntry | null
    h3: TypoEntry | null
    h4: TypoEntry | null
    h5: TypoEntry | null
    h6: TypoEntry | null
    p_normal: TypoEntry | null
    p_small: TypoEntry | null
}

function extractTypographyFromHtml(html: string): TypographyScaleResult {
    const $ = cheerio.load(html)

    // Collect all <style> contents for class-based lookup
    let allStyles = ''
    $('style').each((_, el) => {
        allStyles += $(el).html() || ''
    })

    // Parse CSS rules into a simple map: selector -> { prop: value }
    const cssRules = new Map<string, Record<string, string>>()
    const ruleRegex = /([^{}]+)\{([^}]+)\}/g
    let match
    while ((match = ruleRegex.exec(allStyles)) !== null) {
        const selector = match[1].trim()
        const body = match[2]
        const props: Record<string, string> = {}
        body.split(';').forEach(decl => {
            const [prop, ...valParts] = decl.split(':')
            if (prop && valParts.length) {
                props[prop.trim().toLowerCase()] = valParts.join(':').trim()
            }
        })
        cssRules.set(selector, props)
    }

    const TYPO_PROPS = ['font-family', 'font-size', 'font-weight', 'line-height']

    function getStyleFromClasses(el: cheerio.Element): Record<string, string> {
        const classes = $(el).attr('class')?.split(/\s+/) || []
        const merged: Record<string, string> = {}
        for (const cls of classes) {
            // Check both .classname and tag.classname selectors
            for (const [selector, props] of cssRules) {
                if (selector === `.${cls}` || selector.endsWith(`.${cls}`)) {
                    for (const p of TYPO_PROPS) {
                        if (props[p]) merged[p] = props[p]
                    }
                }
            }
        }
        return merged
    }

    function getStyleFromInline(el: cheerio.Element): Record<string, string> {
        const style = $(el).attr('style') || ''
        const props: Record<string, string> = {}
        style.split(';').forEach(decl => {
            const [prop, ...valParts] = decl.split(':')
            if (prop && valParts.length) {
                const key = prop.trim().toLowerCase()
                if (TYPO_PROPS.includes(key)) {
                    props[key] = valParts.join(':').trim()
                }
            }
        })
        return props
    }

    function getTagLevelStyles(tagName: string): Record<string, string> {
        const merged: Record<string, string> = {}
        // Check tag-level CSS rules (e.g. h1 { ... })
        for (const [selector, props] of cssRules) {
            const trimmed = selector.replace(/\s+/g, ' ').trim()
            if (trimmed === tagName || trimmed.endsWith(` ${tagName}`) || trimmed.startsWith(`${tagName},`)) {
                for (const p of TYPO_PROPS) {
                    if (props[p]) merged[p] = props[p]
                }
            }
        }
        return merged
    }

    function extractForTag(tagName: string): TypoEntry | null {
        const elements = $(tagName)
        if (elements.length === 0) return null

        // Priority: inline style > class styles > tag-level CSS rules
        const el = elements.first()[0]
        if (!el) return null

        const tagStyles = getTagLevelStyles(tagName)
        const classStyles = getStyleFromClasses(el)
        const inlineStyles = getStyleFromInline(el)

        const merged = { ...tagStyles, ...classStyles, ...inlineStyles }

        // If we got nothing meaningful at all, return null
        if (!merged['font-family'] && !merged['font-size'] && !merged['font-weight']) {
            return null
        }

        return {
            fontFamily: merged['font-family']?.replace(/['"]/g, '') || null,
            fontSize: merged['font-size'] || null,
            fontWeight: merged['font-weight'] || null,
            lineHeight: merged['line-height'] || null,
        }
    }

    // Extract headings
    const h1 = extractForTag('h1')
    const h2 = extractForTag('h2')
    const h3 = extractForTag('h3')
    const h4 = extractForTag('h4')
    const h5 = extractForTag('h5')
    const h6 = extractForTag('h6')

    // Extract paragraphs — differentiate normal vs small
    let p_normal: TypoEntry | null = null
    let p_small: TypoEntry | null = null

    const paragraphs = $('p')
    if (paragraphs.length > 0) {
        // Collect all paragraph font sizes to find the "normal" (most common) and "small"
        const sizeMap = new Map<string, number>()
        const pEntries: { size: string; entry: TypoEntry }[] = []

        paragraphs.each((_, el) => {
            const tagStyles = getTagLevelStyles('p')
            const classStyles = getStyleFromClasses(el)
            const inlineStyles = getStyleFromInline(el)
            const merged = { ...tagStyles, ...classStyles, ...inlineStyles }

            const size = merged['font-size'] || 'inherit'
            sizeMap.set(size, (sizeMap.get(size) || 0) + 1)

            if (merged['font-family'] || merged['font-size'] || merged['font-weight']) {
                pEntries.push({
                    size,
                    entry: {
                        fontFamily: merged['font-family']?.replace(/['"]/g, '') || null,
                        fontSize: merged['font-size'] || null,
                        fontWeight: merged['font-weight'] || null,
                        lineHeight: merged['line-height'] || null,
                    }
                })
            }
        })

        if (pEntries.length > 0) {
            // Sort by frequency to find the "normal" paragraph
            const sortedSizes = [...sizeMap.entries()].sort((a, b) => b[1] - a[1])
            const normalSize = sortedSizes[0]?.[0]
            const normalEntry = pEntries.find(e => e.size === normalSize)
            p_normal = normalEntry?.entry || pEntries[0].entry

            // Find smallest size for p_small
            const parsePx = (s: string) => parseFloat(s) || 999
            const smallest = pEntries.reduce((min, cur) =>
                parsePx(cur.size) < parsePx(min.size) ? cur : min
            )
            if (smallest.size !== normalSize) {
                p_small = smallest.entry
            }
        }
    }

    console.log(`[Typography] Extracted: H1=${!!h1} H2=${!!h2} H3=${!!h3} H4=${!!h4} H5=${!!h5} H6=${!!h6} P=${!!p_normal} Ps=${!!p_small}`)

    return { h1, h2, h3, h4, h5, h6, p_normal, p_small }
}

function extractAssetsFromHtml(html: string, baseUrl: string): { images: string[], svgs: string[] } {

    const $ = cheerio.load(html)
    const images: string[] = []
    const svgs: string[] = []
    const seenUrls = new Set<string>()

    // Extract image URLs from <img>, <picture source>, and CSS background-image
    $('img').each((_, el) => {
        const src = $(el).attr('src') || $(el).attr('data-src')
        if (!src) return
        try {
            const absoluteUrl = new URL(src, baseUrl).href
            if (!seenUrls.has(absoluteUrl) && !absoluteUrl.startsWith('data:')) {
                seenUrls.add(absoluteUrl)
                images.push(absoluteUrl)
            }
        } catch { /* skip invalid URLs */ }
    })

    $('picture source').each((_, el) => {
        const srcset = $(el).attr('srcset')
        if (!srcset) return
        // Take the first URL from srcset
        const firstSrc = srcset.split(',')[0]?.trim().split(/\s+/)[0]
        if (!firstSrc) return
        try {
            const absoluteUrl = new URL(firstSrc, baseUrl).href
            if (!seenUrls.has(absoluteUrl) && !absoluteUrl.startsWith('data:')) {
                seenUrls.add(absoluteUrl)
                images.push(absoluteUrl)
            }
        } catch { /* skip */ }
    })

    // Extract inline SVGs
    $('svg').each((_, el) => {
        const svgHtml = $.html(el)
        if (svgHtml && svgHtml.length > 20 && svgHtml.length < 50000) {
            svgs.push(svgHtml)
        }
    })

    return { images: images.slice(0, 50), svgs: svgs.slice(0, 30) }
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

        // Fire HEAD request in parallel with Firecrawl to capture HTTP headers
        const headersPromise = fetchHeaders(url)

        const firecrawlRes = await fetch('https://api.firecrawl.dev/v2/scrape', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                url,
                formats: ['branding', 'screenshot', 'html'],
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

        const [data, responseHeaders]: [any, Record<string, string>] = await Promise.all([
            firecrawlRes.json(),
            headersPromise,
        ])

        if (!data.success || !data.data?.branding) {
            console.error('[Extractor] Firecrawl returned no branding data:', data)
            res.status(422).json({
                error: 'Não foi possível extrair tokens de design dessa URL. O site pode não ter tokens CSS detectáveis ou o acesso foi bloqueado.',
            })
            return
        }

        let images: string[] = []
        let svgs: string[] = []
        let audit = null
        let infrastructure = null
        let typographyScale = null
        if (data.data.html) {
            const assets = extractAssetsFromHtml(data.data.html, url)
            images = assets.images
            svgs = assets.svgs
            audit = auditDesignFromHtml(data.data.html)
            infrastructure = await auditInfrastructure(data.data.html, url, responseHeaders)
            typographyScale = extractTypographyFromHtml(data.data.html)
            console.log(`[Extractor] Found ${images.length} images, ${svgs.length} SVGs | UI: ${audit.uiLibrary} | Motion: ${audit.motionLib}`)
        }

        console.log(`[Extractor] Success for: ${url}`)

        res.json({
            branding: data.data.branding,
            metadata: data.data.metadata,
            screenshot: data.data.screenshot,
            images,
            svgs,
            audit,
            infrastructure,
            typographyScale,
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

// Proxy endpoint for downloading images (avoids CORS issues)
app.use('/api/proxy-image', async (req, res) => {
    const imageUrl = req.query.url as string
    if (!imageUrl) {
        res.status(400).json({ error: 'URL da imagem é obrigatória.' })
        return
    }

    try {
        const response = await fetch(imageUrl, {
            method: req.method === 'HEAD' ? 'HEAD' : 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; MirandaPriestly/1.0)',
            },
        })

        if (!response.ok) {
            res.status(response.status).json({ error: `Falha ao baixar imagem: ${response.status}` })
            return
        }

        const contentType = response.headers.get('content-type') || 'application/octet-stream'
        const contentLength = response.headers.get('content-length')

        res.setHeader('Content-Type', contentType)
        res.setHeader('Cache-Control', 'public, max-age=3600')
        if (contentLength) {
            res.setHeader('Content-Length', contentLength)
        }

        if (req.method === 'HEAD') {
            res.end()
            return
        }

        const buffer = Buffer.from(await response.arrayBuffer())
        res.send(buffer)
    } catch (err) {
        console.error('[Proxy] Image download error:', err)
        res.status(500).json({ error: 'Falha ao fazer proxy da imagem.' })
    }
})

app.listen(PORT, () => {
    console.log(`[Extractor] Server running on http://localhost:${PORT}`)
})

