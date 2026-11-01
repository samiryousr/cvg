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

export const templates: Template[] = [
  {
    id: "modern",
    name: "عصري",
    tone: "أنيق ومعاصر",
    description: "تصميم أنيق بعمود جانبي ولمسات لونية.",
    accent: "#2f6b5f",
  },
  {
    id: "classic",
    name: "كلاسيكي",
    tone: "واضح وتقليدي",
    description: "تخطيط تقليدي واضح وسهل القراءة.",
    accent: "#343b45",
  },
  {
    id: "minimalist",
    name: "بسيط",
    tone: "هادئ ومختصر",
    description: "مساحات مريحة وتركيز على المحتوى.",
    accent: "#6b6258",
  },
  {
    id: "ats",
    name: "متوافق مع ATS",
    tone: "مهيأ للفحص الآلي",
    description: "تخطيط أحادي العمود بلا صور أو جداول.",
    accent: "#263238",
    atsOptimized: true,
  },
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
    "Frontend engineer with 7+ years of experience building scalable web applications. Improved user engagement by 32% through accessible, performance-focused interfaces and data-informed product decisions.",

  experiences: [
    {
      id: "experience-1",

      job: "Senior Frontend Engineer",

      company: "Nawa Technology",

      period: "2021 — الآن",

      description:
        "Led the migration of a high-traffic application to Next.js, reducing page load time by 40%.\nBuilt a shared component system used by 6 product teams.\nImproved accessibility scores from 71 to 96.",
    },
  ] satisfies Experience[],

  education: [
    {
      id: "education-1",

      degree: "M.Sc. in Computer Science",

      school: "Cairo University",

      period: "2018",
    },
  ] satisfies Education[],

  projects: [] as Project[],

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

  templateId: "modern" as TemplateId,
  primaryColor: "#2f6b5f",
  colorMode: "light" as ColorMode,
  editorLanguage: "ar" as EditorLanguage,
}

export type ResumeData = typeof initialResume
