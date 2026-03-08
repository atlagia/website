export default {
    colors: {
      border: "hsl(var(--border))",
      input: "hsl(var(--input))",
      ring: "hsl(var(--ring))",
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      primary: {
        DEFAULT: "hsl(0, 0%, 10%)", // Deep charcoal black
        foreground: "hsl(0, 0%, 100%)", // Crisp white
      },
      secondary: {
        DEFAULT: "hsl(0, 0%, 20%)", // Slightly lighter charcoal
        foreground: "hsl(0, 0%, 90%)", // Light gray
      },
      destructive: {
        DEFAULT: "hsl(0, 80%, 50%)", // Aggressive red
        foreground: "hsl(0, 0%, 100%)",
      },
      muted: {
        DEFAULT: "hsl(0, 0%, 30%)", // Dark gray
        foreground: "hsl(0, 0%, 70%)", // Medium gray
      },
      accent: {
        DEFAULT: "hsl(210, 100%, 50%)", // Vibrant blue
        foreground: "hsl(0, 0%, 100%)",
      },
      popover: {
        DEFAULT: "hsl(0, 0%, 15%)", // Dark background
        foreground: "hsl(0, 0%, 85%)", // Light text
      },
      card: {
        DEFAULT: "hsl(0, 0%, 12%)", // Almost black card background
        foreground: "hsl(0, 0%, 95%)", // Very light text
      },
    },
    borderRadius: {
      lg: "0.5rem", // Sharp, modern corners
      md: "0.375rem", // Slightly softer but still sharp
      sm: "0.25rem", // Minimal rounding
    },
    boxShadow: {
      DEFAULT: "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)", // More pronounced shadow
      md: "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)", // Stronger shadow
    },
    typography: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
        display: ['Oswald', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'sans-serif'],
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
    }
  };