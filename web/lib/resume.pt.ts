import type { AWARDS, EDUCATION, Job, PROJECTS, SKILLS_GROUPS } from "@/lib/resume";

/* Portuguese copy of lib/resume.ts. Same facts; Athena's throughput and latency
   figures are stated as design targets. */

export const JOBS_PT: Job[] = [
  {
    company: "Prefeitura de Ubatuba",
    place: "Ubatuba, São Paulo, Brasil",
    roles: [
      {
        title: "Tech Lead",
        dates: "08/2026 - Atual",
        bullets: [
          "Promovido a Tech Lead após atuar como Diretor de Tecnologia e Inovação, sou responsável pela direção técnica, arquitetura e entrega das iniciativas estratégicas de engenharia da Prefeitura de Ubatuba.",
          "Lidero o squad de desenvolvimento na execução do dia a dia (code review, decisões de design e roadmap), garantindo a continuidade de sistemas digitais que atendem mais de 100.000 cidadãos.",
        ],
        tech: "Liderança Técnica, Java, Spring Boot, System Design, APIs REST, Agile",
      },
      {
        title: "Diretor de Tecnologia e Inovação",
        dates: "2026 - 08/2026",
        bullets: [
          "Liderei um squad de desenvolvimento que colocou mais de 6 sistemas de governo em produção com Java e Spring Boot, modernizando serviços públicos digitais para mais de 100.000 cidadãos.",
          "Fui responsável por todo o ciclo de entrega de software: levantamento de requisitos, arquitetura, desenvolvimento e deploy.",
          "Conquistei 2 prêmios nacionais, incluindo o reconhecimento Smart City por inovação digital na administração pública.",
          "Implantei práticas de DevOps (Docker, pipelines de CI/CD), encurtando os ciclos de release do departamento.",
          "Conduzi de ponta a ponta a integração de sistemas municipais antes isolados em uma infraestrutura digital unificada, reduzindo processos manuais entre secretarias e permitindo o compartilhamento de dados em tempo real.",
          "Assessorei a gestão municipal em estratégia de tecnologia, transformação digital e governança de TI.",
        ],
        tech: "Java, Spring Boot, Docker, PostgreSQL, AWS, APIs REST, Agile",
      },
    ],
  },
  {
    company: "Muno App",
    place: "Ubatuba, São Paulo, Brasil",
    roles: [
      {
        title: "Founder & CTO",
        dates: "02/2025 - Atual",
        bullets: [
          "Fundei e construí do zero uma startup de food-tech, liderando produto, engenharia e operações.",
          "Projetei um sistema 100% digital de PDV (ponto de venda) e gestão de cardápio, substituindo fluxos tradicionais em papel.",
          "Desenvolvi o back-end em Java e Spring Boot e gerenciei a infraestrutura em nuvem na AWS.",
          "Defini o roadmap técnico e liderei todas as decisões de engenharia da plataforma.",
        ],
        tech: "Java, Spring Boot, AWS, Liderança de Produto, System Design",
      },
    ],
  },
  {
    company: "Prescon Assessoria",
    place: "Brasil (Remoto)",
    roles: [
      {
        title: "Desenvolvedor Java e Consultor Técnico",
        dates: "2025 - 2026",
        bullets: [
          "Entreguei soluções de software em Java e consultoria técnica para sistemas de clientes.",
          "Dei orientação de arquitetura e suporte prático no desenvolvimento de serviços de back-end.",
        ],
        tech: "Java, Spring Boot, APIs REST, Consultoria Técnica",
      },
    ],
  },
  {
    company: "Bitwise Software Solutions",
    place: "Brasil",
    roles: [
      {
        title: "Desenvolvedor de Software",
        dates: "2023 - 2025",
        bullets: [
          "Projetei e desenvolvi mais de 30 sistemas de back-end em Java e Spring Boot para diversos clientes.",
          "Contribuí com APIs REST escaláveis, modelagem de banco de dados (MySQL/PostgreSQL) e projetos de integração.",
          "Atuei em times ágeis (Scrum), com gestão de tarefas no Jira e versionamento com Git.",
        ],
        tech: "Java, Spring Boot, MySQL, PostgreSQL, Git, Jira, Agile",
      },
    ],
  },
];

