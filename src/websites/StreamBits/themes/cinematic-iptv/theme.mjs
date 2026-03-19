export default {
  name: 'StreamBits',
  version: '1.0.0',
  description: 'Cinematic IPTV streaming theme — dark, gradient accents, glassmorphism-ready',
  author: 'StreamBits',

  // CSS variable prefix for this theme
  prefix: 'sbi',

  // Theme colors (--sbi-* in BaseHead)
  colors: {
    primary: { DEFAULT: '#0a0a0a', foreground: '#fafafa' },
    surface: { DEFAULT: '#141414', foreground: '#fafafa' },
    muted: { DEFAULT: '#a1a1aa', foreground: '#71717a' },
    accent: { DEFAULT: '#8b5cf6', foreground: '#fafafa' },
    accentBlue: { DEFAULT: '#6366f1', foreground: '#fafafa' },
    background: '#0a0a0a',
    text: '#fafafa',
  },

  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },

  config: {
    layout: 'default',
    darkMode: true,
    rtlSupport: true,
    animations: true,
  },

  navigation: {
    header: [
      { label: 'Home', path: '/' },
      { label: 'Channels', path: '#channels' },
      { label: 'Pricing', path: '#pricing' },
      { label: 'Devices', path: '#devices' },
      { label: 'FAQ', path: '#faq' },
    ],
    footer: {
      company: [
        { label: 'About Us', path: '/about' },
        { label: 'Contact', path: '/contact' },
      ],
      legal: [
        { label: 'Terms of Service', path: '/terms' },
        { label: 'Privacy Policy', path: '/privacy' },
      ],
      support: [
        { label: 'Help Center', path: '/help' },
        { label: 'Live Chat', path: '/chat' },
      ],
    },
  },

  components: {
    header: { transparent: true, sticky: true, mobileMenu: true },
    footer: { columns: 3, newsletter: true, social: true },
    buttons: {
      primary: 'bg-[var(--sbi-accent)] hover:opacity-90',
      secondary: 'bg-[var(--sbi-accentBlue)] hover:opacity-90',
    },
  },

  languages: ['en', 'fr', 'es', 'it', 'de', 'nl', 'pt'],

  social: {
    facebook: 'https://facebook.com/streambits',
    twitter: 'https://twitter.com/streambits',
    instagram: 'https://instagram.com/streambits',
    youtube: 'https://youtube.com/streambits',
  },
};
