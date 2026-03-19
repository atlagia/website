import InfiniteScroll from './reactbits/InfiniteScroll';
import AnimatedContent from './reactbits/AnimatedContent';
import GradientText from './reactbits/GradientText';

interface Channel {
  title: string;
  poster: string;
  alt?: string;
  category?: string;
}

interface ChannelsIslandProps {
  title: string;
  description: string;
  channels: Channel[];
}

export default function ChannelsIsland({ title, description, channels }: ChannelsIslandProps) {
  return (
    <section className="bg-[#0a0a0a] py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <AnimatedContent direction="up" duration={700}>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              <GradientText colors={['#06b6d4', '#8b5cf6', '#6366f1']}>{title}</GradientText>
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">{description}</p>
          </div>
        </AnimatedContent>

        {channels.length > 0 && (
          <InfiniteScroll speed={30} direction="left" pauseOnHover>
            {channels.map((ch, i) => (
              <div key={i} className="flex-shrink-0 w-48 md:w-64 mx-3 group">
                <div className="relative overflow-hidden rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
                  <img
                    src={ch.poster}
                    alt={ch.alt ?? ch.title}
                    width={256}
                    height={384}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-72 md:h-96 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-lg font-bold mb-1 truncate">{ch.title}</h3>
                    {ch.category && (
                      <p className="text-sm text-gray-300 uppercase tracking-wider">{ch.category}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </InfiniteScroll>
        )}
      </div>
    </section>
  );
}
