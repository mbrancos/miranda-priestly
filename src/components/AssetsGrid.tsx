import { useState, useCallback, useEffect } from 'react'
import { Image, Download, AlertCircle, Loader2 } from 'lucide-react'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'

interface AssetsGridProps {
    images: string[]
    svgs: string[]
    sourceUrl: string
}

export default function AssetsGrid({ images, svgs, sourceUrl }: AssetsGridProps) {
    const [exporting, setExporting] = useState(false)

    const hasImages = images.length > 0
    const hasSvgs = svgs.length > 0
    const hasAssets = hasImages || hasSvgs

    const handleExportZip = useCallback(async () => {
        setExporting(true)
        try {
            const zip = new JSZip()
            const imagesFolder = zip.folder('images')!
            const iconsFolder = zip.folder('icons')!

            const imagePromises = images.map(async (url, i) => {
                try {
                    const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(url)}`
                    const res = await fetch(proxyUrl)
                    if (!res.ok) return
                    const blob = await res.blob()
                    const ext = getExtensionFromUrl(url) || getExtensionFromMime(blob.type)
                    imagesFolder.file(`image-${String(i + 1).padStart(3, '0')}.${ext}`, blob)
                } catch {
                    console.warn(`[ZIP] Failed to download: ${url}`)
                }
            })

            await Promise.all(imagePromises)

            svgs.forEach((svg, i) => {
                iconsFolder.file(`icon-${String(i + 1).padStart(3, '0')}.svg`, svg)
            })

            const blob = await zip.generateAsync({ type: 'blob' })
            const domain = getDomainFromUrl(sourceUrl)
            saveAs(blob, `miranda-priestly-assets-${domain}.zip`)
        } catch (err) {
            console.error('[ZIP] Export error:', err)
        } finally {
            setExporting(false)
        }
    }, [images, svgs, sourceUrl])

    if (!hasAssets) {
        return (
            <section className="glass-card p-10 relative overflow-hidden">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-surface-2/50 border border-white/5 flex items-center justify-center shadow-inner">
                        <Image className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                        <h3 className="text-3xl font-black text-text-primary tracking-tight">Inventário Visual</h3>
                        <p className="text-sm text-text-muted mt-1 font-light">Nenhum asset encontrado.</p>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center py-16 gap-4">
                    <AlertCircle className="w-12 h-12 text-text-muted/30" />
                    <p className="text-lg text-text-secondary text-center italic max-w-md leading-relaxed">
                        "Nenhuma imagem? Isso é minimalismo ou eles esqueceram de pagar o fotógrafo?"
                    </p>
                    <p className="text-sm text-text-muted">That's all.</p>
                </div>
            </section>
        )
    }

    return (
        <div className="space-y-12 w-full">
            {/* Header + Export Button */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-surface-2/50 border border-white/5 flex items-center justify-center shadow-inner">
                        <Image className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                        <h3 className="text-3xl font-black text-text-primary tracking-tight">Inventário Visual</h3>
                        <p className="text-sm text-text-muted mt-1 font-light">
                            <span className="font-semibold text-accent">{images.length} imagens</span> e{' '}
                            <span className="font-semibold text-accent">{svgs.length} ícones</span> capturados com a precisão de uma editora de moda.
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleExportZip}
                    disabled={exporting}
                    className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent-hover focus:ring-4 focus:ring-accent-glow focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer shadow-lg shadow-accent/20"
                >
                    {exporting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Empacotando...
                        </>
                    ) : (
                        <>
                            <Download className="w-4 h-4" />
                            Exportar Assets (ZIP)
                        </>
                    )}
                </button>
            </div>

            {/* Images Grid */}
            {hasImages && (
                <section className="glass-card p-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/5 rounded-full blur-[80px] -z-10 pointer-events-none"></div>

                    <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-6">
                        Imagens ({images.length})
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {images.map((url, i) => (
                            <ImageCard key={i} url={url} index={i} />
                        ))}
                    </div>
                </section>
            )}

            {/* SVGs Grid */}
            {hasSvgs && (
                <section className="glass-card p-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[80px] -z-10 pointer-events-none"></div>

                    <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-6">
                        Ícones SVG ({svgs.length})
                    </p>

                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                        {svgs.map((svg, i) => (
                            <SvgCard key={i} svg={svg} index={i} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    )
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Sanitize SVG string so it's always visible on dark backgrounds.
 * Forces size to 100%, injects white currentColor, and replaces
 * explicit black fills with currentColor.
 */
function sanitizeSvg(svg: string): string {
    let result = svg
    // Ensure the <svg> root has explicit dimensions
    if (!result.includes('width=') && !result.includes('height=')) {
        result = result.replace('<svg', '<svg width="100%" height="100%"')
    }
    // Inject white currentColor so paths using currentColor become white
    if (!result.includes('style=')) {
        result = result.replace('<svg', '<svg style="color:#ffffff;overflow:visible"')
    }
    // Replace hardcoded black fills with currentColor to inherit white
    result = result
        .replace(/fill="black"/gi, 'fill="currentColor"')
        .replace(/fill="#000000"/gi, 'fill="currentColor"')
        .replace(/fill="#000"/gi, 'fill="currentColor"')
        .replace(/fill:black/gi, 'fill:currentColor')
        .replace(/fill:#000000/gi, 'fill:currentColor')
    return result
}

// ─── SvgCard ─────────────────────────────────────────────────────────────────

/**
 * Renders a single SVG as an <img> using a data URL.
 * This ensures the SVG renders with its own native colors (no DOM inheritance),
 * and enables proper download and open-in-tab functionality.
 */
function SvgCard({ svg, index }: { svg: string, index: number }) {
    const dataUrl = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`

    const handleDownload = (e: React.MouseEvent) => {
        e.preventDefault()
        const blob = new Blob([svg], { type: 'image/svg+xml' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `icon-${String(index + 1).padStart(3, '0')}.svg`
        a.click()
        URL.revokeObjectURL(url)
    }

    const handleOpenTab = (e: React.MouseEvent) => {
        e.preventDefault()
        const blob = new Blob([svg], { type: 'image/svg+xml' })
        const url = URL.createObjectURL(blob)
        window.open(url, '_blank')
        setTimeout(() => URL.revokeObjectURL(url), 5000)
    }

    return (
        <div
            className="group relative aspect-square rounded-xl overflow-hidden border border-white/8 hover:border-amber-400/30 transition-all duration-300 hover:scale-[1.05] hover:shadow-xl hover:shadow-amber-500/10"
            style={{ background: 'repeating-conic-gradient(rgba(255,255,255,0.035) 0% 25%, rgba(8,8,18,0.95) 0% 50%) 0 0 / 14px 14px' }}
        >
            {/* SVG preview as img — uses its own native colors */}
            <img
                src={dataUrl}
                alt={`SVG Icon ${index + 1}`}
                className="w-full h-full p-3 object-contain"
            />

            {/* Action overlay on hover */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2.5 p-2">
                <button
                    onClick={handleDownload}
                    className="flex items-center gap-1.5 w-full justify-center py-1.5 px-2 rounded-lg bg-white/10 hover:bg-amber-400/20 border border-white/10 hover:border-amber-400/40 text-[10px] font-mono text-white/80 hover:text-amber-300 transition-all cursor-pointer"
                >
                    ↓ Download
                </button>
                <button
                    onClick={handleOpenTab}
                    className="flex items-center gap-1.5 w-full justify-center py-1.5 px-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 text-[10px] font-mono text-white/60 hover:text-white/90 transition-all cursor-pointer"
                >
                    ↗ Nova aba
                </button>
                <span className="text-[9px] font-mono text-white/30 uppercase tracking-wider mt-0.5">
                    svg · {index + 1}
                </span>
            </div>
        </div>
    )
}


function getExtensionFromUrl(url: string): string {
    try {
        const pathname = new URL(url).pathname
        const ext = pathname.split('.').pop()?.toLowerCase()
        if (ext && ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'avif', 'ico'].includes(ext)) {
            return ext
        }
    } catch { /* */ }
    return ''
}

function getExtensionFromMime(mime: string): string {
    const map: Record<string, string> = {
        'image/png': 'png',
        'image/jpeg': 'jpg',
        'image/gif': 'gif',
        'image/webp': 'webp',
        'image/svg+xml': 'svg',
        'image/avif': 'avif',
        'image/x-icon': 'ico',
    }
    return map[mime] || 'png'
}

function getFilenameFromUrl(url: string): string {
    try {
        return new URL(url).pathname.split('/').pop() || 'image'
    } catch {
        return 'image'
    }
}

function getDomainFromUrl(url: string): string {
    try {
        return new URL(url).hostname.replace('www.', '')
    } catch {
        return 'site'
    }
}

// ─── ImageCard ────────────────────────────────────────────────────────────────

function ImageCard({ url, index }: { url: string, index: number }) {
    const [meta, setMeta] = useState<{ width: number, height: number, sizeKb: number | null }>({ width: 0, height: 0, sizeKb: null })
    const [failed, setFailed] = useState(false)

    useEffect(() => {
        let isMounted = true

        const fetchMeta = async () => {
            // Resolve image dimensions via Image element
            const img = new globalThis.Image()
            img.onload = () => {
                if (!isMounted) return
                setMeta(prev => ({ ...prev, width: img.naturalWidth, height: img.naturalHeight }))
            }
            img.onerror = () => {
                if (isMounted) setFailed(true)
            }
            img.src = url

            // Probe file size via HEAD through our proxy
            try {
                const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(url)}`
                const res = await fetch(proxyUrl, { method: 'HEAD' })
                if (res.ok && isMounted) {
                    const length = res.headers.get('content-length')
                    if (length) {
                        setMeta(prev => ({ ...prev, sizeKb: Math.round(parseInt(length) / 1024) }))
                    }
                }
            } catch {
                // Ignore - sizeKb stays null
            }
        }

        fetchMeta()
        return () => { isMounted = false }
    }, [url])

    if (failed) return null

    const ext = getExtensionFromUrl(url).toUpperCase() || 'IMG'
    const name = getFilenameFromUrl(url)

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col rounded-xl overflow-hidden border border-white/8 hover:border-accent/40 transition-all duration-500 hover:shadow-2xl hover:-translate-y-0.5"
            style={{ background: 'rgba(14, 14, 22, 0.92)' }}
        >
            {/* Preview area — dark checkerboard via CSS so it's always dark */}
            <div
                className="relative aspect-square p-4 flex items-center justify-center overflow-hidden"
                style={{
                    background: 'repeating-conic-gradient(rgba(255,255,255,0.025) 0% 25%, rgba(0,0,0,0.35) 0% 50%) 0 0 / 12px 12px',
                }}
            >
                <img
                    src={url}
                    alt={`Asset ${index + 1}`}
                    loading="lazy"
                    className="w-full h-full object-contain filter drop-shadow-xl group-hover:scale-105 transition-transform duration-700 ease-out"
                />
            </div>

            {/* Metadata footer */}
            <div
                className="px-3.5 py-3 border-t border-white/8 flex flex-col gap-1.5"
                style={{ background: 'rgba(8, 8, 16, 0.97)' }}
            >
                <p className="text-[11px] font-semibold text-white/80 truncate leading-tight" title={name}>{name}</p>
                <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-accent/15 text-[9px] font-bold text-accent font-mono uppercase tracking-wider border border-accent/20">
                        {ext}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-mono text-white/35">
                        {meta.width > 0 && <span>{meta.width}×{meta.height}</span>}
                        {meta.sizeKb !== null && (
                            <>
                                <span className="opacity-50">·</span>
                                <span>{meta.sizeKb}kb</span>
                            </>
                        )}
                    </span>
                </div>
            </div>
        </a>
    )
}
