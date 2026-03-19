import Aurora from './reactbits/Aurora';
import AnimatedContent from './reactbits/AnimatedContent';
import GradientText from './reactbits/GradientText';
import ShinyText from './reactbits/ShinyText';

interface CTAIslandProps {
  title: string;
  description: string;
  button: { text: string; link: string };
  features: string[];
  lang?: string;
}

export default function CTAIsland({ title, description, button, features, lang = 'en' }: CTAIslandProps) {
  return (
    <section className="relative w-full py-24 overflow-hidden bg-[#0a0a0a]">
      <Aurora
        colorStops={['rgba(139,92,246,0.2)', 'rgba(99,102,241,0.15)', 'rgba(6,182,212,0.1)']}
        speed={12}
        blend="screen"
      />

      <div className="relative w-full px-4 sm:px-6 lg:px-8">
        <div className="relative bg-white/[0.04] backdrop-blur-xl rounded-none lg:rounded-3xl p-8 md:p-12 border-0 lg:border border-white/10 overflow-hidden hover:border-purple-500/30 transition-all duration-200">
          <div className="relative text-center">
            <AnimatedContent direction="up" duration={700}>
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                <GradientText colors={['#8b5cf6', '#6366f1', '#06b6d4', '#8b5cf6']} animationSpeed={3}>
                  {title}
                </GradientText>
              </h2>
            </AnimatedContent>

            <AnimatedContent direction="up" delay={150} duration={700}>
              <p className="text-gray-400 text-lg mb-8">{description}</p>
              <p className="text-gray-500 text-sm mb-6">
                Compare <a href={`/${lang}/pricing`} className="text-purple-400 hover:opacity-90 underline transition-opacity">pricing plans</a>{' '}
                or read our <a href={`/${lang}/faq`} className="text-purple-400 hover:opacity-90 underline transition-opacity">FAQ</a> for common questions.
              </p>
            </AnimatedContent>

            <AnimatedContent direction="up" delay={300} duration={600}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {features.map((feature, i) => (
                  <div key={i} className="flex items-center space-x-3 bg-white/[0.04] rounded-lg p-4 border border-white/10">
                    <svg className="h-5 w-5 text-purple-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-white">{feature}</span>
                  </div>
                ))}
              </div>
            </AnimatedContent>

            <AnimatedContent direction="up" delay={450} duration={600}>
              <a
                href={button.link}
                className="inline-flex items-center px-8 py-4 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-lg shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 group"
              >
                <ShinyText text={button.text} speed={2.5} shineColor="rgba(255,255,255,0.3)" className="text-lg font-semibold" />
                <svg className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </AnimatedContent>
          </div>

          {/* Corner decorations */}
          <div className="absolute top-0 left-0 w-24 h-24 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-purple-500/50 to-transparent" />
            <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-purple-500/50 to-transparent" />
          </div>
          <div className="absolute bottom-0 right-0 w-24 h-24 pointer-events-none">
            <div className="absolute bottom-0 right-0 w-full h-[2px] bg-gradient-to-l from-blue-500/50 to-transparent" />
            <div className="absolute bottom-0 right-0 w-[2px] h-full bg-gradient-to-t from-blue-500/50 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
