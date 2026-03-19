#!/usr/bin/env node
/**
 * Use Gemini and/or OpenAI to generate SEO-enhanced title and description.
 * API key rotation: random start, then sequential fallback. Gemini keys + OpenAI (gpt-3.5-turbo) in rotation.
 *
 * Usage:
 *   node scripts/shopify-gemini-enhance.mjs <oldTitle> [--description "html"] [--description-file path] [--tags "t1,t2"] [--site-name "Site"]
 *
 * Output: JSON stdout { "title", "descriptionHtml", "metaTitle", "metaDescription", "productType", "tags" }
 */

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const GEMINI_KEYS = [
  'AIzaSyDwX9bfEHACz1I_MqtZhWWNeEdPGca1vzc',
  'AIzaSyDc1A1bjSih0nNJUt1s3l64wzPqFmLPVFQ',
  'AIzaSyCjGWHo_WD_xJvRREODhh7oBaIryJpFO_M',
  'AIzaSyAkp0gc3VWLdD3ljwXpgF-q6wpAft4_qAU',
  'AIzaSyDmcImMnzXdG5-5uEx244sj1dV0lnha_hA',
  'AIzaSyCapEMPfQ8Y6I5tLad-8ujHGZriqw1wUmU',
  'AIzaSyAI8Tf_UZ2bTIRwskUK27UG5kcHVx9VzDA',
  'AIzaSyAXTvUFPpp3YhnwQQNHngoUio3Q74pZlk0',
  'AIzaSyD_NgvEb9Perh7cBX97CMtQ6G8Nd6qJRA8',
  'AIzaSyBh_PPqzkoN_pbYTblT5qy-DAS2JPFA97o',
  'AIzaSyCX-yWD_h5kytReRfCmufa7TpPEq_17OhI',
];

const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const OPENAI_MODEL = 'gpt-3.5-turbo';
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_API_KEY = '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';

