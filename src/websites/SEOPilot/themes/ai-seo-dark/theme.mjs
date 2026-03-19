export default {
  name: 'SEOPilot',
  version: '1.0.0',
  description: 'AI-powered SEO automation platform — dark, electric green accents, tech aesthetic',
  author: 'SEOPilot',

  prefix: 'seo',

  colors: {
    primary: { DEFAULT: '#0a0a0a', foreground: '#f0f0f0' },
    surface: { DEFAULT: '#111111', foreground: '#f0f0f0' },
    muted: { DEFAULT: '#737373', foreground: '#525252' },
    accent: { DEFAULT: '#00E599', foreground: '#0a0a0a' },
    secondary: { DEFAULT: '#06b6d4', foreground: '#0a0a0a' },
    background: '#0a0a0a',
    text: '#f0f0f0',
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
    rtlSupport: false,
    animations: true,
  },

  navigation: {
    header: [
      { label: 'Features', path: '#features' },
      { label: 'Pricing', path: '#pricing' },
      { label: 'How It Works', path: '#how-it-works' },
      { label: 'Integrations', path: '#integrations' },
    ],
    footer: {
      company: [
        { label: 'About Us', path: '/about' },
        { label: 'Blog', path: '/blog' },
        { label: 'Careers', path: '/careers' },
        { label: 'Contact', path: '/contact' },
      ],
      legal: [
        { label: 'Terms of Service', path: '/terms' },
        { label: 'Privacy Policy', path: '/privacy' },
      ],
      support: [
        { label: 'Documentation', path: '/docs' },
        { label: 'Help Center', path: '/help' },
        { label: 'API Reference', path: '/api' },
      ],
    },
  },

  components: {
    header: { transparent: true, sticky: true, mobileMenu: true },
    footer: { columns: 3, newsletter: true, social: true },
    buttons: {
      primary: 'bg-[var(--seo-accent)] hover:opacity-90',
      secondary: 'bg-[var(--seo-secondary)] hover:opacity-90',
    },
  },

  languages: ['en'],

  social: {
    twitter: 'https://twitter.com/seopilot',
    github: 'https://github.com/seopilot',
    linkedin: 'https://linkedin.com/company/seopilot',
  },
};
