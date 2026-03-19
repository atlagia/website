import React from 'react';
import SplitText from './reactbits/SplitText';
import GradientText from './reactbits/GradientText';
import CountUp from './reactbits/CountUp';
import LiquidEther from './reactbits/LiquidEther';
import AnimatedContent from './reactbits/AnimatedContent';
import DecryptedText from './reactbits/DecryptedText';

interface HeroIslandProps {
  title: string;
  description: string;
  stats: Record<string, string>;
  cta: {
    primary: { text: string; link: string };
    secondary: { text: string; link: string };
  };
}

function parseStatNum(val: string): { num: number; suffix: string; isNumeric: boolean } {
  const m = val.match(/^([\d,]+)\+?\s/);
  if (!m) return { num: 0, suffix: '', isNumeric: false };
  const num = parseInt(m[1].replace(/,/g, ''), 10);
  const suffix = val.includes('+') ? '+' : '';
  return { num, suffix, isNumeric: num >= 10 };
}

const THEME_COLORS = ['#8b5cf6', '#6366f1', '#06b6d4', '#8b5cf6'];
const ETHER_COLORS = ['#5227FF', '#FF9FFC', '#B19EEF'];

/** Splits title so the word "IPTV" can be rendered with animated gradient; returns [before, iptv, after] or null if no IPTV. */
function splitTitleForIptv(title: string): [string, string, string] | null {
  const i = title.toUpperCase().indexOf('IPTV');
  if (i === -1) return null;
  return [title.slice(0, i), 'IPTV', title.slice(i + 4)];
}

export default function HeroIsland({ title, description, stats, cta }: HeroIslandProps) {
  const parts = title.includes(':') ? [title.split(':')[0], title.split(':').slice(1).join(':').trim()] : [title];
  const iptvSplit = splitTitleForIptv(title);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 sm:py-24 lg:py-32 bg-[#0a0a0a]">
      {/* Liquid Ether background */}
      <div className="absolute inset-0 z-0">
        <LiquidEther
          colors={ETHER_COLORS}
          mouseForce={20}
          cursorSize={100}
          isViscous
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-[#0a0a0a] pointer-events-none z-[1]" />

      <div className="relative z-10 text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Badge */}
        <AnimatedContent direction="down" delay={100} duration={600}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.07] backdrop-blur-md border border-white/10 mb-8">
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500" />
            <DecryptedText
              text={`Premium IPTV • ${stats.channels || '10,000+ Channels'}`}
              speed={30}
              className="text-sm font-medium text-white/90"
            />
          </div>
        </AnimatedContent>

        {/* Headline — "IPTV" in animated gradient to match theme */}
        <h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight max-w-5xl mx-auto mb-6 leading-[1.15]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {parts.length > 1 ? (
            <>
              <SplitText text={parts[0] + '.'} className="block text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" delay={25} as="span" />
              <GradientText colors={THEME_COLORS} animationSpeed={4} className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold">
                <SplitText text={parts[1]} delay={25} as="span" />
              </GradientText>
            </>
          ) : iptvSplit ? (
            <span className="block text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              <SplitText text={iptvSplit[0]} delay={25} as="span" className="text-white" />
              <GradientText colors={THEME_COLORS} animationSpeed={4} className="inline-block font-bold drop-shadow-[0_2px_12px_rgba(139,92,246,0.5)] min-w-[1ch]">
                {iptvSplit[1]}
              </GradientText>
              <SplitText text={iptvSplit[2]} delay={25} as="span" className="text-white" />
            </span>
          ) : (
            <SplitText text={title} className="block text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]" delay={25} as="span" />
          )}
        </h1>

        <AnimatedContent direction="up" delay={400} duration={800}>
          <p className="text-base sm:text-lg md:text-xl text-gray-200 max-w-2xl mx-auto mb-10 leading-relaxed px-2">
            {description}
          </p>
        </AnimatedContent>

        {/* CTAs */}
        <AnimatedContent direction="up" delay={600} duration={800}>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
            <a
              href={cta.primary.link}
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:-translate-y-0.5"
            >
              {cta.primary.text}
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href={cta.secondary.link}
              className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 text-white font-semibold hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              {cta.secondary.text}
            </a>
          </div>
        </AnimatedContent>

        {/* Stats with CountUp */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto px-2">
          {Object.entries(stats).map(([key, value], i) => {
            const { num, suffix, isNumeric } = parseStatNum(value);
            const label = value.replace(/^[\d,]+\+?\s*/, '');
            return (
              <AnimatedContent key={key} direction="up" delay={800 + i * 150} duration={600}>
                <div className="group relative p-5 sm:p-6 rounded-2xl bg-white/[0.06] backdrop-blur-md border border-white/10 hover:border-purple-500/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,92,246,0.2)]">
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                    {isNumeric ? <><CountUp to={num} duration={2500} suffix={suffix} /> </> : null}
                    {isNumeric ? label : value}
                  </p>
                  <p className="text-sm text-gray-300 capitalize mt-1">
                    {key === 'shows' ? 'TV Shows' : key}
                  </p>
                </div>
              </AnimatedContent>
            );
          })}
        </div>
      </div>
    </section>
  );
}