/** Build list of backends: Gemini keys + OpenAI. Shuffled for rotation. */
function getBackends() {
  const list = [
    ...GEMINI_KEYS.map((apiKey) => ({ type: 'gemini', apiKey })),
    { type: 'openai', apiKey: OPENAI_API_KEY },
  ].filter((b) => b.apiKey);
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

function parseArgs() {
  const args = process.argv.slice(2);
  let title = args[0];
  let description = '';
  let tags = '';
  let siteName = 'Global Gift Cards';
  for (let i = 1; i < args.length; i++) {
    if (args[i] === '--description' && args[i + 1]) { description = args[i + 1]; i++; }
    else if (args[i] === '--description-file' && args[i + 1]) {
      const p = resolve(process.cwd(), args[i + 1]);
      if (existsSync(p)) description = readFileSync(p, 'utf8');
      i++;
    }
    else if (args[i] === '--tags' && args[i + 1]) { tags = args[i + 1]; i++; }
    else if (args[i] === '--site-name' && args[i + 1]) { siteName = args[i + 1]; i++; }
  }
  return { title: title || '', description, tags, siteName };
}

function stripHtml(html) {
  return (html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function buildPrompt(opts) {
  const plainDesc = stripHtml(opts.description).slice(0, 4000);
  return `You are an SEO copywriter. Generate a PERFECT SEO title and product description.

## STRICT REQUIREMENTS (MUST FOLLOW)

### Title
- MAX 60 characters. Professional, SEO-optimized. NOT long.
- Primary keyword first. No pipe chains. No keyword stuffing.

### Meta Title (Page Title)
- MAX 60 characters (Google limit). Exceeding causes truncation in search results.
- Format: "{Primary Keyword} | ${opts.siteName}" or similar. Count chars.

### Meta Description
- MAX 160 characters. 150-160 ideal. Summary with keyword, benefit, CTA.

### Description HTML – CRITICAL
- NO broken links. Use ONLY these safe paths: /collections, /collections/all, /pages/contact. Do NOT invent /collections/xyz or /products/abc unless they exist.
- NO images. Do NOT include <img> tags. Do NOT write placeholder text like "A vibrant image showing..." or "Image of...". Text only.

## Input
- Old title: ${opts.title}
- Old description (excerpt): ${plainDesc || '(none)'}
- Tags: ${opts.tags || '(none)'}
- Site name: ${opts.siteName}

## Output Format
Return ONLY valid JSON (no markdown, no code block):
{
  "title": "Max 60 chars",
  "metaTitle": "Max 60 chars",
  "metaDescription": "Max 160 chars",
  "descriptionHtml": "HTML with NO images, NO broken links",
  "productType": "Single Shopify product type, e.g. Leather Jacket, Biker Jacket, Bomber Jacket",
  "tags": ["tag1", "tag2", "tag3", ...]
}

### productType (required)
- One short category name (1–4 words). Examples: "Leather Jacket", "Biker Jacket", "Bomber Jacket", "Quilted Jacket".

### tags (required)
- Array of 10–18 SEO and discovery tags. Include: product category, style (vintage, distressed, classic), material (leather, genuine leather), occasion (casual, motorcycle, everyday), fit (slim, regular, oversized), color if relevant, gender (men's, women's), and a few descriptive terms. Lowercase, no duplicates.

## Description HTML Structure
1. **H1** – One <h1> with main headline.
2. **Intro** – 1-2 <p> paragraphs.
3. **H2** Key Features + <ul><li>
4. **H2** What You Get + list
5. **H2** Explore – Links ONLY to /collections or /collections/all (safe paths). Or omit this section.
6. **H2** FAQ – <details><summary>Q</summary><p>A</p></details> (3-6 pairs)
7. **FAQ Schema** – <script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[...]}</script>

## Rules
- Valid HTML only. Escape quotes in JSON (\\").
- All English. No images, no broken links.`;
}

async function callGemini(apiKey, prompt) {
  const url = `${GEMINI_BASE}/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8192,
        responseMimeType: 'application/json',
      },
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini ${res.status}: ${err.slice(0, 200)}`);
  }
  const json = await res.json();
  const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('No content in Gemini response');
  return JSON.parse(text.trim());
}

async function callOpenAI(apiKey, prompt) {
  const res = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI ${res.status}: ${err.slice(0, 200)}`);
  }
  const json = await res.json();
  const text = json?.choices?.[0]?.message?.content;
  if (!text) throw new Error('No content in OpenAI response');
  return JSON.parse(text.trim());
}

async function main() {
  const opts = parseArgs();
  if (!opts.title) {
    console.error('Usage: node scripts/shopify-gemini-enhance.mjs <oldTitle> [--description "html"] [--tags "t1,t2"] [--site-name "Site"]');
    process.exit(1);
  }

  const prompt = buildPrompt(opts);
  const backends = getBackends();
  if (backends.length === 0) {
    console.error('No API keys configured (Gemini keys or OPENAI_API_KEY)');
    process.exit(1);
  }
  let lastError;

  for (let k = 0; k < backends.length; k++) {
    const b = backends[k];
    try {
      const result = b.type === 'openai'
        ? await callOpenAI(b.apiKey, prompt)
        : await callGemini(b.apiKey, prompt);
      const title = (result.title || opts.title).slice(0, 60);
      const metaTitle = (result.metaTitle || `${title} | ${opts.siteName}`).slice(0, 60);
      const metaDescription = (result.metaDescription || '').slice(0, 160);
      let descHtml = result.descriptionHtml || '';
      descHtml = descHtml.replace(/<img[^>]*>/gi, '').replace(/\[?\s*[Ii]mage\s+of[^.<]*\.?\s*\]?/g, '');
      const productType = (result.productType || '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 100);
      const tags = Array.isArray(result.tags)
        ? result.tags.filter((t) => typeof t === 'string').map((t) => t.trim().slice(0, 255)).filter(Boolean).slice(0, 250)
        : [];
      const out = {
        title,
        metaTitle,
        metaDescription,
        descriptionHtml: descHtml,
        productType: productType || undefined,
        tags,
      };
      console.log(JSON.stringify(out));
      return;
    } catch (e) {
      lastError = e;
      if (k < backends.length - 1) {
        process.stderr.write(`${b.type} failed, trying next... `);
      }
    }
  }

  console.error('All API keys failed. Last error:', lastError?.message);
  process.exit(2);
}

main();
