/** @type {import('tailwindcss').Config} */
export default {
  colors: {
    primary: {
      DEFAULT: '#000000', // Deep Black
      foreground: '#FAF9F6', // Ivory / Off-White
    },
    accent: {
      DEFAULT: '#D4AF37', // Champagne Gold
      foreground: '#000000', // Deep Black
    },
    muted: {
      DEFAULT: '#333333', // Charcoal Gray
      foreground: '#B0B0B0', // Metallic Silver
    },
    surface: {
      DEFAULT: '#111111', // Very Dark Gray for surface elements
    },
  },
  borderRadius: {
    lg: 'var(--drivon-radius)',
    md: 'calc(var(--drivon-radius) - 2px)',
    sm: 'calc(var(--drivon-radius) - 4px)',
  },
};
