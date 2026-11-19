"use client"

import { useResumeStore } from "@/features/resume-builder/store"

export function ResumeCompletionBar({ label }: { label: string }) {
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

  const completionFields = [
    personal.name,
    personal.role,
    personal.email,
    personal.phone,
    personal.location,
    summary,
    ...experiences.flatMap((item) => [
      item.job,
      item.company,
      item.period,
      item.description,
    ]),
    ...education.flatMap((item) => [item.degree, item.school, item.period]),
    ...projects.flatMap((item) => [
      item.name,
      item.stack,
      item.period,
      item.description,
    ]),
    ...certifications.flatMap((item) => [item.name, item.issuer, item.period]),
    ...languages.flatMap((item) => [item.name, item.proficiency]),
    ...awards.flatMap((item) => [
      item.title,
      item.issuer,
      item.date,
      item.description,
    ]),
    ...volunteerExperiences.flatMap((item) => [
      item.organization,
      item.role,
      item.startDate,
      item.endDate,
      item.description,
    ]),
    ...publications.flatMap((item) => [
      item.title,
      item.publisher,
      item.date,
      item.url,
      item.description,
    ]),
    ...references.flatMap((item) => [
      item.name,
      item.position,
      item.organization,
      item.email,
      item.phone,
    ]),
    ...customSections.flatMap((section) => [
      section.title,
      ...section.entries.flatMap((entry) => [
        entry.title,
        entry.subtitle,
        entry.date,
        entry.description,
        ...entry.fields.flatMap((field) => [field.label, field.value]),
      ]),
    ]),
    ...skills.flatMap((category) => [category.category, category.skills]),
  ]

  const completion = Math.round(
    (completionFields.filter((field) => field.trim().length > 0).length /
      Math.max(completionFields.length, 1)) *
      100,
  )

  return (
    <>
      <div className="progress-row">
        <span>{label}</span>
        <b>{completion}%</b>
      </div>
      <div
        className="progress-bar"
        role="progressbar"
        aria-valuenow={completion}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <span style={{ width: `${completion}%` }} />
      </div>
    </>
  )
}
