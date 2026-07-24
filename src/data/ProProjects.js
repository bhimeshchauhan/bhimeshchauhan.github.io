import website from "../assets/images/projects/website.svg";
import Scrubs from "../assets/images/projects/scrubs.jpeg";
import rag from "../assets/images/projects/rag.webp";
import pitchly from '../assets/images/pitchly.gif';
import pitchlyForm from '../assets/images/pitchly-form.png';
import nebullam1 from '../assets/images/nebullam-1.png';
import nebullam2 from '../assets/images/nebullam-2.png';
import nebullam3 from '../assets/images/nebullam-3.png';
import nebullam4 from '../assets/images/nebullam-4.png';
import nebullam5 from '../assets/images/nebullam-5.png';
import sudoku from '../assets/images/sudoku.gif';

export default [
  {
    id: 8,
    title: "Medical LLM for Clinical Documentation (Scrubs Co-Pilot)",
    icon: Scrubs,
    description:
      "Specialized medical LLM for ambient listening, transcription, and structured chart generation. HIPAA-conscious RAG architecture; integrates with EHR systems and voice-based intake.",
    demoPath: "https://bhimeshchauhan.github.io",
    year: "2025",
    techUsed: "OpenAI GPT-4, Whisper, Supabase, pgvector, React, Node.js, Twilio Voice, ElevenLabs, Docker, AWS"
  },
  {
    id: 9,
    title: "RAG Portfolio Assistant",
    icon: rag,
    description:
      "Production RAG chatbot powering this portfolio. It retrieves relevant site context from pgvector and prompts an LLM to provide grounded answers, with CORS-safe and cost-aware delivery.",
    githubPath: "https://github.com/bhimeshchauhan/bhimeshchauhan.github.io",
    demoPath: "https://bhimeshchauhan.github.io",
    year: "2025",
    techUsed:
      "Supabase Edge Functions, pgvector, Cohere embed-english-v3.0, OpenRouter (Mistral 7B), Node/TypeScript (Deno), React, DOMPurify, GitHub Pages, CI/CD"
  },
  {
    id: 7,
    title: "Persona Detection for Language Learning",
    icon: website,
    description:
      "Graph-based learner persona detection to personalize lesson paths. Neo4j + KNN; Flask inference API; optimized Cypher queries for latency and scale.",
    year: "2022",
    techUsed: "Neo4j, Cypher, Python/Flask, KNN, Pandas, Docker, GCP/AWS"
  },
  {
    id: 2,
    title: "Forms App (Pitchly)",
    icon: website,
    description:
      "Schema-driven form builder used by financial and legal teams, with GraphQL and REST data flows, role-based permissions, and autosave. Optimized queries and CDN caching for global users.",
    media: [pitchly, pitchlyForm],
    demoPath: "https://pitchly.com/",
    year: "2018–2019",
    techUsed: "MeteorJS, GraphQL, Apollo, Node.js, MongoDB, AWS (EC2/S3/CloudFront), REST, Nginx"
  },
  {
    id: 1,
    title: "Remote Monitoring – Aeroponics System",
    icon: website,
    description:
      "Android IoT app to monitor and control high-pressure aeroponics. Telemetry and commands run over MQTT/HTTP, supported by backend dashboards, sensor charts, and ML-based growth recommendations.",
    media: [nebullam1, nebullam2, nebullam3, nebullam4, nebullam5],
    demoPath: "https://apkpure.com/nebullam/com.nebullam.nebullam",
    year: "2016–2017",
    techUsed: "Android (Java/Kotlin), MQTT, Django/Flask, TensorFlow, D3.js, WAMP, Nginx, Docker, Postgres"
  },
  {
    id: 4,
    title: "Sudoku AR + Deep Learning",
    icon: website,
    description:
      "End-to-end Sudoku solver: detects a grid from camera frames, recognizes digits, and solves the puzzle via backtracking. Built a dataset and augmentation pipeline, with model selection in Keras/TensorFlow.",
    media: [sudoku],
    year: "2020",
    techUsed: "Python, OpenCV, TensorFlow/Keras, Scikit-learn, Image Morphology, Backtracking, NumPy"
  },
  {
    id: 10,
    title: "Conway's Game of Life",
    icon: website,
    description:
      "Interactive cellular automaton simulation with preset seed patterns, adjustable grid size and speed, manual cell toggling, and step-through mode. Canvas-rendered with glow effects.",
    iframe: '<iframe width="100%" height="480" src="/game-of-life-embed" style="border:none;border-radius:4px;background:#0d0f11" allowfullscreen></iframe>',
    githubPath: "https://github.com/bhimeshchauhan/bhimeshchauhan.github.io",
    demoPath: "/game-of-life",
    year: "2026",
    techUsed: "React, Canvas API, Styled Components, Gatsby"
  },
  {
    id: 6,
    title: "SpaceFlight – Unity Game",
    icon: website,
    description:
      "Arcade-style space flight with 6DOF controls and collision physics. Gameplay loop, input mapping, scene management, and asset pipeline via Blender.",
    githubPath: "https://github.com/bhimeshchauhan/SpaceExpo",
    demoPath: "https://simmer.io/@bchauhan/spaceshooter",
    year: "2021",
    techUsed: "Unity, C#, WebGL, OpenGL, Physics, Blender"
  },
  {
    id: 5,
    title: "Procedural Terrain Generation",
    icon: website,
    description:
      "WebGL-based procedural terrain using Gaussian noise + mesh generation; interactive camera + shading pipeline; focused on geometry + GPU rendering fundamentals.",
    iframe:
      '<iframe width="100%" height="300" src="//jsfiddle.net/bchauhan/vxoa2jzu/5/embedded/result/dark/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>',
    year: "2020",
    techUsed: "Three.js, WebGL, GLSL, Procedural Noise, Frustum Culling"
  },
  {
    id: 3,
    title: "Connect Four – AI Game",
    icon: website,
    description:
      "AI Connect-4 with two modes: MINIMAX (alpha–beta pruning) and a naïve baseline. Search space ~4.53T boards; demonstrates heuristic evaluation, pruning effectiveness, and game-tree search.",
    githubPath: "https://github.com/bhimeshchauhan/connect_four",
    demoPath: "https://codesandbox.io/s/connect-four-game-fq1oz?file=/src/App.js",
    year: "2019",
    techUsed: "React, Redux, Node.js, Minimax, Alpha–Beta Pruning, Heuristics, GitHub Actions"
  },
];
