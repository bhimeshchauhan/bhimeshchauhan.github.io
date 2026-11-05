import favicon from '../assets/images/bhimesh-favicon.svg'

const SITE = "https://bhimeshchauhan.github.io"
export const personId = `${SITE}/#person`

const title = "Bhimesh Chauhan | Lead / Staff-Level AI Platform Engineer"
const description =
    "Lead AI platform engineer (staff-level, forward-deployed). Shipped production RAG and LLM systems: ~$700K launch in 48 hours, ~80% less clinician documentation time."

export const aboutWebsite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": `${SITE}/`,
    "name": title,
    "author": { "@id": personId }
}

export const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": personId,
    "name": "Bhimesh Chauhan",
    "url": `${SITE}/`,
    "image": `${SITE}/me.jpg`,
    "email": "mailto:bhimeshchauhan@gmail.com",
    "jobTitle": "Lead AI Platform Engineer",
    "description": "Lead AI platform engineer operating at staff scope, with experience embedded with customer teams (forward-deployed work). Builds and runs production RAG and LLM systems end to end, from retrieval architecture to launch-day reliability, and leads teams of 4-5 engineers and designers.",
    "sameAs": [
        "https://www.linkedin.com/in/bhimeshchauhan",
        "https://github.com/bhimeshchauhan"
    ],
    "knowsAbout": [
        "AI platform engineering",
        "Forward deployed engineering",
        "Retrieval-Augmented Generation",
        "Large Language Models",
        "LLM evaluation and observability",
        "Multi-tenant SaaS architecture",
        "Healthcare AI",
        "High-traffic checkout and payments",
        "Distributed systems and IoT",
        "Technical leadership"
    ],
    "knowsLanguage": ["English", "Hindi", "Bengali"],
    "worksFor": { "@type": "Organization", "name": "Rare Days" },
    "alumniOf": [
        { "@type": "CollegeOrUniversity", "name": "Iowa State University" },
        { "@type": "Organization", "name": "Scrubs Co-Pilot" },
        { "@type": "Organization", "name": "BenchSci Inc." },
        { "@type": "Organization", "name": "MicroMart" },
        { "@type": "Organization", "name": "Preply Inc." },
        { "@type": "Organization", "name": "DataRobot Inc." },
        { "@type": "Organization", "name": "Pitchly" },
        { "@type": "Organization", "name": "Nebullam" }
    ],
    "hasOccupation": {
        "@type": "Occupation",
        "name": "AI Platform Engineer",
        "description": "Designs, ships and operates production AI systems (RAG, LLM applications, multi-tenant SaaS) for customer-facing products.",
        "skills": "RAG architecture, LLM applications, TypeScript, Python, React, Next.js, Node.js, PostgreSQL, pgvector, Supabase, AWS, CI/CD, technical leadership"
    }
}

export const siteMeta = {
    title,
    favicon: favicon,
    author: "Bhimesh Chauhan",
    description,
    copyright: "Bhimesh Chauhan, Copyright (c) 2026",
    keywords: [
        "Bhimesh Chauhan",
        "lead AI platform engineer",
        "staff AI engineer",
        "forward deployed engineer",
        "principal AI engineer",
        "lead software engineer",
        "founding engineer",
        "AI platform",
        "retrieval augmented generation",
        "RAG architecture",
        "large language models",
        "multi-tenant SaaS",
        "healthcare AI",
        "technical leadership"
    ],
}
