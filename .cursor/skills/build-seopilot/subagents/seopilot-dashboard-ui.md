# Subagent: seopilot-dashboard-ui

**Phase:** 5 — Dashboard UI (Next.js + shadcn/ui)
**subagent_type:** `generalPurpose`
**model:** default

---

## Objective

Build the complete SaaS dashboard with all pages, components, charts, data tables, and dark mode. Connect to tRPC API.

## Inputs

- `projectRoot`: Monorepo root
- apps/web Next.js setup from scaffold
- apps/api tRPC routers available at localhost:4000
- tRPC router type definitions from packages/shared

## Steps

### 1. tRPC Client Setup

**apps/web/lib/trpc.ts:**
```typescript
import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink, httpSubscriptionLink, splitLink } from '@trpc/client';
import type { AppRouter } from '@seopilot/api/trpc/router';

export const trpc = createTRPCReact<AppRouter>();

export function getTRPCClient() {
  return trpc.createClient({
    links: [
      splitLink({
        condition: (op) => op.type === 'subscription',
        true: httpSubscriptionLink({ url: `${process.env.NEXT_PUBLIC_API_URL}/trpc` }),
        false: httpBatchLink({ url: `${process.env.NEXT_PUBLIC_API_URL}/trpc` }),
      }),
    ],
  });
}
```

**apps/web/components/providers/trpc-provider.tsx:** Wrap app with TRPCProvider + QueryClientProvider.

### 2. Auth Client

**apps/web/lib/auth-client.ts:**
```typescript
import { createAuthClient } from 'better-auth/react';
export const auth = createAuthClient({ baseURL: process.env.NEXT_PUBLIC_API_URL });
```

### 3. Layout Structure

**(dashboard)/layout.tsx:**
- shadcn Sidebar (collapsible, with sections: Dashboard, Sites, Settings)
- Header bar: org switcher, search, notifications bell, user avatar dropdown
- Mobile: Sheet-based sidebar triggered by hamburger
- Breadcrumb trail

**(auth)/layout.tsx:**
- Centered card with SEOPilot logo
- Dark gradient background
- No sidebar

### 4. Auth Pages

**login/page.tsx:**
- Email + password form (React Hook Form + Zod)
- "Continue with Google" button
- "Magic link" option
- Link to register
- Error states, loading states

**register/page.tsx:**
- Name, email, password, org name
- Terms acceptance checkbox
- Redirect to dashboard on success

### 5. Dashboard Overview (/)

**KPI Cards (4-column grid):**
| Card | Value | Icon | Trend |
|------|-------|------|-------|
| Total Sites | count | Globe | +/- vs last month |
| Avg SEO Score | 0-100 | TrendingUp | delta |
| Issues Found | count | AlertTriangle | this month |
| Fixes Applied | count | CheckCircle | this month |

Each card: shadcn Card with animated CountUp number, sparkline mini-chart, trend arrow.

**Score Trend Chart:**
- Recharts AreaChart with gradient fill
- 30-day timeline, one line per site (or averaged)
- Tooltip with exact date + score
- Legend for multiple sites

**Recent Scans Table:**
- shadcn Table: Site name, Status (badge), Pages scanned, Issues, Time, Score
- Status badges: queued (gray), running (blue pulse), completed (green), failed (red)
- Click row → navigate to scan detail

**Agent Activity Feed:**
- Vertical timeline with SSE-powered live updates
- Icons per agent type (🕷️ crawler, 🔧 technical, 📝 content, ⚡ performance, 🤖 fixer)
- Timestamp, agent name, action description
- Auto-scroll to latest

**Quick Actions:**
- "Add Site" button → /sites/new
- "Run Scan" dropdown → select site → trigger scan
- "View Reports" → /reports

### 6. Site Pages

**Site List (/sites):**
- Card grid or table view toggle
- Each site card: name, URL, platform badge, SEO score ring, last scan date, issue count
- Search bar, filter by platform
- "Add Site" CTA button

**Add Site Wizard (/sites/new):**
- Step 1: Enter URL (auto-detect platform via meta tags)
- Step 2: Connect platform (OAuth flow if Shopify/WP/Webflow, or skip for custom)
- Step 3: Configure scan settings (depth, schedule, auto-fix toggle)
- Step 4: First scan trigger
- Progress indication between steps

