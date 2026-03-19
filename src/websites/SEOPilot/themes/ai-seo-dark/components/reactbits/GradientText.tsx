import type { ReactNode } from 'react';

interface GradientTextProps {
  children: ReactNode;
  colors?: string[];
  className?: string;
  animationSpeed?: number;
}

export default function GradientText({
  children,
  colors = ['#8b5cf6', '#6366f1', '#06b6d4', '#8b5cf6'],
  className = '',
  animationSpeed = 4,
}: GradientTextProps) {
  const gradient = colors.join(', ');

  return (
    <span
      className={`inline-block bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage: `linear-gradient(90deg, ${gradient})`,
        backgroundSize: '300% 100%',
        animation: `rb-gradient-shift ${animationSpeed}s ease infinite`,
      }}
    >
      <style>{`@keyframes rb-gradient-shift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} } @media(prefers-reduced-motion:reduce){.rb-gradient-shift{animation:none!important}}`}</style>
      {children}
    </span>
  );
}
