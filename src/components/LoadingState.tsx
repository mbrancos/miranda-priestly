import { Palette, Type, Ruler } from 'lucide-react'

export default function LoadingState() {
    const steps = [
        { icon: <Palette className="w-5 h-5" />, label: 'Conectando ao site...', delay: '0s' },
        { icon: <Type className="w-5 h-5" />, label: 'Extraindo elementos visuais...', delay: '0.3s' },
        { icon: <Ruler className="w-5 h-5" />, label: 'Analisando tokens de design...', delay: '0.6s' },
    ]

    return (
        <div className="w-full flex flex-col items-center px-4">
            <div className="flex flex-col gap-8 w-full max-w-2xl">
                {steps.map((step, i) => (
                    <div
                        key={i}
                        className="animate-fade-in glass-card p-8 flex items-center gap-6 rounded-[var(--radius-xl)] shadow-lg"
                        style={{ animationDelay: step.delay, opacity: 0 }}
                    >
                        <div className="w-11 h-11 rounded-xl bg-[var(--color-accent-surface)] text-[var(--color-accent)] flex items-center justify-center animate-pulse-ring">
                            {step.icon}
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-[var(--color-text-primary)]">{step.label}</p>
                            <div className="mt-2.5 h-1.5 rounded-full overflow-hidden bg-[var(--color-surface-2)]">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-[var(--color-accent)] to-blue-500 animate-shimmer"
                                    style={{ width: '100%' }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
