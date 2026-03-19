import AnimatedContent from './reactbits/AnimatedContent';
import GradientText from './reactbits/GradientText';

interface BannerIslandProps {
  title: string;
  description: string;
  cta: { text: string; link: string };
}

const THEME_COLORS = ['#00E599', '#06b6d4', '#00E599'];

export default function BannerIsland({ title, description, cta }: BannerIslandProps) {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/30 via-[#0a0a0a] to-cyan-900/30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_60%_at_50%_50%,rgba(0,229,153,0.08),transparent_60%)]" />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <AnimatedContent direction="up" duration={700}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6" style={{ fontFamily: 'var(--font-display)' }}>
            <GradientText colors={THEME_COLORS}>{title}</GradientText>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-10">{description}</p>
          <a
            href={cta.link}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 hover:-translate-y-0.5"
          >
            {cta.text}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </AnimatedContent>
      </div>
    </section>
  );
}
