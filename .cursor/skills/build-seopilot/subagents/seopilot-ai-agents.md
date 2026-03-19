# Subagent: seopilot-ai-agents

**Phase:** 4 — AI Agent System (LangGraph)
**subagent_type:** `generalPurpose`
**model:** default

---

## Objective

Build the LangGraph-based AI agent pipeline that orchestrates SEO auditing, fix generation, and automated fix application.

## Inputs

- `projectRoot`: Monorepo root
- Crawler package built (packages/crawler exports crawlSite)
- DB schema available (issues, fixes, agentLogs tables)

## Steps

### 1. Install Dependencies

```bash
cd packages/agents
npm install @langchain/langgraph @langchain/core @langchain/anthropic @langchain/openai zod
npm install -D typescript @types/node
```

### 2. State Definition (src/state.ts)

Define the LangGraph state annotation:

```typescript
import { Annotation } from '@langchain/langgraph';

export const SEOAuditState = Annotation.Root({
  // Input
  siteId: Annotation<string>,
  siteUrl: Annotation<string>,
  scanId: Annotation<string>,
  autoFix: Annotation<boolean>,
  platformType: Annotation<string>,

  // Crawl output
  crawlData: Annotation<CrawlResult | null>,
  pagesScanned: Annotation<number>,

  // Audit outputs (parallel)
  technicalIssues: Annotation<RawIssue[]>,
  contentIssues: Annotation<RawIssue[]>,
  performanceIssues: Annotation<RawIssue[]>,

  // Merged & prioritized
  allIssues: Annotation<PrioritizedIssue[]>,
  seoScore: Annotation<number>,
  scoreBreakdown: Annotation<ScoreBreakdown>,

  // Fix generation
  suggestedFixes: Annotation<SuggestedFix[]>,
  approvedFixes: Annotation<ApprovedFix[]>,

  // Fix application
  appliedFixes: Annotation<AppliedFix[]>,
  failedFixes: Annotation<FailedFix[]>,

  // Verification
  verificationResults: Annotation<VerificationResult[]>,

  // Report
  reportData: Annotation<ReportData | null>,
  reportUrl: Annotation<string | null>,

  // Progress tracking
  currentPhase: Annotation<string>,
  progress: Annotation<number>,
  errors: Annotation<string[]>,
});
```

### 3. Graph Nodes (src/nodes/)

**crawl-node.ts:**
- Calls `crawlSite()` from packages/crawler
- Validates output (minimum pages crawled)
- Stores raw crawl data in R2
- Updates state: crawlData, pagesScanned
- Emits: `scan.progress` event (phase: 'crawling')

**technical-audit.ts:**
- Receives crawlData from state
- Runs technical-seo analyzer from packages/crawler
- Enhances with LLM analysis (Claude) for nuanced issues:
  - Prompt: "Analyze these technical SEO findings and identify the most impactful issues..."
  - Structured output via Zod schema
- Updates state: technicalIssues

**content-audit.ts:**
- Receives crawlData from state
- Runs content-seo analyzer
- LLM enhancement: content quality assessment, keyword opportunities
  - Prompt: "Evaluate the content quality of these pages. Identify thin content, missing keywords, and optimization opportunities..."
- Updates state: contentIssues

**performance-audit.ts:**
- Receives crawlData (CWV metrics)
- Runs speed analyzer
- Categorizes by impact severity
- Updates state: performanceIssues

**merge-prioritize.ts (pure function — no LLM):**
- Combines technicalIssues + contentIssues + performanceIssues
- Deduplicates (same issue on same page)
- Assigns priority score: severity weight × page importance × fix difficulty
- Sorts by priority (critical first)
- Calculates SEO score (0-100) based on issue distribution
- Updates state: allIssues, seoScore, scoreBreakdown

**fix-generator.ts:**
- Takes top N fixable issues (N based on plan limit)
- For each issue, generate a fix using LLM:
  - Meta tag fix: generate optimized title (≤60 chars) and description (≤160 chars)
  - Schema markup fix: generate appropriate JSON-LD
  - Heading fix: suggest restructured heading hierarchy
  - Alt text fix: generate descriptive alt text from page context
  - Internal link fix: suggest relevant pages to link to
  - Content fix: suggest expanded content with keyword optimization
- Each fix includes: aiConfidence (0-1), aiReasoning, beforeValue, afterValue
- Uses Zod structured output to ensure valid fix format
- Updates state: suggestedFixes

**human-gate.ts (conditional node):**
- If `autoFix === true` AND all fixes have confidence > 0.8: proceed to fix-applier
- If `autoFix === false` OR any fix has low confidence: save fixes to DB and STOP (user reviews in dashboard)
- Conditional edge routing based on autoFix flag

