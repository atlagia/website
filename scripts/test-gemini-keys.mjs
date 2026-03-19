#!/usr/bin/env node
/**
 * Verify each key in GEMINI_API_KEYS against the same Gemini API used by shopify-gemini-enhance.mjs.
 * Loads root .env only. Prints …last6 per key (not full secret).
 *
 * Usage: node scripts/test-gemini-keys.mjs
 */
import dotenv from 'dotenv';
import { resolve } from 'path';
import { existsSync } from 'fs';

const GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

const root = resolve(process.cwd(), '.env');
if (existsSync(root)) dotenv.config({ path: root });

function parseKeys() {
  const raw = process.env.GEMINI_API_KEYS || '';
  return raw.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
}

async function testKey(apiKey, i) {
  const url = `${GEMINI_BASE}/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: 'Reply with exactly the word: OK' }] }],
      generationConfig: { maxOutputTokens: 128, temperature: 0 },
    }),
  });
  const hint = `…${apiKey.slice(-6)}`;
  if (!res.ok) {
    const t = await res.text();
    console.log(`#${i + 1} ${hint}: FAIL HTTP ${res.status} — ${t.slice(0, 160).replace(/\s+/g, ' ')}`);
    return false;
  }
  const json = await res.json();
  const cand = json?.candidates?.[0];
  const text = cand?.content?.parts?.[0]?.text;
  if (!text) {
    const fr = cand?.finishReason || '(no candidate)';
    const block = json?.promptFeedback?.blockReason || '';
    const safety = json?.promptFeedback?.safetyRatings?.length
      ? JSON.stringify(json.promptFeedback.safetyRatings).slice(0, 120)
      : '';
    console.log(
      `#${i + 1} ${hint}: FAIL no text (finishReason=${fr}${block ? `, block=${block}` : ''}${safety ? `, safety=${safety}` : ''})`,
    );
    return false;
  }
  console.log(`#${i + 1} ${hint}: OK (${text.trim().slice(0, 40).replace(/\s+/g, ' ')})`);
  return true;
}

const keys = parseKeys();
if (keys.length === 0) {
  console.error('No GEMINI_API_KEYS in .env');
  process.exit(2);
}

console.log(`Testing ${keys.length} Gemini key(s) with model ${GEMINI_MODEL}…\n`);
let passed = 0;
for (let i = 0; i < keys.length; i++) {
  try {
    if (await testKey(keys[i], i)) passed++;
  } catch (e) {
    console.log(`#${i + 1} …${keys[i].slice(-6)}: ERROR ${e.message}`);
  }
}

console.log(`\nSummary: ${passed}/${keys.length} passed`);
process.exit(passed === keys.length ? 0 : 1);
