import { useEffect, useRef, useState } from 'react';

interface DecryptedTextProps {
  text: string;
  speed?: number;
  className?: string;
  characters?: string;
}

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

export default function DecryptedText({ text, speed = 50, className = '', characters = CHARS }: DecryptedTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(text.replace(/./g, () => characters[Math.floor(Math.random() * characters.length)]));
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        io.disconnect();
        let revealed = 0;
        const iv = setInterval(() => {
          revealed++;
          setDisplay(
            text
              .split('')
              .map((ch, i) => (i < revealed ? ch : characters[Math.floor(Math.random() * characters.length)]))
              .join('')
          );
          if (revealed >= text.length) clearInterval(iv);
        }, speed);
      }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [text, speed, characters]);

  return (
    <span ref={ref} className={`font-mono ${className}`} aria-label={text}>
      {display}
    </span>
  );
}
