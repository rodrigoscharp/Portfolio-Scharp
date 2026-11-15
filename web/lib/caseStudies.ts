/* Long-form case studies served at /work/[slug]. Facts come from each
   project's README; keep them in sync when a project changes. */

export type ArchNode = {
  id: string;
  label: string;
  sub: string;
  /** Shown in the side panel when the node is hovered or tapped. */
  detail: string;
  /** Top-left corner in the 1000 x 600 diagram space. */
  x: number;
  y: number;
  kind?: "client" | "edge" | "core" | "data" | "external" | "job";
};

export type ArchEdge = { from: string; to: string; label?: string; dashed?: boolean };

export type CaseStudy = {
  slug: string;
  name: string;
  logo?: string;
  accent: string;
  tagline: string;
  role: string;
  period: string;
  stack: string[];
  problem: string[];
  arch: { nodes: ArchNode[]; edges: ArchEdge[]; caption: string };
  decisions: { title: string; body: string }[];
  numbers: { value: string; label: string }[];
  hindsight: string;
  image?: string;
  live?: string;
  repo?: string;
};

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "muno",
    name: "Muno",
    logo: "/images/logos/muno-wordmark.png",
    accent: "#c4521e",
    tagline: "One deploy, every restaurant: a multi-tenant POS, digital menu and delivery platform.",
    role: "Founder & CTO · sole engineer",
    period: "02/2025 - Now",
    stack: ["Next.js 16", "React 19", "TypeScript", "Prisma 6", "PostgreSQL 17", "Supabase Realtime", "NextAuth v5", "Vercel (gru1)"],
    problem: [
      "Small restaurants run on paper tickets, a WhatsApp number and a delivery app that keeps a cut of every order.",
      "Muno puts the whole restaurant in one URL: menu, QR ordering at the table, kitchen board, rider tracking and payments that land straight in the owner's own gateway. Muno is never part of the money flow.",
    ],
    arch: {
      caption: "Every request is resolved to a tenant at the edge, and every query below it is scoped automatically.",
      nodes: [
        { id: "guest", label: "Diner / Owner", sub: "<slug>.munoapp.com.br", x: 10, y: 40, kind: "client", detail: "Each restaurant lives on its own subdomain. The root domain only serves the landing page, and a test proves it never even queries the tenant table." },
        { id: "proxy", label: "proxy.ts", sub: "tenant from subdomain", x: 280, y: 40, kind: "edge", detail: "Resolves the tenant on every request and injects x-tenant-id and x-tenant-plano. A missing or unknown plan falls back to the cheapest one, so a paid feature never unlocks by omission. The proxy never talks to the database." },
        { id: "app", label: "Next.js 16 app", sub: "RSC + API routes", x: 550, y: 40, kind: "core", detail: "Menu, checkout, table QR, owner panel, kitchen KDS, rider app and the platform CRM, all in one codebase. 1,749 Vitest tests." },
        { id: "prisma", label: "Prisma extension", sub: "auto tenantId scope", x: 550, y: 220, kind: "core", detail: "Injects tenantId into the where clause of every operation. Forgetting it cannot leak another restaurant's data, because there is no way to forget it. A test reads schema.prisma and fails when a new model is missing from the scoped list." },
        { id: "pg", label: "PostgreSQL 17", sub: "RLS on every public table", x: 550, y: 400, kind: "data", detail: "Row Level Security is the lock against the public Supabase key that ships in every menu bundle. 24 models, 18 migrations, RLS included." },
        { id: "rt", label: "Realtime", sub: "per-tenant Broadcast", x: 820, y: 220, kind: "external", detail: "The server publishes after each relevant write; browsers subscribe and fetch the content through the protected API. The old postgres_changes subscriptions read tables with the anon key and were removed." },
        { id: "kds", label: "Kitchen & Rider", sub: "KDS board · GPS", x: 820, y: 40, kind: "client", detail: "Kanban kitchen board updated in real time with a 30 s polling safety net. Accepting a delivery is atomic: two riders never leave for the same order." },
        { id: "pay", label: "Owner's gateway", sub: "MP · Asaas · Stripe…", x: 10, y: 400, kind: "external", detail: "Each restaurant connects its own gateway. Credentials are validated against the provider before saving and stored with AES-256-GCM. A new gateway is one file implementing PaymentProvider." },
        { id: "hook", label: "Tenant webhook", sub: "/webhook/[gw]/[tenant]", x: 280, y: 400, kind: "edge", detail: "The URL is public and authenticates nothing; each call is verified with that merchant's own signature." },
        { id: "cron", label: "Daily job · 9h UTC", sub: "billing · dunning · funnel", x: 820, y: 400, kind: "job", detail: "Generates the month's invoices, runs the dunning ladder and rolls the 90-day raw funnel events into daily counts in the same transaction. Overdue never takes the storefront down: only the management panel closes." },
      ],
      edges: [
        { from: "guest", to: "proxy", label: "HTTPS" },
        { from: "proxy", to: "app", label: "x-tenant-id" },
        { from: "app", to: "prisma" },
        { from: "prisma", to: "pg", label: "scoped SQL" },
        { from: "app", to: "rt", label: "publish after write" },
        { from: "rt", to: "kds", label: "notify" },
        { from: "app", to: "kds", label: "fetch via API", dashed: true },
        { from: "app", to: "pay", label: "charge", dashed: true },
        { from: "pay", to: "hook", label: "signed event" },
        { from: "hook", to: "prisma" },
        { from: "cron", to: "pg" },
      ],
    },
    decisions: [
      { title: "The right tool, not my favorite one", body: "Java and Spring on AWS are my specialty, and what I lead at work. Muno needed something else: one TypeScript codebase for the menu, kitchen, rider app and CRM, one deploy serving every restaurant, running serverless in São Paulo. Picking the stack for the product, not for the résumé, is part of the job." },
      { title: "Isolation in three layers that do different jobs", body: "The Prisma extension separates one restaurant from another. RLS in Postgres locks out the public key. Tests that read the schema catch the model someone forgot. Each layer covers a failure the others cannot." },
      { title: "The money never passes through Muno", body: "Restaurants plug in their own gateway and receive directly. It removes Muno from the financial-intermediation business, and with it a whole class of regulatory and reconciliation risk." },
      { title: "Analytics can never break a sale", body: "Every browser event is keepalive without await, and every server event goes through a function that never throws. If instrumentation fails, the sale still happens and only the number is lost." },
      { title: "404 instead of 403", body: "Where a 403 would confirm that a resource exists in another tenant, the API answers 404. A session from another tenant is treated as logged out." },
      { title: "Dev can't touch production", body: "A guard script aborts migrate, push, reset and even npm run dev unless the database is localhost. It exists because a reset in the wrong place was one prompt away." },
    ],
    numbers: [
      { value: "120+", label: "restaurants on one deploy" },
      { value: "1,749", label: "automated tests" },
      { value: "5", label: "payment gateways behind one interface" },
      { value: "24", label: "data models, all tenant-scoped or RLS-locked" },
    ],
    hindsight: "I would have put the tenant scoping in the data layer from the first commit instead of adding it after the first restaurants went live. Retrofitting isolation meant auditing every query by hand once; now a test does it on every build.",
    image: "/images/muno-desktop.jpg",
    live: "https://munoapp.com.br",
  },
  {
    slug: "myhub",
    name: "MyHub",
    logo: "/images/logos/myhub-app.svg",
    accent: "#0b0b0d",
    tagline: "A productivity SaaS that runs a whole routine in one place, and that AI agents can read and write.",
    role: "Founder · sole engineer",
    period: "2026",
    stack: ["Next.js 16", "React 19", "TypeScript", "Drizzle ORM", "Neon Postgres", "TanStack Query", "Vercel Blob", "Web Push"],
    problem: [
      "Finance in one app, workouts in another, study notes in a third: none of them talk, and none of them answer \"how is my day going?\".",
      "MyHub joins eight modules (finance, studies, goals, routine, workouts, projects, content and job applications) behind one \"Today\" dashboard. It installs on the phone like a native app, and a voice assistant can query and log data through token-protected service routes.",
    ],
    arch: {
      caption: "One owner_id on every row and every query: the boundary is enforced in data, not in screens.",
      nodes: [
        { id: "pwa", label: "PWA", sub: "installed on the phone", x: 10, y: 60, kind: "client", detail: "Installable, opens without browser chrome, with an offline page and push notifications through VAPID." },
        { id: "agents", label: "Orbz agents", sub: "voice · Telegram", x: 10, y: 380, kind: "client", detail: "My AI agents read and log data (spending, workouts, tasks) through dedicated service routes, each guarded by its own token, with read and write separated." },
        { id: "mw", label: "Middleware", sub: "session · 401 · suspension", x: 280, y: 60, kind: "edge", detail: "Blocks every route: a page without a session goes to login, an API call gets 401, and a suspended account loses access immediately." },
        { id: "svc", label: "Service routes", sub: "token-scoped", x: 280, y: 380, kind: "edge", detail: "Separate tokens for reading and writing, so a leaked read token cannot change data." },
        { id: "app", label: "Next.js 16", sub: "8 modules + Today", x: 550, y: 220, kind: "core", detail: "Finance, Studies, Goals, Routine, Workouts, Projects, Content and Applications, plus the unified Today dashboard. TanStack Query on the client, Zod at the edges." },
        { id: "db", label: "Neon Postgres", sub: "Drizzle · owner_id", x: 820, y: 60, kind: "data", detail: "Every row has an owner and every query filters by it. Migrations are rehearsed against a copy before they run." },
        { id: "blob", label: "Vercel Blob", sub: "project images", x: 820, y: 380, kind: "external", detail: "Images for projects and learning tracks." },
        { id: "bill", label: "Asaas", sub: "subscriptions", x: 820, y: 220, kind: "external", detail: "Low-ticket subscription billing, tested end to end against the sandbox." },
      ],
      edges: [
        { from: "pwa", to: "mw" },
        { from: "agents", to: "svc", label: "token" },
        { from: "mw", to: "app" },
        { from: "svc", to: "app" },
        { from: "app", to: "db", label: "WHERE owner_id" },
        { from: "app", to: "blob" },
        { from: "app", to: "bill", dashed: true },
      ],
    },
    decisions: [
      { title: "Business dates are calendar days, not instants", body: "They travel as \"YYYY-MM-DD\" and the arithmetic runs in UTC. Vercel runs in UTC: after 9 pm in Brasília a bare new Date() is already tomorrow, and \"Today\" would silently show the wrong day and break streaks. The rule lives in one module and tests run with TZ=UTC." },
      { title: "Money is always integer cents", body: "Never floating point, anywhere in the stack." },
      { title: "Recurring entries are materialized", body: "Twelve installments become twelve rows at creation time, not a rule evaluated later. It is a legacy of the local-first version, kept because it simplifies everything downstream." },
      { title: "Tests on the logic that hurts to get wrong", body: "Habit streaks, goal progress, recurrence, kanban moves and date arithmetic are unit tested; smoke scripts exercise the API against a real database, creating and cleaning their own data." },
    ],
    numbers: [
      { value: "8", label: "modules behind one dashboard" },
      { value: "36", label: "smoke scripts against a real database" },
      { value: "1", label: "data boundary: owner_id on every row" },
    ],
    hindsight: "It started local-first and single-user. Moving to accounts meant adding an owner to every table; designing for multiple owners from day one would have saved that migration.",
    image: "/images/myhub-desktop-app.jpg",
    live: "https://usemyhub.com",
  },
  {
    slug: "campo",
    name: "Campo",
    logo: "/images/logos/campo-app.svg",
    accent: "#1d2a1f",
    tagline: "A virtual field consultant that tells franchise networks where each store leaves money on the table.",
    role: "Co-founder · architecture & engineering",
    period: "2026 · startup",
    stack: ["Java 21", "Spring Boot 4", "JDBC", "Flyway", "PostgreSQL", "Next.js 15", "Docker", "Caddy"],
    problem: [
      "Franchise networks rely on field consultants who visit store by store to find out why one sells less than the others. Each consultant covers few stores, the visit comes late and the diagnosis depends on who visited.",
      "Campo does that work every day for every store: it compares each one with stores of the same profile, points out what is off, estimates what it costs per month and recommends what the best stores do differently. Then it measures whether the action worked.",
    ],
    arch: {
      caption: "The diagnosis engine is pure Java with no database and no Spring, so it can be tested like a math function.",
      nodes: [
        { id: "pos", label: "POS connector", sub: "X-Api-Key · idempotent", x: 10, y: 60, kind: "client", detail: "Authenticated by the network's key and idempotent by source + externalId, with discounts and cancellations. Re-sending the same order never double counts." },
        { id: "sheet", label: "Spreadsheets", sub: "sales · reviews", x: 10, y: 380, kind: "client", detail: "For networks without an integration: sales by item and reviews from Google, iFood or their own survey. Re-importing the same file never duplicates." },
        { id: "api", label: "Spring Boot 4 API", sub: "Java 21 · JDBC · Flyway", x: 280, y: 220, kind: "core", detail: "Modules for network, sales, diagnosis, actions, goals, visits, usage and tenants. Plain JDBC and Flyway migrations." },
        { id: "agg", label: "Aggregates", sub: "by hour and category", x: 550, y: 60, kind: "data", detail: "Orders are rolled into hourly and category aggregates, so the engine reads a small table instead of every order." },
        { id: "engine", label: "Diagnosis engine", sub: "pure Java · MAD", x: 550, y: 220, kind: "core", detail: "Each store versus stores of the same profile (mall with mall, street with street). A finding needs to be below the median by a relative margin and outside the group's dispersion (MAD). Impact = half the distance to the median times the store's volume." },
        { id: "pg", label: "PostgreSQL", sub: "one network per tenant", x: 550, y: 380, kind: "data", detail: "Each franchisor is an isolated network with its own stores, actions, commercial terms and integrations." },
        { id: "panel", label: "Next.js 15 panel", sub: "3 roles, 3 views", x: 820, y: 220, kind: "client", detail: "Three roles: the franchisor sees the whole network, the consultant sees their portfolio, the franchisee sees only their own stores. Charts are hand-written SVG." },
        { id: "actions", label: "Action plan", sub: "before / after measured", x: 820, y: 380, kind: "job", detail: "Each recommendation becomes an action with an owner and a deadline. Campo records the metric before, measures it after, and adds up the money recovered." },
      ],
      edges: [
        { from: "pos", to: "api", label: "orders" },
        { from: "sheet", to: "api", label: "import" },
        { from: "api", to: "agg" },
        { from: "agg", to: "engine", label: "4 wk vs 4 wk" },
        { from: "api", to: "pg" },
        { from: "engine", to: "panel", label: "findings + R$/month" },
        { from: "panel", to: "actions" },
        { from: "actions", to: "pg", dashed: true },
      ],
    },
    decisions: [
      { title: "Robust statistics, not averages", body: "Median and MAD instead of mean and standard deviation: one outlier store cannot drag the benchmark and hide or invent a problem." },
      { title: "Compare like with like", body: "Stores are compared only within their profile. A street store is never told it underperforms a mall store." },
      { title: "The window ends yesterday", body: "The analysis window ends on the last complete day, so today's half-finished sales never pull the averages down. A new store is compared only on the days it sold." },
      { title: "The engine proves itself", body: "A simulated network with planted problems runs with 5 seeds; the test demands that all 13 planted problems are found, with at most 1 false alarm and no healthy store flagged as a priority." },
    ],
    numbers: [
      { value: "13/13", label: "planted problems found across 5 seeds" },
      { value: "≤ 1", label: "false alarm allowed per run" },
      { value: "3", label: "roles with their own view of the network" },
    ],
    hindsight: "Keeping the engine free of the database and the framework was the best call of the project. The next step is to run it incrementally as orders arrive instead of once a day.",
    image: "/images/campo-desktop-app.jpg",
  },
  {
    slug: "pixlab",
    name: "PixLab",
    accent: "#0b1220",
    tagline: "A chaos lab that proves every cent of a Pix or boleto payment is credited exactly once.",
    role: "Author",
    period: "2025",
    stack: ["Java 25", "Spring Boot 4.1", "Spring Batch 6", "PostgreSQL 16", "RabbitMQ 4", "Testcontainers", "jqwik", "OpenTelemetry", "k6"],
    problem: [
      "Payment providers notify merchants asynchronously, and in production those notifications arrive twice, late, out of order, forged or never.",
      "PixLab pairs a fake PSP with a deterministic chaos engine and a reference merchant that does it right: idempotent ingestion, a pure state machine, a double-entry ledger and automated reconciliation. Every failure mode is a reproducible test.",
    ],
    arch: {
      caption: "One way in: webhooks, polling, reconciliation repairs and CNAB records all go through the same inbox.",
      nodes: [
        { id: "chaos", label: "Chaos engine", sub: "seed + e2eId + scenario", x: 10, y: 60, kind: "job", detail: "Every decision derives from the seed, so a failing run prints its seed and replays exactly." },
        { id: "psp", label: "PSP simulator", sub: "Pix API · boleto bank", x: 10, y: 220, kind: "external", detail: "A fake PSP inspired by the Central Bank Pix API, plus a boleto bank that emits CNAB 240 return files." },
        { id: "disp", label: "Dispatcher", sub: "webhooks · retry", x: 10, y: 380, kind: "external", detail: "Delivers duplicated, delayed, reordered, lost and forged webhooks on purpose. It used to deadlock holding row locks across HTTP; now it uses a short lease and no transaction around the call." },
        { id: "in", label: "Webhook endpoint", sub: "HMAC · fast ack", x: 280, y: 380, kind: "edge", detail: "HMAC-SHA256 checked in constant time; a forged call gets 401 before any effect." },
        { id: "inbox", label: "Inbox", sub: "UNIQUE(source, key)", x: 550, y: 220, kind: "data", detail: "INSERT ... ON CONFLICT DO NOTHING. 1,000 concurrent deliveries of the same Pix produce exactly one credit, with no read-then-write race." },
        { id: "poll", label: "Active polling", sub: "+ reconciliation", x: 280, y: 60, kind: "job", detail: "Re-reads the PSP statement to recover lost webhooks; Spring Batch reconciliation adjusts the ledger to the PSP and opens a case." },
        { id: "workers", label: "Inbox workers", sub: "SKIP LOCKED · FSM", x: 820, y: 220, kind: "core", detail: "Workers claim events with SKIP LOCKED and run a pure state machine. Every event ends PROCESSED or QUARANTINED, never stuck." },
        { id: "ledger", label: "Ledger", sub: "double entry · Σ = 0", x: 820, y: 60, kind: "data", detail: "Every transaction balances; ledger_imbalance is exported as a metric and is always 0." },
        { id: "mq", label: "Outbox", sub: "→ RabbitMQ · same tx", x: 820, y: 380, kind: "external", detail: "Side effects leave through an outbox written in the same transaction, then relayed to RabbitMQ." },
      ],
      edges: [
        { from: "chaos", to: "psp", label: "decides", dashed: true },
        { from: "psp", to: "disp", label: "notify" },
        { from: "disp", to: "in", label: "POST /webhook" },
        { from: "in", to: "inbox" },
        { from: "poll", to: "psp", label: "GET /pix", dashed: true },
        { from: "poll", to: "inbox" },
        { from: "inbox", to: "workers" },
        { from: "workers", to: "ledger" },
        { from: "workers", to: "mq" },
      ],
    },
    decisions: [
      { title: "One path into the system", body: "Webhooks, polling, repairs and boleto files all enter through the same inbox, guarded by a database UNIQUE constraint. That single path is why the guarantees hold everywhere." },
      { title: "Let the database enforce idempotency", body: "A UNIQUE constraint with ON CONFLICT DO NOTHING instead of check-then-insert. No race condition is possible because no read happens first." },
      { title: "Unknown money is never dropped", body: "A Pix for a txid that isn't ours goes to a suspense account with an alert. Amount mismatches are adjusted to the PSP and open a case." },
      { title: "Invariants over examples", body: "Uniqueness, double entry and \"nothing gets stuck\" hold across 500 property-based runs of random chaos; bounded refunds across 300." },
    ],
    numbers: [
      { value: "16.5 ms", label: "p99 at 500 req/s with 30% redeliveries" },
      { value: "127", label: "unit, property, integration & E2E tests" },
      { value: "0", label: "ledger imbalance, always" },
      { value: "3", label: "real bugs found by the chaos engine" },
    ],
    hindsight: "The chaos engine found bugs I would never have written a test for, like JPA silently merging over an existing row. Next time I would build the chaos harness before the happy path.",
    repo: "https://github.com/rodrigoscharp/PixLab",
  },
  {
    slug: "athena",
    name: "Athena",
    accent: "#141433",
    tagline: "A multi-asset order matching engine where every architectural decision is written down and enforced by tests.",
    role: "Author",
    period: "2025",
    stack: ["Java 21", "Spring Boot 3.3", "LMAX Disruptor 4", "Virtual Threads", "PostgreSQL 16", "Kafka 3.7 + Avro", "Redis 7", "gRPC", "ArchUnit", "JMH", "Gatling"],
    problem: [
      "An exchange has to match buy and sell orders by price-time priority, never lose an order, never match one twice, and do it in microseconds while thousands of clients hammer it at once.",
      "Athena is a study of exchange-grade engineering built in the open: limit and market orders over REST, gRPC or WebSocket, matched on a single lock-free thread, every state change stored as an event, and trades streamed to Kafka. It is a study, not a production venue, and it says so.",
    ],
    arch: {
      caption: "One thread owns every order book. Everything slow (database, Kafka) happens off that thread.",
      nodes: [
        { id: "cli", label: "Clients", sub: "REST · gRPC · WebSocket", x: 10, y: 220, kind: "client", detail: "Three inbound adapters on top of the same use cases. gRPC streams book updates; WebSocket pushes a snapshot to the dashboard every 250 ms." },
        { id: "idem", label: "Redis", sub: "Idempotency-Key · 24 h", x: 280, y: 60, kind: "data", detail: "Every write requires an Idempotency-Key. A duplicate request returns the original result without being processed again." },
        { id: "ring", label: "Disruptor ring", sub: "4,096 slots", x: 280, y: 220, kind: "edge", detail: "Request threads only publish commands into the LMAX Disruptor ring buffer. They never touch an order book." },
        { id: "match", label: "Matching thread", sub: "single writer · 0 locks", x: 550, y: 220, kind: "core", detail: "One MatchingEventHandler owns every OrderBook exclusively, so the hot path needs no locks at all. The domain is plain Java: no Spring, no Kafka, no JDBC. Prices are long ticks, never floating point." },
        { id: "vt", label: "Virtual threads", sub: "I/O off the hot path", x: 550, y: 400, kind: "job", detail: "Persistence and publishing are dispatched to Java 21 virtual threads, so a slow disk or broker never stalls matching." },
        { id: "es", label: "Event store", sub: "PostgreSQL · append-only", x: 820, y: 60, kind: "data", detail: "Every state change is persisted as an immutable event before it takes effect. On startup the order book is rebuilt by replaying the events." },
        { id: "kafka", label: "Kafka", sub: "trades · Avro schemas", x: 820, y: 220, kind: "external", detail: "Executions are published at-least-once with Avro contracts in a Schema Registry, so consumers can evolve safely." },
        { id: "proj", label: "Read models", sub: "Redis projections", x: 820, y: 400, kind: "data", detail: "CQRS: book snapshots and trade history are served from projections, never from the live book the matching thread owns." },
        { id: "arch", label: "ArchUnit gate", sub: "14 boundary rules", x: 10, y: 400, kind: "job", detail: "The hexagonal boundaries are checked on every build: the domain imports nothing outside java.*, controllers go through use cases, and @Transactional never appears in the domain. A violation fails mvn verify." },
      ],
      edges: [
        { from: "cli", to: "idem", label: "dedupe" },
        { from: "cli", to: "ring", label: "publish" },
        { from: "ring", to: "match" },
        { from: "match", to: "vt", label: "events" },
        { from: "vt", to: "es", label: "append" },
        { from: "vt", to: "kafka", label: "trades" },
        { from: "vt", to: "proj", label: "project" },
        { from: "arch", to: "match", label: "enforces", dashed: true },
      ],
    },
    decisions: [
      { title: "Single writer instead of locks", body: "All matching runs on one thread fed by a ring buffer. Contention disappears by design instead of being managed with locks, and the order book code stays simple enough to reason about." },
      { title: "Event sourcing as the source of truth", body: "The book is a projection of an append-only event log. Recovering from a crash is a replay, and every past state can be reconstructed and audited." },
      { title: "Long ticks inside, BigDecimal at the edge", body: "Prices are long ticks and quantities long lots in the domain; BigDecimal only exists at the REST and gRPC boundary. No rounding in the critical path, and the matching logic is trivially testable." },
      { title: "Architecture that breaks the build", body: "Hexagonal boundaries are not a diagram on a wiki: 14 ArchUnit rules turn every violation into a failed build." },
      { title: "Real infrastructure in tests", body: "Integration tests run on real PostgreSQL and Redis through Testcontainers, never H2. Mocked tests that pass while real ones would fail are a class of bug the project refuses." },
      { title: "Honest numbers", body: "Performance figures are published as design targets measured locally with JMH and Gatling, not as benchmark results. The README says what the project is not: no auth, no risk management, single node." },
    ],
    numbers: [
      { value: "> 100k", label: "orders/s per symbol (design target, JMH)" },
      { value: "< 100 µs", label: "p99 matching latency (design target)" },
      { value: "14", label: "ArchUnit rules gating every build" },
      { value: "5", label: "Architecture Decision Records" },
    ],
    hindsight: "The single-writer design makes one node very fast but caps it at one node. The next step is partitioning symbols across engines with a sequencer in front, which is how real venues scale.",
    repo: "https://github.com/rodrigoscharp/Athena-Matching-Engine",
  },
  {
    slug: "walletcore",
    name: "WalletCore",
    accent: "#10291f",
    tagline: "A digital wallet API where a transfer can't run twice, can't deadlock and can't break the books.",
    role: "Author",
    period: "2025",
    stack: ["Java 21", "Spring Boot 3.3", "Spring Security 6", "JWT", "PostgreSQL 16", "Flyway", "RabbitMQ 3.13", "Redis 7.4", "Spring Batch", "Bucket4j", "Testcontainers"],
    problem: [
      "Moving money between accounts looks like two UPDATEs. In production it means retries that resend the same transfer, two transfers crossing in opposite directions at the same time, and a notification service that is down right when the money moves.",
      "WalletCore is a REST wallet that handles all of it: JWT with rotating refresh tokens, atomic transfers under pessimistic locks, a double-entry ledger, idempotency keys, per-user rate limiting, and notifications that retry without ever touching the financial transaction.",
    ],
    arch: {
      caption: "The transfer is one ACID transaction; everything that can fail slowly lives outside it.",
      nodes: [
        { id: "cli", label: "Client", sub: "Bearer + Idempotency-Key", x: 10, y: 220, kind: "client", detail: "The client generates the Idempotency-Key before sending, like Stripe or Adyen. If the network fails after processing, resending returns the original result." },
        { id: "sec", label: "Security chain", sub: "JWT · rotating refresh", x: 280, y: 60, kind: "edge", detail: "Spring Security 6 with JWT access tokens and rotating refresh tokens. The app refuses to start without its own signing key: a key committed to the repo would be a public key." },
        { id: "rate", label: "Rate limit", sub: "Bucket4j · 10 ops/min", x: 280, y: 220, kind: "edge", detail: "Transfers, deposits and withdrawals share a per-user bucket of 10 operations per minute; the 11th gets 429." },
        { id: "svc", label: "Transfer service", sub: "lock lowest UUID first", x: 550, y: 220, kind: "core", detail: "Checks idempotency, takes PESSIMISTIC_WRITE locks on both accounts in UUID order, validates the balance, debits, credits and completes, all in one transaction." },
        { id: "pg", label: "PostgreSQL 16", sub: "CHECK balance >= 0", x: 820, y: 220, kind: "data", detail: "The database itself refuses a negative balance, and the idempotency key is UNIQUE. The last line of defense is the schema, not the code." },
        { id: "ledger", label: "Ledger", sub: "double entry · immutable", x: 820, y: 60, kind: "data", detail: "Every transfer writes a DEBIT and a CREDIT entry that are never edited. Deposits and withdrawals go through a per-currency clearing account, so the sum of the ledger is always zero." },
        { id: "mq", label: "RabbitMQ", sub: "retry 1s·2s·4s → DLQ", x: 550, y: 400, kind: "external", detail: "Notifications are published after the transfer, fire-and-forget. The consumer retries three times with exponential backoff and parks failures in a dead-letter queue." },
        { id: "batch", label: "Spring Batch", sub: "statements · reports", x: 820, y: 400, kind: "job", detail: "A daily balance report at 01:00 and a monthly statement at 02:00 on the 1st." },
        { id: "redis", label: "Redis", sub: "cache", x: 280, y: 400, kind: "data", detail: "Spring Cache backed by Redis for read-heavy lookups." },
      ],
      edges: [
        { from: "cli", to: "sec", label: "Bearer" },
        { from: "sec", to: "rate" },
        { from: "rate", to: "svc" },
        { from: "svc", to: "pg", label: "FOR UPDATE" },
        { from: "svc", to: "ledger", label: "DEBIT + CREDIT" },
        { from: "svc", to: "mq", label: "after commit", dashed: true },
        { from: "svc", to: "redis", dashed: true },
        { from: "batch", to: "pg" },
      ],
    },
    decisions: [
      { title: "Lock ordering kills deadlocks by definition", body: "Transfers A→B and B→A at the same time would deadlock. Always locking the lower UUID first makes that cycle impossible, instead of detecting and retrying it." },
      { title: "Pessimistic over optimistic locking", body: "Money on the same account conflicts often. Exclusive locks avoid a storm of rollbacks and retries exactly when the system is busiest." },
      { title: "An idempotency key can't be reused for something else", body: "A replay only returns the stored result when type, accounts and amount match. The same key for a different operation gets 409 instead of the wrong receipt." },
      { title: "A clearing account keeps the books balanced", body: "Deposits and withdrawals have no internal counterpart, so money enters and leaves through a per-currency clearing account, the only one allowed to go negative. Its balance is exactly what the system owes the outside world." },
      { title: "Notifications can't fail a transfer", body: "Publishing errors are caught, so a RabbitMQ outage never rolls back money that already moved. Resilience lives in the consumer: retry, backoff, DLQ." },
    ],
    numbers: [
      { value: "0", label: "sum of every ledger entry, always" },
      { value: "6", label: "integration suites on real Postgres + RabbitMQ" },
      { value: "10/min", label: "money operations per user before 429" },
      { value: "3×", label: "notification retries before the DLQ" },
    ],
    hindsight: "Pessimistic locks are right for a wallet with hot accounts, but they put a ceiling on a single very busy account. At scale I would move hot accounts to an append-only ledger with balances derived asynchronously.",
    repo: "https://github.com/rodrigoscharp/WalletCore",
  },
  {
    slug: "ponte",
    name: "PONTE",
    logo: "/images/logos/ponte.png",
    accent: "#0c1f5c",
    tagline: "A voice for non-verbal autistic children: a symbol board that speaks, works offline and grows with each child.",
    role: "Author",
    period: "2026 · MVP",
    stack: ["Java 17", "Spring Boot 3.4", "PWA", "Service Worker", "Web Speech (TTS)", "H2 → PostgreSQL"],
    problem: [
      "An estimated 270 to 330 thousand children in Brazil are non-verbal or minimally verbal autistic. For them, a communication board is not an accessory: it is the difference between saying \"I'm in pain\", \"I want water\" or \"I love you\", and saying nothing.",
      "PONTE turns any tablet into a communicator: every symbol the child taps is spoken out loud, it keeps working in a classroom without internet, caregivers turn a photo of the child's own world into a new symbol, and therapists see how communication evolves day by day.",
    ],
    arch: {
      caption: "A Spring Boot monolith with packages by domain; the child's tablet keeps working offline and syncs later.",
      nodes: [
        { id: "board", label: "Symbol board", sub: "PWA · tap → speech", x: 10, y: 60, kind: "client", detail: "A stable grid of symbols by category (food, feelings, people, actions, personal) with a sentence bar spoken by text-to-speech." },
        { id: "sw", label: "Offline queue", sub: "service worker", x: 10, y: 380, kind: "edge", detail: "Usage events wait in a queue while offline and sync when the connection returns, so a classroom without Wi-Fi never loses a word." },
        { id: "api", label: "REST API", sub: "/api/v1 · Spring Boot", x: 280, y: 220, kind: "core", detail: "One Spring Boot 3 monolith, packages by domain: profile, consent, symbol, usage, prediction and picto." },
        { id: "consent", label: "Consent", sub: "LGPD in the domain", x: 280, y: 60, kind: "core", detail: "A guardian's active consent is a domain precondition: recording usage without it is rejected by the model itself, not by a screen. Revoking it stops collection at once." },
        { id: "symbols", label: "Symbols", sub: "grid is append-only", x: 550, y: 60, kind: "data", detail: "gridPosition has no setter and no endpoint to move it. New symbols, AI-generated ones included, always go to the end of the grid." },
        { id: "usage", label: "Usage events", sub: "IDs only · daily summary", x: 550, y: 380, kind: "data", detail: "Events carry only IDs, and profiles use a nickname instead of a name: data minimization by design." },
        { id: "picto", label: "Pictogram AI", sub: "photo → symbol", x: 820, y: 60, kind: "external", detail: "A caregiver photographs the child's toy, grandmother or school and it becomes a pictogram. Behind an interface, with a stub until the API key is configured." },
        { id: "predict", label: "Prediction AI", sub: "2-3 taps → sentence", x: 820, y: 220, kind: "external", detail: "After two or three taps, the most likely full sentence is suggested and accepted with one tap, reducing the child's motor effort." },
        { id: "dash", label: "Dashboard", sub: "therapist · daily progress", x: 820, y: 380, kind: "client", detail: "Which symbols the child used, how many sentences were formed and how many predictions were accepted, day by day." },
      ],
      edges: [
        { from: "board", to: "api", label: "taps" },
        { from: "board", to: "sw", dashed: true },
        { from: "sw", to: "api", label: "sync" },
        { from: "api", to: "consent", label: "gate" },
        { from: "api", to: "symbols" },
        { from: "api", to: "usage" },
        { from: "symbols", to: "picto", dashed: true },
        { from: "api", to: "predict", dashed: true },
        { from: "usage", to: "dash", label: "summary" },
      ],
    },
    decisions: [
      { title: "Motor planning is an architecture rule", body: "AAC research shows that moving symbols on the grid hurts the child's motor learning: they memorize the path of the hand, not just the image. So the grid is append-only by construction. No feature, AI included, can move a symbol." },
      { title: "Consent is a domain precondition", body: "Under LGPD, no usage event is recorded without the guardian's active consent. The rule lives in the domain, so no new screen or endpoint can forget it." },
      { title: "Offline-first for real classrooms", body: "Schools often have poor Wi-Fi. The PWA caches the board and queues events, so the child never loses their voice when the network drops." },
      { title: "AI behind interfaces", body: "Pictogram generation and sentence prediction are interfaces with stubs. The MVP runs with zero external calls and switches to real models by adding a key, without touching the rest." },
      { title: "Hardened before the first family", body: "Real consent capture in the UI and image-dimension limits on upload (against decompression bombs) were done before the pilot, not after." },
    ],
    numbers: [
      { value: "270-330k", label: "non-verbal autistic children in Brazil (estimate)" },
      { value: "1 tap", label: "to accept a predicted sentence" },
      { value: "0", label: "symbols ever moved on a child's grid" },
      { value: "0", label: "external calls needed to run the MVP" },
    ],
    hindsight: "The next steps are authentication and ownership for the dashboard, moving from H2 to PostgreSQL and plugging in the real AI models, then a native Android app on the same REST backend.",
    repo: "https://github.com/rodrigoscharp/PONTE",
  },
];

export const caseBySlug = (slug: string) => CASE_STUDIES.find((c) => c.slug === slug);
