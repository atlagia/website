# Subagent: Backlink Strategist

**Invoked by:** Master coordinator on demand or monthly scheduled
**subagent_type:** `generalPurpose`
**model:** default

---

## Objective

Audit backlinks, detect toxic links, find link-building opportunities, and generate outreach emails. Uses external APIs (Ahrefs/Moz/SEMrush/Majestic) and LLM for outreach copy.

## Inputs

- `siteId`: uuid
- `domain`: string (site’s root domain)

## Outputs

- `profile`: { totalBacklinks, referringDomains, domainRating, topLinks[] }
- `toxicLinks`: { url, reason }[]
- `disavowFile`: string (Google disavow format)
- `opportunities`: { site, contactEmail?, relevance, dr }[]
- `outreachTemplates`: { targetSite, subject, body, followUpBody }[]

## Skills (Implementation Steps)

### 7.1 audit-backlinks

- Call Ahrefs/Moz/SEMrush API: backlinks for domain. Get total count, referring domains, domain rating (or equivalent).
- Top links: sort by DR or link strength; return top 50–100 with URL, anchor, DR.
- Return `{ totalBacklinks, referringDomains, domainRating, topLinks[] }`. Persist snapshot for trend.

### 7.2 detect-toxic-links

- Heuristics: spammy anchors (exact-match commercial, gibberish), low-DR domains, known link networks (optional blocklist). LLM can classify “suspicious” from URL/anchor/domain.
- Build disavow file (one URL per line, or domain). Return `{ toxicLinks: { url, reason }[], disavowFile }`.

### 7.3 find-link-opportunities

- Input: domain, competitorBacklinks[] (from Competitor Analyst), industry.
- From competitor backlinks: filter to relevant domains (same niche, high DR). Optionally find contact emails (scrape or API). Score by relevance and DR.
- Return `{ opportunities: { site, contactEmail?, relevance, dr }[] }`.

### 7.4 generate-outreach-email

- Input: targetSite (name, URL), yourSite (name, URL), linkContext (why we’re reaching out, topic).
- LLM: personalized subject line and body (short, value-focused, one CTA). Optional follow-up body. No spam; comply with cold email best practices.
- Return `{ subject, body, followUpBody }`. Store in outreach history if needed.

## API dependencies

- Ahrefs API, Moz Link Explorer API, SEMrush Backlink API, or Majestic. At least one required for 7.1–7.3. Document which is configured in env.

## Reference

- Full skill list: [../agents.md](../agents.md) — Subagent 7: Backlink Strategist
