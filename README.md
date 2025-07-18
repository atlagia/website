# StreamVista IPTV Platform

A modern, multi-theme IPTV streaming platform built with Astro.js, featuring dynamic content management and responsive design.

## 🚀 Features

- **Multi-Theme Architecture**: Support for multiple themes (StreamVista IPTV, Dental Care, Agency, etc.)
- **Dynamic Content**: All content driven by JSON data files for easy management
- **Internationalization**: Multi-language support (English, French, Spanish, Italian, German, Dutch, Portuguese)
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern UI/UX**: Dark theme with glassmorphism effects and smooth animations
- **SEO Optimized**: Built-in SEO features and meta tag management
- **Fast Performance**: Static site generation with Astro.js

## 🛠️ Tech Stack

- **Framework**: [Astro.js](https://astro.build/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Language**: TypeScript
- **Icons**: Lucide React
- **Animations**: CSS animations and transitions
- **Build Tool**: Vite

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/streamvista-iptv.git
   cd streamvista-iptv
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your configuration values.

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:4321`

## 🏗️ Project Structure

```
website/
├── src/
│   ├── components/           # Shared components
│   ├── layouts/             # Layout components
│   ├── pages/               # Page routes
│   ├── themes/              # Theme-specific components
│   │   ├── agency/          # Agency theme
│   │   ├── bikes/           # Bikes theme
│   │   ├── clinic/          # Clinic theme
│   │   ├── default/         # Default theme
│   │   └── iptv/            # StreamVista IPTV theme
│   ├── utils/               # Utility functions
│   └── websites/            # Website configurations
│       └── StreamVista/     # StreamVista website
│           └── themes/
│               └── iptv/    # IPTV theme files
├── public/                  # Static assets
├── scripts/                 # Build and deployment scripts
└── stores/                  # Store configurations
```

## 🎨 Themes

### StreamVista IPTV Theme
- **Location**: `src/websites/StreamVista/themes/iptv/`
- **Features**: Dark theme, streaming-focused UI, channel listings, pricing plans
- **Components**: Header, Footer, Welcome, Features, Channels, Pricing, Devices, etc.

### Adding a New Theme
1. Create a new folder in `src/themes/`
2. Add theme configuration in `theme.json`
3. Create components and pages
4. Add data files for content management

## 🌐 Internationalization

The platform supports multiple languages:
- English (en)
- French (fr)
- Spanish (es)
- Italian (it)
- German (de)
- Dutch (nl)
- Portuguese (pt)

Language files are located in `src/websites/[website]/themes/[theme]/data/`

## 📱 Pages

### StreamVista IPTV Pages
- **Home** (`/`): Landing page with hero, features, pricing
- **Channels** (`/channels`): Channel listings and categories
- **Movies** (`/movies`): Movie catalog and search
- **Shows** (`/shows`): TV shows and series
- **Packages** (`/packages`): Subscription packages and bundles
- **Devices** (`/devices`): Supported devices and platforms
- **About** (`/about`): About the service
- **Contact** (`/contact`): Contact information
- **Terms** (`/terms`): Terms of service
- **Privacy** (`/privacy`): Privacy policy
- **Help** (`/help`): Help and support

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to Netlify
```bash
npm run deploy:netlify
```

### Deploy to Vercel
```bash
npm run deploy:vercel
```

## 🔧 Configuration

### Environment Variables
```env
THEME=iptv
SITE_URL=https://streamvista.com
ANALYTICS_ID=your-analytics-id
```

### Theme Configuration
Edit `src/websites/StreamVista/themes/iptv/theme.json` to customize:
- Colors and styling
- Navigation structure
- Page configurations
- Component settings

## 📊 Analytics

The platform includes support for:
- Google Analytics
- Hotjar (user behavior tracking)

Configure your tracking IDs in the environment variables.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Email: support@streamvista.com
- Documentation: [docs.streamvista.com](https://docs.streamvista.com)

## 🙏 Acknowledgments

- [Astro.js](https://astro.build/) - The web framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Lucide](https://lucide.dev/) - Icon library
- [Unsplash](https://unsplash.com/) - Stock photos

---

Made with ❤️ by the StreamVista Team
