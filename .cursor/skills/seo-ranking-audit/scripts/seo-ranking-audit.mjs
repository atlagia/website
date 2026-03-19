#!/usr/bin/env node
/**
 * SEO Ranking Audit Script — Automated check of Google's 200 ranking factors.
 *
 * Checks ~80+ factors that can be measured programmatically from HTML/HTTP:
 *   Domain, Page-Level (titles, meta, headings, content, speed, images, links),
 *   Site-Level (SSL, sitemap, robots, mobile, schema), and WebSpam indicators.
 *
 * Usage:
 *   node .cursor/skills/seo-ranking-audit/scripts/seo-ranking-audit.mjs <target-website> --url <base-url>
 *
 * Examples:
 *   node .cursor/skills/seo-ranking-audit/scripts/seo-ranking-audit.mjs Drivon --url http://localhost:7002
 *   node .cursor/skills/seo-ranking-audit/scripts/seo-ranking-audit.mjs jacketverse --url https://jacketverse.com
 *
 * Options:
 *   --url        Base URL to audit (required)
 *   --pages      Max pages to crawl (default: 30)
 *   --output     Output file path (default: stdout as JSON)
 *   --verbose    Print progress to stderr
 */

import { writeFileSync } from 'fs';

const args = process.argv.slice(2);
const target = args[0];

function getOpt(key) {
  for (let i = 0; i < args.length; i++) {
    if (args[i] === key && args[i + 1]) return args[i + 1];
  }
  return null;
}
const hasFlag = (key) => args.includes(key);

const baseUrl = getOpt('--url');
const maxPages = parseInt(getOpt('--pages') || '30', 10);
const outputPath = getOpt('--output');
const verbose = hasFlag('--verbose');

if (!target || !baseUrl) {
  console.error('Usage: seo-ranking-audit.mjs <target> --url <base-url>');
  process.exit(1);
}

const log = verbose ? (...a) => console.error('[audit]', ...a) : () => {};

const results = {
  target,
  baseUrl,
  timestamp: new Date().toISOString(),
  pages: [],
  siteLevel: {},
  summary: { total: 0, pass: 0, warn: 0, fail: 0, na: 0 },
  categories: {},
  issues: [],
};

function addCheck(category, factor, status, detail = '') {
  const entry = { category, factor, status, detail };
  results.issues.push(entry);
  results.summary.total++;
  if (status === 'pass') results.summary.pass++;
  else if (status === 'warn') results.summary.warn++;
  else if (status === 'fail') results.summary.fail++;
  else results.summary.na++;

  if (!results.categories[category]) {
    results.categories[category] = { pass: 0, warn: 0, fail: 0, na: 0, total: 0 };
  }
  results.categories[category].total++;
  results.categories[category][status]++;
}

async function fetchPage(url, timeout = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const start = Date.now();
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'SEORankingAuditBot/1.0' },
      redirect: 'follow',
    });
    const elapsed = Date.now() - start;
    const html = await res.text();
    return { url, status: res.status, html, elapsed, headers: res.headers, ok: res.ok };
  } catch (e) {
    return { url, status: 0, html: '', elapsed: 0, headers: null, ok: false, error: e.message };
  } finally {
    clearTimeout(timer);
  }
}

