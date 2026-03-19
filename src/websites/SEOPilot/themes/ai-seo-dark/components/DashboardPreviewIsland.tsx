import AnimatedContent from './reactbits/AnimatedContent';
import GradientText from './reactbits/GradientText';

interface DashboardPreviewIslandProps {
  title: string;
  description: string;
  features: string[];
}

const THEME_COLORS = ['#00E599', '#06b6d4', '#00E599'];

export default function DashboardPreviewIsland({ title, description, features }: DashboardPreviewIslandProps) {
  return (
    <section className="relative py-24 overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(0,229,153,0.04),transparent_60%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedContent direction="up" duration={700}>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              <GradientText colors={THEME_COLORS}>{title}</GradientText>
            </h2>
            <p className="text-gray-300 text-lg">{description}</p>
          </div>
        </AnimatedContent>

        <AnimatedContent direction="up" delay={200} duration={800}>
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02] backdrop-blur-xl p-1">
            <div className="rounded-xl bg-gradient-to-br from-[#111] to-[#0a0a0a] p-6 md:p-10">
              {/* Mock dashboard UI */}
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
                <span className="ml-4 text-sm text-gray-500 font-mono">dashboard.seopilot.ai</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="rounded-xl bg-white/[0.04] border border-white/10 p-5">
                  <p className="text-sm text-gray-400 mb-1">SEO Score</p>
                  <p className="text-4xl font-bold text-emerald-400" style={{ fontFamily: 'var(--font-display)' }}>94</p>
                  <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full w-[94%] rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500" />
                  </div>
                </div>
                <div className="rounded-xl bg-white/[0.04] border border-white/10 p-5">
                  <p className="text-sm text-gray-400 mb-1">Issues Fixed</p>
                  <p className="text-4xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>847</p>
                  <p className="text-sm text-emerald-400 mt-2">+23 this week</p>
                </div>
                <div className="rounded-xl bg-white/[0.04] border border-white/10 p-5">
                  <p className="text-sm text-gray-400 mb-1">Active Agents</p>
                  <p className="text-4xl font-bold text-cyan-400" style={{ fontFamily: 'var(--font-display)' }}>6</p>
                  <p className="text-sm text-gray-400 mt-2">All agents running</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl bg-white/[0.04] border border-white/10 p-5">
                  <p className="text-sm text-gray-400 mb-3">Recent Agent Activity</p>
                  <div className="space-y-3">
                    {['Crawler scanned 142 pages', 'Technical agent found 3 broken links', 'Auto-fix applied schema markup', 'Performance agent optimized 8 images'].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
                        <p className="text-sm text-gray-300">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl bg-white/[0.04] border border-white/10 p-5">
                  <p className="text-sm text-gray-400 mb-3">SEO Health Over Time</p>
                  <div className="flex items-end gap-1 h-24">
                    {[40, 52, 58, 65, 70, 78, 82, 86, 88, 91, 93, 94].map((v, i) => (
                      <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-emerald-500/60 to-cyan-500/40" style={{ height: `${v}%` }} />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-gray-500">Jan</span>
                    <span className="text-xs text-gray-500">Dec</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedContent>

        <AnimatedContent direction="up" delay={400} duration={600}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-10 max-w-3xl mx-auto">
            {features.map((feat, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {feat}
              </div>
            ))}
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
