import AnimatedContent from './reactbits/AnimatedContent';
import GradientText from './reactbits/GradientText';

interface Platform {
  name: string;
  icon: string;
}

interface IntegrationsIslandProps {
  title: string;
  description: string;
  platforms: Platform[];
}

const THEME_COLORS = ['#00E599', '#06b6d4', '#00E599'];

const platformIcons: Record<string, JSX.Element> = {
  shopify: <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor"><path d="M15.337 23.979l7.216-1.561s-2.604-17.613-2.625-17.73c-.018-.116-.145-.199-.26-.199s-2.469-.175-2.469-.175-1.625-1.574-1.822-1.756a.345.345 0 00-.187-.096L15.337 24v-.021zm-3.233-16.91c0-.155-.002-.342-.005-.545-.143.028-.293.059-.452.093-.127-.728-.352-1.36-.746-1.795-.59-.65-1.39-.65-1.595-.65h-.014c-.439-.522-.983-.752-1.483-.752-3.65 0-5.399 4.568-5.946 6.893-.854.265-1.447.447-1.535.477C.099 10.871 0 10.882 0 11.088c0 .164-3.413 26.27-3.413 26.27L15.41 24l-.001-.002-3.305-16.929zM10.74 6.54c0 .129.002.247.002.355-.684.212-1.428.442-2.183.677.421-1.614 1.211-2.396 1.904-2.691.18.42.277.965.277 1.659z" /></svg>,
  wordpress: <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor"><path d="M21.469 6.825c.84 1.537 1.318 3.3 1.318 5.175 0 3.979-2.156 7.456-5.363 9.325l3.295-9.527c.615-1.54.82-2.771.82-3.864 0-.397-.026-.765-.07-1.109m-7.981.105c.647-.034 1.229-.1 1.229-.1.579-.068.511-.924-.068-.891 0 0-1.739.138-2.86.138-1.054 0-2.826-.138-2.826-.138-.58-.033-.647.857-.068.891 0 0 .549.066 1.13.1l1.677 4.594-2.357 7.07L5.93 6.93c.647-.034 1.229-.1 1.229-.1.579-.068.511-.924-.068-.891 0 0-1.739.138-2.86.138-.201 0-.438-.005-.689-.015A10.833 10.833 0 0112 1.182c2.87 0 5.482 1.115 7.426 2.938-.047-.003-.094-.009-.142-.009-1.054 0-1.8.924-1.8 1.914 0 .891.511 1.646 1.054 2.537.41.724.891 1.646.891 2.981 0 .924-.357 1.998-.82 3.493l-1.075 3.59-3.893-11.58.001.001zM12 22.818c-1.457 0-2.842-.309-4.095-.862l4.353-12.639 4.457 12.21c.03.071.063.137.098.199A10.813 10.813 0 0112 22.818M1.182 12c0-2.274.69-4.387 1.872-6.14l5.166 14.15C3.897 18.025 1.182 15.329 1.182 12M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0" /></svg>,
  webflow: <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor"><path d="M17.802 8.56s-1.946 6.023-2.045 6.324c-.047-.338-1.1-6.324-1.1-6.324S12.843 8.56 11.6 11.2c-.038-.133-.886-2.64-.886-2.64S9.638 8.56 8.2 11.2L6.55 8.56H2.8l3.55 6.88s1.348-2.56 2.638-5.12c.04.133.85 5.12.85 5.12s1.35-3.16 2.55-5.44c.08.267 1.2 5.44 1.2 5.44l3.25-6.88h-3.036z" /></svg>,
  google: <svg className="w-10 h-10" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.56c2.08-1.92 3.28-4.74 3.28-8.1z" /><path d="M12 23c2.97 0 5.46-.99 7.28-2.66l-3.56-2.77c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path d="M5.84 14.1a6.83 6.83 0 010-4.24V7.02H2.18A11.96 11.96 0 001 12c0 1.93.46 3.76 1.18 5.38l3.66-3.28z" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.02l3.66 2.84c.87-2.6 3.3-4.48 6.16-4.48z" /></svg>,
  analytics: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  custom: <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
};

export default function IntegrationsIsland({ title, description, platforms }: IntegrationsIslandProps) {
  return (
    <section id="integrations" className="relative py-24 overflow-hidden bg-[#0a0a0a]">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedContent direction="up" duration={700}>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              <GradientText colors={THEME_COLORS}>{title}</GradientText>
            </h2>
            <p className="text-gray-300 text-lg">{description}</p>
          </div>
        </AnimatedContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {platforms.map((p, i) => (
            <AnimatedContent key={i} direction="up" delay={i * 80} duration={500}>
              <div className="flex flex-col items-center gap-4 p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/30 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,229,153,0.1)] group">
                <div className="text-gray-400 group-hover:text-emerald-400 transition-colors">
                  {platformIcons[p.icon] || platformIcons.custom}
                </div>
                <p className="text-sm font-medium text-gray-300 text-center">{p.name}</p>
              </div>
            </AnimatedContent>
          ))}
        </div>
      </div>
    </section>
  );
}
