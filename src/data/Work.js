import dr from "../assets/images/experience/bhimesh/datarobot.png";
import pitchly from "../assets/images/experience/bhimesh/pitchly.png";
import sodima from "../assets/images/experience/bhimesh/sodima.png";
import nebullam from "../assets/images/experience/bhimesh/nebullam.png";
import solum from "../assets/images/experience/bhimesh/solum.png";
import preply from "../assets/images/experience/bhimesh/preply.png";
import micromart from "../assets/images/experience/bhimesh/micromart.png";
import benchsci from "../assets/images/experience/bhimesh/benchsci.png";

export default [
  {
    id: 0,
    name: "BenchSci Inc.",
    designation: "Senior Software Engineer",
    dated: "Apr 2025 – Aug 2025",
    logo: benchsci,
    companyLink: "https://www.benchsci.com/",
    description:
      '● Designed and implemented secure API endpoints to integrate a Retrieval-Augmented Generation (RAG) pipeline with BenchSci’s biomedical research database, enabling LLM-powered literature synthesis for scientists.<br/>' +
      '● Authored complex Cypher queries in Neo4j and optimized SQL queries (PostgreSQL) for efficient retrieval of interconnected biological entities and research metadata.<br/>' +
      '● Developed reusable, accessible UI components in React (TypeScript) following WCAG and company design system standards, ensuring consistent user experience across applications.<br/>' +
      '● Initiated and led the implementation of interactive data visualizations using Cytoscape.js, allowing scientists to explore biological relationships and pathways in real-time.<br/>' +
      '● Collaborated in an Agile environment, conducting code reviews, participating in architectural discussions, and integrating with CI/CD workflows.<br/>' +
      '**Key Skills:** RAG architecture, Neo4j (Cypher), PostgreSQL, React, TypeScript, Cytoscape.js, Data visualization, API design, Agile methodology.'
  },
  {
    id: 1,
    name: "MicroMart / KitchenMate Inc.",
    designation: "Senior Full Stack Software Engineer",
    dated: "",
    logo: micromart,
    companyLink: "https://www.kitchenmate.com/",
    description:
      '● Developed an interactive real-time operations dashboard using React, Node.js, and WebSockets to monitor and manage IoT-connected kiosks, improving operational efficiency by 30%.<br/>' +
      '● Built Modbus RS485 protocol clients in Python and Node.js to interface with smart fridges, integrating low-level hardware via TCP sockets and serial communication.<br/>' +
      '● Led certification and integration of Heartland Payment Systems, ensuring PCI-DSS compliance; implemented secure payment flows with tokenization.<br/>' +
      '● Coordinated API integrations with external vendors using REST/JSON, Postman, and Swagger, ensuring interoperability and uptime.<br/>' +
      '**Key Skills:** IoT integration, Embedded protocols, Payment processing, Secure API design, WebSockets, Node.js, React, Docker, PCI compliance.'
  },
  {
    id: 2,
    name: "Preply Inc.",
    designation: "Senior Full Stack Software Engineer",
    dated: "",
    logo: preply,
    companyLink: "https://www.preply.com/",
    description:
      '● Developed a scalable React/TypeScript frontend integrated with a Python/Django backend to connect students and tutors globally.<br/>' +
      '● Designed and executed progressive A/B tests using Optimizely and internal experimentation platforms, improving Net Satisfaction Score (NSS) across multiple markets.<br/>' +
      '● Analyzed test data using Python (Pandas, NumPy) and SQL, influencing product release decisions in different geographies.<br/>' +
      '● Collaborated in Agile teams, using Jira, GitHub Actions CI/CD pipelines, and code reviews to deliver features on a bi-weekly cadence.<br/>' +
      '**Key Skills:** React, TypeScript, Django, PostgreSQL, A/B testing, Data analytics, Experimentation platforms, Agile methodology, CI/CD.'
  },
  {
    id: 3,
    name: "DataRobot Inc.",
    designation: "Full Stack Software Engineer",
    dated: "",
    logo: dr,
    companyLink: "https://www.datarobot.com/",
    description:
      '● Built React-based frontends interfacing with MSSQL, Amazon Redshift, and Snowflake via REST APIs and secure authentication flows.<br/>' +
      '● Integrated DataRobot AutoML platform with third-party tools such as Microsoft Excel (via COM add-ins), Tableau, and Snowflake, enabling frictionless ML model deployment.<br/>' +
      '● Implemented automated testing pipelines using Jenkins, Jest, and Cypress to ensure release stability.<br/>' +
      '**Key Skills:** React, MSSQL, Amazon Redshift, Snowflake, Tableau, Jenkins, API integration, AutoML, Data visualization.'
  },
  {
    id: 4,
    name: "Pitchly Inc.",
    designation: "Applications Engineer",
    dated: "",
    logo: pitchly,
    companyLink: "https://www.pitchly.com/",
    description:
      '● Designed an MVC-based Node.js application with RESTful APIs to process complex client requests in a high-availability SaaS environment.<br/>' +
      '● Developed two MeteorJS applications consuming GraphQL endpoints, improving data workflows for financial and legal clients.<br/>' +
      '**Key Skills:** Node.js, GraphQL, MeteorJS, REST APIs, SaaS application architecture, MongoDB, API security.'
  },
  {
    id: 5,
    name: "Nebullam Inc.",
    designation: "Android Application Engineer & Data Scientist",
    dated: "",
    logo: nebullam,
    companyLink: "https://www.nebullam.com/",
    description:
      '● Built an Android IoT application (Java/Kotlin) to remotely monitor and control aeroponics systems, integrating with IoT sensors over MQTT.<br/>' +
      '● Developed a TensorFlow-based neural network to optimize plant growth parameters, automating nutrient and lighting schedules, increasing yield and supporting investor pitches.<br/>' +
      '**Key Skills:** Android (Java/Kotlin), IoT integration, MQTT, TensorFlow, Neural networks, Predictive analytics, Agriculture tech.'
  },
  {
    id: 6,
    name: "Sodima Solutions",
    designation: "Full Stack Software Engineer",
    dated: "",
    logo: sodima,
    companyLink: "https://www.sodimasolutions.com/",
    description:
      '● Processed and visualized 3 million agricultural landmass datasets using MeteorJS and D3.js, deploying on Nginx with Docker containers.<br/>' +
      '● Designed MVP architecture with GraphQL APIs powering an NLP chatbot prototype, leveraging Node.js and MongoDB.<br/>' +
      '**Key Skills:** MeteorJS, D3.js, GraphQL, Node.js, MongoDB, Data visualization, NLP prototypes, Docker, Nginx.'
  },
  {
    id: 7,
    name: "Solum Labs - Climate Corporation",
    designation: "Full Stack Software Engineer",
    dated: "",
    logo: solum,
    companyLink: "https://climate.com/",
    description:
      '● Redesigned an MVC model to integrate NFC readers for rapid, error-free nutrient testing, scaling throughput to 1,500 soil samples/day.<br/>' +
      '● Built a high-speed API for plasma spectrometer control using WAMP, Crossbar.io, D3.js, and Leaflet.js for real-time visualization of 180 samples/hour.<br/>' +
      '**Key Skills:** NFC integration, WAMP, Crossbar.io, D3.js, Leaflet.js, API design, Real-time data visualization.'
  }
];
