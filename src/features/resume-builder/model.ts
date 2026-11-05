export type TemplateId = "modern" | "classic" | "minimalist" | "ats" | "developer" | "creative" | "student" | "corporate" | "executive"

export type ColorMode = "light" | "dark"
export type EditorLanguage = "ar" | "en"
export type ResumeDocumentLanguage = "ar" | "en"
export type ResumeDirection = "rtl" | "ltr"

export type Template = {
  id: TemplateId
  name: string
  tone: string
  description: string
  audience: string
  accent: string
  atsOptimized?: boolean
  status: "active" | "planned"
  supportsPhoto?: boolean
  supportsColor?: boolean
  supportsProfessionalLinks?: boolean
}

export type PersonalInfo = {
  name: string

  role: string

  email: string

  phone: string

  location: string

  github: string

  linkedIn: string

  portfolio: string

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

export type ResumeLanguage = {
  id: string
  name: string
  proficiency: string
}

export type Award = {
  id: string
  title: string
  issuer: string
  date: string
  description: string
}

export type VolunteerExperience = {
  id: string
  organization: string
  role: string
  startDate: string
  endDate: string
  description: string
}

export type Publication = {
  id: string
  title: string
  publisher: string
  date: string
  url: string
  description: string
}

export type Reference = {
  id: string
  name: string
  position: string
  organization: string
  email: string
  phone: string
}

export type CustomSectionField = {
  id: string
  label: string
  value: string
}

export type CustomSectionEntry = {
  id: string
  title: string
  subtitle: string
  date: string
  description: string
  fields: CustomSectionField[]
}

export type CustomResumeSection = {
  id: string
  title: string
  entries: CustomSectionEntry[]
}

export type ResumeSectionId = "summary" | "experience" | "education" | "skills" | "projects" | "certifications" | "languages" | "awards" | "volunteer" | "publications" | "references" | `custom:${string}`

export type ResumeSectionLayout = {
  order: ResumeSectionId[]
  hidden: ResumeSectionId[]
}

export const defaultResumeSectionOrder: ResumeSectionId[] = [
  "summary",
  "experience",
  "education",
  "skills",
  "projects",
  "certifications",
  "languages",
  "awards",
  "volunteer",
  "publications",
  "references",
]

export const defaultHiddenResumeSections: ResumeSectionId[] = [
  "languages",
  "awards",
  "volunteer",
  "publications",
  "references",
]

export type ResumeContent = {
  personal: PersonalInfo
  summary: string
  experiences: Experience[]
  education: Education[]
  projects: Project[]
  certifications: Certification[]
  skills: string[]
  languages: ResumeLanguage[]
  awards: Award[]
  volunteerExperiences: VolunteerExperience[]
  publications: Publication[]
  references: Reference[]
  customSections: CustomResumeSection[]
}

export type ResumeConfiguration = {
  sectionLayout: ResumeSectionLayout
  templateId: TemplateId
  documentLanguage: ResumeDocumentLanguage
  primaryColor: string
  colorMode: ColorMode
  editorLanguage: EditorLanguage
}

export type ResumeData = ResumeContent & ResumeConfiguration

export const emptyResume: ResumeData = {
  personal: {
    name: "",

    role: "",

    email: "",

    phone: "",

    location: "",

    github: "",

    linkedIn: "",

    portfolio: "",

    photoUrl: null,
  } satisfies PersonalInfo,

  summary: "",

  experiences: [],

  education: [],

  projects: [],

  certifications: [],

  skills: [],

  languages: [],

  awards: [],

  volunteerExperiences: [],

  publications: [],

  references: [],

  customSections: [],

  sectionLayout: {
    order: [...defaultResumeSectionOrder],
    hidden: [...defaultHiddenResumeSections],
  } satisfies ResumeSectionLayout,

  templateId: "ats",
  documentLanguage: "en",
  primaryColor: "#2f6b5f",
  colorMode: "light",
  editorLanguage: "ar",
}

export const initialResume: ResumeData = {
  ...emptyResume,
  personal: {
    ...emptyResume.personal,
    name: "Alex Morgan",
    role: "Frontend Developer",
    email: "alex.morgan@example.com",
    phone: "+1 (212) 555-0142",
    location: "Austin, TX",
    portfolio: "alexmorgan.example.com",
  },
  summary:
    "Frontend Developer focused on building accessible, high-performing web applications with React and TypeScript. Experienced in turning complex product requirements into clear user experiences and reusable UI systems.",
  experiences: [
    {
      id: "sample-experience-senior-frontend",
      job: "Frontend Developer",
      company: "Northstar Digital (Sample)",
      period: "2022 — Present",
      description:
        "Built responsive product experiences with React, Next.js, and TypeScript.\nCreated reusable interface components that helped the product team deliver features more consistently.\nImproved page performance and accessibility through focused audits and iterative fixes.",
    },
    {
      id: "sample-experience-frontend",
      job: "Junior Frontend Developer",
      company: "Brightside Labs (Sample)",
      period: "2020 — 2022",
      description:
        "Developed and maintained customer-facing interfaces from design specifications.\nPartnered with design and backend teammates to ship product improvements.\nHelped improve usability by resolving common navigation and form issues.",
    },
  ] satisfies Experience[],
  education: [
    {
      id: "sample-education-computer-science",
      degree: "B.S. in Computer Science",
      school: "Example State University",
      period: "2016 — 2020",
    },
  ] satisfies Education[],
  projects: [
    {
      id: "sample-project-customer-portal",
      name: "Customer Portal Refresh",
      stack: "React, TypeScript, Next.js",
      period: "2024",
      description:
        "Designed and built a responsive self-service portal with clearer account workflows and accessible form patterns.",
      url: "alexmorgan.example.com/customer-portal",
    },
    {
      id: "sample-project-component-library",
      name: "Reusable UI Component Library",
      stack: "TypeScript, Storybook, CSS",
      period: "2023",
      description:
        "Created a documented set of shared interface components to help teams build consistent product experiences.",
      url: "alexmorgan.example.com/ui-library",
    },
  ] satisfies Project[],
  skills: [
    "React",
    "TypeScript",
    "Next.js",
    "JavaScript",
    "HTML & CSS",
    "Accessibility",
    "Responsive Design",
    "UI Performance",
  ],
}