**Site Detail (/sites/[siteId]):**
- Hero section: SEO score ring (large, animated), site name, URL, platform badge
- Score Breakdown: 4 progress bars (Technical, Content, Performance, Links)
- Issue Distribution: Recharts BarChart grouped by severity
- Latest Scan Summary: status, pages, issues, duration
- Quick Fix CTA: "Auto-fix N approved issues"
- Recent activity timeline (last 10 agent actions)

**Issues (/sites/[siteId]/issues):**
- TanStack Table with server-side pagination (50 per page)
- Columns: Severity (badge), Category (badge), Title, Page URL, Status, Fix
- Filters: severity multi-select, category multi-select, status, URL search
- Sortable by severity, category, page URL
- Expandable row: full description, current value, suggested value, "Apply Fix" button
- Bulk select: checkbox column → bulk approve/dismiss/apply
- Export CSV button

**Fixes (/sites/[siteId]/fixes):**
- Tabs: Suggested | Approved | Applied | Failed
- Each fix card: issue title, confidence bar, before/after code diff
- "Apply" button (loading state, SSE progress)
- "Apply All Approved" batch button
- "Revert" for applied fixes
- AI reasoning tooltip on hover

**Reports (/sites/[siteId]/reports):**
- Report list: date, type, scan reference, download button
- Report preview: embedded HTML viewer or PDF iframe
- "Generate Report" button (triggers report job)
- Schedule toggle: auto-generate weekly/monthly

**Competitors (/sites/[siteId]/competitors):**
- "Add Competitor" modal with URL input
- Comparison table: your site vs competitors (score, issues, load time, content)
- Radar chart: overlaid scores per category

**Site Settings (/sites/[siteId]/settings):**
- Scan schedule (daily/weekly/monthly/manual)
- Auto-fix toggle with category granularity
- Platform connection status
- Delete site (danger zone)

### 7. Settings Pages

**Profile (/settings):**
- Name, email, avatar upload
- Password change form
- Two-factor setup

**Billing (/settings/billing):**
- Current plan card with features
- Usage meter: scans used / limit (with progress bar)
- "Upgrade Plan" buttons for each tier
- Stripe billing portal link
- Invoice history

**Team (/settings/team):**
- Member list table: name, email, role, joined date
- Invite member modal: email + role select
- Role management: owner, admin, member
- Remove member (danger)

**Integrations (/settings/integrations):**
- Platform cards: Shopify, WordPress, Webflow, Google Search Console, Google Analytics
- Each card: logo, name, connection status (green/gray), Connect/Disconnect button
- OAuth flow initiated on "Connect" click
- "Test Connection" button for connected platforms

### 8. Reusable Components

Build in `apps/web/components/dashboard/`:

**seo-score-ring.tsx:**
- Circular SVG progress ring (0-100)
- Color: red (<40), orange (40-70), green (>70)
- Animated on mount (CSS transition)
- Center label: score number

**issue-table.tsx:**
- Configurable TanStack Table wrapper
- Server-side pagination, sorting, filtering
- Expandable rows
- Bulk selection
- Empty state

**agent-activity-feed.tsx:**
- Timeline layout with dotted line
- SSE subscription for live updates
- Agent type icons and colors
- Relative timestamps ("2 min ago")
- Max 50 items with "Load more"

**scan-progress-bar.tsx:**
- Multi-phase progress: Crawling → Analyzing → Fixing → Reporting
- Current phase highlighted with animation
- Pages scanned counter

**fix-suggestion-card.tsx:**
- Before/after values with diff highlighting
- AI confidence meter (0-100%)
- "Apply" / "Dismiss" / "Edit" buttons
- Expandable AI reasoning

**site-health-chart.tsx:**
- Recharts AreaChart
- Score trend over time (7d / 30d / 90d toggle)
- Gradient fill matching score color
- Reference line at score 80 ("Good" threshold)

### 9. Dark Mode

- Default theme: dark
- next-themes provider in root layout
- shadcn CSS variables configured for dark palette
- SEOPilot brand colors (emerald/cyan) integrated into theme
- Toggle in header (sun/moon icon)

### 10. MCP Verification

Navigate to every major page and screenshot:
1. Login page
2. Dashboard overview
3. Site list (with sample data)
4. Site detail
5. Issues table
6. Fixes page
7. Settings
8. Mobile viewport (375px)

## Output

Return: page count (list all pages), component count, shadcn components used, dark mode confirmed, MCP screenshots taken, any issues.
