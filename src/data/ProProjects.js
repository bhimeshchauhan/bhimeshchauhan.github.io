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
    id: 10,
    title: "Conway's Game of Life",
    icon: website,
    description:
      "Interactive cellular automaton simulation with preset seed patterns (Glider, Pulsar, Gosper Glider Gun, etc.), adjustable grid size and speed, manual cell toggling, and step-through mode. Canvas-rendered with glow effects.",
    iframe: '<iframe width="100%" height="600" src="/game-of-life" style="border:none;border-radius:4px" allowfullscreen></iframe>',
    githubPath: "https://github.com/bhimeshchauhan/bhimeshchauhan.github.io",
    year: "2025",
    techUsed: "React, Canvas API, Styled Components, Gatsby"
  },
  {
    id: 9,
    title: "Bhimesh’s RAG Resume Assistant",
    icon: rag,
    description:
      "Production RAG chatbot powering this portfolio. Embeds resume, goals, and site data into pgvector; retrieves top-k and prompts an LLM for grounded answers. CORS-safe, cost-aware, with Cohere embeddings and OpenRouter models.",
    githubPath: "https://github.com/bhimeshchauhan/bhimeshchauhan.github.io",
    demoPath: "https://bhimeshchauhan.github.io",
    year: "2025",
    techUsed:
      "Supabase Edge Functions, pgvector, Cohere embed-english-v3.0, OpenRouter (Mistral 7B), Node/TypeScript (Deno), React, DOMPurify, GitHub Pages, CI/CD"
  },
  {
    id: 8,
    title: "Medical LLM for Clinical Documentation (Scrubs Co-Pilot)",
    icon: Scrubs,
    description:
      "Specialized medical LLM for ambient listening, transcription, and structured chart generation. HIPAA-conscious RAG architecture; integrates with EHR systems and voice-based intake.",
    demoPath: "https://bhimeshchauhan.github.io",
    year: "2023–2024",
    techUsed: "OpenAI GPT-4, Whisper, Supabase, pgvector, React, Node.js, Twilio Voice, ElevenLabs, Docker, AWS"
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
    id: 4,
    title: "Sudoku AR + Deep Learning",
    icon: website,
    description:
      "End-to-end Sudoku solver: detects grid from camera frames, OCRs digits, and solves via backtracking. Built dataset + augmentation; model selection with Keras/TensorFlow.",
    media: [sudoku],
    year: "2020",
    techUsed: "Python, OpenCV, TensorFlow/Keras, Scikit-learn, Image Morphology, Backtracking, NumPy"
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
  {
    id: 2,
    title: "Forms App (Pitchly)",
    icon: website,
    description:
      "Schema-driven form builder used by financial/legal teams; GraphQL/REST data flows, role-based permissions, and autosave. Optimized queries and CDN caching for global users.",
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
      "Android IoT app to monitor/control high-pressure aeroponics. Telemetry + commands over MQTT/HTTP; backend dashboards, sensor charts, and ML-based growth recommendations.",
    media: [nebullam1, nebullam2, nebullam3, nebullam4, nebullam5],
    demoPath: "https://apkpure.com/nebullam/com.nebullam.nebullam",
    year: "2016–2017",
    techUsed: "Android (Java/Kotlin), MQTT, Django/Flask, TensorFlow, D3.js, WAMP, Nginx, Docker, Postgres"
  }
];
