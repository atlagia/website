# SEOPilot — Full Project Audit

## 1. What Exists and Works

### 1.1 Authentication
- **Status:** Working
- **Stack:** Supabase Auth (email/password)
- **Pages:** `/login`, `/register`, `/forgot-password`, `/reset-password`
- **Middleware:** Protects dashboard routes, redirects unauthenticated to `/login`
- **Gap:** No Google OAuth, no magic link, no team/org-scoped auth

### 1.2 Site Management
- **Status:** Working
- **API:** `site.create`, `site.list`, `site.getById`, `site.update`, `site.delete`, `site.getStats`
- **UI:** Add Site form (URL + name), site list with cards, site detail with score ring
- **Gap:** `getStats` returns real totalSites/avgScore but issuesThisMonth/fixesThisMonth are 0. No site settings page. Platform detection works but no credentials storage flow.

### 1.3 Scan Pipeline
- **Status:** Working (basic)
- **Flow:** `scan.trigger` → `setImmediate(runScanPipeline)` → crawl → analyze → store → score
- **Crawler:** Cheerio + fetch, sitemap discovery, 50-page crawl, 300ms polite delay
- **Analyzer:** 11 rule checks (missing title, meta desc, H1, canonical, schema, images alt, thin content, slow load, noindex, HTTP errors)
- **Score:** `calculateSeoScore()` with weighted deductions, min 15, max deduction 85
- **Gap:** No JS rendering, no Core Web Vitals, no broken link verification, no duplicate content detection, no redirect chain analysis. Runs in-process (no Trigger.dev). No scheduled scans.

### 1.4 Issues & Fixes
- **Status:** Partially working
- **Issues:** Stored in DB per scan. Issues page reads from `scan.getResults`. Filter by severity works.
- **Fixes:** Template-based suggestions (9 fix templates for common rules). Apply/revert/bulk apply update DB `fixStatus` only.
- **Gap:** `issue.list`, `issue.bySeverity`, `issue.byCategory` are stubs (return empty). Fix "apply" doesn't touch the live site. No AI-generated fixes (templates only). No confidence scoring from LLM.

### 1.5 Real-time Events
- **Status:** Partially working
- **Events:** `publishEvent()` writes to Redis pub/sub. `emitLocal()` for in-process events. Scan progress, agent activity, score update events defined.
- **Gap:** No SSE subscription endpoint in tRPC. Dashboard polls via `refetchInterval` instead of streaming. No reconnection logic.

### 1.6 UI / Dashboard
- **Status:** Partially working
- **Dashboard:** Beautiful dark UI with ReactBits animations (CountUp, SpotlightCard, GradientText, StarBorder, ShinyText). Stats cards, recent scans, agent activity sections exist but show hardcoded zeros/empty states.
- **Site detail:** Score ring, category breakdown, scan history (last 5), quick actions. SEO Score Trend chart renders with fake demo data.
- **Gap:** Dashboard not wired to real data. SiteHealthChart uses `DEMO_DATA`. Reports page uses `DEMO_REPORTS`. No scan history page, no site settings page, no competitors page.

---

## 2. Gap Analysis by Domain

### 2.1 Technical SEO
| Capability | Status | Gap |
|-----------|--------|-----|
| Meta tag analysis | ✅ Working | Title, description, length checks |
| H1 analysis | ✅ Working | Missing H1 detection |
| Canonical check | ✅ Working | Missing canonical detection |
| Schema detection | ✅ Working | Presence only, no validation |
| Image alt text | ✅ Working | Count of missing alts |
| Robots meta | ✅ Working | Noindex detection |
| Status codes | ✅ Working | 4xx/5xx detection |
| Broken links | ❌ Missing | No HEAD request verification |
| Redirect chains | ❌ Missing | No redirect hop analysis |
| Duplicate content | ❌ Missing | No similarity comparison |
| Hreflang | ❌ Missing | No multilingual analysis |
| Mixed content (HTTP/HTTPS) | ❌ Missing | No protocol check |
| Sitemap validation | ❌ Missing | Found but not validated |
| Mobile-friendliness | ❌ Missing | No viewport/responsive check |

### 2.2 Performance SEO
| Capability | Status | Gap |
|-----------|--------|-----|
| Page load time | ✅ Basic | Fetch time only (not real user) |
| Core Web Vitals | ❌ Missing | LCP, CLS, INP, TTFB columns exist in DB but never populated |
| Lighthouse | ❌ Missing | No Lighthouse integration |
| Page weight | ❌ Missing | No asset size analysis |
| Render-blocking resources | ❌ Missing | |
| Image optimization | ❌ Missing | Format check only, no compression analysis |

