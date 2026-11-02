export type TemplateId = "modern" | "classic" | "minimalist" | "ats"
export type ColorMode = "light" | "dark"
export type EditorLanguage = "ar" | "en"

export type Template = {
  id: TemplateId
  name: string
  tone: string
  description: string
  accent: string
  dark?: boolean
  atsOptimized?: boolean
}

export type PersonalInfo = {
  name: string

  role: string

  email: string

  phone: string

  location: string

  github: string

  linkedIn: string

  photoUrl: string | null
}

export type Experience = {
  id: string

  job: string

  company: string

  period: string

  description: string
}

export type Education = {
  id: string

  degree: string

  school: string

  period: string
}

export type Project = {
  id: string

  name: string

  stack: string

  period: string

  description: string

  url: string
}

export type Certification = {
  id: string

  name: string

  issuer: string

  period: string
}

export const atsTemplate: Template = {
  id: "ats",
  name: "احترافي",
  tone: "متوافق مع أنظمة ATS",
  description:
    "تخطيط واضح أحادي العمود يسهل قراءته على مسؤولي التوظيف وأنظمة ATS.",
  accent: "#263238",
  atsOptimized: true,
}

export const templates: Template[] = [
  {
    id: "modern",
    name: "عصري",
    tone: "أنيق ومعاصر",
    description: "عمود جانبي منظم ولمسات لونية تبرز المهارات ومعلومات التواصل.",
    accent: "#2f6b5f",
  },
  {
    id: "classic",
    name: "كلاسيكي",
    tone: "واضح وتقليدي",
    description: "تخطيط مألوف ومتوازن مناسب لمختلف المجالات ومستويات الخبرة.",
    accent: "#343b45",
  },
  {
    id: "minimalist",
    name: "بسيط",
    tone: "هادئ ومختصر",
    description: "تصميم نظيف ومساحات مريحة تضع الخبرات والإنجازات في المقدمة.",
    accent: "#6b6258",
  },
  atsTemplate,
]

export const initialResume = {
  personal: {
    name: "Omar Khaled",

    role: "Senior Frontend Engineer",

    email: "omar.khaled@example.com",

    phone: "+20 100 123 4567",

    location: "Cairo, Egypt",

    github: "",

    linkedIn: "",

    photoUrl: null,
  } satisfies PersonalInfo,

  summary:
    "Senior Frontend Engineer with 7+ years of experience building accessible, high-performing web applications with React, Next.js, and TypeScript. Led product and platform improvements that reduced page load time by 40%, increased conversion by 12%, and established reusable UI standards across six teams.",

  experiences: [
    {
      id: "experience-1",

      job: "Senior Frontend Engineer",

      company: "Nawa Technology",

      period: "May 2021 — Present",

      description:
        "Led the migration of a high-traffic customer platform to Next.js, reducing page load time by 40% and improving Core Web Vitals.\nBuilt and documented a shared component library adopted by 6 product teams, reducing duplicated UI work.\nRaised accessibility audit scores from 71 to 96 by addressing keyboard navigation, semantics, and contrast.\nPartnered with product, design, and backend teams to ship features from discovery through production.",
    },
    {
      id: "experience-2",

      job: "Frontend Engineer",

      company: "BrightWare",

      period: "Jan 2018 — Apr 2021",

      description:
        "Delivered responsive React features for customer-facing products used by more than 80,000 monthly users.\nReduced JavaScript bundle size by 28% through route-based code splitting and dependency optimization.\nExpanded automated test coverage from 45% to 82% using Jest and React Testing Library.\nWorked with design and analytics teams on experiments that improved checkout conversion by 12%.",
    },
  ] satisfies Experience[],

  education: [
    {
      id: "education-1",

      degree: "B.Sc. in Computer Science",

      school: "Cairo University",

      period: "2014 — 2018",
    },
  ] satisfies Education[],

  projects: [
    {
      id: "project-1",
      name: "Customer Portal Performance Upgrade",
      stack: "Next.js, React, TypeScript, Web Vitals",
      period: "2024",
      description:
        "Refactored key customer journeys and introduced route-level code splitting, reducing largest contentful paint by 40%.\nImproved keyboard navigation and semantic markup to meet WCAG accessibility guidelines.",
      url: "",
    },
    {
      id: "project-2",
      name: "Reusable UI Component Library",
      stack: "React, TypeScript, Storybook, Jest",
      period: "2022 — 2023",
      description:
        "Created accessible, documented components and usage patterns adopted by 6 product teams.\nAdded visual examples and unit tests to improve consistency and reduce regressions.",
      url: "",
    },
  ] satisfies Project[],

  certifications: [] as Certification[],

  skills: [
    "React",
    "Next.js",
    "TypeScript",
    "JavaScript",
    "HTML5",
    "CSS3",
    "Tailwind CSS",
    "Node.js",
    "REST APIs",
    "GraphQL",
    "Jest",
    "Playwright",
    "Web Accessibility",
    "Performance Optimization",
    "Git",
    "CI/CD",
  ],

  templateId: "ats" as TemplateId,
  primaryColor: "#2f6b5f",
  colorMode: "light" as ColorMode,
  editorLanguage: "ar" as EditorLanguage,
}

export type ResumeData = typeof initialResume
