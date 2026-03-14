import type { MiddlewareHandler } from 'astro';

// Get allowed languages from environment
const getAllowedLanguages = (): string[] => {
  // Use process.env for server-side access (middleware runs on server)
  const allowedLanguages = process.env.ALLOWED_LANGUAGES || import.meta.env.ALLOWED_LANGUAGES || 'en';
  return allowedLanguages.split(',').map(lang => lang.trim()).filter(lang => lang.length > 0);
};

const allowedLanguages = getAllowedLanguages();

export const onRequest: MiddlewareHandler = (context, next) => {
  const url = new URL(context.request.url);
  const pathname = url.pathname;

  // WWW canonicalization: redirect www to non-www (301) so one canonical version for SEO
  const hostname = url.hostname;
  if (hostname.startsWith('www.')) {
    const canonicalHost = hostname.slice(4);
    const canonicalUrl = new URL(context.request.url);
    canonicalUrl.hostname = canonicalHost;
    return context.redirect(canonicalUrl.toString(), 301);
  }
  
  // Check if path starts with a language code
  const pathParts = pathname.split('/').filter(part => part.length > 0);
  
  if (pathParts.length > 0) {
    const firstPart = pathParts[0];
    
    // Check if first part is a 2-character language code
    if (firstPart.length === 2 && /^[a-z]{2}$/.test(firstPart)) {
      // Check if this language is not allowed
      if (!allowedLanguages.includes(firstPart)) {
        // Language not allowed, redirect to English version
        const remainingPath = pathParts.slice(1).join('/');
        const newPath = `/en${remainingPath ? `/${remainingPath}` : ''}`;
        const searchParams = url.search;
        const redirectUrl = `${newPath}${searchParams}`;
        
        console.log(`🔄 Redirecting disallowed language: ${pathname} -> ${redirectUrl}`);
        return context.redirect(redirectUrl, 301);
      }
    }
  }
  
  // Handle trailing slash normalization for language routes
  // Redirect /<lang>/ to /<lang> to avoid duplicate content
  if (pathname.match(/^\/[a-z]{2}\/$/)) {
    // This is a language code with trailing slash (e.g., /en/, /tr/, /fr/)
    const langCode = pathname.slice(1, -1); // Remove leading / and trailing /
    const searchParams = url.search;
    const redirectUrl = `/${langCode}${searchParams}`;
    
    console.log(`🔄 Redirecting language route with trailing slash: ${pathname} -> ${redirectUrl}`);
    return context.redirect(redirectUrl, 301);
  }
  
  // Check for undefined paths and redirect them
  if (pathname.includes('/undefined/')) {
    let newPath = pathname.replace('/undefined/', '/');
    
    // If the path starts with a language code followed by undefined, keep the language
    const pathParts = pathname.split('/').filter(part => part.length > 0);
    if (pathParts.length >= 2 && allowedLanguages.includes(pathParts[0]) && pathParts[1] === 'undefined') {
      // Keep the language: /en/undefined/blog -> /en/blog
      newPath = `/${pathParts[0]}${pathParts.slice(2).length > 0 ? `/${pathParts.slice(2).join('/')}` : ''}`;
    } else if (pathParts.length >= 1 && pathParts[0] === 'undefined') {
      // No language prefix: /undefined/blog -> /en/blog
      newPath = `/en${pathParts.slice(1).length > 0 ? `/${pathParts.slice(1).join('/')}` : ''}`;
    }
    
    // Preserve query parameters
    const searchParams = url.search;
    const redirectUrl = `${newPath}${searchParams}`;
    
    console.log(`🔄 Redirecting undefined path: ${pathname} -> ${redirectUrl}`);
    return context.redirect(redirectUrl, 301);
  }

  // Handle product link redirects
  const productRedirects = {
    'link-to-size-chart': '/en/size-chart',
    'link-to-return-policy': '/en/returns',
    'link-to-shipping-info': '/en/shipping',
    'link-to-ethical-manufacturing': '/en/about',
    'insert_size_chart_link_here': '/en/size-chart'
  };

  // Handle page redirects (non-language pages to English versions)
  const pageRedirects = {
    '/terms': '/en/terms',
    '/shipping': '/en/shipping',
    '/returns': '/en/returns',
    '/size-chart': '/en/size-chart',
    '/cookies': '/en/cookies'
  };

  // Check for product redirects
  for (const [oldPath, newPath] of Object.entries(productRedirects)) {
    if (pathname.includes(oldPath)) {
      // Extract language from path if present
      const pathParts = pathname.split('/').filter(part => part.length > 0);
      let language = 'en'; // default
      
      if (pathParts.length > 0 && allowedLanguages.includes(pathParts[0])) {
        language = pathParts[0];
      }
      
      const redirectPath = newPath.replace('/en/', `/${language}/`);
      const searchParams = url.search;
      const redirectUrl = `${redirectPath}${searchParams}`;
      
      console.log(`🔄 Redirecting product link: ${pathname} -> ${redirectUrl}`);
      return context.redirect(redirectUrl, 301);
    }
  }

  // Check for page redirects (exact matches)
  if (pageRedirects[pathname]) {
    const searchParams = url.search;
    const redirectUrl = `${pageRedirects[pathname]}${searchParams}`;
    
    console.log(`🔄 Redirecting page: ${pathname} -> ${redirectUrl}`);
    return context.redirect(redirectUrl, 301);
  }
  
  // Check for double language paths like /en/fr/channels -> /fr/channels
  if (pathParts.length >= 2) {
    const firstPart = pathParts[0];
    const secondPart = pathParts[1];
    
    // Check if both parts look like language codes (2 characters)
    if (firstPart.length === 2 && secondPart.length === 2) {
      // This is a double language path, redirect to use the second language
      const remainingPath = pathParts.slice(2).join('/');
      let newPath;
      
      // If second language is allowed, use it; otherwise use 'en'
      if (allowedLanguages.includes(secondPart)) {
        newPath = `/${secondPart}${remainingPath ? `/${remainingPath}` : ''}`;
      } else {
        newPath = `/en${remainingPath ? `/${remainingPath}` : ''}`;
      }
      
      // Preserve query parameters
      const searchParams = url.search;
      const redirectUrl = `${newPath}${searchParams}`;
      
      console.log(`🔄 Redirecting double language path: ${pathname} -> ${redirectUrl}`);
      return context.redirect(redirectUrl, 301);
    }
  }
  
  return next();
};
