import { Server, Globe2, BarChart3, ShieldCheck, ShieldX, Cloud, HardDrive } from 'lucide-react'
import type { InfrastructureResult } from '../types'

interface InfraPanelProps {
    infrastructure: InfrastructureResult | undefined
}

// ─── Miranda's Verdicts ───────────────────────────────────────────────────────

const CMS_VERDICTS: Record<string, string> = {
    'WordPress': '"WordPress. Espero que os 47 plugins de segurança estejam atualizados. Caso contrário, serão encontrados amanhã de manhã nos tablóides."',
    'Wix': '"Construído no Wix. Compreendo. O orçamento deve estar extremamente apertado nesta temporada."',
    'Webflow': '"Webflow. Uma escolha competente. Ainda não é código real, mas ao menos tem a decência de parecer."',
    'Bubble': '"Bubble. No-code. Pelo menos foram honestos sobre as suas limitações — o que não é pouco."',
    'Builderall': '"Builderall. Uma escolha... existente. That\'s all."',
    'Squarespace': '"Squarespace. Minimalista forçado. É o IKEA do desenvolvimento web."',
    'Shopify': '"Shopify. Funciona. Não me perguntem se eu gosto, mas funciona."',
    'WeWeb': '"WeWeb. Construtores de frontend declarando independência dos programadores. Interessante audácia."',
    'Google Sites': '"Google Sites. Em 2026. Isso é ou minimalismo de alto nível ou falta completa de informação."',
    'Next.js': '"Next.js. Framework moderno, SSR, edge-ready. Ao menos alguém aqui sabe o que está a fazer."',
    'Nuxt.js': '"Nuxt.js. A escolha do Vue para quem não quer explicar por que não usa Next. Aceitável."',
    'Angular': '"Angular. Burocrático, verboso e absolutamente corporativo. Como um tailleur mal-cortado."',
    'Vue.js': '"Vue.js. Simpático. O Golden Retriever dos frameworks. Ninguém odeia, ninguém se impressiona."',
    'React (SPA)': '"React puro, sem SSR. Espero que o seu SEO também seja purista — em não existir."',
    'Drupal': '"Drupal. Robusto como uma rocha e com interface igualmente atraente."',
    'Joomla': '"Joomla. Uma escolha de 2008 que sobreviveu de algum modo. Resista ao impulso de perguntar como."',
    'HTML Customizado/Puro': '"HTML puro. É um purista ou parou no tempo em 1999? De qualquer forma, é ousado."',
}

const HOSTING_VERDICTS: Record<string, string> = {
    cloud: '"Alta performance. Serverless, edge, escalável. Muito bem — o servidor não será uma desculpa para o layout."',
    shared: '"Shared hosting. O orçamento da campanha foi todo para o fotógrafo. Sobrou troco para a infra."',
    unknown: '"Não identificado. Ou está bem escondido, ou simplesmente não quer ser encontrado. Entendo."',
}

