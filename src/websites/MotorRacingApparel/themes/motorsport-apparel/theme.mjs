/** MotorRacingApparel design tokens: Jet Black, Carbon Gray, White, Racing Red, Electric Blue, Neon Yellow */
export default {
  colors: {
    border: "hsl(var(--border))",
    input: "hsl(var(--input))",
    ring: "hsl(var(--ring))",
    background: "hsl(var(--background))",
    foreground: "hsl(var(--foreground))",
    primary: {
      DEFAULT: "hsl(0, 0%, 4%)",   // Jet Black
      foreground: "hsl(0, 0%, 100%)", // Pure White
    },
    secondary: {
      DEFAULT: "hsl(0, 0%, 10%)",  // Carbon Fiber Gray
      foreground: "hsl(0, 0%, 90%)",
    },
    destructive: {
      DEFAULT: "hsl(0, 72%, 51%)", // Racing Red
      foreground: "hsl(0, 0%, 100%)",
    },
    muted: {
      DEFAULT: "hsl(0, 0%, 18%)",
      foreground: "hsl(0, 0%, 65%)",
    },
    accent: {
      DEFAULT: "hsl(221, 83%, 53%)", // Electric Blue
      foreground: "hsl(0, 0%, 100%)",
    },
    popover: {
      DEFAULT: "hsl(0, 0%, 8%)",
      foreground: "hsl(0, 0%, 90%)",
    },
    card: {
      DEFAULT: "hsl(0, 0%, 10%)",
      foreground: "hsl(0, 0%, 95%)",
    },
  },
  borderRadius: {
    lg: "0.5rem",
    md: "0.375rem",
    sm: "0.25rem",
  },
  boxShadow: {
    DEFAULT: "0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)",
    md: "0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.4)",
  },
  typography: {
    fontFamily: {
      sans: ['DM Sans', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica Neue', 'sans-serif'],
      display: ['Bebas Neue', 'DM Sans', 'system-ui', 'sans-serif'],
    },
    fontSize: {
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  animation: {
    hover: 'transform 0.2s ease-in-out',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
};
