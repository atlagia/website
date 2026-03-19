import { type ReactNode, useRef, useState } from 'react';

interface InfiniteScrollProps {
  children: ReactNode;
  speed?: number;
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
  className?: string;
}

export default function InfiniteScroll({
  children,
  speed = 40,
  direction = 'left',
  pauseOnHover = true,
  className = '',
}: InfiniteScrollProps) {
  const [paused, setPaused] = useState(false);
  const dir = direction === 'right' ? 'reverse' : 'normal';

  return (
    <div
      className={`overflow-hidden ${className}`}
      onMouseEnter={() => pauseOnHover && setPaused(true)}
      onMouseLeave={() => pauseOnHover && setPaused(false)}
    >
      <style>{`
        @keyframes rb-marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @media(prefers-reduced-motion:reduce){.rb-marquee-track{animation:none!important}}
      `}</style>
      <div
        className="rb-marquee-track flex w-max"
        style={{
          animation: `rb-marquee ${speed}s linear infinite`,
          animationDirection: dir,
          animationPlayState: paused ? 'paused' : 'running',
        }}
      >
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0" aria-hidden="true">{children}</div>
      </div>
    </div>
  );
}
