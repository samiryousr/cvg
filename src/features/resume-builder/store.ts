import { create } from "zustand"

import { createJSONStorage, persist } from "zustand/middleware"

import {
  defaultHiddenResumeSections,
  defaultResumeSectionOrder,
  emptyResume,
  initialResume,
  legacyPreviewResume,
  type Award,
  type Certification,
  type ColorMode,
  type CustomResumeSection,
  type Education,
  type EditorLanguage,
  type Experience,
  type PersonalInfo,
  type Project,
  type Publication,
  type Reference,
  type ResumeData,
  type ResumeDocumentLanguage,
  type ResumeSectionId,
  type SkillCategory,
  type TemplateId,
  type VolunteerExperience,
  type ResumeLanguage,
} from "@/features/resume-builder/model"

import { normalizeTemplateId } from "@/features/resume-builder/template-registry"
import {
  MAX_SUMMARY_LENGTH,
  PERSONAL_FIELD_LIMITS,
  sanitizeResumeText,
  sanitizeSkills,
} from "@/features/resume-builder/validation"

type Direction = -1 | 1
type ResumeSaveStatus = "idle" | "saving" | "saved" | "error"

export const useResumeSaveStatus = create<{ status: ResumeSaveStatus }>(() => ({
  status: "idle",
}))

const pendingStorageWrites = new Map<string, {
  timer: ReturnType<typeof setTimeout>
  value: string
}>()

function flushPendingStorageWrites() {
  for (const [name, pending] of pendingStorageWrites) {
    clearTimeout(pending.timer)

    try {
      localStorage.setItem(name, pending.value)
      useResumeSaveStatus.setState({ status: "saved" })
    } catch (error) {
      console.error("Could not save the resume to localStorage.", error)
      useResumeSaveStatus.setState({ status: "error" })
    } finally {
      pendingStorageWrites.delete(name)
    }
  }
}

if (typeof window !== "undefined") {
  window.addEventListener("pagehide", flushPendingStorageWrites)
}

const debouncedLocalStorage = {
  getItem: (name: string) => localStorage.getItem(name),

  setItem: (name: string, value: string) => {
    // Landing-page store changes must not overwrite saved data before editor hydration.
    if (!useResumeStore.getState().hasHydrated) return

    useResumeSaveStatus.setState({ status: "saving" })

    const pending = pendingStorageWrites.get(name)
    if (pending) clearTimeout(pending.timer)

    const timer = setTimeout(() => {
      try {
        localStorage.setItem(name, value)
        useResumeSaveStatus.setState({ status: "saved" })
      } catch (error) {
        console.error("Could not save the resume to localStorage.", error)
        useResumeSaveStatus.setState({ status: "error" })
      } finally {
        pendingStorageWrites.delete(name)
      }
    }, 500)

    pendingStorageWrites.set(name, { timer, value })
  },

  removeItem: (name: string) => {
    const pending = pendingStorageWrites.get(name)
    if (pending) {
      clearTimeout(pending.timer)
      pendingStorageWrites.delete(name)
    }

    localStorage.removeItem(name)
    useResumeSaveStatus.setState({ status: "idle" })
  },
}

type ResumeActions = {
  updatePersonal: <K extends keyof PersonalInfo,>(
    key: K,

    value: PersonalInfo[K],
  ) => void

  updateSummary: (summary: string) => void

  updateExperience: (
    id: string,

    updates: Partial<Omit<Experience, "id">>,
  ) => void

  addExperience: () => void

  removeExperience: (id: string) => void

  updateEducation: (
    id: string,

    updates: Partial<Omit<Education, "id">>,
  ) => void

  addEducation: () => void

  removeEducation: (id: string) => void

  updateProject: (id: string, updates: Partial<Omit<Project, "id">>) => void

  addProject: () => void

  removeProject: (id: string) => void

  updateCertification: (
    id: string,

    updates: Partial<Omit<Certification, "id">>,
  ) => void

  addCertification: () => void

  removeCertification: (id: string) => void

  updateLanguages: (languages: ResumeLanguage[]) => void

  addLanguage: () => void

  updateLanguage: (
    id: string,

    updates: Partial<Omit<ResumeLanguage, "id">>,
  ) => void

  removeLanguage: (id: string) => void

  updateAwards: (awards: Award[]) => void

  addAward: () => void

  updateAward: (id: string, updates: Partial<Omit<Award, "id">>) => void

  removeAward: (id: string) => void

  updateVolunteerExperiences: (items: VolunteerExperience[]) => void

  addVolunteerExperience: () => void

  updateVolunteerExperience: (
    id: string,

    updates: Partial<Omit<VolunteerExperience, "id">>,
  ) => void

  removeVolunteerExperience: (id: string) => void

  updatePublications: (publications: Publication[]) => void

  addPublication: () => void

  updatePublication: (
    id: string,

    updates: Partial<Omit<Publication, "id">>,
  ) => void

  removePublication: (id: string) => void

  updateReferences: (references: Reference[]) => void

  addReference: () => void

  updateReference: (
    id: string,

    updates: Partial<Omit<Reference, "id">>,
  ) => void

  removeReference: (id: string) => void

  addCustomSection: () => string

  updateCustomSection: (
    id: string,

    updates: Partial<Pick<CustomResumeSection, "title">>,
  ) => void

  removeCustomSection: (id: string) => void

  addCustomEntry: (sectionId: string) => void

  updateCustomEntry: (
    sectionId: string,

    entryId: string,

    updates: Partial<Omit<CustomResumeSection["entries"][number], "id" | "fields">>,
  ) => void

  removeCustomEntry: (sectionId: string, entryId: string) => void

  addCustomField: (sectionId: string, entryId: string) => void

  updateCustomField: (
    sectionId: string,

    entryId: string,

    fieldId: string,

    updates: Partial<Omit<CustomResumeSection["entries"][number]["fields"][number], "id">>,
  ) => void

  removeCustomField: (
    sectionId: string,

    entryId: string,

    fieldId: string,
  ) => void

  updateSkills: (skills: SkillCategory[]) => void

  addSkillCategory: () => void

  moveSkill: (index: number, direction: Direction) => void

  moveEntry: (
    sectionId: ResumeSectionId,

    entryId: string,

    direction: Direction,
  ) => void

  duplicateEntry: (sectionId: ResumeSectionId, entryId: string) => void

  moveSection: (sectionId: ResumeSectionId, direction: Direction) => void

  setSectionVisible: (sectionId: ResumeSectionId, visible: boolean) => void

  setTemplate: (templateId: TemplateId) => void

  setPrimaryColor: (primaryColor: string) => void

  setColorMode: (colorMode: ColorMode) => void

  setEditorLanguage: (language: EditorLanguage) => void

  setDocumentLanguage: (language: ResumeDocumentLanguage) => void

  resetResume: () => void
}

