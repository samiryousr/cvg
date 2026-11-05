"use client"

import { memo } from "react"

import { previewResume } from "@/features/resume-builder/model"

import { createResumePreviewData } from "@/features/resume-builder/preview-data"

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

  const previewData = createResumePreviewData(
    {
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
    },

    previewResume,
  )

  const hasPlaceholderContent = previewData.placeholderFields.size > 0

  const safeTemplateId = normalizeTemplateId(templateId, "ats")

  const TemplateRenderer = getTemplateDefinition(safeTemplateId).component

  const templateProps = {
    ...previewData,

    customSections,

    sectionLayout,

    primaryColor,

    documentLanguage,
  }

  return (
    <div
      className={`resume-preview-frame${
        hasPlaceholderContent ? " is-sample-preview" : ""
      }`}
    >
      {hasPlaceholderContent && (
        <p className="preview-sample-note" role="note">
          {documentLanguage === "ar"
            ? "النص الباهت أمثلة توضيحية، اكتب بياناتك لتظهر بشكلها النهائي"
            : "Faded text is only an example. Enter your details to see the final style."}
        </p>
      )}
      <article
        className={`resume-paper template-${safeTemplateId}`}
        lang={documentLanguage}
        dir={documentLanguage === "ar" ? "rtl" : "ltr"}
      >
        <TemplateRenderer {...templateProps} />
      </article>
    </div>
  )
})
