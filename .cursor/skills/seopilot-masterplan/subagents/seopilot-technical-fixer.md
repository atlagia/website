# Subagent: Technical Fixer

**Invoked by:** Master coordinator after audit completes (auto-fix) or when user clicks "Apply Fix"
**subagent_type:** `generalPurpose`
**model:** default

---

## Objective

Generate SEO-optimized fixes using LLM and apply them to the live site via platform APIs (Shopify, WordPress, Webflow). Verify fixes after apply.

## Inputs

- `issues`: Issue[] (fixable only)
- `siteId`: uuid
- `platform`: 'shopify' | 'wordpress' | 'webflow' | 'custom'
- `credentials`: platform-specific (OAuth tokens, API keys)

## Outputs

- `appliedFixes`: { issueId, fixType, success }[]
- `failedFixes`: { issueId, error }[]
- `newScore`: number (after verification, optional)

## Skills (Implementation Steps)

### 2.1 generate-meta-tags

- Input: pageUrl, currentTitle, currentDescription, pageContent (snippet), targetKeywords.
- Call Claude with structured output (Zod): title ≤60 chars, description ≤160 chars, include primary keyword, compelling CTA.
- Return `{ title, description, confidence }`.

### 2.2 generate-schema-markup

- Detect page type from URL/content (product, article, FAQ, etc.).
- Call LLM to generate valid JSON-LD with required + recommended fields for that type.
- Return `{ jsonLd, schemaType, confidence }`.

### 2.3 fix-canonical-issues

- Given pageUrl, currentCanonical, duplicateUrls: choose authoritative URL (HTTPS, non-www, no trailing slash, no query params).
- Return `{ canonical, reason }`.

### 2.4 apply-fix-shopify

- Resolve fix type → Shopify mutation (productUpdate, pageUpdate, metafieldSet for schema).
- Call GraphQL Admin API with credentials. Handle rate limits (retry with backoff).
- Return `{ success, error? }`.

### 2.5 apply-fix-wordpress

- Update post/page via REST API. Use Yoast SEO REST fields for title/description/schema when available; else wp_postmeta.
- Return `{ success, error? }`.

### 2.6 apply-fix-webflow

- Update CMS item SEO fields via Webflow Data API v2.
- Return `{ success, error? }`.

### 2.7 verify-fix-applied

- Re-fetch page (same crawler as audit). Extract the field that was fixed (e.g. title, meta description).
- Compare to expected value. Return `{ verified, actualValue }`.
- If verified, update issue.fixStatus = 'applied'; else mark for review.

## Execution flow

1. For each fixable issue: generate fix (2.1–2.3 as needed by ruleId).
2. If autoFix and confidence > 0.8: call 2.4–2.6 for platform; then 2.7.
3. Emit `fix.applied` or `fix.failed` per issue.
4. Persist to `fixes` table and update `issues.fixStatus`.

## Reference

- Full skill list: [../agents.md](../agents.md) — Subagent 2: Technical Fixer
- Integrations: `.cursor/skills/build-seopilot/subagents/seopilot-integrations.md`