const TRACKER_VERDICTS = {
    many: (n: number) => `"Vigiado por ${n} pixels. Que desespero por atenção e por dados de conversão ao mesmo tempo."`,
    some: (n: number) => `"${n} rastreadores. Monitoramento padrão de quem não quer tomar decisões às cegas."`,
    none: '"Nenhum pixel de conversão. Estão a lançar uma coleção às cegas, pelo que vejo. Ousados."',
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
    cms: { label: 'CMS', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    pagebuilder: { label: 'Page Builder', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    framework: { label: 'Framework', color: 'text-green-400 bg-green-500/10 border-green-500/20' },
    pure: { label: 'HTML Puro', color: 'text-text-muted bg-white/5 border-white/10' },
    unknown: { label: 'Desconhecido', color: 'text-text-muted bg-white/5 border-white/10' },
}

function CmsCard({ infrastructure }: { infrastructure: InfrastructureResult }) {
    const verdict = CMS_VERDICTS[infrastructure.cms] || `"${infrastructure.cms}. Sem comentários adicionais."`
    const cat = CATEGORY_LABELS[infrastructure.cmsCategory] || CATEGORY_LABELS.unknown

    return (
        <div className="glass-card p-8 relative overflow-hidden">
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent-surface border border-border-default flex items-center justify-center">
                        <Globe2 className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-text-muted uppercase tracking-widest">CMS & Stack</p>
                        <h4 className="text-lg font-black text-text-primary">Tecnologia de Construção</h4>
                    </div>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${cat.color}`}>
                    {cat.label}
                </span>
            </div>

            <p className="text-3xl font-black text-text-primary mb-6">{infrastructure.cms}</p>

            <blockquote className="border-l-2 border-border-default pl-4">
                <p className="text-sm text-text-secondary italic font-light leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                    {verdict}
                </p>
                <footer className="text-[10px] text-text-muted mt-2 font-mono tracking-wider">— Miranda Priestly</footer>
            </blockquote>
        </div>
    )
}

function HostingCard({ infrastructure }: { infrastructure: InfrastructureResult }) {
    const verdict = HOSTING_VERDICTS[infrastructure.hostingCategory] || HOSTING_VERDICTS.unknown
    const isCloud = infrastructure.hostingCategory === 'cloud'
    const isShared = infrastructure.hostingCategory === 'shared'

    return (
        <div className={`glass-card p-8 relative overflow-hidden border ${isCloud ? 'border-emerald-500/20' : isShared ? 'border-orange-500/20' : 'border-white/8'}`}>
            <div className={`absolute inset-0 pointer-events-none ${isCloud ? 'bg-emerald-500/3' : isShared ? 'bg-orange-500/3' : ''}`} />

            <div className="flex items-start justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent-surface border border-border-default flex items-center justify-center">
                        {isCloud ? <Cloud className="w-5 h-5 text-emerald-500" /> : <HardDrive className="w-5 h-5 text-orange-500" />}
                    </div>
                    <div>
                        <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Hospedagem</p>
                        <h4 className="text-lg font-black text-text-primary">Provedor de Infraestrutura</h4>
                    </div>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${isCloud ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                    : isShared ? 'text-orange-400 bg-orange-500/10 border-orange-500/20'
                        : 'text-text-muted bg-white/5 border-white/10'
                    }`}>
                    {isCloud ? '☁ Cloud' : isShared ? '⬡ Shared' : '? Desconhecido'}
                </span>
            </div>

            <p className="text-3xl font-black text-text-primary mb-6 relative z-10">{infrastructure.hosting}</p>

            <blockquote className="border-l-2 border-white/10 pl-4 relative z-10">
                <p className="text-sm text-text-secondary italic font-light leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                    {verdict}
                </p>
                <footer className="text-[10px] text-text-muted mt-2 font-mono tracking-wider">— Miranda Priestly</footer>
            </blockquote>
        </div>
    )
}

function TrackersCard({ infrastructure }: { infrastructure: InfrastructureResult }) {
    const count = infrastructure.trackers.length
    const verdict = count >= 4
        ? TRACKER_VERDICTS.many(count)
        : count > 0
            ? TRACKER_VERDICTS.some(count)
            : TRACKER_VERDICTS.none

    return (
        <div className="glass-card p-8 relative overflow-hidden">
            <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent-surface border border-border-default flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Rastreadores</p>
                        <h4 className="text-lg font-black text-text-primary">Analytics & Pixels</h4>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {count > 0
                        ? <ShieldX className="w-4 h-4 text-amber-400" />
                        : <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    }
                    <span className={`text-2xl font-black font-mono ${count >= 4 ? 'text-red-400' : count > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {count}
                    </span>
                </div>
            </div>

            {count > 0 ? (
                <div className="flex flex-wrap gap-2 mb-6">
                    {infrastructure.trackers.map(t => (
                        <span
                            key={t}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-amber-500/8 border border-amber-500/15 text-amber-300/80 font-mono"
                        >
                            {t}
                        </span>
                    ))}
                </div>
            ) : (
                <p className="text-2xl font-black text-text-primary mb-6">Nenhum detectado</p>
            )}

            <blockquote className="border-l-2 border-white/10 pl-4">
                <p className="text-sm text-text-secondary italic font-light leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                    {verdict}
                </p>
                <footer className="text-[10px] text-text-muted mt-2 font-mono tracking-wider">— Miranda Priestly</footer>
            </blockquote>
        </div>
    )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function InfraPanel({ infrastructure }: InfraPanelProps) {
    if (!infrastructure) {
        return (
            <div className="glass-card p-12 flex flex-col items-center justify-center gap-4 text-center">
                <Server className="w-12 h-12 text-text-muted/30" />
                <blockquote>
                    <p className="text-lg text-text-secondary italic" style={{ fontFamily: 'Georgia, serif' }}>
                        "Os bastidores não foram revelados. O servidor guardou os seus segredos desta vez."
                    </p>
                    <footer className="text-xs text-text-muted mt-2 font-mono">— Miranda Priestly</footer>
                </blockquote>
            </div>
        )
    }

    return (
        <div className="space-y-8 w-full animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-accent-surface border border-border-default flex items-center justify-center shadow-xs">
                    <Server className="w-6 h-6 text-accent" />
                </div>
                <div>
                    <h3 className="text-3xl font-black text-text-primary tracking-tight">Os Bastidores</h3>
                    <p className="text-sm text-text-muted mt-1 font-light">
                        CMS, infraestrutura e rastreadores — expostos com a discreção habitual.
                    </p>
                </div>
            </div>

            {/* Cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CmsCard infrastructure={infrastructure} />
                <HostingCard infrastructure={infrastructure} />
                <TrackersCard infrastructure={infrastructure} />
            </div>
        </div>
    )
}
