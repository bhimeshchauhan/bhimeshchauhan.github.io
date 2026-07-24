# Public Case Studies and Search Metadata Design

## Goal

Add a polished, responsive Case Studies section that positions Bhimesh Chauhan for lead and staff AI-platform engineering roles while keeping current work and confidential details private.

## Scope

The public section contains exactly four case studies:

1. **Wrangle**: a travel-photo curation and micro-guide platform.
2. **Scrubs Co-Pilot**: an ambient clinical documentation product.
3. **RAG Portfolio Assistant**: the grounded retrieval assistant used on this portfolio.
4. **PDF-to-Audiobook**: an AI/NLP narration system with personalized, context-aware voice and characterization.

Rare Days remains in `/experience/` only. It will not appear on the case-study index, in individual case studies, in project structured data, or in new promotional copy.

## Information Architecture

### Routes

- `/case-studies/` is an index page with a concise positioning statement and one card per case study.
- `/case-studies/wrangle/`
- `/case-studies/scrubs-copilot/`
- `/case-studies/rag-portfolio-assistant/`
- `/case-studies/pdf-to-audiobook/`

The existing `/projects/` page remains a broad technical portfolio. Case studies are the curated, recruiter-facing proof of product and systems leadership. The primary navigation gains a `Case Studies` link positioned between `Experience` and `Projects`.

## Content Boundaries

Each case-study page uses only public-safe, visible content:

- A plain-language problem statement.
- Bhimesh's ownership and engineering scope.
- A high-level system description presented as an architecture flow, not proprietary diagrams or source code.
- Decisions around reliability, privacy, observability, delivery, or product quality when documented.
- A short technology list sourced from the site or local project records.
- Outcomes only when already supported by the existing site. Scrubs may state that clinician documentation time was reduced by about 80%.

Wrangle may state that it uses Expo/React Native, NestJS with Fastify, Supabase/Postgres, shared TypeScript contracts, private media storage, background image processing, Sentry, and CI checks. It must not publish repository URLs, deployment URLs, credentials, API routes, contract details, customer information, private datasets, or unverified production metrics.

The audiobook case study must describe the capability without naming an unverified vendor, scale figure, customer, or reliability result.

## UI and Responsiveness

The section uses the site’s existing dark blue visual language and Signika typography.

The index presents responsive cards in a two-column grid on desktop and one column on narrow screens. Cards show a category label, title, outcome or product purpose, technology tags, and a clear `Read case study` link.

Individual pages have:

1. Breadcrumb to the index.
2. A title, domain label, and concise summary.
3. A `What I built` section.
4. A `System at a glance` architecture flow built from semantic HTML, with accessible text equivalents.
5. `Key decisions` and `How I approached reliability` sections.
6. An evidence-backed `Outcome` section or, where no metric is verified, an explicit product capability statement.
7. Technology tags and a link back to all case studies.

No em dashes appear in new public copy. Copy is direct, senior, and human rather than buzzword-heavy.

## Data and Component Boundaries

`src/data/caseStudies.js` is the single source of truth for four case-study records. It owns slugs, titles, labels, descriptions, technologies, architecture flow steps, decisions, reliability details, and outcomes.

`src/components/CaseStudies/CaseStudyCard.js` renders index cards only.

`src/components/CaseStudies/CaseStudyDetail.js` renders a detail page from one record only. It contains no hardcoded case-study copy.

`src/pages/case-studies/index.js` renders the index.

`gatsby-node.js` creates individual pages from the records. `src/templates/case-study.js` resolves a page record by slug and renders it through the shared detail component.

`src/components/Seo.js` owns per-page metadata and JSON-LD. Layout delegates title, description, canonical path, Open Graph image, and page-specific structured data to this component while retaining site-wide Person and WebSite schema.

## Search and Sharing Metadata

- Correct `siteUrl` to `https://bhimeshchauhan.github.io`.
- Add a canonical URL, page-specific title and description, Open Graph metadata, and Twitter card metadata to every page using the shared SEO component.
- The case-study index receives `CollectionPage` JSON-LD.
- Individual case studies receive `Article` JSON-LD that matches their visible text, author, URL, title, description, and keywords. Do not invent publication dates.
- Include the WebSite schema alongside Person schema only on the home page.
- Add all public routes, including the four case studies, to `static/sitemap.xml` and reference that sitemap from `static/robots.txt`.
- Use precise visible headings, descriptive alt text, and internally linked, crawlable pages. No keyword stuffing.

## Verification

1. `npm run build` completes successfully.
2. The built files include all five case-study routes.
3. Rendered individual pages include a canonical URL, Open Graph title and description, and Article JSON-LD.
4. The case-study index includes CollectionPage JSON-LD.
5. `static/sitemap.xml` lists the final HTTPS URLs and `static/robots.txt` references it.
6. Desktop and narrow viewport inspection confirms that cards, architecture flows, and navigation do not overflow or clip.
7. A final content review confirms Rare Days appears only in the existing Experience data and is absent from all new case-study files.

## Non-Goals

- Replacing the existing Projects page.
- Publishing source code, internal diagrams, customer data, credentials, or deployment details.
- Claiming search rankings or LinkedIn placement guarantees.
- Creating new quantified outcomes where the existing portfolio does not support them.