### 2.3 Content SEO
| Capability | Status | Gap |
|-----------|--------|-----|
| Word count / thin content | ✅ Working | <100 words flagged |
| Keyword analysis | ❌ Missing | No keyword research, density, or optimization |
| Content quality scoring | ❌ Missing | No readability, E-E-A-T signals |
| Duplicate content | ❌ Missing | No page-to-page comparison |
| Internal linking strategy | ❌ Missing | Link count only, no graph analysis |

### 2.4 Off-page SEO
| Capability | Status | Gap |
|-----------|--------|-----|
| Backlink analysis | ❌ Missing | No backlink data source |
| Competitor analysis | ❌ Missing | Schema exists, no implementation |
| SERP tracking | ❌ Missing | No rank monitoring |
| Domain authority | ❌ Missing | No DR/DA tracking |

### 2.5 AI / Automation
| Capability | Status | Gap |
|-----------|--------|-----|
| AI fix generation | ❌ Missing | Template strings only, no LLM |
| LangGraph pipeline | ❌ Missing | Architecture designed, not built |
| RAG knowledge base | ❌ Missing | `seoKnowledge` table exists, no data or embeddings |
| Scheduled automation | ❌ Missing | Manual scan only |
| Auto-fix pipeline | ❌ Missing | No platform API integration |

### 2.6 Infrastructure
| Capability | Status | Gap |
|-----------|--------|-----|
| Database (Postgres) | ✅ Working | Neon, schema migrated |
| Redis (Upstash) | ✅ Working | Connected, pub/sub used |
| Auth (Supabase) | ✅ Working | Email/password |
| Trigger.dev | ⚠️ Configured | API key set, no jobs defined |
| R2 Storage | ⚠️ Configured | Credentials in env, upload script exists, not used by app |
| Stripe | ❌ Stub | No real products/checkout |

---

## 3. Code Quality Assessment

### Strengths
- Clean monorepo structure with clear separation (apps/web, apps/api)
- Drizzle schema is comprehensive and well-indexed
- tRPC router structure follows best practices (typed end-to-end)
- UI is polished dark theme with thoughtful animations
- Scan pipeline has proper error handling and phase-based progress

### Weaknesses
- **No shared types package.** Frontend uses `(site as any)` casts extensively.
- **No input validation middleware.** tRPC procedures use `publicProcedure` (no auth check).
- **In-process jobs.** `setImmediate(runScanPipeline)` blocks Node event loop for long crawls and dies if server restarts.
- **Issue router is dead code.** Stubs return empty arrays; issues page bypasses it entirely via `scan.getResults`.
- **No error boundaries.** Frontend has no error handling for failed tRPC calls.
- **No rate limiting on scan trigger.** User can spam "Run Scan" (partially mitigated by active-scan check).
- **Crawler is fragile.** No timeout per page, no retry on network errors, no concurrency control.
- **Score formula is ad-hoc.** Weighted deduction approach gives 15 for 121 issues — needs calibration.

### Security Concerns
- All tRPC procedures are `publicProcedure` (no auth middleware)
- Supabase credentials in `.env.local` (correct) but API `.env` has DB URL without rotation
- No CSRF protection on mutations
- No input sanitization on site URL (potential SSRF via crawl)

---

## 4. Database Schema vs Implementation Gap

| Table | Schema | Has Data | Has API | Has UI |
|-------|--------|----------|---------|--------|
| users | ✅ | ✅ | Partial | ✅ (auth) |
| organizations | ✅ | ✅ | Auto-created | ❌ |
| orgMembers | ✅ | ❌ | ❌ | ❌ |
| sites | ✅ | ✅ | ✅ | ✅ |
| scans | ✅ | ✅ | ✅ | ✅ |
| pages | ✅ | ✅ | Via scan.getResults | ❌ |
| issues | ✅ | ✅ | Stub | ✅ (via scan) |
| fixes | ✅ | Partial | ✅ | ✅ |
| agentLogs | ✅ | ❌ | Stub | ❌ |
| reports | ✅ | ❌ | Stub | Demo only |
| seoScoreHistory | ✅ | ✅ | ❌ | Demo chart |
| competitors | ✅ | ❌ | ❌ | ❌ |
| seoKnowledge | ✅ | ❌ | ❌ | ❌ |

---

## 5. Performance Baseline

| Metric | Current | Target |
|--------|---------|--------|
| Crawl speed (50 pages) | ~20 seconds | <10s (concurrent) |
| Scan-to-results latency | ~25 seconds | <15s (with Trigger.dev) |
| Dashboard load (sites list) | ~1.5s | <500ms (ISR + cache) |
| API cold start | ~2s (tsx watch) | <200ms (compiled) |
| Max pages per crawl | 50 (sitemap) | 500+ (configurable) |
| Concurrent scans | 1 (in-process) | 10+ (Trigger.dev workers) |
