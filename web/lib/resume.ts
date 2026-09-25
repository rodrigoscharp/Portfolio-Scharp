export type Role = {
  title: string;
  dates: string;
  bullets: string[];
  tech: string;
};

export type Job = {
  company: string;
  place: string;
  roles: Role[];
};

export const JOBS: Job[] = [
  {
    company: "Municipality of Ubatuba",
    place: "Ubatuba, São Paulo, Brazil",
    roles: [
      {
        title: "Project Manager",
        dates: "08/2026 - Present",
        bullets: [
          "Promoted to Project Manager after serving as Director of Technology and Innovation, now leading the planning, scheduling, and delivery of strategic technology projects for the Municipality of Ubatuba.",
          "Responsible for coordinating development teams and business stakeholders, ensuring continuity of digital systems serving 100,000+ citizens.",
        ],
        tech: "Project Management, Java, Spring Boot, REST APIs, Agile",
      },
      {
        title: "Director of Technology and Innovation",
        dates: "2026 - 08/2026",
        bullets: [
          "Led a development squad delivering 6+ government systems to production using Java and Spring Boot, modernizing public digital services for more than 100,000 citizens.",
          "Owned the full software delivery lifecycle: requirements gathering, architecture, development, and deployment.",
          "Won 2 national awards, including Smart City recognition for digital innovation in public administration.",
          "Implemented DevOps practices (Docker, CI/CD pipelines), reducing the department's release cycles.",
          "Led end-to-end integration of previously siloed municipal systems into a unified digital infrastructure, reducing manual cross-department processes and enabling real-time data sharing.",
          "Advised municipal leadership on technology strategy, digital transformation, and IT governance.",
        ],
        tech: "Java, Spring Boot, Docker, PostgreSQL, AWS, REST APIs, Agile",
      },
    ],
  },
  {
    company: "Muno App",
    place: "Ubatuba, São Paulo, Brazil",
    roles: [
      {
        title: "Founder & CTO",
        dates: "02/2025 - Present",
        bullets: [
          "Founded and built a food-tech startup from the ground up, leading product, engineering, and operations.",
          "Designed a 100% digital POS (point-of-sale) and menu management system, replacing traditional paper-based workflows.",
          "Developed the backend using Java and Spring Boot and managed cloud infrastructure on AWS.",
          "Defined the technical roadmap and led all engineering decisions for the platform.",
        ],
        tech: "Java, Spring Boot, AWS, Product Leadership, System Design",
      },
    ],
  },
  {
    company: "Prescon Assessoria",
    place: "Brazil (Remote)",
    roles: [
      {
        title: "Java Developer & Technical Consultant",
        dates: "2025 - 2026",
        bullets: [
          "Delivered Java software solutions and technical consulting for client systems.",
          "Provided architectural guidance and hands-on support for backend service development.",
        ],
        tech: "Java, Spring Boot, REST APIs, Technical Consulting",
      },
    ],
  },
  {
    company: "Bitwise Software Solutions",
    place: "Brazil",
    roles: [
      {
        title: "Software Developer",
        dates: "2023 - 2025",
        bullets: [
          "Designed and developed 30+ backend systems using Java and Spring Boot for multiple clients.",
          "Contributed to scalable REST APIs, database modeling (MySQL/PostgreSQL), and integration projects.",
          "Collaborated in Agile teams (Scrum), managing tasks via Jira and version control with Git.",
        ],
        tech: "Java, Spring Boot, MySQL, PostgreSQL, Git, Jira, Agile",
      },
    ],
  },
];

