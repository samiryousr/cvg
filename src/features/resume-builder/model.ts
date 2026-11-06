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

export type SkillCategory = {
  id: string
  category: string
  skills: string
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
  skills: SkillCategory[]
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

export const legacyPreviewResume: ResumeData = {
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
  certifications: [
    {
      id: "sample-certification-accessibility",
      name: "Web Accessibility Foundations (Sample)",
      issuer: "Example Learning",
      period: "2023",
    },
  ] satisfies Certification[],
  skills: [
    {
      id: "sample-skills-languages",
      category: "Languages",
      skills: "JavaScript, TypeScript, HTML, CSS",
    },
    {
      id: "sample-skills-frontend",
      category: "Frontend",
      skills: "React, Next.js, Accessibility, Responsive Design",
    },
    {
      id: "sample-skills-tools",
      category: "Tools & Delivery",
      skills: "Git, CI/CD, UI Performance",
    },
  ] satisfies SkillCategory[],
  languages: [
    {
      id: "sample-language-english",
      name: "English",
      proficiency: "Fluent",
    },
    {
      id: "sample-language-spanish",
      name: "Spanish",
      proficiency: "Conversational",
    },
  ] satisfies ResumeLanguage[],
  awards: [
    {
      id: "sample-award-product",
      title: "Product Collaboration Award (Sample)",
      issuer: "Northstar Digital (Sample)",
      date: "2023",
      description:
        "Recognized for cross-functional collaboration on a product usability initiative.",
    },
  ] satisfies Award[],
  volunteerExperiences: [
    {
      id: "sample-volunteer-mentor",
      organization: "Code Neighbors (Sample)",
      role: "Volunteer Web Development Mentor",
      startDate: "2021",
      endDate: "Present",
      description:
        "Support early-career learners with portfolio reviews and introductory frontend workshops.",
    },
  ] satisfies VolunteerExperience[],
  publications: [
    {
      id: "sample-publication-accessible-ui",
      title: "Building More Accessible Interfaces (Sample)",
      publisher: "Example Tech Journal",
      date: "2024",
      url: "alexmorgan.example.com/writing/accessible-interfaces",
      description:
        "A practical overview of accessibility checks that fit into everyday frontend development.",
    },
  ] satisfies Publication[],
  references: [
    {
      id: "sample-reference-jordan",
      name: "Jordan Lee (Sample)",
      position: "Product Design Lead",
      organization: "Northstar Digital (Sample)",
      email: "jordan.lee@example.com",
      phone: "+1 (212) 555-0184",
    },
  ] satisfies Reference[],
  sectionLayout: {
    order: [...defaultResumeSectionOrder],
    hidden: [],
  } satisfies ResumeSectionLayout,
}

export const previewResume: ResumeData = {
  ...emptyResume,
  personal: {
    ...emptyResume.personal,
    name: "Alex Morgan",
    role: "Frontend Developer",
  },
  summary:
    "Frontend Developer focused on building clear, accessible web experiences.",
  experiences: [
    {
      id: "sample-experience-senior-frontend",
      job: "Frontend Developer",
      company: "Example Studio",
      period: "2022 — Present",
      description: "Built accessible interfaces with React and TypeScript.",
    },
  ] satisfies Experience[],
  education: [
    {
      id: "sample-education-computer-science",
      degree: "B.S. in Computer Science",
      school: "Example University",
      period: "2016 — 2020",
    },
  ] satisfies Education[],
  projects: [
    {
      id: "sample-project-customer-portal",
      name: "Customer Portal",
      stack: "React, TypeScript",
      period: "2024",
      description: "Designed a responsive self-service web experience.",
      url: "",
    },
  ] satisfies Project[],
  skills: [
    {
      id: "preview-skills-frontend",
      category: "Frontend",
      skills: "React, TypeScript, Next.js",
    },
  ] satisfies SkillCategory[],
  sectionLayout: {
    order: [...defaultResumeSectionOrder],
    hidden: [],
  } satisfies ResumeSectionLayout,
}

export const initialResume = emptyResume

export function hasResumeContent(resume: ResumeData): boolean {
  const fieldValuesWithoutIds = <T extends { id: string }>(items: T[]) =>
    items.flatMap((item) =>
      Object.entries(item)
        .filter(([key]) => key !== "id")
        .map(([, value]) => value),
    )

  const fieldValues = [
    ...Object.values(resume.personal).filter(
      (value): value is string => typeof value === "string",
    ),
    resume.summary,
    ...fieldValuesWithoutIds(resume.experiences),
    ...fieldValuesWithoutIds(resume.education),
    ...fieldValuesWithoutIds(resume.projects),
    ...fieldValuesWithoutIds(resume.certifications),
    ...resume.skills.flatMap((category) => [
      category.category,
      category.skills,
    ]),
    ...fieldValuesWithoutIds(resume.languages),
    ...fieldValuesWithoutIds(resume.awards),
    ...fieldValuesWithoutIds(resume.volunteerExperiences),
    ...fieldValuesWithoutIds(resume.publications),
    ...fieldValuesWithoutIds(resume.references),
    ...resume.customSections.flatMap((section) => [
      section.title,
      ...section.entries.flatMap((entry) => [
        entry.title,
        entry.subtitle,
        entry.date,
        entry.description,
        ...entry.fields.flatMap((field) => [field.label, field.value]),
      ]),
    ]),
  ]

  return fieldValues.some(
    (value) => typeof value === "string" && value.trim().length > 0,
  )
}
