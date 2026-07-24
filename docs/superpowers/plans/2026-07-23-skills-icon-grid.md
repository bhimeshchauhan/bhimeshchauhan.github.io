# Skills Icon Grid Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore an extensive, modern icon-card Skills page that highlights Bhimesh's credible Lead/Staff AI-platform toolset.

**Architecture:** Replace the text-only skill strings with structured group and tool records. Each record contains a title, experience signal, icon URL, and optional detail. The page maps those records into accessible visual cards; CSS supplies the responsive dark-theme grid and image fallbacks.

**Tech Stack:** Gatsby, React, CSS, externally hosted Simple Icons and existing icon assets.

## Global Constraints

- Preserve the `/skills/` route and the site's existing dark visual language.
- Use only tools evidenced in the resume, portfolio, or approved experience content.
- Order groups so AI/RAG and senior platform capabilities appear before supporting tools.
- Use only `Production`, `Strong`, and `Working knowledge` experience signals.
- Do not modify experience, projects, resume, or unrelated generated files.

---

### Task 1: Define grouped individual-skill data

**Files:**
- Modify: `src/data/skills.js`

**Interfaces:**
- Produces: an array of `{ title, summary, skills }` groups.
- Each `skills` item has `{ title, level, icon, detail }` string properties.
- Consumed by: `src/pages/skills.js`.

- [ ] **Step 1: Replace text-only skills with individual tool records**

```js
{
  title: "AI and RAG Systems",
  summary: "Production AI applications, retrieval, and workflow automation.",
  skills: [
    {
      title: "OpenAI API",
      level: "Production",
      icon: "https://cdn.simpleicons.org/openai/FFFFFF",
      detail: "LLM application and chatbot delivery"
    }
  ]
}
```

Include the six ordered groups from the design: AI and RAG Systems, Application Engineering, Data and APIs, Cloud Reliability and Delivery, IoT Mobile and Integrations, and Product and Engineering Leadership. Populate them with individual verified tool cards including OpenAI API, pgvector, TypeScript, JavaScript, Python, React, Node.js, PostgreSQL, Neo4j, GraphQL, AWS, Docker, Jenkins, CircleCI, Cypress, Kibana, MQTT, Modbus, Android, and representative leadership capabilities.

- [ ] **Step 2: Check data shape with Node parsing**

Run: `node -e "require('fs').readFileSync('src/data/skills.js', 'utf8'); console.log('skills data readable')"`

Expected: `skills data readable`.

- [ ] **Step 3: Commit the data update**

```bash
git add src/data/skills.js
git commit -m "Add detailed skills icon data"
```

### Task 2: Render accessible icon cards

**Files:**
- Modify: `src/pages/skills.js`

**Interfaces:**
- Consumes: skill groups from `src/data/skills.js`.
- Produces: `section.skillGroup` containing `article.skillCard` records.

- [ ] **Step 1: Replace list-item rendering with tool-card rendering**

```jsx
{group.skills.map((item) => (
  <article className="skillCard" key={item.title}>
    <div className="skillIconFrame">
      <img src={item.icon} alt="" className="skillIcon" loading="lazy" />
    </div>
    <div className="skillCardBody">
      <span className={`skillLevel skillLevel--${item.level.toLowerCase().replaceAll(' ', '-')}`}>
        {item.level}
      </span>
      <h3>{item.title}</h3>
      <p>{item.detail}</p>
    </div>
  </article>
))}
```

Keep the page title and concise recruiter-focused introduction. Use the item title as the unique key because each title is unique inside its group.

- [ ] **Step 2: Add an image fallback label**

```jsx
<img
  src={item.icon}
  alt=""
  className="skillIcon"
  loading="lazy"
  onError={(event) => {
    event.currentTarget.style.display = "none";
    event.currentTarget.parentElement.dataset.fallback = item.title.slice(0, 2);
  }}
/>
```

The empty alt attribute keeps decorative logos out of the accessibility tree. The parent data attribute is used by CSS as a visible initial fallback.

- [ ] **Step 3: Run the Gatsby build**

Run: `npm run build`

Expected: exit code 0 and Gatsby lists `/skills/` among generated pages.

- [ ] **Step 4: Commit the component update**

```bash
git add src/pages/skills.js
git commit -m "Render modern skills icon cards"
```

### Task 3: Style the responsive icon grid

**Files:**
- Modify: `src/styles/skillStyle.css`

**Interfaces:**
- Consumes: `skillsGroups`, `skillGroup`, `skillGrid`, `skillCard`, `skillIconFrame`, `skillIcon`, `skillCardBody`, and `skillLevel` classes from `src/pages/skills.js`.
- Produces: a responsive desktop and mobile layout for the icon cards.

- [ ] **Step 1: Add a dense responsive grid**

```css
.skillGrid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(10.5rem, 1fr));
    gap: 1rem;
}

@media screen and (max-width: 650px) {
    .skillGrid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.75rem;
    }
}
```

- [ ] **Step 2: Style icon cards and level badges**

```css
.skillCard {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 14px;
    overflow: hidden;
    transition: border-color 160ms ease, transform 160ms ease, background 160ms ease;
}

.skillCard:hover {
    background: rgba(255, 255, 255, 0.09);
    border-color: rgba(255, 207, 74, 0.75);
    transform: translateY(-3px);
}
```

Use a fixed icon frame, `object-fit: contain`, small readable title/detail copy, and distinct but restrained level badge colors. Add a `::after { content: attr(data-fallback); }` fallback on `.skillIconFrame[data-fallback]`.

- [ ] **Step 3: Run visual and production checks**

Run: `npm run build && curl -I --max-time 5 --silent --show-error http://localhost:8000/skills/ | head -1`

Expected: Gatsby exits 0 and the final line is `HTTP/1.1 200 OK`.

- [ ] **Step 4: Commit styling**

```bash
git add src/styles/skillStyle.css
git commit -m "Style responsive skills icon grid"
```

### Task 4: Final review

**Files:**
- Verify: `src/data/skills.js`
- Verify: `src/pages/skills.js`
- Verify: `src/styles/skillStyle.css`

- [ ] **Step 1: Confirm high-priority skills are first**

Run: `rg -n 'AI and RAG Systems|OpenAI API|pgvector|TypeScript|Python|AWS|Docker|CI/CD' src/data/skills.js`

Expected: every search term has a match, with AI/RAG group before Application Engineering.

- [ ] **Step 2: Confirm clean working tree for owned files**

Run: `git status --short src/data/skills.js src/pages/skills.js src/styles/skillStyle.css`

Expected: no output after the final commit.
