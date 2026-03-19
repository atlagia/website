import SpotlightCard from './reactbits/SpotlightCard';
import StarBorder from './reactbits/StarBorder';
import AnimatedContent from './reactbits/AnimatedContent';
import GradientText from './reactbits/GradientText';
import ShinyText from './reactbits/ShinyText';

interface Plan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: { text: string; link: string };
  popular: boolean;
}

interface PricingIslandProps {
  title: string;
  description: string;
  plans: Plan[];
}

const THEME_COLORS = ['#00E599', '#06b6d4', '#00E599'];

export default function PricingIsland({ title, description, plans }: PricingIslandProps) {
  return (
    <section id="pricing" className="relative py-24 overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(0,229,153,0.05),transparent_50%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedContent direction="up" duration={700}>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              <GradientText colors={THEME_COLORS}>{title}</GradientText>
            </h2>
            <p className="text-gray-300 text-lg">{description}</p>
          </div>
        </AnimatedContent>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => {
            const card = (
              <SpotlightCard
                className={`rounded-2xl backdrop-blur-xl border transition-all duration-300 h-full ${
                  plan.popular
                    ? 'bg-gradient-to-b from-emerald-500/10 to-transparent border-emerald-500/30 hover:shadow-[0_0_50px_rgba(0,229,153,0.15)]'
                    : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                }`}
                spotlightColor={plan.popular ? 'rgba(0,229,153,0.12)' : 'rgba(255,255,255,0.05)'}
              >
                <div className="p-8 flex flex-col h-full">
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-black text-sm font-semibold shadow-lg shadow-emerald-500/30 z-20">
                      <ShinyText text="Most Popular" speed={2} shineColor="rgba(255,255,255,0.5)" />
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-white mb-1" style={{ fontFamily: 'var(--font-display)' }}>{plan.name}</h3>
                  <p className="text-sm text-gray-400 mb-4">{plan.description}</p>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>{plan.price}</span>
                    <span className="text-gray-400">{plan.period}</span>
                  </div>
                  <ul className="space-y-4 mb-8 flex-1">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-3 text-gray-300">
                        <svg className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href={plan.cta.link}
                    className={`block w-full py-3 px-6 rounded-xl text-center font-semibold transition-all duration-300 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black hover:shadow-lg hover:shadow-emerald-500/30'
                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                    }`}
                  >
                    {plan.cta.text}
                  </a>
                </div>
              </SpotlightCard>
            );

            return (
              <AnimatedContent key={i} direction="up" delay={i * 150} duration={600}>
                <div className={`relative ${plan.popular ? 'md:-translate-y-2' : ''}`}>
                  {plan.popular ? (
                    <StarBorder color="#00E599" speed={6} borderRadius="1rem">
                      {card}
                    </StarBorder>
                  ) : (
                    card
                  )}
                </div>
              </AnimatedContent>
            );
          })}
        </div>
      </div>
    </section>
  );
}
