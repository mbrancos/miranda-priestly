/**
 * WCAG 2.1 Contrast Ratio Utilities
 * Used by AuditPanel to evaluate text readability.
 */

interface RGB { r: number; g: number; b: number }

/** Parse hex or rgb() string to RGB. Returns null if unparseable. */
export function hexToRgb(color: string): RGB | null {
    const clean = color.trim().toLowerCase()

    // hex: #rgb or #rrggbb
    const hexMatch = clean.match(/^#([0-9a-f]{3,8})$/)
    if (hexMatch) {
        const hex = hexMatch[1]
        if (hex.length === 3) {
            return {
                r: parseInt(hex[0] + hex[0], 16),
                g: parseInt(hex[1] + hex[1], 16),
                b: parseInt(hex[2] + hex[2], 16),
            }
        }
        if (hex.length === 6) {
            return {
                r: parseInt(hex.slice(0, 2), 16),
                g: parseInt(hex.slice(2, 4), 16),
                b: parseInt(hex.slice(4, 6), 16),
            }
        }
    }

    // rgb(r, g, b) or rgba(r, g, b, a)
    const rgbMatch = clean.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/)
    if (rgbMatch) {
        return {
            r: parseInt(rgbMatch[1]),
            g: parseInt(rgbMatch[2]),
            b: parseInt(rgbMatch[3]),
        }
    }

    return null
}

/** Relative luminance per WCAG 2.1 (sRGB). */
export function relativeLuminance({ r, g, b }: RGB): number {
    const toLinear = (c: number): number => {
        const s = c / 255
        return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
    }
    return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
}

/** Contrast ratio between two hex/rgb color strings. Returns null if either is invalid. */
export function calculateContrastRatio(fgColor: string, bgColor: string): number | null {
    const fg = hexToRgb(fgColor)
    const bg = hexToRgb(bgColor)
    if (!fg || !bg) return null

    const l1 = relativeLuminance(fg)
    const l2 = relativeLuminance(bg)
    const lighter = Math.max(l1, l2)
    const darker = Math.min(l1, l2)
    return Math.round(((lighter + 0.05) / (darker + 0.05)) * 100) / 100
}

/** WCAG compliance level for normal text. */
export function getContrastLevel(ratio: number | null): 'AAA' | 'AA' | 'FAIL' {
    if (ratio === null) return 'FAIL'
    if (ratio >= 7) return 'AAA'
    if (ratio >= 4.5) return 'AA'
    return 'FAIL'
}
