"use client"

import { memo } from "react"

import { useResumeStore } from "@/features/resume-builder/store"

import {
  AtsResumeTemplate,
  ClassicResumeTemplate,
  MinimalistResumeTemplate,
  ModernResumeTemplate,
} from "@/components/resume-builder/ResumeTemplates"

export const LiveResumePreview = memo(function LiveResumePreview() {
  const personal = useResumeStore((state) => state.personal)

  const summary = useResumeStore((state) => state.summary)

  const experiences = useResumeStore((state) => state.experiences)

  const education = useResumeStore((state) => state.education)

  const projects = useResumeStore((state) => state.projects)

  const certifications = useResumeStore((state) => state.certifications)

  const skills = useResumeStore((state) => state.skills)

  const templateId = useResumeStore((state) => state.templateId)

  const primaryColor = useResumeStore((state) => state.primaryColor)

  const templateProps = {
    personal,

    summary,

    experiences,

    education,

    projects,

    certifications,

    skills,

    primaryColor,
  }

  const content = {
    modern: <ModernResumeTemplate {...templateProps} />,

    classic: <ClassicResumeTemplate {...templateProps} />,

    minimalist: <MinimalistResumeTemplate {...templateProps} />,

    ats: <AtsResumeTemplate {...templateProps} />,
  }[templateId]

  return (
    <article
      className={`resume-paper template-${templateId}`}
      lang="en"
      dir="ltr"
    >
      {content}
    </article>
  )
})
