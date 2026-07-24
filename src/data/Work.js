import dr from "../assets/images/experience/bhimesh/datarobot.png";
import pitchly from "../assets/images/experience/bhimesh/pitchly.png";
import nebullam from "../assets/images/experience/bhimesh/nebullam.png";
import preply from "../assets/images/experience/bhimesh/preply.png";
import micromart from "../assets/images/experience/bhimesh/micromart.png";
import benchsci from "../assets/images/experience/bhimesh/benchsci.png";
import scrubs from "../assets/images/experience/bhimesh/scrubs.png";
import rareDays from "../assets/images/experience/bhimesh/raredays.png";

export default [
  {
    id: 0,
    name: "Rare Days",
    designation: "Lead Software Engineer",
    dated: "Jan 2026 – Present",
    logo: rareDays,
    description:
      'Architected and built a multi-tenant SaaS platform with a production RAG chatbot, owning the system from retrieval architecture through backend delivery and reliable releases.<br/><br/>' +
      '● Built the RAG pipeline and chatbot experience, improving retrieval quality for customer-facing AI capabilities.<br/>' +
      '● Designed the multi-tenant SaaS architecture, including backend infrastructure and role-aware access controls.<br/>' +
      '● Delivered 10+ CI improvements that strengthened release quality and platform reliability.<br/>' +
      '● Mentored a junior engineer and created reusable AI capabilities for other Rare Days projects.<br/>' +
      '**Key Skills:** RAG architecture, LLM chatbots, multi-tenant SaaS, backend infrastructure, access control, CI/CD, technical leadership.'
  },
  {
    id: 1,
    name: "Scrubs Co-Pilot",
    designation: "Founder and CTO",
    dated: "Aug 2025 – Dec 2025",
    logo: scrubs,
    companyLink: "https://scrubscopilot.com/",
    description:
      'Founded and led all engineering for an ambient clinical AI platform that structures doctor–patient conversations into medical documentation.<br/><br/>' +
      '● Architected LLM and RAG workflows for real-time transcription and structured note generation, reducing clinician documentation time by about 80%.<br/>' +
      '● Designed the application, data, and infrastructure foundation for an end-to-end clinical workflow rather than a standalone model demonstration.<br/>' +
      '● Set the technical roadmap from MVP through production, balancing clinical workflow quality, security, and reliability.<br/>' +
      '● Worked with clinicians to validate outputs and guide the evolution of the AI system.<br/>' +
      '● Owned engineering leadership across infrastructure, data security, and technical execution.<br/>' +
      '**Key Skills:** Healthcare AI, LLM systems, RAG architecture, full-stack engineering, technical leadership.'
  },
  {
    id: 2,
    name: "BenchSci",
    designation: "Lead AI and Full-Stack Engineer",
    dated: "Apr 2025 – Aug 2025",
    logo: benchsci,
    companyLink: "https://www.benchsci.com/",
    description:
      'Led AI data-platform engineering for biomedical research workflows, turning unstructured scientific evidence into reliable, model-ready data.<br/><br/>' +
      '● Built AI-driven pipelines processing 100K+ research artifacts into structured datasets.<br/>' +
      '● Designed RAG workflows that gave scientific teams an LLM-powered path to literature synthesis and discovery.<br/>' +
      '● Reduced manual data curation by about 60% by standardizing AI-assisted extraction and validation workflows.<br/>' +
      '● Developed Neo4j and PostgreSQL query paths for interconnected biological entities and research metadata.<br/>' +
      '● Established data reliability, lineage, and auditability practices across engineering, science, and ML teams.<br/>' +
      '**Key Skills:** RAG architecture, LLMs, Neo4j (Cypher), PostgreSQL, AI data pipelines, API design.'
  },
  {
    id: 3,
    name: "MicroMart",
    designation: "Senior Full-Stack Software Engineer",
    dated: "Jun 2023 – Apr 2025",
    logo: micromart,
    companyLink: "https://www.kitchenmate.com/",
    description:
      'Built and operated distributed software for smart food kiosks, spanning device management, payments, operations, and inventory workflows.<br/><br/>' +
      '● Built real-time operational interfaces with React, Node.js, and WebSockets for visibility into distributed kiosk activity.<br/>' +
      '● Implemented Modbus RS485 integrations in Python and Node.js to connect cloud services with embedded hardware over TCP and serial protocols.<br/>' +
      '● Improved database query performance by about 25%, reduced downtime by about 30%, and reduced bug reports by about 40%.<br/>' +
      '● Delivered production payment workflows and supported payment-certification work alongside device and cloud integrations.<br/>' +
      '**Key Skills:** Distributed systems, IoT platforms, payments, embedded integrations, React, Node.js, Python.'
  },
  {
    id: 4,
    name: "Preply",
    designation: "Senior Full-Stack Software Engineer",
    dated: "Oct 2020 – Jun 2023",
    logo: preply,
    companyLink: "https://www.preply.com/",
    description:
      'Built personalization and analytics capabilities for a global language-learning marketplace serving 80K+ learners.<br/><br/>' +
      '● Led a cross-functional team delivering student progress-tracking and feedback capabilities for 80K learners.<br/>' +
      '● Used customer interviews to shape scalable experiments and personalization releases around learner needs.<br/>' +
      '● Built NLP-driven personalization that increased engagement by 20% and satisfaction by 15%.<br/>' +
      '● Ran tests and product analysis across markets that contributed to a sustained 5% increase in conversion.<br/>' +
      '**Key Skills:** Personalization platforms, NLP, experimentation, React, Django, Python, SQL.'
  },
  {
    id: 5,
    name: "DataRobot",
    designation: "Full-Stack Software Engineer",
    dated: "Jul 2019 – May 2020",
    logo: dr,
    companyLink: "https://www.datarobot.com/",
    description:
      'Built enterprise integrations that connected AutoML workflows to customer data and analytics tools.<br/><br/>' +
      '● Integrated DataRobot with Excel, Snowflake, Tableau, and Alteryx, increasing partner visibility by 70%.<br/>' +
      '● Delivered integrations with C#, JDBC, Vue, Python/Django, React, and Python/Flask across customer-facing workflows.<br/>' +
      '● Built custom Jenkins and Kibana CI/CD tooling to make ML-backed releases repeatable and dependable.<br/>' +
      '● Prototyped Android remote-control flows for an ML-model proof of concept.<br/>' +
      '**Key Skills:** AutoML platforms, enterprise integrations, React, Snowflake, CI/CD.'
  },
  {
    id: 6,
    name: "Pitchly",
    designation: "Full-Stack Software Developer",
    dated: "Jul 2018 – Jul 2019",
    logo: pitchly,
    companyLink: "https://www.pitchly.com/",
    description:
      'Built SaaS applications for financial and legal teams with an emphasis on complex client workflows and practical data access.<br/><br/>' +
      '● Designed and built MVC-based Node.js REST APIs for high-throughput client workflows, adhering to OWASP and HIPAA requirements.<br/>' +
      '● Developed two GraphQL-powered MeteorJS applications for financial and legal customers.<br/>' +
      '● Automated client intake and pitch-deck generation through full-stack application workflows.<br/>' +
      '**Key Skills:** Node.js, GraphQL, MeteorJS, SaaS architecture.'
  },
  {
    id: 7,
    name: "Nebullam",
    designation: "Android Software Developer and Data Scientist",
    dated: "May 2017 – Aug 2019",
    logo: nebullam,
    companyLink: "https://www.nebullam.com/",
    description:
      'Built software for connected aeroponics systems, combining Android control surfaces, device telemetry, and data-science workflows.<br/><br/>' +
      '● Built an Android application to monitor and control high-pressure aeroponics firmware through MQTT.<br/>' +
      '● Connected telemetry and remote-control flows to backend services for system monitoring and operation.<br/>' +
      '● Developed PyTorch and TensorFlow neural-network models for resource prediction and plant-growth automation, increasing crop yield by 20%.<br/>' +
      '**Key Skills:** Android, IoT systems, MQTT, TensorFlow, data science.'
  }
];
