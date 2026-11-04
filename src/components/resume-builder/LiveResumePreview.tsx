"use client"

import { memo } from "react"

import { useResumeStore } from "@/features/resume-builder/store"
import {
  getTemplateDefinition,
  normalizeTemplateId,
} from "@/features/resume-builder/template-registry"

export const LiveResumePreview = memo(function LiveResumePreview() {
  const personal = useResumeStore((state) => state.personal)

  const summary = useResumeStore((state) => state.summary)

  const experiences = useResumeStore((state) => state.experiences)

  const education = useResumeStore((state) => state.education)

  const projects = useResumeStore((state) => state.projects)

  const certifications = useResumeStore((state) => state.certifications)

  const skills = useResumeStore((state) => state.skills)

  const languages = useResumeStore((state) => state.languages)

  const awards = useResumeStore((state) => state.awards)

  const volunteerExperiences = useResumeStore(
    (state) => state.volunteerExperiences,
  )

  const publications = useResumeStore((state) => state.publications)

  const references = useResumeStore((state) => state.references)

  const customSections = useResumeStore((state) => state.customSections)

  const sectionLayout = useResumeStore((state) => state.sectionLayout)

  const templateId = useResumeStore((state) => state.templateId)

  const documentLanguage = useResumeStore((state) => state.documentLanguage)

  const primaryColor = useResumeStore((state) => state.primaryColor)

  const safeTemplateId = normalizeTemplateId(templateId, "ats")
  const templateDefinition = getTemplateDefinition(safeTemplateId)
  const TemplateRenderer = templateDefinition.component

  const templateProps = {
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

    customSections,

    sectionLayout,

    primaryColor,

    documentLanguage,
  }

  return (
    <article
      className={`resume-paper template-${safeTemplateId}`}
      lang={documentLanguage}
      dir={documentLanguage === "ar" ? "rtl" : "ltr"}
    >
      <TemplateRenderer {...templateProps} />
    </article>
  )
})
