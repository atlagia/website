export default {
  colors: {
    border: "hsl(var(--border))",
    input: "hsl(var(--input))",
    ring: "hsl(var(--ring))",
    background: "hsl(var(--background))",
    foreground: "hsl(var(--foreground))",
    primary: {
      DEFAULT: "#0a0a0a",
      foreground: "#fafafa",
    },
    secondary: {
      DEFAULT: "#1a1a1a",
      foreground: "#fafafa",
    },
    destructive: {
      DEFAULT: "hsl(0, 80%, 50%)",
      foreground: "hsl(0, 0%, 100%)",
    },
    muted: {
      DEFAULT: "#a3a3a3",
      foreground: "#737373",
    },
    accent: {
      DEFAULT: "#8B4513",
      foreground: "#fafafa",
    },
    popover: {
      DEFAULT: "#151515",
      foreground: "#fafafa",
    },
    card: {
      DEFAULT: "#151515",
      foreground: "#fafafa",
    },
  },
  borderRadius: {
    lg: "0.5rem",
    md: "0.375rem",
    sm: "0.25rem",
  },
  boxShadow: {
    DEFAULT: "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)",
    md: "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)",
  },
  typography: {
    fontFamily: {
      sans: ["Source Sans 3", "system-ui", "-apple-system", "sans-serif"],
      display: ["Cormorant Garamond", "Georgia", "serif"],
    },
    fontSize: {
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  animation: {
    hover: "transform 0.2s ease-in-out",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  },
};
