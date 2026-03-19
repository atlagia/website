import AnimatedContent from './reactbits/AnimatedContent';
import GradientText from './reactbits/GradientText';

interface Step {
  number: string;
  title: string;
  description: string;
}

interface HowItWorksIslandProps {
  title: string;
  description: string;
  steps: Step[];
}

const THEME_COLORS = ['#00E599', '#06b6d4', '#00E599'];

export default function HowItWorksIsland({ title, description, steps }: HowItWorksIslandProps) {
  return (
    <section id="how-it-works" className="relative py-24 overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,rgba(6,182,212,0.06),transparent_50%)]" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedContent direction="up" duration={700}>
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              <GradientText colors={THEME_COLORS}>{title}</GradientText>
            </h2>
            <p className="text-gray-300 text-lg">{description}</p>
          </div>
        </AnimatedContent>

        <div className="relative">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-500/40 via-cyan-500/20 to-transparent" />
          <div className="space-y-16 md:space-y-20">
            {steps.map((step, i) => {
              const isEven = i % 2 === 0;
              return (
                <AnimatedContent key={i} direction={isEven ? 'left' : 'right'} delay={i * 150} duration={600}>
                  <div className={`flex flex-col md:flex-row items-center gap-8 ${isEven ? '' : 'md:flex-row-reverse'}`}>
                    <div className={`flex-1 ${isEven ? 'md:text-right' : 'md:text-left'}`}>
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-3" style={{ fontFamily: 'var(--font-display)' }}>{step.title}</h3>
                      <p className="text-gray-300 text-base leading-relaxed">{step.description}</p>
                    </div>
                    <div className="relative flex-shrink-0">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center">
                        <span className="text-2xl font-bold text-emerald-400" style={{ fontFamily: 'var(--font-display)' }}>{step.number}</span>
                      </div>
                    </div>
                    <div className="flex-1 hidden md:block" />
                  </div>
                </AnimatedContent>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
