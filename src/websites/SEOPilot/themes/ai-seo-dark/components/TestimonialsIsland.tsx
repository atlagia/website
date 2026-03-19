import SpotlightCard from './reactbits/SpotlightCard';
import AnimatedContent from './reactbits/AnimatedContent';
import GradientText from './reactbits/GradientText';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  location: string;
}

interface TestimonialsIslandProps {
  title: string;
  description: string;
  testimonials: Testimonial[];
}

const THEME_COLORS = ['#00E599', '#06b6d4', '#00E599'];

export default function TestimonialsIsland({ title, description, testimonials }: TestimonialsIslandProps) {
  return (
    <section className="relative py-24 overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/10 via-black to-black" />
        <div className="absolute top-20 left-10 text-8xl text-emerald-500/10 font-serif select-none" style={{ animation: 'rb-float 6s ease-in-out infinite' }}>&ldquo;</div>
        <div className="absolute bottom-20 right-10 text-8xl text-cyan-500/10 font-serif select-none" style={{ animation: 'rb-float 6s ease-in-out infinite 3s' }}>&rdquo;</div>
      </div>

      <style>{`@keyframes rb-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-20px)}} @media(prefers-reduced-motion:reduce){[style*="rb-float"]{animation:none!important}}`}</style>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedContent direction="up" duration={700}>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              <GradientText colors={THEME_COLORS}>{title}</GradientText>
            </h2>
            <p className="text-gray-300 text-lg">{description}</p>
          </div>
        </AnimatedContent>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <AnimatedContent key={i} direction="up" delay={i * 150} duration={600}>
              <SpotlightCard
                className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-emerald-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,229,153,0.1)]"
                spotlightColor="rgba(0,229,153,0.08)"
              >
                <div className="p-8">
                  <div className="flex space-x-1 mb-6">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <svg key={j} className="h-5 w-5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 italic">&ldquo;{t.quote}&rdquo;</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center text-black font-semibold">
                      {t.author.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <p className="text-white font-medium">{t.author}</p>
                      <p className="text-gray-400 text-sm">{t.role}, {t.company}</p>
                      <p className="text-gray-500 text-xs">{t.location}</p>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </AnimatedContent>
          ))}
        </div>
      </div>
    </section>
  );
}
