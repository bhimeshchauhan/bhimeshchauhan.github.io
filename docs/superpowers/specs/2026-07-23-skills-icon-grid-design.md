# Skills Icon Grid Refresh

## Goal

Show Bhimesh's broad hands-on technical range in a recruiter-friendly Skills page without losing the visual icon-card experience of the original site.

## Scope

Update only the Skills page, its data source, and its stylesheet. Preserve the existing Gatsby page route at `/skills/` and leave unrelated portfolio pages unchanged.

## Information Architecture

The page keeps the current recruiter-focused order, but each category contains individual technology cards instead of text-only capability bullets:

1. AI and RAG Systems
2. Application Engineering
3. Data and APIs
4. Cloud, Reliability, and Delivery
5. IoT, Mobile, and Integrations
6. Product and Engineering Leadership

The first five sections use individual tool cards with a logo, tool name, and an accurate experience signal: `Production`, `Strong`, or `Working knowledge`. The leadership section is also shown as cards, using meaningful engineering-capability icons rather than pretending leadership is a software product.

## Content Rules

- Include tools demonstrated in the resume, portfolio, or approved experience content.
- Prioritize RAG, LLM applications, multi-tenant SaaS, TypeScript, JavaScript, Python, React, Node.js, PostgreSQL, Neo4j, GraphQL, AWS, Docker, CI/CD, testing, observability, payments, IoT, Android, and the supporting tools used across Bhimesh's career.
- Preserve breadth, including established tools such as Django, Flask, MongoDB, Redis, RabbitMQ, WebSockets, MQTT, Modbus, Jenkins, CircleCI, Cypress, and Kibana.
- Do not claim unsupported expertise or add technologies not evidenced by the portfolio material.
- Keep recruiter-facing AI-platform technologies first; older or specialized tools remain visible in relevant groups.

## Visual Design

- Use a responsive card grid with consistent icon areas, a small experience badge, and clear readable tool names.
- Make the grid denser than the old page on desktop while retaining large enough tap targets on mobile.
- Use the site's dark visual language with elevated panels, subtle borders, and short hover transitions.
- Render icons with accessible alt text and graceful fallback initials if an external icon cannot load.

## Validation

- Run `npm run build` successfully.
- Confirm `http://localhost:8000/skills/` returns HTTP 200 after the update.
- Confirm all categories render from the new structured skill data and that the page stays usable at mobile widths.
