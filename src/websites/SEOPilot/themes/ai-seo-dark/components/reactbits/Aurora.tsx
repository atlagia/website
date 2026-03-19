interface AuroraProps {
  colorStops?: string[];
  speed?: number;
  blend?: string;
  className?: string;
}

export default function Aurora({
  colorStops = ['rgba(139,92,246,0.3)', 'rgba(99,102,241,0.2)', 'rgba(6,182,212,0.15)'],
  speed = 8,
  blend = 'screen',
  className = '',
}: AuroraProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} style={{ mixBlendMode: blend as any }}>
      <style>{`
        @keyframes rb-aurora-1{0%,100%{transform:translate(-20%,-10%) scale(1)}33%{transform:translate(10%,20%) scale(1.1)}66%{transform:translate(-10%,10%) scale(0.9)}}
        @keyframes rb-aurora-2{0%,100%{transform:translate(20%,10%) scale(1.1)}33%{transform:translate(-20%,-10%) scale(0.9)}66%{transform:translate(10%,-20%) scale(1)}}
        @keyframes rb-aurora-3{0%,100%{transform:translate(0,20%) scale(0.9)}50%{transform:translate(-20%,-10%) scale(1.1)}}
        @media(prefers-reduced-motion:reduce){[data-aurora]{animation:none!important}}
      `}</style>
      {colorStops.map((color, i) => (
        <div
          key={i}
          data-aurora
          className="absolute rounded-full blur-[100px]"
          style={{
            width: `${60 + i * 15}%`,
            height: `${60 + i * 15}%`,
            top: `${-10 + i * 15}%`,
            left: `${-10 + i * 20}%`,
            background: `radial-gradient(ellipse at center, ${color}, transparent 70%)`,
            animation: `rb-aurora-${(i % 3) + 1} ${speed + i * 2}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}
