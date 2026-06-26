// Central place for all site content. Edit these values to update the site.

export const siteConfig = {
  url: "https://elroykimbi.dev",
  // Professional display name. Change in one place if needed.
  name: "Elroy Kimbi",
  fullName: "Elroy Ankelmbom Kimbi Yonghabichia",
  role: "Technical Lead & Full Stack Engineer",
  tagline:
    "Technical Lead and Full Stack Engineer building scalable enterprise applications, microservices, and CI/CD platforms.",
  // A more human, quirky one-liner used in the hero.
  quip: "I turn caffeine into microservices and bugs into features™.",
  summary:
    "Technical Lead & Senior Full Stack Engineer with 4+ years of experience leading cross-functional teams and delivering scalable enterprise applications, microservices, and CI/CD solutions. Proficient across the JVM, .NET, and modern web stacks, with hands-on expertise in Docker, Kubernetes, and cloud platforms (Azure, AWS). I drive Agile delivery, mentor developers, and obsess over reliable, well-architected systems.",
  email: "elroykanye@gmail.com",
  phone: "+237 690 376 344",
  location: "Bamenda, North West Region, Cameroon",
  jobTitle: "Technical Lead & Full Stack Engineer",
  resumeUrl: "/resume.pdf",
  yearsExperience: "4+",
  // Paste verification tokens here after registering the domain.
  // Google: https://search.google.com/search-console   Bing: https://www.bing.com/webmasters
  verification: {
    google: "",
    bing: "",
  },
} as const;

export type SocialLink = { label: string; href: string };