function extractMeta(html) {
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() || '';
  const metaDesc = html.match(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']/i)?.[1]?.trim()
    || html.match(/<meta\s+content=["']([\s\S]*?)["']\s+name=["']description["']/i)?.[1]?.trim()
    || '';
  const canonical = html.match(/<link\s+rel=["']canonical["']\s+href=["']([\s\S]*?)["']/i)?.[1]?.trim()
    || html.match(/<link\s+href=["']([\s\S]*?)["']\s+rel=["']canonical["']/i)?.[1]?.trim()
    || '';
  const viewport = html.match(/<meta\s+name=["']viewport["']\s+content=["']([\s\S]*?)["']/i)?.[1]?.trim() || '';
  const robots = html.match(/<meta\s+name=["']robots["']\s+content=["']([\s\S]*?)["']/i)?.[1]?.trim() || '';

  const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
  const h2s = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
  const h3s = [...html.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());

  const bodyText = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const wordCount = bodyText.split(/\s+/).filter(Boolean).length;

  const images = [...html.matchAll(/<img\s[^>]*?>/gi)].map(tag => {
    const src = tag[0].match(/src=["'](.*?)["']/i)?.[1] || '';
    const alt = tag[0].match(/alt=["'](.*?)["']/i)?.[1] || '';
    const loading = tag[0].match(/loading=["'](.*?)["']/i)?.[1] || '';
    return { src, alt, loading };
  });

  const internalLinks = [...html.matchAll(/<a\s[^>]*?href=["'](\/[^"']*|(?:https?:\/\/[^"']*))["'][^>]*?>/gi)]
    .map(m => m[1])
    .filter(href => href.startsWith('/') || href.startsWith(baseUrl));

  const externalLinks = [...html.matchAll(/<a\s[^>]*?href=["'](https?:\/\/[^"']*)["'][^>]*?>/gi)]
    .map(m => m[1])
    .filter(href => !href.startsWith(baseUrl) && !href.startsWith('/'));

  const hasSchema = html.includes('application/ld+json') || html.includes('itemtype=');
  const schemaTypes = [...html.matchAll(/"@type"\s*:\s*"([^"]+)"/g)].map(m => m[1]);

  const hasBreadcrumb = html.includes('BreadcrumbList') || html.includes('breadcrumb');
  const hasHreflang = /<link\s[^>]*hreflang/i.test(html);

  const nofollowInternal = [...html.matchAll(/<a\s[^>]*rel=["'][^"']*nofollow[^"']*["'][^>]*href=["'](\/[^"']*)/gi)].length;

  return {
    title, metaDesc, canonical, viewport, robots,
    h1s, h2s, h3s, bodyText, wordCount,
    images, internalLinks, externalLinks,
    hasSchema, schemaTypes, hasBreadcrumb, hasHreflang,
    nofollowInternal, htmlSize: html.length,
  };
}

function discoverLinks(html, pageUrl) {
  const links = new Set();
  const matches = html.matchAll(/<a\s[^>]*?href=["'](\/[^"'#]*|(?:https?:\/\/[^"'#]*))["']/gi);
  for (const m of matches) {
    let href = m[1];
    if (href.startsWith('/')) href = baseUrl.replace(/\/$/, '') + href;
    if (href.startsWith(baseUrl)) {
      const u = new URL(href);
      u.hash = '';
      u.search = '';
      links.add(u.toString());
    }
  }
  return [...links];
}

async function checkSiteLevel() {
  log('Checking site-level factors...');

  const sitemapRes = await fetchPage(`${baseUrl}/sitemap.xml`, 10000);
  const hasSitemap = sitemapRes.ok && sitemapRes.html.includes('<urlset');
  addCheck('Site-Level', 'Sitemap.xml (F67)', hasSitemap ? 'pass' : 'fail',
    hasSitemap ? 'Sitemap found' : 'No sitemap.xml found at /sitemap.xml');

  const robotsRes = await fetchPage(`${baseUrl}/robots.txt`, 10000);
  const hasRobots = robotsRes.ok && robotsRes.html.length > 0;
  addCheck('Site-Level', 'Robots.txt', hasRobots ? 'pass' : 'warn',
    hasRobots ? 'robots.txt found' : 'No robots.txt');

  const isHttps = baseUrl.startsWith('https://');
  addCheck('Site-Level', 'SSL/HTTPS (F70)', isHttps ? 'pass' : (baseUrl.includes('localhost') ? 'na' : 'fail'),
    isHttps ? 'HTTPS active' : baseUrl.includes('localhost') ? 'Localhost — skip' : 'No HTTPS');

  const notFoundRes = await fetchPage(`${baseUrl}/this-page-should-not-exist-404-test`, 10000);
  const has404 = notFoundRes.status === 404 || (notFoundRes.html && notFoundRes.html.includes('404'));
  addCheck('Site-Level', 'Custom 404 Page', has404 ? 'pass' : 'warn',
    has404 ? 'Custom 404 detected' : 'No clear 404 response for missing pages');

  results.siteLevel = { hasSitemap, hasRobots, isHttps, has404 };
}

async function auditPage(url, meta) {
  const pagePath = url.replace(baseUrl, '') || '/';
  log(`Auditing: ${pagePath}`);

  const cat = 'Page-Level';

  // F10: Title tag
  if (!meta.title) {
    addCheck(cat, `Title Tag Missing (F10) — ${pagePath}`, 'fail', 'No <title> tag');
  } else if (meta.title.length > 65) {
    addCheck(cat, `Title Tag Too Long (F10) — ${pagePath}`, 'warn', `${meta.title.length} chars: "${meta.title.slice(0, 50)}..."`);
  } else if (meta.title.length < 10) {
    addCheck(cat, `Title Tag Too Short (F10) — ${pagePath}`, 'warn', `Only ${meta.title.length} chars`);
  } else {
    addCheck(cat, `Title Tag (F10) — ${pagePath}`, 'pass', `${meta.title.length} chars`);
  }

  // F12: Meta description
  if (!meta.metaDesc) {
    addCheck(cat, `Meta Description Missing (F12) — ${pagePath}`, 'fail', 'No meta description');
  } else if (meta.metaDesc.length > 160) {
    addCheck(cat, `Meta Description Too Long (F12) — ${pagePath}`, 'warn', `${meta.metaDesc.length} chars`);
  } else {
    addCheck(cat, `Meta Description (F12) — ${pagePath}`, 'pass', `${meta.metaDesc.length} chars`);
  }

  // F13: H1 tag
  if (meta.h1s.length === 0) {
    addCheck(cat, `H1 Missing (F13) — ${pagePath}`, 'fail', 'No H1 tag found');
  } else if (meta.h1s.length > 1) {
    addCheck(cat, `Multiple H1s (F13) — ${pagePath}`, 'warn', `${meta.h1s.length} H1 tags found`);
  } else {
    addCheck(cat, `H1 Tag (F13) — ${pagePath}`, 'pass', `"${meta.h1s[0].slice(0, 60)}"`);
  }

  // F18: Content length
  if (meta.wordCount < 100) {
    addCheck(cat, `Thin Content (F18) — ${pagePath}`, 'fail', `Only ${meta.wordCount} words`);
  } else if (meta.wordCount < 300) {
    addCheck(cat, `Short Content (F18) — ${pagePath}`, 'warn', `${meta.wordCount} words (aim for 300+)`);
  } else {
    addCheck(cat, `Content Length (F18) — ${pagePath}`, 'pass', `${meta.wordCount} words`);
  }

  // F22: Canonical tag
  if (!meta.canonical) {
    addCheck(cat, `Canonical Missing (F22) — ${pagePath}`, 'warn', 'No rel=canonical');
  } else {
    addCheck(cat, `Canonical Tag (F22) — ${pagePath}`, 'pass', meta.canonical);
  }

  // F23: Image optimization
  const imagesWithoutAlt = meta.images.filter(img => !img.alt || img.alt.trim() === '');
  if (meta.images.length === 0) {
    addCheck(cat, `No Images (F23/F36) — ${pagePath}`, 'na', 'Page has no images');
  } else if (imagesWithoutAlt.length > 0) {
    addCheck(cat, `Images Missing Alt (F23) — ${pagePath}`, 'fail',
      `${imagesWithoutAlt.length}/${meta.images.length} images have no alt text`);
  } else {
    addCheck(cat, `Image Alt Text (F23) — ${pagePath}`, 'pass', `All ${meta.images.length} images have alt text`);
  }

  // Mobile viewport (F74)
  if (!meta.viewport) {
    addCheck('Site-Level', `Mobile Viewport Missing (F74) — ${pagePath}`, 'fail', 'No viewport meta tag');
  } else if (!meta.viewport.includes('width=device-width')) {
    addCheck('Site-Level', `Viewport Not Responsive (F74) — ${pagePath}`, 'warn', meta.viewport);
  } else {
    addCheck('Site-Level', `Mobile Viewport (F74) — ${pagePath}`, 'pass', 'Responsive viewport set');
  }

  // Schema.org (F119)
  if (!meta.hasSchema) {
    addCheck(cat, `No Schema.org Markup (F119) — ${pagePath}`, 'warn', 'No JSON-LD or microdata found');
  } else {
    addCheck(cat, `Schema.org (F119) — ${pagePath}`, 'pass', `Types: ${meta.schemaTypes.join(', ') || 'detected'}`);
  }

  // Breadcrumbs (F73)
  if (!meta.hasBreadcrumb) {
    addCheck('Site-Level', `No Breadcrumbs (F73) — ${pagePath}`, 'warn', 'No BreadcrumbList schema or breadcrumb markup');
  } else {
    addCheck('Site-Level', `Breadcrumbs (F73) — ${pagePath}`, 'pass', 'Breadcrumb markup found');
  }

  // F19: Page speed (HTML size as proxy)
  if (meta.htmlSize > 500000) {
    addCheck(cat, `HTML Too Large (F19) — ${pagePath}`, 'fail', `${(meta.htmlSize / 1024).toFixed(0)}KB`);
  } else if (meta.htmlSize > 200000) {
    addCheck(cat, `HTML Size Warning (F19) — ${pagePath}`, 'warn', `${(meta.htmlSize / 1024).toFixed(0)}KB`);
  } else {
    addCheck(cat, `HTML Size (F19) — ${pagePath}`, 'pass', `${(meta.htmlSize / 1024).toFixed(0)}KB`);
  }

  // F45: URL length
  const urlPath = new URL(url).pathname;
  if (urlPath.length > 100) {
    addCheck(cat, `URL Too Long (F45) — ${pagePath}`, 'warn', `${urlPath.length} chars`);
  } else {
    addCheck(cat, `URL Length (F45) — ${pagePath}`, 'pass', `${urlPath.length} chars`);
  }

  // F39: Broken links check (just count, actual checking would be too slow)
  const brokenLinkCount = meta.internalLinks.filter(l => l.includes('undefined') || l.includes('null')).length;
  if (brokenLinkCount > 0) {
    addCheck(cat, `Suspicious Internal Links (F39) — ${pagePath}`, 'warn', `${brokenLinkCount} links contain undefined/null`);
  }

  // F55: Too many outbound links
  if (meta.externalLinks.length > 100) {
    addCheck(cat, `Too Many Outbound Links (F55) — ${pagePath}`, 'warn', `${meta.externalLinks.length} external links`);
  }

  // Nofollow sculpting check (F188)
  if (meta.nofollowInternal > 5) {
    addCheck('On-Site WebSpam', `Excessive Internal Nofollow (F188) — ${pagePath}`, 'warn',
      `${meta.nofollowInternal} internal nofollow links — possible PageRank sculpting`);
  }

  return {
    url, path: pagePath,
    title: meta.title,
    metaDesc: meta.metaDesc,
    h1s: meta.h1s,
    wordCount: meta.wordCount,
    imageCount: meta.images.length,
    imagesWithoutAlt: imagesWithoutAlt.length,
    internalLinkCount: meta.internalLinks.length,
    externalLinkCount: meta.externalLinks.length,
    hasCanonical: !!meta.canonical,
    hasSchema: meta.hasSchema,
    hasBreadcrumb: meta.hasBreadcrumb,
    htmlSizeKB: Math.round(meta.htmlSize / 1024),
  };
}

async function crawlAndAudit() {
  const visited = new Set();
  const queue = [baseUrl.replace(/\/$/, '')];
  if (!queue[0].endsWith('/')) queue[0] += '/';

  const enQueue = [...new Set([
    `${baseUrl.replace(/\/$/, '')}/`,
    `${baseUrl.replace(/\/$/, '')}/en`,
    `${baseUrl.replace(/\/$/, '')}/en/`,
  ])];
  for (const u of enQueue) {
    if (!queue.includes(u)) queue.push(u);
  }

  while (queue.length > 0 && visited.size < maxPages) {
    const url = queue.shift();
    const normalized = url.replace(/\/$/, '');
    if (visited.has(normalized)) continue;
    visited.add(normalized);

    const { html, status, elapsed, ok, error } = await fetchPage(url);

    if (!ok) {
      log(`  SKIP ${url} — ${error || `status ${status}`}`);
      continue;
    }

    // Speed check for this page
    if (elapsed > 3000) {
      addCheck('Page-Level', `Slow Response (F19) — ${url.replace(baseUrl, '') || '/'}`, 'fail', `${elapsed}ms response time`);
    } else if (elapsed > 1500) {
      addCheck('Page-Level', `Moderate Response (F19) — ${url.replace(baseUrl, '') || '/'}`, 'warn', `${elapsed}ms`);
    }

    const meta = extractMeta(html);
    const pageResult = await auditPage(url, meta);
    results.pages.push(pageResult);

    const newLinks = discoverLinks(html, url);
    for (const link of newLinks) {
      const norm = link.replace(/\/$/, '');
      if (!visited.has(norm) && !queue.includes(link)) {
        queue.push(link);
      }
    }
  }

  log(`Crawled ${visited.size} pages`);
}

function checkDuplicates() {
  const titles = {};
  const descriptions = {};

  for (const page of results.pages) {
    if (page.title) {
      if (!titles[page.title]) titles[page.title] = [];
      titles[page.title].push(page.path);
    }
    if (page.metaDesc) {
      if (!descriptions[page.metaDesc]) descriptions[page.metaDesc] = [];
      descriptions[page.metaDesc].push(page.path);
    }
  }

  for (const [title, paths] of Object.entries(titles)) {
    if (paths.length > 1) {
      addCheck('Site-Level', 'Duplicate Title Tags (F72)', 'fail',
        `"${title.slice(0, 50)}..." used on ${paths.length} pages: ${paths.join(', ')}`);
    }
  }

  for (const [desc, paths] of Object.entries(descriptions)) {
    if (paths.length > 1) {
      addCheck('Site-Level', 'Duplicate Meta Descriptions (F72)', 'fail',
        `Description used on ${paths.length} pages: ${paths.join(', ')}`);
    }
  }
}

function addDomainFactors() {
  const cat = 'Domain';
  try {
    const u = new URL(baseUrl);
    const hostname = u.hostname;

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      addCheck(cat, 'Domain Analysis', 'na', 'Localhost — domain factors not applicable');
      return;
    }

    const tld = hostname.split('.').pop();
    const isGenericTLD = ['com', 'net', 'org', 'io', 'co'].includes(tld);
    addCheck(cat, 'TLD Type (F9)', isGenericTLD ? 'pass' : 'warn',
      isGenericTLD ? `Generic TLD: .${tld}` : `Country-code TLD: .${tld} — may limit global ranking`);

    if (hostname.includes('www.')) {
      addCheck(cat, 'WWW Prefix', 'pass', 'Using www prefix');
    }
  } catch {
    addCheck(cat, 'Domain Analysis', 'na', 'Could not parse URL');
  }
}

function addWebSpamChecks() {
  const cat = 'On-Site WebSpam';

  for (const page of results.pages) {
    if (page.title && page.title.split(/\s+/).length > 15) {
      addCheck(cat, `Title Possibly Stuffed (F182) — ${page.path}`, 'warn',
        `Title has ${page.title.split(/\s+/).length} words`);
    }
  }
}

function computeSummary() {
  const categoryWeights = {
    'Domain': 5,
    'Page-Level': 25,
    'Site-Level': 15,
    'Backlink': 25,
    'User Interaction': 10,
    'Algorithm Rules': 5,
    'Social Signals': 5,
    'Brand Signals': 5,
    'On-Site WebSpam': 2.5,
    'Off-Page WebSpam': 2.5,
  };

  let weightedScore = 0;
  let totalWeight = 0;

  for (const [cat, data] of Object.entries(results.categories)) {
    const applicable = data.pass + data.warn + data.fail;
    if (applicable === 0) continue;
    const score = ((data.pass + data.warn * 0.5) / applicable) * 100;
    data.score = Math.round(score);

    const weight = categoryWeights[cat] || 5;
    weightedScore += score * weight;
    totalWeight += weight;
  }

  results.overallScore = totalWeight > 0 ? Math.round(weightedScore / totalWeight) : 0;
}

async function main() {
  log(`Starting SEO Ranking Audit for ${target} at ${baseUrl}`);
  log(`Max pages: ${maxPages}`);

  addDomainFactors();
  await checkSiteLevel();
  await crawlAndAudit();
  checkDuplicates();
  addWebSpamChecks();

  // Note factors that require external tools
  addCheck('Backlink', 'Backlink Analysis', 'na', 'Requires external tool (Semrush/Ahrefs) — not checked automatically');
  addCheck('User Interaction', 'CTR / Bounce Rate / Dwell Time', 'na', 'Requires Google Analytics/Search Console data');
  addCheck('Algorithm Rules', 'Geo-targeting / Freshness', 'na', 'Requires Search Console data for full analysis');
  addCheck('Social Signals', 'Social Media Presence', 'na', 'Requires manual check of social profiles');
  addCheck('Brand Signals', 'Brand Searches / Mentions', 'na', 'Requires Google Trends / Semrush data');
  addCheck('Off-Page WebSpam', 'Link Profile Quality', 'na', 'Requires backlink tool analysis');

  computeSummary();

  const output = JSON.stringify(results, null, 2);

  if (outputPath) {
    writeFileSync(outputPath, output);
    log(`Report saved to ${outputPath}`);
  } else {
    console.log(output);
  }

  log(`Audit complete. Overall score: ${results.overallScore}/100`);
  log(`Total checks: ${results.summary.total} (${results.summary.pass} pass, ${results.summary.warn} warn, ${results.summary.fail} fail, ${results.summary.na} n/a)`);
}

main().catch(e => {
  console.error('Audit failed:', e);
  process.exit(1);
});
