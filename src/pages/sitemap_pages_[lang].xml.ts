import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';

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

export const prerender = true;

export const getStaticPaths = () => {
  return ['', 'en', 'fr', 'de', 'es', 'it'].map(lang => ({ params: { lang: lang || 'default' } }));
};

async function getThemePages(): Promise<ThemePage[]> {
  try {
    const theme = import.meta.env.THEME || 'default';
    const siteName = import.meta.env.PUBLIC_SITE_NAME || 'default';
    
    // Updated path to get theme.json from the websites directory
    const themePath = path.join(process.cwd(), 'src', 'websites', siteName, 'themes', theme, 'theme.json');
    
    const themeContent = await fs.readFile(themePath, 'utf-8');
    const themeConfig: ThemeConfig = JSON.parse(themeContent);
    
    const themePaths = themeConfig.pages.map(page => page.path);
    
    const filteredStaticPages = staticPages
      .filter(page => !themePaths.includes(page.url))
      .map(page => ({
        path: page.url,
        name: page.url.substring(1) || 'Home',
        description: '',
        priority: page.priority
      }));
    
    return [...themeConfig.pages, ...filteredStaticPages];
  } catch (error) {
    console.warn('Warning: theme.json not found or invalid. Using static pages.');
    return staticPages.map(page => ({
      path: page.url,
      name: page.url.substring(1) || 'Home',
      description: '',
      priority: page.priority
    }));
  }
}

// Helper function to escape XML special characters
function escapeXml(unsafe: string): string {
  return unsafe?.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  }) || '';
}

export const GET: APIRoute = async ({ params, site }) => {
  if (!site) {
    throw new Error('Site URL is not defined');
  }

  const lang = params.lang === 'default' ? '' : params.lang;

  try {
    const pages = await getThemePages();
    const lastmod = new Date().toISOString();

    const urlBlocks = pages.map(page => {
      const pagePath = page.path.startsWith('/') ? page.path.substring(1) : page.path;
      const pageUrl = lang 
        ? new URL(`${lang}/${pagePath}`, site).href
        : new URL(pagePath, site).href;

      return `<url>
    <loc>${escapeXml(pageUrl)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${page.priority}</priority>
</url>`;
    });

    const sitemap = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlBlocks.join('\n')}
</urlset>`;

    return new Response(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    console.error('Error generating pages sitemap:', error);
    return new Response('Error generating pages sitemap', { status: 500 });
  }
};