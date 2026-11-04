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

export const initialResume: ResumeData = {
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

  experiences: [] as Experience[],

  education: [] as Education[],

  projects: [] as Project[],

  certifications: [] as Certification[],

  skills: [] as string[],

  languages: [] as ResumeLanguage[],

  awards: [] as Award[],

  volunteerExperiences: [] as VolunteerExperience[],

  publications: [] as Publication[],

  references: [] as Reference[],

  customSections: [] as CustomResumeSection[],

  sectionLayout: {
    order: [...defaultResumeSectionOrder],
    hidden: [...defaultHiddenResumeSections],
  } satisfies ResumeSectionLayout,

  templateId: "ats" as TemplateId,
  documentLanguage: "en" as ResumeDocumentLanguage,
  primaryColor: "#2f6b5f",
  colorMode: "light" as ColorMode,
  editorLanguage: "ar" as EditorLanguage,
}