**fix-applier.ts:**
- Takes approvedFixes from state
- For each fix, calls appropriate integration connector:
  - Shopify: updateMeta, addSchema via GraphQL
  - WordPress: update post/page via REST, update Yoast fields
  - Webflow: update CMS item SEO fields
  - Custom: store fixes for manual application (provide code snippets)
- Records success/failure per fix
- Updates state: appliedFixes, failedFixes
- Emits: `fix.applied` events

**verification.ts:**
- Re-crawl only the pages that had fixes applied
- Compare before/after for each fix
- Verify fix is actually applied (e.g., new title appears in HTML)
- Calculate new SEO score
- Updates state: verificationResults
- Emits: `score.update` event

**report-builder.ts:**
- Compile all state into report format:
  - Executive summary (1 paragraph)
  - Score before/after with breakdown
  - Top issues found (grouped by category)
  - Fixes applied (with before/after)
  - Remaining issues (prioritized)
  - Recommendations
- Generate PDF (use @react-pdf/renderer or puppeteer-pdf)
- Upload to R2
- Updates state: reportData, reportUrl

### 4. Main Graph (src/graph.ts)

```typescript
import { StateGraph, START, END } from '@langchain/langgraph';
import { SEOAuditState } from './state';

const workflow = new StateGraph(SEOAuditState)
  .addNode('crawl', crawlNode)
  .addNode('technicalAudit', technicalAuditNode)
  .addNode('contentAudit', contentAuditNode)
  .addNode('performanceAudit', performanceAuditNode)
  .addNode('mergePrioritize', mergePrioritizeNode)
  .addNode('fixGenerator', fixGeneratorNode)
  .addNode('humanGate', humanGateNode)
  .addNode('fixApplier', fixApplierNode)
  .addNode('verification', verificationNode)
  .addNode('reportBuilder', reportBuilderNode)
  // Edges
  .addEdge(START, 'crawl')
  .addEdge('crawl', 'technicalAudit')
  .addEdge('crawl', 'contentAudit')      // parallel fan-out
  .addEdge('crawl', 'performanceAudit')   // parallel fan-out
  .addEdge('technicalAudit', 'mergePrioritize')
  .addEdge('contentAudit', 'mergePrioritize')
  .addEdge('performanceAudit', 'mergePrioritize')
  .addEdge('mergePrioritize', 'fixGenerator')
  .addEdge('fixGenerator', 'humanGate')
  .addConditionalEdges('humanGate', (state) => {
    return state.autoFix ? 'fixApplier' : 'reportBuilder';
  })
  .addEdge('fixApplier', 'verification')
  .addEdge('verification', 'reportBuilder')
  .addEdge('reportBuilder', END);

export const seoAuditGraph = workflow.compile({
  checkpointer: postgresCheckpointer, // resume after failure
});
```

### 5. Checkpointer (src/checkpointer.ts)

PostgreSQL-based checkpoint storage:
- Stores graph state at every node transition
- Enables resume from last successful node on failure
- Stores in a `langgraph_checkpoints` table

### 6. LLM Tools (src/tools/)

LangChain tool definitions for LLM function calling:

**meta-generator.ts:**
- Input: page URL, current title, current description, page content snippet
- Output: optimized title (≤60 chars), optimized description (≤160 chars)
- Constraints: include primary keyword, compelling, accurate

**schema-generator.ts:**
- Input: page type, page content, existing schema
- Output: valid JSON-LD for the page type
- Supports: Organization, Product, Article, FAQ, BreadcrumbList, LocalBusiness

**content-optimizer.ts:**
- Input: page content, target keywords, competitor content
- Output: optimized content with better keyword usage, structure, readability

**alt-text-generator.ts:**
- Input: image URL, surrounding context, page topic
- Output: descriptive alt text (≤125 chars)

**internal-linker.ts:**
- Input: current page content, list of all site pages with titles
- Output: suggested internal links (anchor text + target URL)

### 7. Prompt Templates (src/prompts/)

System prompts for each audit agent. Must include:
- Role definition (e.g., "You are a senior technical SEO auditor")
- Context about the site being analyzed
- Specific rules and thresholds (char limits, score thresholds)
- Output format specification (Zod schema reference)
- Examples of good/bad analysis

### 8. Test

Run the full pipeline on a test URL:

```typescript
const result = await seoAuditGraph.invoke({
  siteUrl: 'http://localhost:7026/en',
  siteId: 'test-site-id',
  scanId: 'test-scan-id',
  autoFix: false,
  platformType: 'custom',
});
```

Verify: all nodes execute, issues found, fixes suggested, report generated.

## Output

Return: node count, tool count, sample pipeline output (issue count, fix count, score), checkpoint working, any issues.
