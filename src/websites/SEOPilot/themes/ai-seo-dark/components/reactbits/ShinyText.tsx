interface ShinyTextProps {
  text: string;
  className?: string;
  speed?: number;
  shineColor?: string;
}

export default function ShinyText({ text, className = '', speed = 3, shineColor = 'rgba(255,255,255,0.3)' }: ShinyTextProps) {
  return (
    <>
      <style>{`
        @keyframes rb-shine{0%{background-position:200% 0}100%{background-position:-200% 0}}
        @media(prefers-reduced-motion:reduce){.rb-shiny{animation:none!important}}
      `}</style>
      <span
        className={`rb-shiny inline-block bg-clip-text text-transparent ${className}`}
        style={{
          backgroundImage: `linear-gradient(110deg, currentColor 35%, ${shineColor} 50%, currentColor 65%)`,
          backgroundSize: '250% 100%',
          WebkitTextFillColor: 'transparent',
          animation: `rb-shine ${speed}s linear infinite`,
          color: 'inherit',
        }}
      >
        {text}
      </span>
    </>
  );
}