export const PROJECTS_PT: typeof PROJECTS = [
  {
    name: "WalletCore - API REST de Carteira Digital",
    repo: "github.com/rodrigoscharp/WalletCore",
    bullets: [
      "Carteira digital de nível de produção, com transferências e contabilidade de partidas dobradas.",
      "Autenticação JWT, pessimistic locking para segurança em concorrência e notificações assíncronas via RabbitMQ.",
    ],
    stack: "Java 21, Spring Boot 3, PostgreSQL, RabbitMQ, Redis, Docker",
  },
  {
    name: "Athena Matching Engine - Motor de Casamento de Ordens",
    repo: "github.com/rodrigoscharp/Athena-Matching-Engine",
    bullets: [
      "Motor de matching de ordens de alta performance, projetado para processar mais de 100.000 ordens por segundo.",
      "Concorrência lock-free projetada para latência p99 abaixo de 100 microssegundos.",
    ],
    stack: "Java 21, Spring Boot, Kafka, Redis, gRPC",
  },
  {
    name: "Orbz - Time de Agentes de IA Pessoais",
    repo: "github.com/rodrigoscharp/Orbz",
    bullets: [
      "Cinco agentes de IA, cada um dono de uma área (finanças, agenda, pesquisa, código, coordenação), conversando por voz, texto e Telegram dentro de uma sala 3D.",
      "Integra Google Calendar, Gmail, Spotify, GitHub e tarefas do Claude Code, cada uma rodando em branch e worktree isolados.",
    ],
    stack: "Next.js 15, TypeScript, three.js, Claude, Supabase, Telegram Bot API",
  },
];

export const AWARDS_PT: typeof AWARDS = [
  {
    name: "Prêmio Smart City",
    text: "Reconhecimento nacional pelas iniciativas de transformação digital e cidade inteligente da Prefeitura de Ubatuba.",
  },
  {
    name: "Prêmio Cidade Inovadora",
    text: "Reconhecimento nacional por inovação na administração pública e gestão municipal orientada por tecnologia.",
  },
];

export const SKILLS_GROUPS_PT: typeof SKILLS_GROUPS = [
  { label: "Linguagens de Programação", items: ["Java 21", "TypeScript", "SQL"] },
  { label: "Frameworks e Bibliotecas", items: ["Spring Boot 3", "Spring Security", "Spring Data JPA", "Next.js 14"] },
  { label: "Bancos de Dados", items: ["PostgreSQL", "MySQL", "Redis"] },
  { label: "Mensageria e Streaming", items: ["RabbitMQ", "Apache Kafka"] },
  { label: "Cloud e DevOps", items: ["AWS (CloudFront, ALB, ECS, API Gateway, Lambda)", "Docker", "CI/CD", "Portainer", "Tailscale"] },
  {
    label: "Arquitetura e Padrões",
    items: ["APIs REST", "Microsserviços", "Clean Architecture", "Ledger de Partidas Dobradas", "Concorrência Lock-Free", "Pessimistic Locking", "JWT"],
  },
  { label: "Gestão de Projetos", items: ["Planejamento e Cronograma", "Gestão de Stakeholders", "Agile (Scrum)"] },
  { label: "Ferramentas", items: ["Git", "Jira", "Supabase", "Prisma", "Vercel"] },
  { label: "Inteligência Artificial", items: ["Groq (LLaMA)", "ElevenLabs TTS", "Web Speech API", "Agentes de IA Generativa", "Claude Code"] },
];

export const EDUCATION_PT: typeof EDUCATION = {
  degree: "Análise e Desenvolvimento de Sistemas",
  school: "UNICSUL, Universidade Cruzeiro do Sul",
  dates: "2023 - 2025",
  certs: [
    { name: "Especialização Java + Spring Boot", by: "Rocketseat", dates: "2024 - 2025" },
    { name: "Generative AI Agents: Transform Your Organization", by: "Google" },
    { name: "Claude Code in Action", by: "Anthropic" },
    { name: "AI Fluency", by: "Anthropic" },
    { name: "CS50: Introduction to Computer Science", by: "Harvard University" },
  ],
  languages: [
    { name: "Português", level: "Nativo" },
    { name: "Inglês", level: "Proficiência Profissional" },
  ],
};

export const SUMMARY_PT =
  "Engenheiro de Software com mais de 4 anos de experiência projetando e entregando sistemas de back-end em produção no setor público, em fintech e em food-tech. Base sólida em sistemas distribuídos, mensageria (RabbitMQ, Kafka), concorrência e back-ends de alta performance.";