export type ResumeStore = ResumeData & {
  hasHydrated: boolean
} & ResumeActions

const createId = () => globalThis.crypto.randomUUID()

const sectionIds = new Set<string>(defaultResumeSectionOrder)

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function readString(
  value: unknown,
  fallback = "",
  maxLength = 10_000,
): string {
  return typeof value === "string"
    ? sanitizeResumeText(value, maxLength)
    : fallback
}

function sanitizeTextFields<T extends object>(fields: T): T {
  const sanitized = { ...fields }

  for (const [key, value] of Object.entries(fields)) {
    if (typeof value === "string") {
      Reflect.set(sanitized, key, sanitizeResumeText(value))
    }
  }

  return sanitized
}

function sanitizeItems<T extends { id: string }>(items: T[]): T[] {
  return items.map((item) => sanitizeTextFields(item))
}

function isSafeProfilePhoto(value: string | null): boolean {
  return (
    value === null ||
    /^data:image\/(?:jpeg|png|webp);base64,[A-Za-z\d+/]+={0,2}$/.test(value)
  )
}

function normalizeSkills(value: unknown): SkillCategory[] {
  if (!Array.isArray(value)) return []

  if (value.every((skill) => typeof skill === "string")) {
    const legacySkills = value
      .map((skill) => sanitizeResumeText(skill, 120).trim())
      .filter(Boolean)
      .join(", ")
    return legacySkills
      ? [{ id: "legacy-skills", category: "Skills", skills: legacySkills }]
      : []
  }

  const ids = new Set<string>()
  const categories = value.filter(isRecord).map((rawCategory) => {
    const skills =
      typeof rawCategory.skills === "string"
        ? rawCategory.skills
        : Array.isArray(rawCategory.items)
          ? rawCategory.items
              .filter((skill): skill is string => typeof skill === "string")
              .join(", ")
          : ""

    return {
      id: readId(rawCategory.id, ids),
      category: readString(rawCategory.category, "", 120),
      skills: readString(skills, "", 2_000),
    }
  })

  const legacySkills = value
    .filter((skill): skill is string => typeof skill === "string")
    .map((skill) => sanitizeResumeText(skill, 120).trim())
    .filter(Boolean)

  if (legacySkills.length > 0) {
    categories.push({
      id: readId("legacy-skills", ids),
      category: "Skills",
      skills: legacySkills.join(", "),
    })
  }

  return categories
}

function readId(value: unknown, seen: Set<string>): string {
  const id = readString(value).trim()
  if (id && !seen.has(id)) {
    seen.add(id)
    return id
  }

  let nextId = createId()
  while (seen.has(nextId)) nextId = createId()
  seen.add(nextId)
  return nextId
}

function normalizeItems<T>(
  value: unknown,
  normalize: (item: Record<string, unknown>) => T,
): T[] {
  if (!Array.isArray(value)) return []
  return value.filter(isRecord).map(normalize)
}

function moveItem<T extends { id: string }>(
  items: T[],

  id: string,

  direction: Direction,
) {
  const index = items.findIndex((item) => item.id === id)

  const targetIndex = index + direction

  if (index < 0 || targetIndex < 0 || targetIndex >= items.length) return items

  const next = [...items]
  ;[next[index], next[targetIndex]] = [next[targetIndex], next[index]]

  return next
}

function sectionKeyForCustom(id: string): ResumeSectionId {
  return `custom:${id}`
}

function updateSectionVisibility(
  sectionLayout: ResumeData["sectionLayout"],

  sectionId: ResumeSectionId,

  visible: boolean,
) {
  const hidden = new Set(sectionLayout.hidden)

  if (visible) hidden.delete(sectionId)
  else hidden.add(sectionId)

  return { ...sectionLayout, hidden: [...hidden] }
}