export const PROJECTS = [
  {
    name: "WalletCore - Digital Wallet REST API",
    repo: "github.com/rodrigoscharp/WalletCore",
    bullets: [
      "Production-grade digital wallet with fund transfers and double-entry accounting.",
      "Implemented JWT authentication, pessimistic locking for concurrency safety, and asynchronous notifications via RabbitMQ.",
    ],
    stack: "Java 21, Spring Boot 3, PostgreSQL, RabbitMQ, Redis, Docker",
  },
  {
    name: "Athena Matching Engine - Order Matching Engine",
    repo: "github.com/rodrigoscharp/Athena-Matching-Engine",
    bullets: [
      "High-performance order matching engine processing 100,000+ orders per second.",
      "Achieved p99 latency below 100 microseconds with a lock-free concurrency design.",
    ],
    stack: "Java 21, Spring Boot, Kafka, Redis, gRPC",
  },
  {
    name: "HelpNote AI - AI Note-Taking Assistant",
    repo: "github.com/rodrigoscharp/HelpNote_-IA",
    bullets: [
      "Assistant that transcribes lecture and event audio, extracts keywords, and generates AI-enriched summaries.",
    ],
    stack: "Java, Spring Boot, PostgreSQL, LLM integration",
  },
  {
    name: "BETO AI - Self-Hosted Personal Assistant",
    repo: "github.com/rodrigoscharp/BETO-IA",
    bullets: [
      "Voice-based personal assistant with Spotify, Google Calendar, and GitHub integrations, with no third-party subscriptions.",
    ],
    stack: "Next.js 14, TypeScript, Groq (LLaMA), ElevenLabs, Supabase",
  },
];

export const AWARDS = [
  {
    name: "Smart City Award",
    text: "National recognition for digital transformation and smart city initiatives at the Municipality of Ubatuba.",
  },
  {
    name: "Innovative City Award",
    text: "National recognition for innovation in public administration and technology-driven municipal governance.",
  },
];

export const SKILLS_GROUPS = [
  { label: "Programming Languages", items: ["Java 21", "TypeScript", "SQL"] },
  { label: "Frameworks & Libraries", items: ["Spring Boot 3", "Spring Security", "Spring Data JPA", "Next.js 14"] },
  { label: "Databases", items: ["PostgreSQL", "MySQL", "Redis"] },
  { label: "Messaging & Streaming", items: ["RabbitMQ", "Apache Kafka"] },
  { label: "Cloud & DevOps", items: ["AWS (CloudFront, ALB, ECS, API Gateway, Lambda)", "Docker", "CI/CD", "Portainer", "Tailscale"] },
  {
    label: "Architecture & Patterns",
    items: ["REST APIs", "Microservices", "Clean Architecture", "Double-Entry Ledger", "Lock-Free Concurrency", "Pessimistic Locking", "JWT"],
  },
  { label: "Project Management", items: ["Planning & Scheduling", "Stakeholder Management", "Agile (Scrum)"] },
  { label: "Tools", items: ["Git", "Jira", "Supabase", "Prisma", "Vercel"] },
  { label: "Artificial Intelligence", items: ["Groq (LLaMA)", "ElevenLabs TTS", "Web Speech API", "Generative AI Agents", "Claude Code"] },
];

export const EDUCATION = {
  degree: "Systems Analysis and Development",
  school: "UNICSUL, Universidade Cruzeiro do Sul",
  dates: "2023 - 2025",
  certs: [
    { name: "Java + Spring Boot Specialization", by: "Rocketseat", dates: "2024 - 2025" },
    { name: "Generative AI Agents: Transform Your Organization", by: "Google" },
    { name: "Claude Code in Action", by: "Anthropic" },
    { name: "AI Fluency", by: "Anthropic" },
    { name: "CS50: Introduction to Computer Science", by: "Harvard University" },
  ],
  languages: [
    { name: "Portuguese", level: "Native" },
    { name: "English", level: "Professional Proficiency" },
  ],
};

export const SUMMARY =
  "Software Engineer with 4+ years of experience designing and delivering production backend systems across the public sector, fintech, and food-tech. Strong background in distributed systems, messaging (RabbitMQ, Kafka), concurrency, and high-performance backends.";
