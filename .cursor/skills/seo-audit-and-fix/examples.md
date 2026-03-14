# SEO Audit and Fix — Examples

## When to Use

- "Run an SEO audit on GlobalGiftCards."
- "Fix SEO for the digital-marketplace theme."
- "I want perfect website SEO for this site."
- "Do a first SEO audit on all data, content, and code, then fix everything."

---

## Example Flow (Subagent-Based — Default)

The process is **always** handled by subagents. Main agent only runs Phase 0 and launches the four subagents in order.

1. **Phase 0 (main agent):** Target = GlobalGiftCards, theme = digital-marketplace, baseUrl = http://localhost:7002. Context payload built; todo: seo-audit → seo-fix-high → seo-fix-medium-low → seo-verify.
2. **Launch seo-audit** (subagent_type: seo-audit or generalPurpose with prompt). Input: context. Output: full SEO Audit Report + summary.
3. **Launch seo-fix-high.** Input: context + audit report. Output: list of files changed and what was fixed.
4. **Launch seo-fix-medium-low.** Input: context + audit report + fix-high summary. Output: list of files changed and what was fixed.
5. **Launch seo-verify.** Input: context + audit report + both fix summaries. Output: "Verified: perfect website SEO. …" or "Verification incomplete: …"
6. **Main agent:** If verified, tell user "perfect website SEO" and summarize fixes. If incomplete, report remaining issues or retry.

---

## Example Issue → Fix (ATLAGIA Theme)

- **Issue:** Homepage title from `index_en.json` is "Global Gift Cards" (20 chars). High.
- **Fix:** Update `data/index_en.json` (or wherever title is sourced) to e.g. "Global Gift Cards: Buy Digital Gift Cards Online | GlobalGiftCards" (56 chars). Ensure the component that outputs `<title>` uses this field.
- **Issue:** No BreadcrumbList on product page. Medium.
- **Fix:** Add JSON-LD BreadcrumbList in layout or product template (Home → Collections → Category → Product). Validate with Rich Results Test.
