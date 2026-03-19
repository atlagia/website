import { useState } from 'react';
import AnimatedContent from './reactbits/AnimatedContent';
import GradientText from './reactbits/GradientText';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQIslandProps {
  title: string;
  description: string;
  questions: FAQItem[];
}

export default function FAQIsland({ title, description, questions }: FAQIslandProps) {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section className="relative py-24 overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/10 via-black to-black" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedContent direction="up" duration={700}>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              <GradientText colors={['#00E599', '#06b6d4', '#00E599']}>{title}</GradientText>
            </h2>
            <p className="text-gray-300 text-lg">{description}</p>
          </div>
        </AnimatedContent>

        <div className="space-y-4">
          {questions.map((item, i) => {
            const isOpen = expanded === i;
            return (
              <AnimatedContent key={i} direction="up" delay={i * 80} duration={500}>
                <div className="group">
                  <button
                    onClick={() => setExpanded(isOpen ? null : i)}
                    className="w-full text-left bg-white/[0.03] backdrop-blur-xl rounded-xl p-6 border border-white/10 hover:border-emerald-500/30 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white group-hover:text-emerald-300 transition-colors duration-300 pr-4">
                        {item.question}
                      </h3>
                      <span className="flex-shrink-0">
                        <svg
                          className={`w-6 h-6 text-gray-300 group-hover:text-emerald-300 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </div>
                    <div
                      className="overflow-hidden transition-all duration-300"
                      style={{ maxHeight: isOpen ? '500px' : '0', opacity: isOpen ? 1 : 0, marginTop: isOpen ? '1rem' : '0' }}
                    >
                      <p className="text-gray-300">{item.answer}</p>
                    </div>
                  </button>
                </div>
              </AnimatedContent>
            );
          })}
        </div>

        <AnimatedContent direction="up" delay={500}>
          <div className="mt-12 text-center">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
              <svg className="h-5 w-5 text-emerald-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <span className="text-white/90 text-sm font-medium">Still have questions? Contact our support team</span>
            </div>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
