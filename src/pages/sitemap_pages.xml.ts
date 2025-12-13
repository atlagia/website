import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';

// Default static pages that should always be included
const staticPages = [
  {
    url: '/',
    lastmod: new Date(),
    changefreq: 'daily',
    priority: 1.0
  },
  {
    url: '/about',
    lastmod: new Date(),
    changefreq: 'monthly',
    priority: 0.8
  },
  {
    url: '/contact',
    lastmod: new Date(),
    changefreq: 'monthly',
    priority: 0.8
  },
  {
    url: '/blog',
    lastmod: new Date(),
    changefreq: 'daily',
    priority: 0.9
  },
  {
    url: '/shop',
    lastmod: new Date(),
    changefreq: 'daily',
    priority: 0.9
  }
];

// Pages to exclude only if they exist in theme.json
const excludeIfInTheme = ['/shop', '/blog', '/about', '/contact'];

interface ThemePage {
  path: string;
  name: string;
  description: string;
  priority: number;
}

interface ThemeConfig {
  pages: ThemePage[];
  metadata: {
    name: string;
    version: string;
    description: string;
    author: string;
    license: string;
  };
}

async function getThemePages(): Promise<ThemePage[]> {
  try {
    // Get theme from environment variable
    const theme = import.meta.env.THEME || 'default';
    
    // Construct path to theme.json
    const themePath = path.join(process.cwd(), 'src', 'themes', theme, 'theme.json');
    
    // Read and parse theme.json
    const themeContent = await fs.readFile(themePath, 'utf-8');
    const themeConfig: ThemeConfig = JSON.parse(themeContent);
    
    // Get theme pages paths
    const themePaths = themeConfig.pages.map(page => page.path);
    
    // Filter out static pages that exist in theme
    const filteredStaticPages = staticPages
      .filter(page => !themePaths.includes(page.url))
      .map(page => ({
        path: page.url,
        name: page.url.substring(1) || 'Home',
        description: '',
        priority: page.priority
      }));
    
    // Combine theme pages with remaining static pages
    return [...themeConfig.pages, ...filteredStaticPages];
  } catch (error) {
    console.warn('Warning: theme.json not found or invalid. Using static pages.');
    // Convert static pages to ThemePage format
    return staticPages.map(page => ({
      path: page.url,
      name: page.url.substring(1) || 'Home',
      description: '',
      priority: page.priority
    }));
  }
}

export const GET: APIRoute = async ({ site }) => {
  if (!site) {
    throw new Error('Site URL is not defined');
  }

  // Get combined pages
  const allPages = await getThemePages();

  // Convert to sitemap format
  const urlEntries = allPages.map(page => ({
    url: page.path,
    lastmod: new Date(),
    changefreq: page.priority >= 0.9 ? 'daily' : 'monthly',
    priority: page.priority
  }));

  const pagesXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urlEntries.map(page => `
    <url>
      <loc>${new URL(page.url, site).href}</loc>
      <lastmod>${page.lastmod.toISOString()}</lastmod>
      <changefreq>${page.changefreq}</changefreq>
      <priority>${page.priority}</priority>
    </url>
  `).join('')}
</urlset>`;

  return new Response(pagesXml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};