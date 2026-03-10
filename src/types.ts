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

export type UiLibrary = 'tailwind' | 'material-ui' | 'bootstrap' | 'radix' | 'custom' | 'unknown'
export type MotionLib = 'framer-motion' | 'gsap' | 'aos' | 'css-native' | 'none' | 'unknown'
export type CmsCategory = 'cms' | 'pagebuilder' | 'framework' | 'pure' | 'unknown'
export type HostingCategory = 'cloud' | 'shared' | 'unknown'

export interface AuditResult {
    uiLibrary: UiLibrary
    uiLibraryConfidence: number
    motionLib: MotionLib
    motionDetected: boolean
}

export interface InfrastructureResult {
    cms: string
    cmsCategory: CmsCategory
    hosting: string
    hostingCategory: HostingCategory
    trackers: string[]
}

export interface TypographyScaleEntry {
    fontFamily: string | null
    fontSize: string | null
    fontWeight: string | null
    lineHeight: string | null
}

export interface TypographyScale {
    h1: TypographyScaleEntry | null
    h2: TypographyScaleEntry | null
    h3: TypographyScaleEntry | null
    h4: TypographyScaleEntry | null
    h5: TypographyScaleEntry | null
    h6: TypographyScaleEntry | null
    p_normal: TypographyScaleEntry | null
    p_small: TypographyScaleEntry | null
}

export interface ExtractResult {
    branding: BrandingData
    metadata?: {
        title?: string
        sourceURL?: string
    }
    images?: string[]
    svgs?: string[]
    audit?: AuditResult
    infrastructure?: InfrastructureResult
    typographyScale?: TypographyScale
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
