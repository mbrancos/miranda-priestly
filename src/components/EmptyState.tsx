import { Code2, Palette, Ruler, Type } from 'lucide-react'

export default function EmptyState() {
    const cards = [
        {
            icon: <Palette className="w-5 h-5 text-pink-400" />,
            title: 'Paletas de Cores',
            description: 'Detecção automática de cores primárias, secundárias e funcionais.'
        },
        {
            icon: <Type className="w-5 h-5 text-blue-400" />,
            title: 'Guia de Tipografia',
            description: 'Extração de famílias de fontes, pesos e escala tipográfica.'
        },
        {
            icon: <Ruler className="w-5 h-5 text-emerald-400" />,
            title: 'Tokens de Espaço',
            description: 'Identificação de paddings, margens e bordas arredondadas.'
        },
        {
            icon: <Code2 className="w-5 h-5 text-amber-400" />,
            title: 'Exportação Pronta',
            description: 'Geração imediata de JSON (tokens) e configurações para Tailwind v4.'
        }
    ]

    return (
        <div className="mt-48 animate-fade-in w-full flex flex-col items-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 max-w-5xl mx-auto">
                {cards.map((card, i) => (
                    <div
                        key={i}
                        className="glass-card p-8 sm:p-10 hover:bg-[var(--color-surface-1)] hover:-translate-y-1 transition-all duration-300 border border-[var(--color-border-default)]/50 rounded-[var(--radius-xl)]"
                    >
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                            <div className="shrink-0 w-14 h-14 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border-default)] flex items-center justify-center shadow-inner">
                                {card.icon}
                            </div>
                            <div className="pt-1">
                                <h4 className="font-bold text-lg text-[var(--color-text-primary)] tracking-tight">{card.title}</h4>
                                <p className="text-[15px] text-[var(--color-text-secondary)] mt-3 leading-relaxed">
                                    {card.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-20 flex justify-center animate-fade-in" style={{ animationDelay: '0.6s', opacity: 0 }}>
                <p className="inline-flex items-center gap-3 text-sm font-medium text-[var(--color-text-muted)] bg-[var(--color-surface-1)] px-6 py-3 rounded-full border border-[var(--color-border-default)] shadow-sm">
                    <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse shadow-[0_0_8px_var(--color-accent)]" />
                    Experimente com sites como airbnb.com, stripe.com ou apple.com
                </p>
            </div>
        </div>
    )
}
