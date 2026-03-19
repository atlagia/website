import SpotlightCard from './reactbits/SpotlightCard';
import AnimatedContent from './reactbits/AnimatedContent';
import GradientText from './reactbits/GradientText';

interface Testimonial {
  name: string;
  location: string;
  rating: number;
  comment: string;
}

interface TestimonialsIslandProps {
  title: string;
  description: string;
  testimonials: Testimonial[];
}

export default function TestimonialsIsland({ title, description, testimonials }: TestimonialsIslandProps) {
  return (
    <section className="relative py-24 overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black to-black" />
        <div className="absolute top-20 left-10 text-8xl text-purple-500/10 font-serif select-none" style={{ animation: 'rb-float 6s ease-in-out infinite' }}>&ldquo;</div>
        <div className="absolute bottom-20 right-10 text-8xl text-emerald-500/10 font-serif select-none" style={{ animation: 'rb-float 6s ease-in-out infinite 3s' }}>&rdquo;</div>
      </div>

      <style>{`@keyframes rb-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-20px)}} @media(prefers-reduced-motion:reduce){[style*="rb-float"]{animation:none!important}}`}</style>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedContent direction="up" duration={700}>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              <GradientText colors={['#8b5cf6', '#10b981', '#6366f1']}>{title}</GradientText>
            </h2>
            <p className="text-gray-300 text-lg">{description}</p>
          </div>
        </AnimatedContent>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <AnimatedContent key={i} direction="up" delay={i * 150} duration={600}>
              <SpotlightCard
                className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-purple-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]"
                spotlightColor="rgba(139,92,246,0.1)"
              >
                <div className="p-8">
                  <div className="flex space-x-1 mb-6">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <svg key={j} className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 italic">&ldquo;{t.comment}&rdquo;</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-emerald-500 flex items-center justify-center text-white font-semibold">
                      {t.name.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <p className="text-white font-medium">{t.name}</p>
                      <p className="text-gray-300 text-sm">{t.location}</p>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </AnimatedContent>
          ))}
        </div>

        <AnimatedContent direction="up" delay={500}>
          <div className="mt-12 text-center">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
              <svg className="h-5 w-5 text-emerald-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-white/90 text-sm font-medium">Trusted by Thousands of Users Worldwide</span>
            </div>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
