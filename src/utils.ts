import type { BrandingData, DesignTokens } from './types'

export function brandingToDesignTokens(branding: BrandingData, sourceUrl: string): DesignTokens {
    const colors: DesignTokens['colors'] = {}
    const typography: DesignTokens['typography'] = {}
    const spacing: DesignTokens['spacing'] = {}
    const components: DesignTokens['components'] = {}

    // ── Colors ──
    if (branding.colors) {
        const colorLabels: Record<string, string> = {
            primary: 'Cor primária da marca',
            secondary: 'Cor secundária',
            accent: 'Cor de destaque',
            background: 'Cor de fundo geral',
            textPrimary: 'Cor do texto principal',
            textSecondary: 'Cor do texto secundário',
            link: 'Cor de links',
            success: 'Cor de sucesso',
            warning: 'Cor de aviso',
            error: 'Cor de erro',
        }

        for (const [key, value] of Object.entries(branding.colors)) {
            if (value) {
                colors[key] = {
                    $type: 'color',
                    $value: value,
                    $description: colorLabels[key] || `Cor: ${key}`,
                }
            }
        }
    }

    // ── Typography ──
    if (branding.typography?.fontFamilies) {
        for (const [key, value] of Object.entries(branding.typography.fontFamilies)) {
            if (value) {
                typography[`fontFamily-${key}`] = {
                    $type: 'fontFamily',
                    $value: value,
                    $description: `Família de fonte ${key}`,
                }
            }
        }
    }

    if (branding.fonts?.length) {
        branding.fonts.forEach((font, i) => {
            if (font.family && !Object.values(typography).some(t => t.$value === font.family)) {
                typography[`font-${i}`] = {
                    $type: 'fontFamily',
                    $value: font.family,
                    $description: `Fonte detectada: ${font.family}`,
                }
            }
        })
    }

    if (branding.typography?.fontSizes) {
        for (const [key, value] of Object.entries(branding.typography.fontSizes)) {
            if (value) {
                typography[`fontSize-${key}`] = {
                    $type: 'fontSize',
                    $value: value,
                    $description: `Tamanho de fonte para ${key}`,
                }
            }
        }
    }

    if (branding.typography?.fontWeights) {
        for (const [key, value] of Object.entries(branding.typography.fontWeights)) {
            if (value !== undefined) {
                typography[`fontWeight-${key}`] = {
                    $type: 'fontWeight',
                    $value: value,
                    $description: `Peso da fonte: ${key}`,
                }
            }
        }
    }

    if (branding.typography?.lineHeights) {
        for (const [key, value] of Object.entries(branding.typography.lineHeights)) {
            if (value) {
                typography[`lineHeight-${key}`] = {
                    $type: 'lineHeight',
                    $value: value,
                    $description: `Altura de linha para ${key}`,
                }
            }
        }
    }

    // ── Spacing ──
    if (branding.spacing) {
        if (branding.spacing.baseUnit !== undefined) {
            spacing['baseUnit'] = {
                $type: 'dimension',
                $value: `${branding.spacing.baseUnit}px`,
                $description: 'Unidade base de espaçamento',
            }
        }
        if (branding.spacing.borderRadius) {
            spacing['borderRadius'] = {
                $type: 'borderRadius',
                $value: branding.spacing.borderRadius,
                $description: 'Raio de borda padrão',
            }
        }
        if (branding.spacing.padding) {
            for (const [key, value] of Object.entries(branding.spacing.padding)) {
                if (value) {
                    spacing[`padding-${key}`] = {
                        $type: 'spacing',
                        $value: value,
                        $description: `Padding ${key}`,
                    }
                }
            }
        }
    }

    // ── Components ──
    if (branding.components) {
        for (const [compName, compTokens] of Object.entries(branding.components)) {
            if (compTokens) {
                components[compName] = {}
                for (const [prop, value] of Object.entries(compTokens)) {
                    if (value) {
                        components[compName][prop] = {
                            $type: prop.includes('color') || prop.includes('background') || prop.includes('border') ? 'color' : 'dimension',
                            $value: value,
                        }
                    }
                }
            }
        }
    }

    return {
        $schema: 'https://design-tokens.github.io/community-group/format/',
        name: 'DesignSystemTokens',
        sourceUrl,
        extractedAt: new Date().toISOString(),
        colors,
        typography,
        spacing,
        ...(Object.keys(components).length > 0 ? { components } : {}),
    }
}

export function generateTailwindConfig(tokens: DesignTokens): string {
    const config: any = {
        theme: {
            extend: {
                colors: {},
                fontSize: {},
                fontWeight: {},
                lineHeight: {},
                borderRadius: {},
                spacing: {},
            }
        }
    }

    // Map colors
    Object.entries(tokens.colors).forEach(([name, data]) => {
        config.theme.extend.colors[name] = data.$value
    })

    // Map typography
    Object.entries(tokens.typography).forEach(([name, data]) => {
        if (name.startsWith('fontSize-')) {
            config.theme.extend.fontSize[name.replace('fontSize-', '')] = data.$value
        } else if (name.startsWith('fontWeight-')) {
            config.theme.extend.fontWeight[name.replace('fontWeight-', '')] = data.$value
        } else if (name.startsWith('lineHeight-')) {
            config.theme.extend.lineHeight[name.replace('lineHeight-', '')] = data.$value
        }
    })

    // Map spacing
    Object.entries(tokens.spacing).forEach(([name, data]) => {
        if (name === 'borderRadius') {
            config.theme.extend.borderRadius.default = data.$value
        } else if (name.startsWith('padding-')) {
            config.theme.extend.spacing[name.replace('padding-', 'p-')] = data.$value
        } else if (name === 'baseUnit') {
            config.theme.extend.spacing.base = data.$value
        }
    })

    return `/** @type {import('tailwindcss').Config} */\nexport default ${JSON.stringify(config, null, 2)}`
}

export function generateCSSVariables(tokens: DesignTokens): string {
    let css = ':root {\n'

    // Colors
    css += '  /* Colors */\n'
    Object.entries(tokens.colors).forEach(([name, data]) => {
        css += `  --color-${name}: ${data.$value};\n`
    })

    // Typography
    css += '\n  /* Typography */\n'
    Object.entries(tokens.typography).forEach(([name, data]) => {
        css += `  --${name.replace('fontSize-', 'font-size-').replace('fontWeight-', 'font-weight-').replace('lineHeight-', 'line-height-')}: ${data.$value};\n`
    })

    // Spacing
    css += '\n  /* Spacing */\n'
    Object.entries(tokens.spacing).forEach(([name, data]) => {
        const cssName = name === 'borderRadius' ? 'border-radius' : name.replace('padding-', 'spacing-p-')
        css += `  --${cssName}: ${data.$value};\n`
    })

    css += '}'
    return css
}

export function downloadFile(content: string, filename: string, contentType: string) {
    const a = document.createElement('a')
    const file = new Blob([content], { type: contentType })
    a.href = URL.createObjectURL(file)
    a.download = filename
    a.click()
    URL.revokeObjectURL(a.href)
}
