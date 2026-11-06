import type {
  ResumeData,
  SkillCategory,
} from "@/features/resume-builder/model"

export function mergePreviewRecord<T extends object>(
  actual: T,

  sample: T,

  path: string,

  placeholderFields: Set<string>,
): T {
  const merged: T = { ...sample, ...actual }

  for (const key of Object.keys(sample) as Array<keyof T>) {
    const actualValue = actual[key]

    const sampleValue = sample[key]

    if (
      typeof sampleValue === "string" &&
      sampleValue.length > 0 &&
      (typeof actualValue !== "string" || actualValue.trim().length === 0)
    ) {
      Reflect.set(merged, key, sampleValue)

      placeholderFields.add(`${path}.${String(key)}`)
    }
  }

  return merged
}

export function mergePreviewList<T extends { id: string }>(
  actual: T[],

  sample: T[],

  path: string,

  placeholderFields: Set<string>,
): T[] {
  return Array.from(
    { length: Math.max(actual.length, sample.length) },

    (_, index) => {
      const actualItem = actual[index]
      const sampleItem = sample[index]

      if (!actualItem) {
        Object.entries(sampleItem ?? {}).forEach(([key, value]) => {
          if (key !== "id" && typeof value === "string" && value.trim()) {
            placeholderFields.add(`${path}.${index}.${key}`)
          }
        })
        return sampleItem
      }

      if (!sampleItem) return actualItem

      return mergePreviewRecord(
        actualItem,

        sampleItem,

        `${path}.${index}`,

        placeholderFields,
      )
    },
  )
}

export function mergePreviewSkills(
  actual: SkillCategory[],

  sample: SkillCategory[],

  placeholderFields: Set<string>,
) {
  if (actual.length > 0) return actual

  sample.forEach((category, index) => {
    if (category.category.trim()) {
      placeholderFields.add(`skills.${index}.category`)
    }
    if (category.skills.trim()) {
      placeholderFields.add(`skills.${index}.skills`)
    }
  })

  return sample
}

export function createResumePreviewData(
  actual: Pick<ResumeData, "personal" | "summary" | "experiences" | "education" | "projects" | "certifications" | "skills" | "languages" | "awards" | "volunteerExperiences" | "publications" | "references">,

  sample: ResumeData,
) {
  const placeholderFields = new Set<string>()

  const personal = mergePreviewRecord(
    actual.personal,

    sample.personal,

    "personal",

    placeholderFields,
  )

  const summary =
    actual.summary.trim().length > 0
      ? actual.summary
      : (placeholderFields.add("summary"), sample.summary)

  const experiences = mergePreviewList(
    actual.experiences,

    sample.experiences,

    "experiences",

    placeholderFields,
  )

  const education = mergePreviewList(
    actual.education,

    sample.education,

    "education",

    placeholderFields,
  )

  const projects = mergePreviewList(
    actual.projects,

    sample.projects,

    "projects",

    placeholderFields,
  )

  const certifications = mergePreviewList(
    actual.certifications,

    sample.certifications,

    "certifications",

    placeholderFields,
  )

  const skills = mergePreviewSkills(
    actual.skills,

    sample.skills,

    placeholderFields,
  )

  const languages = mergePreviewList(
    actual.languages,

    sample.languages,

    "languages",

    placeholderFields,
  )

  const awards = mergePreviewList(
    actual.awards,

    sample.awards,

    "awards",

    placeholderFields,
  )

  const volunteerExperiences = mergePreviewList(
    actual.volunteerExperiences,

    sample.volunteerExperiences,

    "volunteerExperiences",

    placeholderFields,
  )

  const publications = mergePreviewList(
    actual.publications,

    sample.publications,

    "publications",

    placeholderFields,
  )

  const references = mergePreviewList(
    actual.references,

    sample.references,

    "references",

    placeholderFields,
  )

  return {
    personal,

    summary,

    experiences,

    education,

    projects,

    certifications,

    skills,

    languages,

    awards,

    volunteerExperiences,

    publications,

    references,

    placeholderFields,
  }
}
