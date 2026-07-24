# Public Case Studies and Search Metadata Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build four recruiter-facing, responsive case-study pages with accurate technical content and crawlable sharing metadata.

**Architecture:** A shared data module supplies all case-study copy to one index-card component and one reusable detail component. Gatsby creates four detail routes. A shared SEO component receives optional page data from Layout and renders canonical, social, and structured metadata.

**Tech Stack:** Gatsby 5, React 18, styled-components, react-helmet, JSON-LD, static XML sitemap.

## Global Constraints

- Include exactly Wrangle, Scrubs Co-Pilot, RAG Portfolio Assistant, and PDF-to-Audiobook.
- Rare Days must not appear in new case-study files.
- Do not publish private URLs, customer data, credentials, API routes, source code, deployment details, or unverified metrics.
- New public copy contains no em dashes.
- Use `https://bhimeshchauhan.github.io` as the site URL.
- Preserve unrelated dirty-worktree files.

---

### Task 1: Add case-study data and responsive UI components

**Files:**
- Create: `src/data/caseStudies.js`
- Create: `src/components/CaseStudies/CaseStudyCard.js`
- Create: `src/components/CaseStudies/CaseStudyDetail.js`
- Create: `src/styles/caseStudiesStyle.js`

**Interfaces:**
- Produces `caseStudies`, a CommonJS array with `slug`, `title`, `label`, `summary`, `scope`, `architecture`, `decisions`, `reliability`, `outcome`, `technologies`, and `seo`.
- `CaseStudyCard({ study })` links to `/case-studies/${study.slug}/`.
- `CaseStudyDetail({ study })` renders one detail record with semantic sections.

- [ ] Create the four public-safe records. Use CommonJS so Gatsby Node and client code can both consume the module.
- [ ] Render the index card and detail page via semantic React markup. Render architecture as an ordered list and technologies as a tag list.
- [ ] Add responsive styled-components: two card columns on desktop, one column at 700px, with no horizontal overflow.
- [ ] Verify `rg -n -i 'Rare Days|TODO|TBD|—' src/data/caseStudies.js src/components/CaseStudies src/styles/caseStudiesStyle.js` has no output.
- [ ] Commit only those four paths with message `feat: add case study content and components`.

### Task 2: Create routes and navigation

**Files:**
- Create: `src/pages/case-studies/index.js`
- Create: `src/templates/case-study.js`
- Modify: `gatsby-node.js`
- Modify: `src/data/Navigation.js`
- Modify: `src/data/About.js`

**Interfaces:**
- `gatsby-node.js` imports `caseStudies` and creates `/case-studies/${slug}/` with `{ slug }` page context.
- Template finds its record by `pageContext.slug` and passes it to `CaseStudyDetail`.

- [ ] Add the index H1, positioning statement, and one `CaseStudyCard` per record.
- [ ] Replace the inactive Gatsby Node comment with `createPages`, resolving `src/templates/case-study.js` and producing one route per study.
- [ ] Add `Case Studies` to navigation between Experience and Projects, and add the destination to homepage data without removing existing links.
- [ ] Run `npm run build` and verify `find public/case-studies -maxdepth 3 -name index.html | sort` returns the index and four detail pages.
- [ ] Commit only the routing and navigation files with message `feat: publish case study routes`.

### Task 3: Add SEO and discovery metadata

**Files:**
- Create: `src/components/Seo.js`
- Modify: `src/components/layout.js`
- Modify: `src/data/Seo.js`
- Modify: `gatsby-config.js`
- Create: `static/sitemap.xml`
- Modify: `static/robots.txt`

**Interfaces:**
- `Seo({ title, description, pathname, type, structuredData })` emits an HTTPS canonical URL plus Helmet metadata.
- `Layout({ children, seo })` passes the current path and optional `seo` object to `Seo`.

- [ ] Add per-page canonical, description, Open Graph, Twitter Card, and JSON-LD output. Use title format `${title} | Bhimesh Chauhan`, except on the home page.
- [ ] Pass CollectionPage schema from the index and Article schema from each template. Schema fields must match visible page copy and must not include dates.
- [ ] Correct `siteMetadata.siteUrl`, add the fixed HTTPS public route list to `static/sitemap.xml`, and append `Sitemap: https://bhimeshchauhan.github.io/sitemap.xml` to `static/robots.txt`.
- [ ] Run `npm run build`; confirm detail HTML includes canonical, `og:title`, `twitter:card`, and `application/ld+json`, and sitemap lists all four case-study URLs.
- [ ] Commit only SEO and discovery files with message `feat: add portfolio SEO metadata`.

### Task 4: Validate and refine the integrated experience

**Files:**
- Modify only directly related files if inspection exposes a visual defect.

- [ ] Run `npm run build` and require exit code 0.
- [ ] Run `npm run develop` and inspect `/case-studies/` plus `/case-studies/wrangle/` at 1440px and 390px.
- [ ] Confirm that primary navigation, cards, architecture flows, labels, and links do not overflow or clip.
- [ ] Run `rg -n -i 'Rare Days' src/data/caseStudies.js src/components/CaseStudies src/pages/case-studies src/templates/case-study.js static/sitemap.xml` and require no output.
- [ ] Commit focused corrections only, with message `fix: refine case study responsiveness`.