function normalizeSectionLayout(
  value: unknown,

  customSections: CustomResumeSection[],
): ResumeData["sectionLayout"] {
  const raw = isRecord(value) ? value : {}

  const validIds = new Set<string>([
    ...sectionIds,

    ...customSections.map((section) => sectionKeyForCustom(section.id)),
  ])

  const order = Array.isArray(raw.order)
    ? raw.order.filter(
        (id): id is ResumeSectionId =>
          typeof id === "string" && validIds.has(id),
      )
    : []

  const uniqueOrder = [...new Set(order)]

  const hidden = Array.isArray(raw.hidden)
    ? raw.hidden.filter(
        (id): id is ResumeSectionId =>
          typeof id === "string" && validIds.has(id),
      )
    : [...defaultHiddenResumeSections]

  return {
    order: [
      ...uniqueOrder,

      ...defaultResumeSectionOrder.filter((id) => !uniqueOrder.includes(id)),

      ...customSections

        .map((section) => sectionKeyForCustom(section.id))

        .filter((id) => !uniqueOrder.includes(id)),
    ],

    hidden: [...new Set(hidden)],
  }
}

function normalizeResumeData(value: unknown, fallback: ResumeData): ResumeData {
  const raw = isRecord(value) ? value : {}
  const rawPersonal = isRecord(raw.personal) ? raw.personal : {}
  const personal: PersonalInfo = {
    name: readString(
      rawPersonal.name,
      fallback.personal.name,
      PERSONAL_FIELD_LIMITS.name,
    ),
    role: readString(
      rawPersonal.role,
      fallback.personal.role,
      PERSONAL_FIELD_LIMITS.role,
    ),
    email: readString(
      rawPersonal.email,
      fallback.personal.email,
      PERSONAL_FIELD_LIMITS.email,
    ),
    phone: readString(
      rawPersonal.phone,
      fallback.personal.phone,
      PERSONAL_FIELD_LIMITS.phone,
    ),
    location: readString(
      rawPersonal.location,
      fallback.personal.location,
      PERSONAL_FIELD_LIMITS.location,
    ),
    github: readString(
      rawPersonal.github,
      fallback.personal.github,
      PERSONAL_FIELD_LIMITS.github,
    ),
    linkedIn: readString(
      rawPersonal.linkedIn,
      fallback.personal.linkedIn,
      PERSONAL_FIELD_LIMITS.linkedIn,
    ),
    portfolio: readString(
      rawPersonal.portfolio,
      fallback.personal.portfolio,
      PERSONAL_FIELD_LIMITS.portfolio,
    ),
    photoUrl:
      (typeof rawPersonal.photoUrl === "string" ||
        rawPersonal.photoUrl === null) &&
      isSafeProfilePhoto(rawPersonal.photoUrl)
        ? rawPersonal.photoUrl
        : fallback.personal.photoUrl,
  }

  const experienceIds = new Set<string>()
  const experiences = normalizeItems(
    raw.experiences,
    (item): Experience => ({
      id: readId(item.id, experienceIds),
      job: readString(item.job),
      company: readString(item.company),
      period: readString(item.period),
      description: readString(item.description),
    }),
  )

  const educationIds = new Set<string>()
  const education = normalizeItems(
    raw.education,
    (item): Education => ({
      id: readId(item.id, educationIds),
      degree: readString(item.degree),
      school: readString(item.school),
      period: readString(item.period),
    }),
  )

  const projectIds = new Set<string>()
  const projects = normalizeItems(
    raw.projects,
    (item): Project => ({
      id: readId(item.id, projectIds),
      name: readString(item.name),
      stack: readString(item.stack),
      period: readString(item.period),
      description: readString(item.description),
      url: readString(item.url),
    }),
  )

  const certificationIds = new Set<string>()
  const certifications = normalizeItems(
    raw.certifications,
    (item): Certification => ({
      id: readId(item.id, certificationIds),
      name: readString(item.name),
      issuer: readString(item.issuer),
      period: readString(item.period),
    }),
  )

  const languageIds = new Set<string>()
  const languages = normalizeItems(
    raw.languages,
    (item): ResumeLanguage => ({
      id: readId(item.id, languageIds),
      name: readString(item.name),
      proficiency: readString(item.proficiency),
    }),
  )

  const awardIds = new Set<string>()
  const awards = normalizeItems(
    raw.awards,
    (item): Award => ({
      id: readId(item.id, awardIds),
      title: readString(item.title),
      issuer: readString(item.issuer),
      date: readString(item.date),
      description: readString(item.description),
    }),
  )

  const volunteerIds = new Set<string>()
  const volunteerExperiences = normalizeItems(
    raw.volunteerExperiences,
    (item): VolunteerExperience => ({
      id: readId(item.id, volunteerIds),
      organization: readString(item.organization),
      role: readString(item.role),
      startDate: readString(item.startDate),
      endDate: readString(item.endDate),
      description: readString(item.description),
    }),
  )

  const publicationIds = new Set<string>()
  const publications = normalizeItems(
    raw.publications,
    (item): Publication => ({
      id: readId(item.id, publicationIds),
      title: readString(item.title),
      publisher: readString(item.publisher),
      date: readString(item.date),
      url: readString(item.url),
      description: readString(item.description),
    }),
  )

  const referenceIds = new Set<string>()
  const references = normalizeItems(
    raw.references,
    (item): Reference => ({
      id: readId(item.id, referenceIds),
      name: readString(item.name),
      position: readString(item.position),
      organization: readString(item.organization),
      email: readString(item.email),
      phone: readString(item.phone),
    }),
  )

  const customSectionIds = new Set<string>()
  const customSections = normalizeItems(
    raw.customSections,
    (section): CustomResumeSection => {
      const sectionId = readId(section.id, customSectionIds)
      const entryIds = new Set<string>()
      const entries = normalizeItems(section.entries, (entry) => {
        const entryId = readId(entry.id, entryIds)
        const fieldIds = new Set<string>()
        const fields = normalizeItems(entry.fields, (field) => ({
          id: readId(field.id, fieldIds),
          label: readString(field.label),
          value: readString(field.value),
        }))

        return {
          id: entryId,
          title: readString(entry.title),
          subtitle: readString(entry.subtitle),
          date: readString(entry.date),
          description: readString(entry.description),
          fields,
        }
      })

      return {
        id: sectionId,
        title: readString(section.title),
        entries,
      }
    },
  )
  const effectiveCustomSections = Array.isArray(raw.customSections)
    ? customSections
    : fallback.customSections

  return {
    personal,
    summary: readString(raw.summary, fallback.summary, MAX_SUMMARY_LENGTH),
    experiences: Array.isArray(raw.experiences)
      ? experiences
      : fallback.experiences,
    education: Array.isArray(raw.education) ? education : fallback.education,
    projects: Array.isArray(raw.projects) ? projects : fallback.projects,
    certifications: Array.isArray(raw.certifications)
      ? certifications
      : fallback.certifications,
    skills: Array.isArray(raw.skills)
      ? sanitizeSkills(normalizeSkills(raw.skills))
      : fallback.skills,
    languages: Array.isArray(raw.languages) ? languages : fallback.languages,
    awards: Array.isArray(raw.awards) ? awards : fallback.awards,
    volunteerExperiences: Array.isArray(raw.volunteerExperiences)
      ? volunteerExperiences
      : fallback.volunteerExperiences,
    publications: Array.isArray(raw.publications)
      ? publications
      : fallback.publications,
    references: Array.isArray(raw.references)
      ? references
      : fallback.references,
    customSections: effectiveCustomSections,
    sectionLayout: normalizeSectionLayout(
      raw.sectionLayout,
      effectiveCustomSections,
    ),
    templateId:
      typeof raw.templateId === "string"
        ? normalizeTemplateId(raw.templateId, fallback.templateId)
        : fallback.templateId,
    documentLanguage:
      raw.documentLanguage === "ar" || raw.documentLanguage === "en"
        ? raw.documentLanguage
        : fallback.documentLanguage,
    primaryColor:
      typeof raw.primaryColor === "string" &&
      /^#[\da-f]{6}$/i.test(raw.primaryColor)
        ? raw.primaryColor
        : fallback.primaryColor,
    colorMode:
      raw.colorMode === "light" || raw.colorMode === "dark"
        ? raw.colorMode
        : fallback.colorMode,
    editorLanguage:
      raw.editorLanguage === "ar" || raw.editorLanguage === "en"
        ? raw.editorLanguage
        : fallback.editorLanguage,
  }
}