export const socials: SocialLink[] = [
  { label: "GitHub", href: "https://github.com/elroykanye" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/elroykanye" },
  { label: "Twitter", href: "https://twitter.com/elroykanye" },
  { label: "Email", href: `mailto:elroykanye@gmail.com` },
];

// Profiles that prove "this is the same person" to search engines (schema.org sameAs).
export const sameAs: string[] = [
  "https://github.com/elroykanye",
  "https://www.linkedin.com/in/elroykanye",
  "https://twitter.com/elroykanye",
  "https://elroykanye.hashnode.dev",
];

export type SkillGroup = { category: string; items: string[] };

export const skills: SkillGroup[] = [
  {
    category: "Languages",
    items: ["Java", "Kotlin", "C#", "TypeScript", "JavaScript", "SQL"],
  },
  {
    category: "Frameworks",
    items: ["Spring Boot", ".NET", "Angular", "React", "ExpressJS"],
  },
  {
    category: "Cloud & DevOps",
    items: [
      "Docker",
      "Kubernetes",
      "GitLab CI/CD",
      "Azure DevOps",
      "AWS",
      "Terraform",
    ],
  },
  {
    category: "Data & Messaging",
    items: ["PostgreSQL", "MongoDB", "Redis", "Kafka", "RabbitMQ", "Amazon SQS"],
  },
  {
    category: "Practices",
    items: [
      "Microservices",
      "Systems Design",
      "Database Design",
      "Scalability",
      "Agile / Scrum",
    ],
  },
];

export type ExperienceItem = {
  company: string;
  role: string;
  period: string;
  description: string;
  highlights: string[];
  stack: string[];
};

export const experience: ExperienceItem[] = [
  {
    company: "Drifting Desk",
    role: "Senior Software Engineer",
    period: "Dec 2023 — Feb 2026",
    description:
      "Led developers across architecture, reviews, and mentoring while shipping enterprise microservices.",
    highlights: [
      "Led a team across code reviews, architecture decisions, and mentoring, elevating team capability and accelerating delivery via Agile/Scrum.",
      "Designed and maintained microservices (Metasonic, ESG Assistant) using Java/Kotlin, Spring Boot, C#/.NET, Kafka, RabbitMQ, MongoDB, Redis, and Kubernetes.",
      "Built and optimized React and Angular frontends, improving performance and UX across platforms.",
      "Improved observability and reliability with Grafana dashboards, containerized deployments, and automated CI/CD via Azure DevOps and GitLab CI/CD.",
      "Developed WordPress plugins and PHP integrations enabling custom internal tooling.",
    ],
    stack: ["Spring Boot", "Java", "Kotlin", "C#/.NET", "React", "Angular", "Kubernetes", "Kafka"],
  },
  {
    company: "Bayzat",
    role: "Software Engineer",
    period: "Sep 2022 — Aug 2023",
    description:
      "Built HR and payroll platform features serving thousands of users.",
    highlights: [
      "Developed and maintained HR/payroll features with Kotlin, Spring Boot, and PostgreSQL, ensuring compliance and reliability at scale.",
      "Built a bank integration with Saudi Awwal Bank, enabling on-platform payroll processing for customers in KSA.",
      "Collaborated with product and customer success in Agile sprints to prioritize feedback and improve UX.",
      "Enhanced backend architecture, reducing incidents and improving scalability.",
    ],
    stack: ["Kotlin", "Spring Boot", "PostgreSQL", "React", "TypeScript", "Terraform", "Amazon SQS"],
  },
  {
    company: "Skolabox",
    role: "Software Engineer",
    period: "May 2022 — Dec 2023",
    description:
      "Built and secured the Transkript education management system.",
    highlights: [
      "Maintained and enhanced attendance, authentication, and records modules for the Transkript platform.",
      "Designed and implemented data security policies (including MFA), ensuring confidentiality and integrity.",
      "Managed CI/CD pipelines and Azure DevOps deployments, reducing release time and improving consistency.",
      "Optimized backend architecture for performance, scalability, and maintainability across multiple schools.",
    ],
    stack: ["Java", "Kotlin", "Spring Boot", "Angular", "ExpressJS", "Azure App Service", "PostgreSQL"],
  },
  {
    company: "OpenRefine",
    role: "Software Developer",
    period: "Mar 2022 — Aug 2022",
    description:
      "Open-source contributor (Outreachy) improving global accessibility.",
    highlights: [
      "Implemented server-side localization to support multiple languages and improve global accessibility.",
      "Reviewed contributions and maintained server-side code quality through peer reviews.",
      "Collaborated with the open-source community to triage and resolve critical issues.",
    ],
    stack: ["JavaScript", "Java", "Servlets", "Java IO/NIO", "Weblate"],
  },
  {
    company: "Nasia Technologies",
    role: "Software Engineer",
    period: "Feb 2022 — Aug 2022",
    description:
      "Helped launch One Seed One Farm, an enterprise market system.",
    highlights: [
      "Contributed to the inception and development of One Seed One Farm, an enterprise-grade market system.",
      "Designed the database architecture and implemented CI/CD pipelines for faster, more reliable deployments.",
    ],
    stack: ["Java", "Spring Boot", "CI/CD", "PostgreSQL"],
  },
];

export type EducationItem = { school: string; credential: string; period: string };

export const education: EducationItem[] = [
  {
    school: "University of Bamenda",
    credential: "B.Eng, Computer Engineering",
    period: "2019 — 2023",
  },
  {
    school: "Lycée Bilingue d’Atiela",
    credential: "GCE Advanced Level",
    period: "2017 — 2019",
  },
];

export type VolunteerItem = { org: string; role: string; period: string };

export const volunteering: VolunteerItem[] = [
  {
    org: "Microsoft Learn",
    role: "Student Ambassador",
    period: "2022 — Present",
  },
  {
    org: "Google Developer Group",
    role: "Organiser",
    period: "2022 — 2023",
  },
  {
    org: "Google Developer Student Clubs",
    role: "Project Coordinator",
    period: "2021 — 2022",
  },
];

// ---- Personality (edit freely — keep it fun) ----

// Shown in a playful "facts" grid. Mix of true + tongue-in-cheek.
export const funFacts: string[] = [
  "I’ve shipped to production on a Friday and lived to tell the tale.",
  "My commit messages are 60% poetry, 40% “fix stuff”.",
  "I debug rubber-duck style — the duck has equity now.",
  "Kotlin and I are in a committed relationship. Java knows.",
  "I once named a microservice after a snack. No regrets.",
  "Dark mode isn’t a preference, it’s a personality.",
];

// Rotating status lines for the "Currently" ticker.
export const currently: string[] = [
  "Leading a team across timezones and tabs.",
  "Reading about distributed systems (again).",
  "Pretending my side projects will ship this weekend.",
  "Collecting Grafana dashboards like trading cards.",
];

// ---- "Notes from the Grassfields": Cameroonian developer stories ----

// Content for the /share page where readers submit their own stories.
// Submissions are saved to MongoDB (see src/lib/mongodb.ts) and reviewed in /admin.
export type StoryTheme = { title: string; prompt: string };

export const stories = {
  // Public prompts shown on /share to spark submissions. Your private
  // editorial backlog lives in content/ideas.md, this is just for visitors.
  intro:
    "I'm writing a series about what it actually takes to build software from Cameroon. The opportunities, the obstacles, and the ridicule we rarely say out loud. If you've lived any of it, your story can help someone else feel less alone, and shape what I write next.",
  themes: [
    {
      title: "Getting paid",
      prompt:
        "Wrestled with wire transfers, crypto, or fees eating your money? Tell me how you actually get paid.",
    },
    {
      title: "The ridicule tax",
      prompt:
        "Been doubted, lowballed, or told a Cameroonian dev can't really do this? What happened, and how did you respond?",
    },
    {
      title: "Internet you can't trust",
      prompt:
        "Outages, power cuts, the 2017 to 2018 shutdown. How has unreliable connection shaped how you work?",
    },
    {
      title: "Breaking in",
      prompt:
        "Landing that first remote role or international client. What opened the door, or slammed it?",
    },
  ] as StoryTheme[],
} as const;

// `icon` maps to a lucide icon in Principles.tsx.
export type Principle = { icon: string; title: string; body: string };

// Short, opinionated “things I believe” — more human than a skills list.
export const principles: Principle[] = [
  {
    icon: "layers",
    title: "Boring tech, exciting outcomes",
    body: "I reach for proven tools. The thrill should be in what we ship, not in 3am incident calls.",
  },
  {
    icon: "compass",
    title: "Readable beats clever",
    body: "Code is read far more than it’s written. If the next dev needs a séance to understand it, I rewrote it.",
  },
  {
    icon: "users",
    title: "Mentor as you go",
    body: "A team that levels up together ships faster than any one hero ever could.",
  },
  {
    icon: "rocket",
    title: "Ship, measure, repeat",
    body: "Small reversible steps with good observability beat a big-bang launch and a prayer.",
  },
];
