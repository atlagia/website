import type { ReactNode } from 'react';

interface StarBorderProps {
  children: ReactNode;
  color?: string;
  speed?: number;
  className?: string;
  borderRadius?: string;
}

export default function StarBorder({
  children,
  color = '#8b5cf6',
  speed = 6,
  className = '',
  borderRadius = '1rem',
}: StarBorderProps) {
  return (
    <div className={`relative ${className}`} style={{ borderRadius }}>
      <style>{`
        @keyframes rb-star-rotate{0%{--rb-angle:0deg}100%{--rb-angle:360deg}}
        @property --rb-angle{syntax:'<angle>';initial-value:0deg;inherits:false}
        @media(prefers-reduced-motion:reduce){.rb-star-wrap{animation:none!important}}
      `}</style>
      <div
        className="rb-star-wrap absolute inset-0 overflow-hidden"
        style={{
          borderRadius,
          animation: `rb-star-rotate ${speed}s linear infinite`,
        }}
      >
        <div
          className="absolute inset-[-2px]"
          style={{
            borderRadius,
            background: `conic-gradient(from var(--rb-angle, 0deg), transparent 70%, ${color} 85%, transparent 100%)`,
          }}
        />
      </div>
      <div
        className="relative"
        style={{
          borderRadius,
          background: 'inherit',
        }}
      >
        {children}
      </div>
    </div>
  );
}
