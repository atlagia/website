# Subagent: seopilot-verify

**Phase:** 9 — E2E Testing & MCP Verification
**subagent_type:** `browser-use`
**model:** default

---

## Objective

End-to-end verification of the complete SEOPilot platform using MCP browser automation. Test all critical user flows and capture screenshots.

## Inputs

- Full platform running: web (:3000), api (:4000)
- Database seeded with test user
- At least one site added

## MCP Browser Flows

### Flow 1: Authentication

```
1. browser_navigate → http://localhost:3000/register
2. browser_snapshot → verify form renders
3. browser_fill → name: "Test User", email: "test@seopilot.ai", password: "Test1234!"
4. browser_click → "Create Account" button
5. browser_wait → 2s
6. browser_snapshot → verify redirect to dashboard
7. browser_take_screenshot → "01-dashboard-empty.png"
8. browser_navigate → http://localhost:3000/login (logout first)
9. browser_fill → email + password
10. browser_click → "Sign In"
11. browser_snapshot → verify dashboard loads
12. browser_take_screenshot → "02-login-success.png"
```

**Pass criteria:** User can register and login. Dashboard renders after auth.

### Flow 2: Add Site

```
1. browser_navigate → http://localhost:3000/sites/new
2. browser_snapshot → verify wizard step 1
3. browser_fill → URL: "http://localhost:7026" (SEOPilot marketing site)
4. browser_click → "Next" or "Add Site"
5. browser_wait → 3s (platform detection)
6. browser_snapshot → verify site added
7. browser_navigate → http://localhost:3000/sites
8. browser_take_screenshot → "03-site-list.png"
9. browser_click → new site row
10. browser_snapshot → verify site detail page
11. browser_take_screenshot → "04-site-detail.png"
```

**Pass criteria:** Site appears in list. Detail page shows site info.

### Flow 3: Run Scan

```
1. On site detail page
2. browser_click → "Run Scan" button
3. browser_wait → 2s
4. browser_snapshot → verify progress bar appeared
5. browser_take_screenshot → "05-scan-progress.png"
6. Poll every 5s:
   - browser_snapshot → check scan status
   - If status != 'completed': continue polling (max 2 minutes)
7. browser_take_screenshot → "06-scan-complete.png"
8. browser_snapshot → verify: SEO score shows, issue count > 0
```

**Pass criteria:** Scan starts, progress shown in real-time, completes with results.

### Flow 4: View Issues

```
1. browser_navigate → http://localhost:3000/sites/{siteId}/issues
2. browser_snapshot → verify table renders with issues
3. browser_take_screenshot → "07-issues-list.png"
4. Test filters:
   a. browser_click → severity filter → select "Critical"
   b. browser_snapshot → verify filtered results
   c. browser_click → clear filter
5. Test sort:
   a. browser_click → "Severity" column header
   b. browser_snapshot → verify sorted
6. Test expand:
   a. browser_click → first issue row
   b. browser_snapshot → verify expanded detail (current/suggested value)
   c. browser_take_screenshot → "08-issue-detail.png"
7. Test bulk select:
   a. browser_click → select checkbox on 3 issues
   b. browser_snapshot → verify bulk action bar appears
```

**Pass criteria:** Issues table renders, filters/sort work, expandable rows show detail.

### Flow 5: Apply Fix

```
1. browser_navigate → http://localhost:3000/sites/{siteId}/fixes
2. browser_snapshot → verify fix suggestions list
3. browser_take_screenshot → "09-fix-suggestions.png"
4. browser_click → "Apply" on first fix
5. browser_wait → 3s
6. browser_snapshot → verify fix status changed to "Applied"
7. browser_take_screenshot → "10-fix-applied.png"
```

**Pass criteria:** Fix suggestions shown, apply works, status updates.

### Flow 6: Reports

```
1. browser_navigate → http://localhost:3000/sites/{siteId}/reports
2. browser_snapshot → verify reports page
3. browser_click → "Generate Report" button
4. browser_wait → 5s
5. browser_snapshot → verify report appears in list
6. browser_take_screenshot → "11-reports.png"
```

**Pass criteria:** Report generation works, appears in list with download link.

### Flow 7: Settings & Billing

```
1. browser_navigate → http://localhost:3000/settings
2. browser_take_screenshot → "12-settings-profile.png"
3. browser_navigate → http://localhost:3000/settings/billing
4. browser_take_screenshot → "13-settings-billing.png"
5. browser_navigate → http://localhost:3000/settings/team
6. browser_take_screenshot → "14-settings-team.png"
7. browser_navigate → http://localhost:3000/settings/integrations
8. browser_take_screenshot → "15-settings-integrations.png"
```

**Pass criteria:** All settings pages render correctly.

### Flow 8: Responsive Design

```
1. browser_navigate → http://localhost:3000 at viewport 375x812 (iPhone)
2. browser_take_screenshot → "16-mobile-dashboard.png"
3. browser_click → hamburger menu
4. browser_snapshot → verify mobile sidebar opens
5. browser_take_screenshot → "17-mobile-sidebar.png"
6. browser_navigate → http://localhost:3000/sites/{siteId}/issues
7. browser_take_screenshot → "18-mobile-issues.png"
```

**Pass criteria:** All pages responsive. Sidebar collapses to mobile menu.

### Flow 9: Dark Mode

```
1. browser_navigate → http://localhost:3000
2. browser_snapshot → verify dark mode active (default)
3. browser_click → theme toggle (if exists)
4. browser_wait → 500ms
5. browser_take_screenshot → "19-light-mode.png"
6. browser_click → theme toggle again
7. browser_take_screenshot → "20-dark-mode.png"
```

**Pass criteria:** Dark mode is default. Toggle works without flash.

### Flow 10: Console Error Check

For each page visited:
- Check browser console for JavaScript errors
- Log any errors found
- Critical: no uncaught exceptions
- Warning: deprecation warnings (note but don't fail)

## Verification Matrix

| Flow | Page/Feature | Status | Screenshot |
|------|-------------|--------|------------|
| 1 | Auth (register + login) | ⬜ | 01, 02 |
| 2 | Add site | ⬜ | 03, 04 |
| 3 | Run scan (with SSE progress) | ⬜ | 05, 06 |
| 4 | Issues (table, filters, expand) | ⬜ | 07, 08 |
| 5 | Apply fix | ⬜ | 09, 10 |
| 6 | Generate report | ⬜ | 11 |
| 7 | Settings (all sub-pages) | ⬜ | 12-15 |
| 8 | Mobile responsive | ⬜ | 16-18 |
| 9 | Dark mode toggle | ⬜ | 19, 20 |
| 10 | Console errors | ⬜ | N/A |

## Output

Return: verification matrix with pass/fail per flow, screenshot file paths, list of any issues found, console errors (if any).
