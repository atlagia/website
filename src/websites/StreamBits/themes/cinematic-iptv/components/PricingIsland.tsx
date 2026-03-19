import SpotlightCard from './reactbits/SpotlightCard';
import StarBorder from './reactbits/StarBorder';
import AnimatedContent from './reactbits/AnimatedContent';
import GradientText from './reactbits/GradientText';
import ShinyText from './reactbits/ShinyText';

interface Plan {
  name: string;
  price: string;
  duration: string;
  checkoutUrl: string;
  features: string[];
  isPopular: boolean;
}

interface PricingIslandProps {
  title: string;
  description: string;
  plans: Plan[];
}

export default function PricingIsland({ title, description, plans }: PricingIslandProps) {
  return (
    <section className="relative py-24 overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(59,130,246,0.06),transparent_50%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedContent direction="up" duration={700}>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              <GradientText colors={['#8b5cf6', '#6366f1', '#06b6d4']}>{title}</GradientText>
            </h2>
            <p className="text-gray-300 text-lg">{description}</p>
          </div>
        </AnimatedContent>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => {
            const card = (
              <SpotlightCard
                className={`rounded-2xl backdrop-blur-xl border transition-all duration-300 h-full ${
                  plan.isPopular
                    ? 'bg-gradient-to-b from-purple-500/10 to-transparent border-purple-500/30 hover:shadow-[0_0_50px_rgba(139,92,246,0.2)]'
                    : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                }`}
                spotlightColor={plan.isPopular ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.05)'}
              >
                <div className="p-8 flex flex-col h-full">
                  {plan.isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold shadow-lg shadow-purple-500/30 z-20">
                      <ShinyText text="Most Popular" speed={2} shineColor="rgba(255,255,255,0.4)" />
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-4xl font-bold text-white">${plan.price}</span>
                    <span className="text-gray-300">/{plan.duration}</span>
                  </div>
                  <ul className="space-y-4 mb-8 flex-1">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-3 text-gray-300">
                        <svg className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href={plan.checkoutUrl}
                    className={`block w-full py-3 px-6 rounded-xl text-center font-semibold transition-all duration-300 ${
                      plan.isPopular
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:shadow-purple-500/30'
                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                    }`}
                  >
                    Get Started
                  </a>
                </div>
              </SpotlightCard>
            );

            return (
              <AnimatedContent key={i} direction="up" delay={i * 150} duration={600}>
                <div className={`relative ${plan.isPopular ? 'md:-translate-y-2' : ''}`}>
                  {plan.isPopular ? (
                    <StarBorder color="#8b5cf6" speed={6} borderRadius="1rem">
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

        <AnimatedContent direction="up" delay={500}>
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium text-white/90">30-Day Money Back Guarantee</span>
            </div>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
