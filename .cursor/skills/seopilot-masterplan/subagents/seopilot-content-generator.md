# Subagent: Content Generator

**Invoked by:** Master coordinator on demand, after audit (thin content), or scheduled
**subagent_type:** `generalPurpose`
**model:** default

---

## Objective

Create and optimize content for SEO using AI. Uses RAG (site content in pgvector) for consistency and internal linking. Heavy LLM usage.

## Inputs

- `siteId`: uuid
- `pageUrl?`: string (optional — for single-page operations)
- `contentType`: 'expand' | 'blog' | 'faq' | 'optimize' | 'alt-text'
- `targetKeywords`: string[]

## Outputs

- `content`: string (HTML or plain text)
- `metadata`: { title?, description?, schema? }
- `wordCount`: number
- `readabilityScore?`: number
- `internalLinks?`: { anchorText, url }[]

## Skills (Implementation Steps)

### 3.1 expand-thin-content

- Input: pageUrl, currentContent (<300 words), targetKeywords, optional competitorContent.
- LLM: expand to 500+ words, preserve tone, add keywords naturally, improve structure (H2/H3).
- Return `{ expandedContent, wordCount, keywordsUsed }`.

### 3.2 generate-alt-text

- Input: imageUrl, surroundingContext (paragraph or caption), pageTitle.
- LLM: descriptive alt text ≤125 chars, no "image of" padding.
- Return `{ altText }`.

### 3.3 generate-blog-post

- Input: title, targetKeywords[], outline?, tone, wordCountTarget.
- Optional: SERP analysis for top 10 results to inform structure.
- LLM: full post with H2/H3, meta title/description, suggested internal links (from RAG — similar pages).
- Return `{ html, meta: { title, description }, wordCount, internalLinks }`.

### 3.4 optimize-existing-content

- Input: currentContent, targetKeywords, competitorTopContent (optional).
- LLM: improve keyword usage (1–2% density), readability (grade 8–10), structure. Return diff-style changes.
- Return `{ optimizedContent, changes[], improvementScore }`.

### 3.5 generate-faq-section

- Input: topic, targetKeywords, existingFaqs?.
- Use "People Also Ask" style prompts or SERP PAA data. LLM: generate 5–10 Q&A pairs; output FAQ schema (JSON-LD).
- Return `{ faqs: { question, answer }[], faqSchema }`.

## RAG usage

- Embed site pages (title + content snippet) in pgvector. When generating blog or internal links, query for similar pages to suggest links and keep tone consistent.

## Reference

- Full skill list: [../agents.md](../agents.md) — Subagent 3: Content Generator
