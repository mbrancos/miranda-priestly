export interface BrandingColors {
    primary?: string
    secondary?: string
    accent?: string
    background?: string
    textPrimary?: string
    textSecondary?: string
    link?: string
    success?: string
    warning?: string
    error?: string
    [key: string]: string | undefined
}

export interface BrandingFont {
    family: string
}

export interface BrandingTypography {
    fontFamilies?: {
        primary?: string
        heading?: string
        code?: string
        [key: string]: string | undefined
    }
    fontSizes?: {
        h1?: string
        h2?: string
        h3?: string
        body?: string
        [key: string]: string | undefined
    }
    fontWeights?: {
        light?: number
        regular?: number
        medium?: number
        bold?: number
        [key: string]: number | undefined
    }
    lineHeights?: {
        heading?: string
        body?: string
        [key: string]: string | undefined
    }
}

export interface BrandingSpacing {
    baseUnit?: number
    borderRadius?: string
    padding?: Record<string, string>
    margins?: Record<string, string>
}

export interface BrandingComponents {
    buttonPrimary?: {
        background?: string
        textColor?: string
        borderRadius?: string
    }
    buttonSecondary?: {
        background?: string
        textColor?: string
        borderColor?: string
        borderRadius?: string
    }
    input?: Record<string, string>
    [key: string]: Record<string, string | undefined> | undefined
}

export interface BrandingData {
    colorScheme?: string
    logo?: string
    colors?: BrandingColors
    fonts?: BrandingFont[]
    typography?: BrandingTypography
    spacing?: BrandingSpacing
    components?: BrandingComponents
}

export interface ExtractResult {
    branding: BrandingData
    metadata?: {
        title?: string
        sourceURL?: string
    }
}

/** W3C Design Tokens format for AI consumption */
export interface DesignTokens {
    $schema: string
    name: string
    sourceUrl: string
    extractedAt: string
    colors: Record<string, {
        $type: string
        $value: string
        $description?: string
    }>
    typography: Record<string, {
        $type: string
        $value: string | number
        $description?: string
    }>
    spacing: Record<string, {
        $type: string
        $value: string | number
        $description?: string
    }>
    components?: Record<string, Record<string, {
        $type: string
        $value: string
    }>>
}
