export default {
  name: 'FastIPTV',
  version: '1.0.0',
  description: 'A modern IPTV streaming service theme',
  author: 'FastIPTV',
  
  // Theme colors
  colors: {
    primary: '#8B5CF6', // Purple
    secondary: '#10B981', // Emerald
    background: '#000000',
    text: '#FFFFFF',
    accent: '#6D28D9',
  },

  // Theme configuration
  config: {
    layout: 'default',
    darkMode: true,
    rtlSupport: true,
    animations: true,
  },

  // Navigation structure
  navigation: {
    header: [
      {
        label: 'Home',
        path: '/',
      },
      {
        label: 'Channels',
        path: '#channels',
      },
      {
        label: 'Pricing',
        path: '#pricing',
      },
      {
        label: 'Devices',
        path: '#devices',
      },
      {
        label: 'FAQ',
        path: '#faq',
      },
    ],
    footer: {
      company: [
        {
          label: 'About Us',
          path: '/about',
        },
        {
          label: 'Contact',
          path: '/contact',
        },
      ],
      legal: [
        {
          label: 'Terms of Service',
          path: '/terms',
        },
        {
          label: 'Privacy Policy',
          path: '/privacy',
        },
      ],
      support: [
        {
          label: 'Help Center',
          path: '/help',
        },
        {
          label: 'Live Chat',
          path: '/chat',
        },
      ],
    },
  },

  // Component customization
  components: {
    header: {
      transparent: true,
      sticky: true,
      mobileMenu: true,
    },
    footer: {
      columns: 3,
      newsletter: true,
      social: true,
    },
    buttons: {
      primary: 'bg-purple-600 hover:bg-purple-700',
      secondary: 'bg-emerald-600 hover:bg-emerald-700',
    },
  },

  // Supported languages
  languages: ['en', 'fr', 'es', 'it', 'de', 'nl', 'pt'],

  // Social media links
  social: {
    facebook: 'https://facebook.com/fastiptv',
    twitter: 'https://twitter.com/fastiptv',
    instagram: 'https://instagram.com/fastiptv',
    youtube: 'https://youtube.com/fastiptv',
  },
};