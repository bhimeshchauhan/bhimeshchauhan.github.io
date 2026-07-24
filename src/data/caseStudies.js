const caseStudies = [
  {
    slug: "wrangle",
    title: "Wrangle",
    label: "Mobile product and platform engineering",
    summary:
      "I built the platform behind a travel product that turns photo libraries into ranked, structured micro-guides for better exploration.",
    scope: [
      "Built the mobile and backend foundations for creating, curating, publishing, and sharing travel guides.",
      "Designed a system that connects mobile capture, private media, guide composition, and discovery without treating any one layer as an isolated feature.",
      "Created the engineering foundation for a product experience that can evolve from a personal trip archive into a useful social guide."
    ],
    architecture: [
      "Expo and React Native provide the mobile workflow for capture, curation, and guide discovery.",
      "A NestJS service running with Fastify handles product workflows through typed TypeScript contracts.",
      "Supabase and Postgres support authentication, relational product data, and private media storage.",
      "Background image-processing work keeps longer-running media tasks separate from interactive product flows.",
      "Shared domain logic, observability, and CI checks keep the mobile and platform layers aligned as the product changes."
    ],
    decisions: [
      "Shared contracts reduce drift between a fast-moving mobile product and the backend that supports it.",
      "Private media and membership-aware access controls put user trust ahead of a convenient but unsafe storage model.",
      "Background processing protects the interaction loop from work that does not need to block a traveler."
    ],
    reliability: [
      "Type checks, mobile tests, and API end-to-end checks are part of the delivery path.",
      "Error boundaries and Sentry instrumentation make failures visible across mobile and backend workflows.",
      "The platform separates interactive requests from asynchronous media processing so it can fail and recover more gracefully."
    ],
    outcome:
      "The result is a real product foundation for transforming scattered travel media into curated, visually navigable guides, with the engineering depth to support privacy, iteration, and future intelligence features.",
    technologies: [
      "Expo",
      "React Native",
      "NestJS",
      "Fastify",
      "TypeScript",
      "Zod",
      "Supabase",
      "Postgres",
      "Python",
      "Sentry",
      "CI/CD"
    ],
    seo: {
      description:
        "Case study: Bhimesh Chauhan built a mobile and backend platform that transforms travel photos into structured, privacy-conscious micro-guides.",
      keywords: [
        "mobile platform engineering",
        "React Native",
        "NestJS",
        "travel product",
        "Supabase",
        "full-stack architecture"
      ]
    }
  },
  {
    slug: "scrubs-copilot",
    title: "Scrubs Co-Pilot",
    label: "Healthcare AI and founder-led product engineering",
    summary:
      "I founded and built an ambient clinical AI platform that turns clinician-patient conversations into structured medical documentation.",
    scope: [
      "Owned the product and engineering work from clinical workflow discovery through application architecture, infrastructure, and production readiness.",
      "Built the workflow across ambient listening, transcription, retrieval, structured note generation, and the interfaces clinicians use to review information.",
      "Set technical direction while balancing product speed with data security, clinical workflow quality, and dependable delivery."
    ],
    architecture: [
      "Ambient audio enters a transcription workflow designed around clinical conversations.",
      "LLM and retrieval steps transform relevant context into structured documentation rather than a generic conversation transcript.",
      "The application layer connects voice, data, APIs, and clinician-facing workflows into one product experience.",
      "Production infrastructure supports secure delivery, operational visibility, and iteration with clinical feedback."
    ],
    decisions: [
      "Designed around clinician workflow validation, because an impressive model output is not enough if it does not fit the way care is delivered.",
      "Treated retrieval and structured generation as a product system with security and review needs, not as a model demo.",
      "Kept ownership end to end so product tradeoffs, infrastructure choices, and clinical feedback could move together."
    ],
    reliability: [
      "Used real healthcare-professional feedback to guide output quality and workflow decisions.",
      "Built security and production readiness into the roadmap rather than treating them as a post-MVP concern.",
      "Structured outputs made it practical to review and improve documentation workflows over time."
    ],
    outcome:
      "The platform reduced clinician documentation time by about 80% by focusing the AI system on the practical work of turning conversations into usable medical documentation.",
    technologies: [
      "OpenAI",
      "Whisper",
      "RAG",
      "Supabase",
      "pgvector",
      "React",
      "Node.js",
      "Twilio Voice",
      "Docker",
      "AWS"
    ],
    seo: {
      description:
        "Case study: Bhimesh Chauhan founded and built Scrubs Co-Pilot, an ambient clinical AI platform for structured medical documentation.",
      keywords: [
        "healthcare AI",
        "clinical documentation",
        "ambient AI",
        "RAG architecture",
        "LLM product engineering"
      ]
    }
  },
  {
    slug: "rag-portfolio-assistant",
    title: "RAG Portfolio Assistant",
    label: "Grounded AI applications",
    summary:
      "I built the AI assistant on this portfolio so visitors can explore my experience through grounded answers instead of hunting through static pages.",
    scope: [
      "Designed the retrieval, prompt, and frontend interaction flow for a conversational way to explore the portfolio.",
      "Connected portfolio content to vector search so answers can use relevant site context rather than rely only on a model's general knowledge.",
      "Delivered the system with a lightweight full-stack architecture appropriate for a public website."
    ],
    architecture: [
      "Portfolio content is prepared for retrieval and stored as searchable vector context.",
      "A visitor question is embedded and matched to relevant context before generation.",
      "A server-side function builds a grounded request for the language model.",
      "The React chat interface renders the response with safe client-side handling."
    ],
    decisions: [
      "Prioritized grounded retrieval so the assistant can point visitors toward information actually represented on the site.",
      "Used an architecture that keeps the public interface simple while separating retrieval and model work from the browser.",
      "Designed with token cost and public-web safety in mind instead of treating every prompt as an unrestricted chat session."
    ],
    reliability: [
      "Retrieval context gives answers a clear factual boundary tied to the portfolio.",
      "The interface sanitizes rendered content before it reaches the page.",
      "The system handles unavailable services without breaking the rest of the site experience."
    ],
    outcome:
      "The assistant gives recruiters and collaborators a direct way to ask about relevant experience, technical depth, and product work while keeping the portfolio itself as the source of truth.",
    technologies: [
      "Supabase Edge Functions",
      "pgvector",
      "Cohere embeddings",
      "OpenRouter",
      "TypeScript",
      "React",
      "DOMPurify",
      "GitHub Pages",
      "CI/CD"
    ],
    seo: {
      description:
        "Case study: Bhimesh Chauhan built a grounded RAG assistant that lets visitors explore portfolio experience through retrieval-backed AI answers.",
      keywords: [
        "RAG assistant",
        "retrieval augmented generation",
        "pgvector",
        "AI chatbot",
        "full-stack AI"
      ]
    }
  },
  {
    slug: "pdf-to-audiobook",
    title: "PDF-to-Audiobook",
    label: "Applied NLP and voice experiences",
    summary:
      "I designed an AI-assisted PDF-to-audiobook experience that treats narration as a context and characterization problem, not just text-to-speech.",
    scope: [
      "Built a workflow that turns source documents into narration-ready content with structure, speaker context, and listening flow in mind.",
      "Applied ML, AI, and NLP techniques to personalize voice and tone rather than using one flat reading style for every passage.",
      "Focused on an experience that can preserve meaning while making long-form content easier and more engaging to consume."
    ],
    architecture: [
      "A document ingestion step extracts text and preserves useful structural context.",
      "NLP analysis identifies passages, narrative roles, and cues that affect how content should be delivered.",
      "A narration plan maps context to voice, tone, pacing, and characterization choices.",
      "Voice rendering produces an audiobook-style listening experience informed by that plan."
    ],
    decisions: [
      "Treated document structure and context as first-class inputs because raw text alone loses much of what makes narration understandable.",
      "Designed personalization around listening intent, tone, and character rather than a single generic voice.",
      "Kept the system focused on a clear human outcome: making dense written content more natural to listen to."
    ],
    reliability: [
      "Separated extraction, analysis, narration planning, and voice rendering so the system can be understood and improved one layer at a time.",
      "Preserved document context through the workflow to reduce abrupt tone shifts and disconnected narration.",
      "Used explicit intermediate stages so quality can be reviewed before content reaches the listener."
    ],
    outcome:
      "The project demonstrates product-minded AI engineering: a system that combines NLP and voice experiences to make documents more accessible, personal, and engaging.",
    technologies: [
      "Machine Learning",
      "NLP",
      "LLMs",
      "Document processing",
      "Text-to-speech",
      "Voice design",
      "Context-aware generation"
    ],
    seo: {
      description:
        "Case study: Bhimesh Chauhan designed an AI and NLP PDF-to-audiobook experience with context-aware narration, voice, and characterization.",
      keywords: [
        "NLP",
        "voice AI",
        "PDF to audiobook",
        "text to speech",
        "context aware AI"
      ]
    }
  }
];

module.exports = caseStudies;
