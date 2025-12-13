export default {
    colors: {
      border: "hsl(var(--border))",
      input: "hsl(var(--input))",
      ring: "hsl(var(--ring))",
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      primary: {
        DEFAULT: "hsl(180, 60%, 45%)", // Teal - dental/medical primary
        hover: "hsl(180, 60%, 40%)",
        light: "hsl(180, 60%, 97%)",
        foreground: "hsl(0, 0%, 100%)",
      },
      secondary: {
        DEFAULT: "hsl(195, 80%, 50%)", // Cyan - dental/medical secondary
        hover: "hsl(195, 80%, 45%)",
        light: "hsl(195, 80%, 97%)",
        foreground: "hsl(0, 0%, 100%)",
      },
      success: {
        DEFAULT: "hsl(160, 84%, 39%)",
        hover: "hsl(160, 84%, 34%)",
        light: "hsl(160, 84%, 97%)",
        foreground: "hsl(0, 0%, 100%)",
      },
      info: {
        DEFAULT: "hsl(200, 85%, 45%)",
        hover: "hsl(200, 85%, 40%)",
        light: "hsl(200, 85%, 97%)",
        foreground: "hsl(0, 0%, 100%)",
      },
      warning: {
        DEFAULT: "hsl(35, 95%, 50%)",
        hover: "hsl(35, 95%, 45%)",
        light: "hsl(35, 95%, 97%)",
        foreground: "hsl(0, 0%, 100%)",
      },
      destructive: {
        DEFAULT: "hsl(0, 90%, 60%)",
        hover: "hsl(0, 90%, 55%)",
        light: "hsl(0, 90%, 97%)",
        foreground: "hsl(0, 0%, 100%)",
      },
      muted: {
        DEFAULT: "hsl(220, 15%, 96%)",
        hover: "hsl(220, 15%, 92%)",
        foreground: "hsl(220, 20%, 36%)",
      },
      accent: {
        DEFAULT: "hsl(200, 85%, 50%)", // Blue - dental/medical accent
        hover: "hsl(200, 85%, 45%)",
        light: "hsl(200, 85%, 97%)",
        foreground: "hsl(0, 0%, 100%)",
      },
      popover: {
        DEFAULT: "hsl(0, 0%, 100%)",
        foreground: "hsl(220, 25%, 20%)",
      },
      card: {
        DEFAULT: "hsl(0, 0%, 100%)",
        foreground: "hsl(220, 25%, 20%)",
      },
      rating: {
        DEFAULT: "hsl(45, 100%, 50%)",
        foreground: "hsl(220, 25%, 20%)",
      },
      badge: {
        DEFAULT: "hsl(200, 85%, 45%)",
        foreground: "hsl(0, 0%, 100%)",
      },
      ai: {
        DEFAULT: "hsl(180, 60%, 45%)", // Teal for AI/dental theme
        gradient: {
          start: "hsl(180, 60%, 45%)", // Teal
          mid: "hsl(195, 80%, 50%)", // Cyan
          end: "hsl(200, 85%, 50%)", // Blue
        },
      },
      navy: {
        900: "hsl(230, 40%, 8%)",
        800: "hsl(230, 35%, 12%)",
        700: "hsl(230, 30%, 16%)",
        600: "hsl(230, 25%, 20%)",
      }
    },
    borderRadius: {
      lg: "1rem",
      md: "0.75rem",
      sm: "0.5rem",
      xl: "1.5rem",
      "2xl": "2rem",
      full: "9999px",
    },
    shadows: {
      sm: "0 2px 4px 0 rgb(0 0 0 / 0.05)",
      DEFAULT: "0 2px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      md: "0 6px 12px -2px rgb(0 0 0 / 0.1), 0 3px 6px -3px rgb(0 0 0 / 0.1)",
      lg: "0 15px 25px -3px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
      xl: "0 25px 35px -5px rgb(0 0 0 / 0.1), 0 10px 15px -6px rgb(0 0 0 / 0.1)",
      "2xl": "0 35px 60px -12px rgb(0 0 0 / 0.25)",
      glow: "0 0 20px rgba(20, 184, 166, 0.35)", // Teal glow
      "ai-card": "0 0 25px rgba(20, 184, 166, 0.2)", // Teal card shadow
    },
    gradients: {
      "ai-primary": "linear-gradient(135deg, hsl(180, 60%, 45%), hsl(195, 80%, 50%))", // Teal to Cyan
      "ai-secondary": "linear-gradient(135deg, hsl(195, 80%, 50%), hsl(200, 85%, 50%))", // Cyan to Blue
      "ai-accent": "linear-gradient(135deg, hsl(180, 60%, 45%), hsl(200, 85%, 50%))", // Teal to Blue
      "ai-surface": "linear-gradient(180deg, hsl(180, 40%, 98%), hsl(195, 40%, 98%))", // Light teal/cyan
      "ai-dark": "linear-gradient(135deg, hsl(180, 40%, 8%), hsl(195, 40%, 12%))", // Dark teal/cyan
    },
    animation: {
      DEFAULT: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      fast: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
      slow: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
      bounce: "all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    },
    blur: {
      sm: "4px",
      DEFAULT: "8px",
      md: "12px",
      lg: "16px",
      xl: "24px",
      "2xl": "40px",
      "3xl": "64px",
    }
  };