function clearMatchingPreviewValues<T extends object>(value: T, sample: T): T {
  const cleaned: T = { ...value }
  const keys = Object.keys(sample) as Array<keyof T>

  for (const key of keys) {
    const currentValue = cleaned[key]
    const sampleValue = sample[key]
    if (
      key !== "id" &&
      typeof currentValue === "string" &&
      currentValue === sampleValue
    ) {
      Reflect.set(cleaned, key, "")
    }
  }

  return cleaned
}

function stripPreviewItems<T extends { id: string }>(
  items: T[],
  samples: T[],
): T[] {
  return items.flatMap((item) => {
    const sample = samples.find((candidate) => candidate.id === item.id)
    if (!sample) return [item]

    const cleaned = clearMatchingPreviewValues(item, sample)
    const hasUserValues = Object.entries(cleaned).some(
      ([key, value]) =>
        key !== "id" && typeof value === "string" && value.trim().length > 0,
    )

    return hasUserValues ? [cleaned] : []
  })
}

function stripPreviewResume(resume: ResumeData): ResumeData {
  const sampleCollections = [
    legacyPreviewResume.experiences,
    legacyPreviewResume.education,
    legacyPreviewResume.projects,
    legacyPreviewResume.certifications,
    legacyPreviewResume.languages,
    legacyPreviewResume.awards,
    legacyPreviewResume.volunteerExperiences,
    legacyPreviewResume.publications,
    legacyPreviewResume.references,
  ]
  const savedCollections = [
    resume.experiences,
    resume.education,
    resume.projects,
    resume.certifications,
    resume.languages,
    resume.awards,
    resume.volunteerExperiences,
    resume.publications,
    resume.references,
  ]
  const hasSampleRecord = sampleCollections.some((samples, index) =>
    savedCollections[index].some((item) =>
      samples.some((sample) => sample.id === item.id),
    ),
  )
  const hasPreviewSignature =
    resume.personal.name === legacyPreviewResume.personal.name ||
    resume.personal.email === legacyPreviewResume.personal.email ||
    resume.summary === legacyPreviewResume.summary ||
    hasSampleRecord

  if (!hasPreviewSignature) return resume

  const personal = clearMatchingPreviewValues(
    resume.personal,
    legacyPreviewResume.personal,
  )

  const cleaned: ResumeData = {
    ...resume,
    personal,
    summary:
      resume.summary === legacyPreviewResume.summary ? "" : resume.summary,
    experiences: stripPreviewItems(
      resume.experiences,
      legacyPreviewResume.experiences,
    ),
    education: stripPreviewItems(
      resume.education,
      legacyPreviewResume.education,
    ),
    projects: stripPreviewItems(resume.projects, legacyPreviewResume.projects),
    certifications: stripPreviewItems(
      resume.certifications,
      legacyPreviewResume.certifications,
    ),
    skills: resume.skills
      .map((category) => ({
        ...category,
        skills: category.skills
          .split(/[,،]/)
          .map((skill) => skill.trim())
          .filter(
            (skill) =>
              !legacyPreviewResume.skills.some((sample) =>
                sample.skills
                  .split(/[,،]/)
                  .map((sampleSkill) => sampleSkill.trim())
                  .includes(skill),
              ),
          )
          .join(", "),
      }))
      .filter((category) => {
        const isSampleCategory = legacyPreviewResume.skills.some(
          (sample) => sample.category === category.category,
        )
        return (
          category.skills ||
          (!isSampleCategory && category.category !== "Skills")
        )
      }),
    languages: stripPreviewItems(
      resume.languages,
      legacyPreviewResume.languages,
    ),
    awards: stripPreviewItems(resume.awards, legacyPreviewResume.awards),
    volunteerExperiences: stripPreviewItems(
      resume.volunteerExperiences,
      legacyPreviewResume.volunteerExperiences,
    ),
    publications: stripPreviewItems(
      resume.publications,
      legacyPreviewResume.publications,
    ),
    references: stripPreviewItems(
      resume.references,
      legacyPreviewResume.references,
    ),
  }

  if (
    JSON.stringify(resume.sectionLayout) ===
    JSON.stringify(legacyPreviewResume.sectionLayout)
  ) {
    cleaned.sectionLayout = {
      order: [...emptyResume.sectionLayout.order],
      hidden: [...emptyResume.sectionLayout.hidden],
    }
  }

  return cleaned
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      ...initialResume,

      hasHydrated: false,

      updatePersonal: (key, value) =>
        set((state) => {
          const safeValue =
            key === "photoUrl"
              ? (typeof value === "string" || value === null) &&
                isSafeProfilePhoto(value)
                ? value
                : null
              : typeof value === "string"
                ? sanitizeResumeText(value, PERSONAL_FIELD_LIMITS[key])
                : value

          return { personal: { ...state.personal, [key]: safeValue } }
        }),

      updateSummary: (summary) =>
        set({ summary: sanitizeResumeText(summary, MAX_SUMMARY_LENGTH) }),

      updateExperience: (id, updates) =>
        set((state) => ({
          experiences: state.experiences.map((item) =>
            item.id === id ? { ...item, ...sanitizeTextFields(updates) } : item,
          ),
        })),

      addExperience: () =>
        set((state) => ({
          experiences: [
            ...state.experiences,

            {
              id: createId(),
              job: "",
              company: "",
              period: "",
              description: "",
            },
          ],

          sectionLayout: updateSectionVisibility(
            state.sectionLayout,

            "experience",

            true,
          ),
        })),

      removeExperience: (id) =>
        set((state) => ({
          experiences: state.experiences.filter((item) => item.id !== id),
        })),

      updateEducation: (id, updates) =>
        set((state) => ({
          education: state.education.map((item) =>
            item.id === id ? { ...item, ...sanitizeTextFields(updates) } : item,
          ),
        })),

      addEducation: () =>
        set((state) => ({
          education: [
            ...state.education,

            { id: createId(), degree: "", school: "", period: "" },
          ],

          sectionLayout: updateSectionVisibility(
            state.sectionLayout,

            "education",

            true,
          ),
        })),

      removeEducation: (id) =>
        set((state) => ({
          education: state.education.filter((item) => item.id !== id),
        })),

      updateProject: (id, updates) =>
        set((state) => ({
          projects: state.projects.map((item) =>
            item.id === id ? { ...item, ...sanitizeTextFields(updates) } : item,
          ),
        })),

      addProject: () =>
        set((state) => ({
          projects: [
            ...state.projects,

            {
              id: createId(),

              name: "",

              stack: "",

              period: "",

              description: "",

              url: "",
            },
          ],

          sectionLayout: updateSectionVisibility(
            state.sectionLayout,

            "projects",

            true,
          ),
        })),

      removeProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((item) => item.id !== id),
        })),

      updateCertification: (id, updates) =>
        set((state) => ({
          certifications: state.certifications.map((item) =>
            item.id === id ? { ...item, ...sanitizeTextFields(updates) } : item,
          ),
        })),

      addCertification: () =>
        set((state) => ({
          certifications: [
            ...state.certifications,

            { id: createId(), name: "", issuer: "", period: "" },
          ],

          sectionLayout: updateSectionVisibility(
            state.sectionLayout,

            "certifications",

            true,
          ),
        })),

      removeCertification: (id) =>
        set((state) => ({
          certifications: state.certifications.filter((item) => item.id !== id),
        })),

      updateLanguages: (languages) =>
        set({ languages: sanitizeItems(languages) }),

      addLanguage: () =>
        set((state) => ({
          languages: [
            ...state.languages,

            { id: createId(), name: "", proficiency: "" },
          ],

          sectionLayout: updateSectionVisibility(
            state.sectionLayout,

            "languages",

            true,
          ),
        })),

      updateLanguage: (id, updates) =>
        set((state) => ({
          languages: state.languages.map((item) =>
            item.id === id ? { ...item, ...sanitizeTextFields(updates) } : item,
          ),
        })),

      removeLanguage: (id) =>
        set((state) => ({
          languages: state.languages.filter((item) => item.id !== id),
        })),

      updateAwards: (awards) => set({ awards: sanitizeItems(awards) }),

      addAward: () =>
        set((state) => ({
          awards: [
            ...state.awards,

            {
              id: createId(),
              title: "",
              issuer: "",
              date: "",
              description: "",
            },
          ],

          sectionLayout: updateSectionVisibility(
            state.sectionLayout,

            "awards",

            true,
          ),
        })),

      updateAward: (id, updates) =>
        set((state) => ({
          awards: state.awards.map((item) =>
            item.id === id ? { ...item, ...sanitizeTextFields(updates) } : item,
          ),
        })),

      removeAward: (id) =>
        set((state) => ({
          awards: state.awards.filter((item) => item.id !== id),
        })),

      updateVolunteerExperiences: (items) =>
        set({ volunteerExperiences: sanitizeItems(items) }),

      addVolunteerExperience: () =>
        set((state) => ({
          volunteerExperiences: [
            ...state.volunteerExperiences,

            {
              id: createId(),

              organization: "",

              role: "",

              startDate: "",

              endDate: "",

              description: "",
            },
          ],

          sectionLayout: updateSectionVisibility(
            state.sectionLayout,

            "volunteer",

            true,
          ),
        })),

      updateVolunteerExperience: (id, updates) =>
        set((state) => ({
          volunteerExperiences: state.volunteerExperiences.map((item) =>
            item.id === id ? { ...item, ...sanitizeTextFields(updates) } : item,
          ),
        })),

      removeVolunteerExperience: (id) =>
        set((state) => ({
          volunteerExperiences: state.volunteerExperiences.filter(
            (item) => item.id !== id,
          ),
        })),

      updatePublications: (publications) =>
        set({ publications: sanitizeItems(publications) }),

      addPublication: () =>
        set((state) => ({
          publications: [
            ...state.publications,

            {
              id: createId(),

              title: "",

              publisher: "",

              date: "",

              url: "",

              description: "",
            },
          ],

          sectionLayout: updateSectionVisibility(
            state.sectionLayout,

            "publications",

            true,
          ),
        })),

      updatePublication: (id, updates) =>
        set((state) => ({
          publications: state.publications.map((item) =>
            item.id === id ? { ...item, ...sanitizeTextFields(updates) } : item,
          ),
        })),

      removePublication: (id) =>
        set((state) => ({
          publications: state.publications.filter((item) => item.id !== id),
        })),

      updateReferences: (references) =>
        set({ references: sanitizeItems(references) }),

      addReference: () =>
        set((state) => ({
          references: [
            ...state.references,

            {
              id: createId(),

              name: "",

              position: "",

              organization: "",

              email: "",

              phone: "",
            },
          ],

          sectionLayout: updateSectionVisibility(
            state.sectionLayout,

            "references",

            true,
          ),
        })),

      updateReference: (id, updates) =>
        set((state) => ({
          references: state.references.map((item) =>
            item.id === id ? { ...item, ...sanitizeTextFields(updates) } : item,
          ),
        })),

      removeReference: (id) =>
        set((state) => ({
          references: state.references.filter((item) => item.id !== id),
        })),

      addCustomSection: () => {
        const id = createId()

        set((state) => ({
          customSections: [
            ...state.customSections,
            { id, title: "", entries: [] },
          ],

          sectionLayout: {
            ...state.sectionLayout,

            order: [...state.sectionLayout.order, sectionKeyForCustom(id)],

            hidden: state.sectionLayout.hidden.filter(
              (section) => section !== sectionKeyForCustom(id),
            ),
          },
        }))

        return id
      },

      updateCustomSection: (id, updates) =>
        set((state) => ({
          customSections: state.customSections.map((section) =>
            section.id === id
              ? { ...section, ...sanitizeTextFields(updates) }
              : section,
          ),
        })),

      removeCustomSection: (id) =>
        set((state) => ({
          customSections: state.customSections.filter(
            (section) => section.id !== id,
          ),

          sectionLayout: {
            order: state.sectionLayout.order.filter(
              (sectionId) => sectionId !== sectionKeyForCustom(id),
            ),

            hidden: state.sectionLayout.hidden.filter(
              (sectionId) => sectionId !== sectionKeyForCustom(id),
            ),
          },
        })),

      addCustomEntry: (sectionId) =>
        set((state) => ({
          customSections: state.customSections.map((section) =>
            section.id === sectionId
              ? {
                  ...section,

                  entries: [
                    ...section.entries,

                    {
                      id: createId(),

                      title: "",

                      subtitle: "",

                      date: "",

                      description: "",

                      fields: [],
                    },
                  ],
                }
              : section,
          ),

          sectionLayout: updateSectionVisibility(
            state.sectionLayout,

            sectionKeyForCustom(sectionId),

            true,
          ),
        })),

      updateCustomEntry: (sectionId, entryId, updates) =>
        set((state) => ({
          customSections: state.customSections.map((section) =>
            section.id === sectionId
              ? {
                  ...section,

                  entries: section.entries.map((entry) =>
                    entry.id === entryId
                      ? { ...entry, ...sanitizeTextFields(updates) }
                      : entry,
                  ),
                }
              : section,
          ),
        })),

      removeCustomEntry: (sectionId, entryId) =>
        set((state) => ({
          customSections: state.customSections.map((section) =>
            section.id === sectionId
              ? {
                  ...section,

                  entries: section.entries.filter(
                    (entry) => entry.id !== entryId,
                  ),
                }
              : section,
          ),
        })),

      addCustomField: (sectionId, entryId) =>
        set((state) => ({
          customSections: state.customSections.map((section) =>
            section.id === sectionId
              ? {
                  ...section,

                  entries: section.entries.map((entry) =>
                    entry.id === entryId
                      ? {
                          ...entry,

                          fields: [
                            ...entry.fields,

                            { id: createId(), label: "", value: "" },
                          ],
                        }
                      : entry,
                  ),
                }
              : section,
          ),
        })),

      updateCustomField: (sectionId, entryId, fieldId, updates) =>
        set((state) => ({
          customSections: state.customSections.map((section) =>
            section.id === sectionId
              ? {
                  ...section,

                  entries: section.entries.map((entry) =>
                    entry.id === entryId
                      ? {
                          ...entry,

                          fields: entry.fields.map((field) =>
                            field.id === fieldId
                              ? { ...field, ...sanitizeTextFields(updates) }
                              : field,
                          ),
                        }
                      : entry,
                  ),
                }
              : section,
          ),
        })),

      removeCustomField: (sectionId, entryId, fieldId) =>
        set((state) => ({
          customSections: state.customSections.map((section) =>
            section.id === sectionId
              ? {
                  ...section,

                  entries: section.entries.map((entry) =>
                    entry.id === entryId
                      ? {
                          ...entry,

                          fields: entry.fields.filter(
                            (field) => field.id !== fieldId,
                          ),
                        }
                      : entry,
                  ),
                }
              : section,
          ),
        })),

      updateSkills: (skills) => set({ skills: sanitizeSkills(skills) }),

      addSkillCategory: () =>
        set((state) => ({
          skills: [
            ...state.skills,
            { id: createId(), category: "", skills: "" },
          ],
        })),

      moveSkill: (index, direction) =>
        set((state) => {
          const targetIndex = index + direction

          if (
            index < 0 ||
            targetIndex < 0 ||
            targetIndex >= state.skills.length
          ) {
            return state
          }

          const skills = [...state.skills]
          ;[skills[index], skills[targetIndex]] = [
            skills[targetIndex],

            skills[index],
          ]

          return { skills }
        }),

      moveEntry: (sectionId, entryId, direction) =>
        set((state) => {
          switch (sectionId) {
            case "experience":
              return {
                experiences: moveItem(state.experiences, entryId, direction),
              }

            case "education":
              return {
                education: moveItem(state.education, entryId, direction),
              }

            case "projects":
              return { projects: moveItem(state.projects, entryId, direction) }

            case "certifications":
              return {
                certifications: moveItem(
                  state.certifications,
                  entryId,
                  direction,
                ),
              }

            case "languages":
              return {
                languages: moveItem(state.languages, entryId, direction),
              }

            case "awards":
              return { awards: moveItem(state.awards, entryId, direction) }

            case "volunteer":
              return {
                volunteerExperiences: moveItem(
                  state.volunteerExperiences,

                  entryId,

                  direction,
                ),
              }

            case "publications":
              return {
                publications: moveItem(state.publications, entryId, direction),
              }

            case "references":
              return {
                references: moveItem(state.references, entryId, direction),
              }

            default:
              if (!sectionId.startsWith("custom:")) return state

              return {
                customSections: state.customSections.map((section) =>
                  section.id === sectionId.slice("custom:".length)
                    ? {
                        ...section,

                        entries: moveItem(section.entries, entryId, direction),
                      }
                    : section,
                ),
              }
          }
        }),

      duplicateEntry: (sectionId, entryId) =>
        set((state) => {
          switch (sectionId) {
            case "experience": {
              const entry = state.experiences.find(
                (item) => item.id === entryId,
              )
              return entry
                ? {
                    experiences: [
                      ...state.experiences,
                      { ...entry, id: createId() },
                    ],
                  }
                : state
            }
            case "education": {
              const entry = state.education.find((item) => item.id === entryId)
              return entry
                ? {
                    education: [
                      ...state.education,
                      { ...entry, id: createId() },
                    ],
                  }
                : state
            }
            case "projects": {
              const entry = state.projects.find((item) => item.id === entryId)
              return entry
                ? {
                    projects: [...state.projects, { ...entry, id: createId() }],
                  }
                : state
            }
            case "certifications": {
              const entry = state.certifications.find(
                (item) => item.id === entryId,
              )
              return entry
                ? {
                    certifications: [
                      ...state.certifications,
                      { ...entry, id: createId() },
                    ],
                  }
                : state
            }
            case "languages": {
              const entry = state.languages.find((item) => item.id === entryId)
              return entry
                ? {
                    languages: [
                      ...state.languages,
                      { ...entry, id: createId() },
                    ],
                  }
                : state
            }
            case "awards": {
              const entry = state.awards.find((item) => item.id === entryId)
              return entry
                ? {
                    awards: [...state.awards, { ...entry, id: createId() }],
                  }
                : state
            }
            case "volunteer": {
              const entry = state.volunteerExperiences.find(
                (item) => item.id === entryId,
              )
              return entry
                ? {
                    volunteerExperiences: [
                      ...state.volunteerExperiences,
                      { ...entry, id: createId() },
                    ],
                  }
                : state
            }
            case "publications": {
              const entry = state.publications.find(
                (item) => item.id === entryId,
              )
              return entry
                ? {
                    publications: [
                      ...state.publications,
                      { ...entry, id: createId() },
                    ],
                  }
                : state
            }
            case "references": {
              const entry = state.references.find((item) => item.id === entryId)
              return entry
                ? {
                    references: [
                      ...state.references,
                      { ...entry, id: createId() },
                    ],
                  }
                : state
            }
            default:
              if (!sectionId.startsWith("custom:")) return state
              return {
                customSections: state.customSections.map((section) => {
                  if (section.id !== sectionId.slice("custom:".length)) {
                    return section
                  }
                  const entry = section.entries.find(
                    (item) => item.id === entryId,
                  )
                  return entry
                    ? {
                        ...section,
                        entries: [
                          ...section.entries,
                          {
                            ...entry,
                            id: createId(),
                            fields: entry.fields.map((field) => ({
                              ...field,
                              id: createId(),
                            })),
                          },
                        ],
                      }
                    : section
                }),
              }
          }
        }),

      moveSection: (sectionId, direction) =>
        set((state) => {
          const index = state.sectionLayout.order.indexOf(sectionId)

          const targetIndex = index + direction

          if (
            index < 0 ||
            targetIndex < 0 ||
            targetIndex >= state.sectionLayout.order.length
          ) {
            return state
          }

          const order = [...state.sectionLayout.order]
          ;[order[index], order[targetIndex]] = [
            order[targetIndex],
            order[index],
          ]

          return { sectionLayout: { ...state.sectionLayout, order } }
        }),

      setSectionVisible: (sectionId, visible) =>
        set((state) => ({
          sectionLayout: updateSectionVisibility(
            state.sectionLayout,

            sectionId,

            visible,
          ),
        })),

      setTemplate: (templateId) =>
        set({ templateId: normalizeTemplateId(templateId, "ats") }),

      setPrimaryColor: (primaryColor) =>
        set({
          primaryColor: /^#[\da-f]{6}$/i.test(primaryColor)
            ? primaryColor
            : emptyResume.primaryColor,
        }),

      setColorMode: (colorMode) => set({ colorMode }),

      setEditorLanguage: (editorLanguage) => set({ editorLanguage }),

      setDocumentLanguage: (documentLanguage) => set({ documentLanguage }),

      resetResume: () =>
        set({
          ...emptyResume,
          personal: { ...emptyResume.personal },
          sectionLayout: {
            order: [...defaultResumeSectionOrder],
            hidden: [...defaultHiddenResumeSections],
          },
        }),
    }),

    {
      name: "sirti-resume",

      version: 5,

      storage: createJSONStorage(() => debouncedLocalStorage),

      skipHydration: true,

      partialize: (state) => ({
        personal: state.personal,

        summary: state.summary,

        experiences: state.experiences,

        education: state.education,

        projects: state.projects,

        certifications: state.certifications,

        skills: state.skills,

        languages: state.languages,

        awards: state.awards,

        volunteerExperiences: state.volunteerExperiences,

        publications: state.publications,

        references: state.references,

        customSections: state.customSections,

        sectionLayout: state.sectionLayout,

        templateId: state.templateId,

        primaryColor: state.primaryColor,

        colorMode: state.colorMode,

        editorLanguage: state.editorLanguage,

        documentLanguage: state.documentLanguage,
      }),

      migrate: (persistedState) => {
        const resume = normalizeResumeData(persistedState, emptyResume)
        return stripPreviewResume(resume)
      },

      merge: (persistedState, currentState) =>
        persistedState === undefined
          ? currentState
          : {
              ...currentState,
              ...normalizeResumeData(persistedState, emptyResume),
            },

      onRehydrateStorage: () => (_state, error) => {
        if (error) {
          console.error(
            "Could not restore the saved resume from localStorage.",

            error,
          )
        }

        useResumeStore.setState({ hasHydrated: true })
      },
    },
  ),
)
