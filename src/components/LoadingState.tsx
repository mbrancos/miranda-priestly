import { Eye, Palette, Hexagon } from 'lucide-react'

export default function LoadingState() {
    const steps = [
        { icon: <Eye className="w-5 h-5" />, label: 'Avaliando se esta URL merece nosso tempo...', delay: '0s' },
        { icon: <Hexagon className="w-5 h-5" />, label: 'Extraindo estrutura. Por favor, que não seja outro template florido para a primavera...', delay: '0.3s' },
        { icon: <Palette className="w-5 h-5" />, label: 'Compilando os tokens de cor. Estou julgando as escolhas silenciosamente.', delay: '0.6s' },
    ]

    return (
        <div className="w-full flex flex-col items-center px-4">
            <div className="flex flex-col gap-6 w-full max-w-2xl relative">
                {/* Linha conectora de vidro entre steps */}
                <div className="absolute left-[34px] top-10 bottom-10 w-0.5 bg-linear-to-b from-accent/40 via-accent/10 to-transparent -z-10"></div>

                {steps.map((step, i) => (
                    <div
                        key={i}
                        className="animate-fade-in glass-card p-6 flex items-center gap-6 rounded-2xl relative overflow-hidden"
                        style={{ animationDelay: step.delay, opacity: 0 }}
                    >
                        <div className="w-12 h-12 rounded-full bg-surface-2/50 backdrop-blur-md border border-white/5 text-accent flex items-center justify-center animate-pulse-ring z-10 shrink-0 shadow-lg shadow-black/20">
                            {step.icon}
                        </div>
                        <div className="flex-1 z-10">
                            <p className="text-sm font-medium text-text-primary tracking-wide leading-relaxed">{step.label}</p>
                            <div className="mt-3 h-1 rounded-full overflow-hidden bg-surface-2/30">
                                <div
                                    className="h-full rounded-full bg-accent animate-shimmer"
                                    style={{ width: '100%' }}
                                />
                            </div>
                        </div>
                    </div>
                ))}

                <p className="text-center mt-6 text-sm text-text-muted italic opacity-70">Aguarde. A excelência leva tempo.</p>
            </div>
        </div>
    )
}
