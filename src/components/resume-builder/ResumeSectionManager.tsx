"use client"

import { useState, type ReactNode } from "react"

import {
  CertificationFields,
  EducationFields,
  ExperienceFields,
  ProjectFields,
} from "@/components/resume-builder/ResumeEditorFields"

import {
  previewResume,
  type ResumeSectionId,
} from "@/features/resume-builder/model"

import { useResumeStore } from "@/features/resume-builder/store"

type Direction = -1 | 1
type StandardSectionId = "summary" | "experience" | "education" | "skills" | "projects" | "certifications" | "languages" | "awards" | "volunteer" | "publications" | "references"

const sectionIconPaths: Record<StandardSectionId, string> = {
  summary: "M5 6h14M5 12h14M5 18h9",
  experience: "M3 8h18v12H3zM8 8V5h8v3M3 12h18M10 12v2h4v-2",
  education: "m2 9 10-5 10 5-10 5L2 9Zm4 3v5c3 2 9 2 12 0v-5M22 9v6",
  skills:
    "m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z",
  projects: "m12 3 9 5-9 5-9-5 9-5Zm-9 9 9 5 9-5M3 16l9 5 9-5",
  certifications: "M12 3a6 6 0 0 0-3 11.2V21l3-2 3 2v-6.8A6 6 0 0 0 12 3Z",
  languages:
    "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20",
  awards:
    "M8 4h8v4a4 4 0 0 1-8 0V4Zm0 2H4v2a4 4 0 0 0 4 4m8-6h4v2a4 4 0 0 1-4 4m-4 0v5m-4 4h8m-7-4h6",
  volunteer:
    "M20.8 8.8c0 4.2-8.8 10-8.8 10s-8.8-5.8-8.8-10A4.8 4.8 0 0 1 12 6a4.8 4.8 0 0 1 8.8 2.8Z",
  publications:
    "M4 4h11a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3V4Zm14 3h2v13h-2M8 9h6M8 13h6",
  references:
    "M16 20v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1m7-8a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm6-7a4 4 0 0 1 0 7m2 3a4 4 0 0 1 3 4v1",
}

function isStandardSectionId(value: string): value is StandardSectionId {
  return Object.prototype.hasOwnProperty.call(sectionIconPaths, value)
}

function SectionGlyph({ sectionId }: { sectionId: string }) {
  const key = isStandardSectionId(sectionId) ? sectionId : undefined

  return (
    <svg
      className="section-manager-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path
        d={key ? sectionIconPaths[key] : "M3 6h18v14H3zM3 10h18M8 6V4h8v2"}
      />
    </svg>
  )
}

function EntryFields({
  label,

  value,

  onChange,

  type = "text",

  multiline = false,

  placeholder,

  required = false,

  isArabic,
}: {
  label: string

  value: string

  onChange: (value: string) => void

  type?: "text" | "email" | "tel" | "url" | "date"

  multiline?: boolean

  placeholder?: string

  required?: boolean

  isArabic: boolean
}) {
  const direction =
    type === "email" || type === "tel" || type === "url" || type === "date"
      ? "ltr"
      : isArabic
        ? "rtl"
        : "ltr"

  const control = multiline ? (
    <textarea
      dir={direction}
      value={value}
      placeholder={placeholder ?? label}
      required={required}
      onChange={(event) => onChange(event.target.value)}
    />
  ) : (
    <input
      type={type}
      dir={direction}
      value={value}
      placeholder={placeholder ?? label}
      required={required}
      onChange={(event) => onChange(event.target.value)}
    />
  )

  return (
    <label className={multiline ? "wide-field" : undefined}>
      <span>
        {label}
        {required ? " *" : ` · ${isArabic ? "اختياري" : "Optional"}`}
      </span>
      {control}
    </label>
  )
}

function EntryCard({
  title,

  onRemove,

  onMove,
  onDuplicate,
  isFirst,

  isLast,

  children,
}: {
  title: string

  onRemove: () => void

  onMove: (direction: Direction) => void
  onDuplicate: () => void

  isFirst: boolean

  isLast: boolean

  children: ReactNode
}) {
  const isArabic = useResumeStore((state) => state.editorLanguage === "ar")

  const removeLabel = isArabic ? "حذف" : "Remove"

  const upLabel = isArabic ? "تحريك لأعلى" : "Move up"

  const downLabel = isArabic ? "تحريك لأسفل" : "Move down"

  return (
    <div className="section-entry-row">
      <div className="section-entry-controls">
        <button
          type="button"
          aria-label={upLabel}
          disabled={isFirst}
          onClick={() => onMove(-1)}
        >
          ↑
        </button>
        <button
          type="button"
          aria-label={downLabel}
          disabled={isLast}
          onClick={() => onMove(1)}
        >
          ↓
        </button>
      </div>
      <article className="repeatable-form-card">
        <div className="repeatable-form-heading">
          <strong>{title}</strong>
          <div className="entry-card-actions">
            <button type="button" onClick={onDuplicate}>
              {isArabic ? "نسخ" : "Duplicate"}
            </button>
            <button
              className="remove-item-button"
              type="button"
              onClick={onRemove}
            >
              {removeLabel}
            </button>
          </div>
        </div>
        <div className="form-grid" data-field-language={isArabic ? "ar" : "en"}>
          {children}
        </div>
      </article>
    </div>
  )
}

export function ResumeSectionManager() {
  const isArabic = useResumeStore((state) => state.editorLanguage === "ar")

  const sectionLayout = useResumeStore((state) => state.sectionLayout)

  const summary = useResumeStore((state) => state.summary)

  const customSections = useResumeStore((state) => state.customSections)

  const experiences = useResumeStore((state) => state.experiences)

  const education = useResumeStore((state) => state.education)

  const projects = useResumeStore((state) => state.projects)

  const certifications = useResumeStore((state) => state.certifications)

  const languages = useResumeStore((state) => state.languages)

  const awards = useResumeStore((state) => state.awards)

  const volunteerExperiences = useResumeStore(
    (state) => state.volunteerExperiences,
  )

  const publications = useResumeStore((state) => state.publications)

  const references = useResumeStore((state) => state.references)

  const skills = useResumeStore((state) => state.skills)

  const moveEntry = useResumeStore((state) => state.moveEntry)

  const duplicateEntry = useResumeStore((state) => state.duplicateEntry)

  const moveSkill = useResumeStore((state) => state.moveSkill)

  const updateSkills = useResumeStore((state) => state.updateSkills)

  const addSkillCategory = useResumeStore((state) => state.addSkillCategory)

  const moveSection = useResumeStore((state) => state.moveSection)

  const setSectionVisible = useResumeStore((state) => state.setSectionVisible)

  const addExperience = useResumeStore((state) => state.addExperience)

  const addEducation = useResumeStore((state) => state.addEducation)

  const addProject = useResumeStore((state) => state.addProject)

  const addCertification = useResumeStore((state) => state.addCertification)

  const addLanguage = useResumeStore((state) => state.addLanguage)

  const addAward = useResumeStore((state) => state.addAward)

  const addVolunteerExperience = useResumeStore(
    (state) => state.addVolunteerExperience,
  )

  const addPublication = useResumeStore((state) => state.addPublication)

  const addReference = useResumeStore((state) => state.addReference)

  const addCustomSection = useResumeStore((state) => state.addCustomSection)

  const updateCustomSection = useResumeStore(
    (state) => state.updateCustomSection,
  )

  const removeCustomSection = useResumeStore(
    (state) => state.removeCustomSection,
  )

  const addCustomEntry = useResumeStore((state) => state.addCustomEntry)

  const updateCustomEntry = useResumeStore((state) => state.updateCustomEntry)

  const removeCustomEntry = useResumeStore((state) => state.removeCustomEntry)

  const addCustomField = useResumeStore((state) => state.addCustomField)

  const updateCustomField = useResumeStore((state) => state.updateCustomField)

  const removeCustomField = useResumeStore((state) => state.removeCustomField)

  const updateLanguage = useResumeStore((state) => state.updateLanguage)

  const removeLanguage = useResumeStore((state) => state.removeLanguage)

  const updateAward = useResumeStore((state) => state.updateAward)

  const removeAward = useResumeStore((state) => state.removeAward)

  const updateVolunteerExperience = useResumeStore(
    (state) => state.updateVolunteerExperience,
  )

  const removeVolunteerExperience = useResumeStore(
    (state) => state.removeVolunteerExperience,
  )

  const updatePublication = useResumeStore((state) => state.updatePublication)

  const removePublication = useResumeStore((state) => state.removePublication)

  const updateReference = useResumeStore((state) => state.updateReference)

  const removeReference = useResumeStore((state) => state.removeReference)

  const [activeSection, setActiveSection] = useState<ResumeSectionId | "">("")

  const copy = isArabic
    ? {
        summary: "الملخص المهني",

        experience: "الخبرات العملية",

        education: "التعليم",

        skills: "المهارات",

        projects: "المشاريع",

        certifications: "الشهادات",

        languages: "اللغات",

        awards: "الجوائز والإنجازات",

        volunteer: "العمل التطوعي",

        publications: "المنشورات",

        references: "المراجع",

        custom: "قسم إضافي",

        addSection: "+ إضافة قسم مخصص",

        addEntry: "+ إضافة عنصر",

        visible: "ظاهر في السيرة",

        open: "تعديل القسم",

        summaryHint: "عدّل محتوى الملخص من المعلومات الأساسية أعلاه.",

        titlePlaceholder: "مثال: جائزة التميز",

        issuerPlaceholder: "مثال: الجهة أو المؤسسة",

        organizationPlaceholder: "مثال: مؤسسة مجتمعية",

        rolePlaceholder: "مثال: مرشد تقني",

        publicationPlaceholder: "مثال: أثر التقنية على التعليم",

        publisherPlaceholder: "مثال: مجلة أو منصة نشر",

        referencePlaceholder: "مثال: الاسم الكامل",

        urlPlaceholder: "https://example.com",

        languagePlaceholder: "مثال: العربية",

        proficiencyPlaceholder: "مثال: متقدم",

        customTitlePlaceholder: "مثال: الأنشطة المهنية",

        customEntryPlaceholder: "مثال: عنوان النشاط",

        title: "العنوان",

        issuer: "الجهة المانحة",

        date: "التاريخ",

        description: "الوصف",

        language: "اللغة",

        proficiency: "مستوى الإتقان",

        organization: "المؤسسة",

        role: "الدور",

        startDate: "تاريخ البداية",

        endDate: "تاريخ النهاية",

        publisher: "الناشر",

        url: "الرابط",

        name: "الاسم",

        position: "المنصب",

        email: "البريد الإلكتروني",

        phone: "الهاتف",

        subtitle: "تفاصيل إضافية",

        addField: "+ إضافة حقل",

        fieldName: "اسم الحقل",

        fieldValue: "القيمة",

        item: "عنصر",

        languageItem: "لغة",

        awardItem: "إنجاز",

        volunteerItem: "تطوع",

        publicationItem: "منشور",

        referenceItem: "مرجع",

        customEntry: "محتوى مخصص",

        remove: "حذف",

        proficiencyHint: "مثال: اللغة الأم، متقدم، متوسط",

        addSkill: "+ إضافة مهارة",

        addSkillCategory: "+ إضافة فئة مهارات",

        skillCategory: "الفئة",

        skillItems: "المهارات (افصل بينها بفاصلة)",

        skillCategoryPlaceholder: "مثال: الواجهات الأمامية",

        skillItemsPlaceholder: "مثال: React، TypeScript، Next.js",

        duplicate: "نسخ",

        startHere: "ابدأ هنا",

        incomplete: "أكمل البيانات",

        complete: "مكتمل",

        emptyState: "لا توجد بيانات بعد. أضف أول عنصر للبدء.",
      }
    : {
        summary: "Professional summary",

        experience: "Work experience",

        education: "Education",

        skills: "Skills",

        projects: "Projects",

        certifications: "Certifications",

        languages: "Languages",

        awards: "Awards & achievements",

        volunteer: "Volunteer experience",

        publications: "Publications",

        references: "References",

        custom: "Custom section",

        addSection: "+ Add custom section",

        addEntry: "+ Add entry",

        visible: "Show on resume",

        open: "Edit section",

        summaryHint: "Edit your summary in Basic information above.",

        titlePlaceholder: "Example: Excellence Award",

        issuerPlaceholder: "Example: Awarding organization",

        organizationPlaceholder: "Example: Community organization",

        rolePlaceholder: "Example: Technical mentor",

        publicationPlaceholder: "Example: How technology shapes education",

        publisherPlaceholder: "Example: Journal or publisher",

        referencePlaceholder: "Example: Full name",

        urlPlaceholder: "https://example.com",

        languagePlaceholder: "Example: Arabic",

        proficiencyPlaceholder: "Example: Fluent",

        customTitlePlaceholder: "Example: Professional activities",

        customEntryPlaceholder: "Example: Activity title",

        title: "Title",

        issuer: "Issuer",

        date: "Date",

        description: "Description",

        language: "Language",

        proficiency: "Proficiency",

        organization: "Organization",

        role: "Role",

        startDate: "Start date",

        endDate: "End date",

        publisher: "Publisher",

        url: "URL",

        name: "Name",

        position: "Position",

        email: "Email",

        phone: "Phone",

        subtitle: "Additional details",

        addField: "+ Add field",

        fieldName: "Field name",

        fieldValue: "Value",

        item: "Entry",

        languageItem: "Language",

        awardItem: "Achievement",

        volunteerItem: "Volunteer role",

        publicationItem: "Publication",

        referenceItem: "Reference",

        customEntry: "Custom entry",

        remove: "Remove",

        proficiencyHint: "For example: Native, Fluent, Intermediate",

        addSkill: "+ Add skill",

        addSkillCategory: "+ Add skill category",

        skillCategory: "Category",

        skillItems: "Skills (comma-separated)",

        skillCategoryPlaceholder: "Example: Frontend",

        skillItemsPlaceholder: "Example: React, TypeScript, Next.js",

        duplicate: "Duplicate",

        startHere: "Start here",

        incomplete: "Add details",

        complete: "Complete",

        emptyState: "No entries yet. Add your first one to get started.",
      }

  const labels: Record<string, string> = {
    summary: copy.summary,

    experience: copy.experience,

    education: copy.education,

    skills: copy.skills,

    projects: copy.projects,

    certifications: copy.certifications,

    languages: copy.languages,

    awards: copy.awards,

    volunteer: copy.volunteer,

    publications: copy.publications,

    references: copy.references,
  }

  const allSectionIds = [
    ...new Set([
      ...sectionLayout.order,

      ...customSections.map((section) => `custom:${section.id}` as const),
    ]),
  ]

  const renderEntryRow = (
    sectionId: ResumeSectionId,

    entryId: string,

    index: number,

    count: number,

    content: ReactNode,
  ) => (
    <div className="section-entry-row" key={entryId}>
      <div className="section-entry-controls">
        <button
          type="button"
          aria-label={isArabic ? "تحريك لأعلى" : "Move up"}
          disabled={index === 0}
          onClick={() => moveEntry(sectionId, entryId, -1)}
        >
          ↑
        </button>
        <button
          type="button"
          aria-label={isArabic ? "نسخ العنصر" : "Duplicate entry"}
          onClick={() => duplicateEntry(sectionId, entryId)}
        >
          +
        </button>
        <button
          type="button"
          aria-label={isArabic ? "تحريك لأسفل" : "Move down"}
          disabled={index === count - 1}
          onClick={() => moveEntry(sectionId, entryId, 1)}
        >
          ↓
        </button>
      </div>
      {content}
    </div>
  )

  const hasSectionContent = (id: ResumeSectionId) => {
    switch (id) {
      case "summary":
        return summary.trim().length > 0
      case "experience":
        return experiences.some(
          (item) => item.job.trim() && item.company.trim(),
        )
      case "education":
        return education.some(
          (item) => item.degree.trim() && item.school.trim(),
        )
      case "skills":
        return skills.some(
          (category) => category.category.trim() || category.skills.trim(),
        )
      case "projects":
        return projects.some((item) => item.name.trim())
      case "certifications":
        return certifications.some((item) => item.name.trim())
      case "languages":
        return languages.some((item) => item.name.trim())
      case "awards":
        return awards.some((item) => item.title.trim())
      case "volunteer":
        return volunteerExperiences.some(
          (item) => item.role.trim() && item.organization.trim(),
        )
      case "publications":
        return publications.some((item) => item.title.trim())
      case "references":
        return references.some((item) => item.name.trim())
      default:
        return (
          id.startsWith("custom:") &&
          customSections.some(
            (section) =>
              section.id === id.slice("custom:".length) &&
              section.title.trim() &&
              section.entries.some((entry) => entry.title.trim()),
          )
        )
    }
  }

  const sectionEntryCount = (id: ResumeSectionId) => {
    switch (id) {
      case "summary":
        return summary.trim() ? 1 : 0
      case "experience":
        return experiences.length
      case "education":
        return education.length
      case "skills":
        return skills.length
      case "projects":
        return projects.length
      case "certifications":
        return certifications.length
      case "languages":
        return languages.length
      case "awards":
        return awards.length
      case "volunteer":
        return volunteerExperiences.length
      case "publications":
        return publications.length
      case "references":
        return references.length
      default:
        return (
          customSections.find(
            (section) => section.id === id.slice("custom:".length),
          )?.entries.length ?? 0
        )
    }
  }

  const panelFor = (id: ResumeSectionId): ReactNode => {
    switch (id) {
      case "summary":
        return <p className="section-manager-hint">{copy.summaryHint}</p>

      case "experience":
        return (
          <>
            {experiences.map((item, index) =>
              renderEntryRow(
                id,

                item.id,

                index,

                experiences.length,

                <ExperienceFields key={item.id} experience={item} />,
              ),
            )}
            <button
              className="add-item-button"
              onClick={addExperience}
              type="button"
            >
              {copy.addEntry}
            </button>
          </>
        )

      case "education":
        return (
          <>
            {education.map((item, index) =>
              renderEntryRow(
                id,

                item.id,

                index,

                education.length,

                <EducationFields key={item.id} education={item} />,
              ),
            )}
            <button
              className="add-item-button"
              onClick={addEducation}
              type="button"
            >
              {copy.addEntry}
            </button>
          </>
        )

      case "skills":
        return (
          <>
            {skills.map((category, index) => (
              <div
                className="section-entry-row skill-category-editor-row"
                key={category.id}
              >
                <div className="section-entry-controls">
                  <button
                    type="button"
                    aria-label={isArabic ? "تحريك الفئة لأعلى" : "Move category up"}
                    disabled={index === 0}
                    onClick={() => moveSkill(index, -1)}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    aria-label={isArabic ? "نسخ فئة المهارات" : "Duplicate skill category"}
                    onClick={() =>
                      updateSkills([
                        ...skills.slice(0, index + 1),
                        { ...category, id: crypto.randomUUID() },
                        ...skills.slice(index + 1),
                      ])
                    }
                  >
                    +
                  </button>
                  <button
                    type="button"
                    aria-label={isArabic ? "تحريك الفئة لأسفل" : "Move category down"}
                    disabled={index === skills.length - 1}
                    onClick={() => moveSkill(index, 1)}
                  >
                    ↓
                  </button>
                </div>
                <div className="skill-editor-field">
                  <EntryFields
                    label={copy.skillCategory}
                    value={category.category}
                    placeholder={copy.skillCategoryPlaceholder}
                    onChange={(value) =>
                      updateSkills(
                        skills.map((current, currentIndex) =>
                          currentIndex === index
                            ? { ...current, category: value }
                            : current,
                        ),
                      )
                    }
                    isArabic={isArabic}
                  />
                  <EntryFields
                    label={copy.skillItems}
                    value={category.skills}
                    placeholder={copy.skillItemsPlaceholder}
                    onChange={(value) =>
                      updateSkills(
                        skills.map((current, currentIndex) =>
                          currentIndex === index
                            ? { ...current, skills: value }
                            : current,
                        ),
                      )
                    }
                    isArabic={isArabic}
                  />
                  <button
                    className="remove-item-button"
                    type="button"
                    onClick={() =>
                      updateSkills(
                        skills.filter((_, currentIndex) => currentIndex !== index),
                      )
                    }
                  >
                    {copy.remove}
                  </button>
                </div>
              </div>
            ))}
            <button
              className="add-item-button"
              type="button"
              onClick={addSkillCategory}
            >
              {copy.addSkillCategory}
            </button>
          </>
        )

      case "projects":
        return (
          <>
            {projects.map((item, index) =>
              renderEntryRow(
                id,

                item.id,

                index,

                projects.length,

                <ProjectFields key={item.id} project={item} />,
              ),
            )}
            <button
              className="add-item-button"
              onClick={addProject}
              type="button"
            >
              {copy.addEntry}
            </button>
          </>
        )

      case "certifications":
        return (
          <>
            {certifications.map((item, index) =>
              renderEntryRow(
                id,

                item.id,

                index,

                certifications.length,

                <CertificationFields key={item.id} certification={item} />,
              ),
            )}
            <button
              className="add-item-button"
              onClick={addCertification}
              type="button"
            >
              {copy.addEntry}
            </button>
          </>
        )

      case "languages":
        return (
          <>
            {languages.map((item, index) => (
              <EntryCard
                key={item.id}
                title={`${copy.languageItem} ${index + 1}`}
                onRemove={() => removeLanguage(item.id)}
                onDuplicate={() => duplicateEntry(id, item.id)}
                onMove={(direction) => moveEntry(id, item.id, direction)}
                isFirst={index === 0}
                isLast={index === languages.length - 1}
              >
                <EntryFields
                  label={copy.language}
                  value={item.name}
                  onChange={(name) => updateLanguage(item.id, { name })}
                  placeholder={copy.languagePlaceholder}
                  required
                  isArabic={isArabic}
                />
                <EntryFields
                  label={copy.proficiency}
                  value={item.proficiency}
                  onChange={(proficiency) =>
                    updateLanguage(item.id, { proficiency })
                  }
                  placeholder={copy.proficiencyPlaceholder}
                  isArabic={isArabic}
                />
                <small className="section-field-hint">
                  {copy.proficiencyHint}
                </small>
              </EntryCard>
            ))}
            <button
              className="add-item-button"
              onClick={addLanguage}
              type="button"
            >
              {copy.addEntry}
            </button>
          </>
        )

      case "awards":
        return (
          <>
            {awards.map((item, index) => (
              <EntryCard
                key={item.id}
                title={`${copy.awardItem} ${index + 1}`}
                onRemove={() => removeAward(item.id)}
                onDuplicate={() => duplicateEntry(id, item.id)}
                onMove={(direction) => moveEntry(id, item.id, direction)}
                isFirst={index === 0}
                isLast={index === awards.length - 1}
              >
                <EntryFields
                  label={copy.title}
                  value={item.title}
                  onChange={(title) => updateAward(item.id, { title })}
                  placeholder={copy.titlePlaceholder}
                  required
                  isArabic={isArabic}
                />
                <EntryFields
                  label={copy.issuer}
                  value={item.issuer}
                  onChange={(issuer) => updateAward(item.id, { issuer })}
                  placeholder={copy.issuerPlaceholder}
                  isArabic={isArabic}
                />
                <EntryFields
                  label={copy.date}
                  value={item.date}
                  onChange={(date) => updateAward(item.id, { date })}
                  type="date"
                  isArabic={isArabic}
                />
                <EntryFields
                  label={copy.description}
                  value={item.description}
                  onChange={(description) =>
                    updateAward(item.id, { description })
                  }
                  placeholder={
                    isArabic
                      ? "مثال: سبب منح الجائزة أو أثرها"
                      : "Example: Why it was awarded or its impact"
                  }
                  multiline
                  isArabic={isArabic}
                />
              </EntryCard>
            ))}
            <button
              className="add-item-button"
              onClick={addAward}
              type="button"
            >
              {copy.addEntry}
            </button>
          </>
        )

      case "volunteer":
        return (
          <>
            {volunteerExperiences.map((item, index) => (
              <EntryCard
                key={item.id}
                title={`${copy.volunteerItem} ${index + 1}`}
                onRemove={() => removeVolunteerExperience(item.id)}
                onDuplicate={() => duplicateEntry(id, item.id)}
                onMove={(direction) => moveEntry(id, item.id, direction)}
                isFirst={index === 0}
                isLast={index === volunteerExperiences.length - 1}
              >
                <EntryFields
                  label={copy.organization}
                  value={item.organization}
                  onChange={(organization) =>
                    updateVolunteerExperience(item.id, { organization })
                  }
                  placeholder={copy.organizationPlaceholder}
                  required
                  isArabic={isArabic}
                />
                <EntryFields
                  label={copy.role}
                  value={item.role}
                  onChange={(role) =>
                    updateVolunteerExperience(item.id, { role })
                  }
                  placeholder={copy.rolePlaceholder}
                  required
                  isArabic={isArabic}
                />
                <EntryFields
                  label={copy.startDate}
                  value={item.startDate}
                  onChange={(startDate) =>
                    updateVolunteerExperience(item.id, { startDate })
                  }
                  type="date"
                  isArabic={isArabic}
                />
                <EntryFields
                  label={copy.endDate}
                  value={item.endDate}
                  onChange={(endDate) =>
                    updateVolunteerExperience(item.id, { endDate })
                  }
                  type="date"
                  isArabic={isArabic}
                />
                <EntryFields
                  label={copy.description}
                  value={item.description}
                  onChange={(description) =>
                    updateVolunteerExperience(item.id, { description })
                  }
                  placeholder={
                    isArabic
                      ? "مثال: المبادرة أو الأثر الذي ساهمت فيه"
                      : "Example: The initiative or impact you contributed to"
                  }
                  multiline
                  isArabic={isArabic}
                />
              </EntryCard>
            ))}
            <button
              className="add-item-button"
              onClick={addVolunteerExperience}
              type="button"
            >
              {copy.addEntry}
            </button>
          </>
        )

      case "publications":
        return (
          <>
            {publications.map((item, index) => (
              <EntryCard
                key={item.id}
                title={`${copy.publicationItem} ${index + 1}`}
                onRemove={() => removePublication(item.id)}
                onDuplicate={() => duplicateEntry(id, item.id)}
                onMove={(direction) => moveEntry(id, item.id, direction)}
                isFirst={index === 0}
                isLast={index === publications.length - 1}
              >
                <EntryFields
                  label={copy.title}
                  value={item.title}
                  onChange={(title) => updatePublication(item.id, { title })}
                  placeholder={copy.publicationPlaceholder}
                  required
                  isArabic={isArabic}
                />
                <EntryFields
                  label={copy.publisher}
                  value={item.publisher}
                  onChange={(publisher) =>
                    updatePublication(item.id, { publisher })
                  }
                  placeholder={copy.publisherPlaceholder}
                  isArabic={isArabic}
                />
                <EntryFields
                  label={copy.date}
                  value={item.date}
                  onChange={(date) => updatePublication(item.id, { date })}
                  type="date"
                  isArabic={isArabic}
                />
                <EntryFields
                  label={copy.url}
                  value={item.url}
                  onChange={(url) => updatePublication(item.id, { url })}
                  type="url"
                  placeholder={copy.urlPlaceholder}
                  isArabic={isArabic}
                />
                <EntryFields
                  label={copy.description}
                  value={item.description}
                  onChange={(description) =>
                    updatePublication(item.id, { description })
                  }
                  placeholder={
                    isArabic
                      ? "مثال: ملخص قصير عن المنشور"
                      : "Example: A short summary of the publication"
                  }
                  multiline
                  isArabic={isArabic}
                />
              </EntryCard>
            ))}
            <button
              className="add-item-button"
              onClick={addPublication}
              type="button"
            >
              {copy.addEntry}
            </button>
          </>
        )

      case "references":
        return (
          <>
            {references.map((item, index) => (
              <EntryCard
                key={item.id}
                title={`${copy.referenceItem} ${index + 1}`}
                onRemove={() => removeReference(item.id)}
                onDuplicate={() => duplicateEntry(id, item.id)}
                onMove={(direction) => moveEntry(id, item.id, direction)}
                isFirst={index === 0}
                isLast={index === references.length - 1}
              >
                <EntryFields
                  label={copy.name}
                  value={item.name}
                  onChange={(name) => updateReference(item.id, { name })}
                  placeholder={copy.referencePlaceholder}
                  required
                  isArabic={isArabic}
                />
                <EntryFields
                  label={copy.position}
                  value={item.position}
                  onChange={(position) =>
                    updateReference(item.id, { position })
                  }
                  isArabic={isArabic}
                />
                <EntryFields
                  label={copy.organization}
                  value={item.organization}
                  onChange={(organization) =>
                    updateReference(item.id, { organization })
                  }
                  isArabic={isArabic}
                />
                <EntryFields
                  label={copy.email}
                  value={item.email}
                  onChange={(email) => updateReference(item.id, { email })}
                  type="email"
                  isArabic={isArabic}
                />
                <EntryFields
                  label={copy.phone}
                  value={item.phone}
                  onChange={(phone) => updateReference(item.id, { phone })}
                  type="tel"
                  isArabic={isArabic}
                />
              </EntryCard>
            ))}
            <button
              className="add-item-button"
              onClick={addReference}
              type="button"
            >
              {copy.addEntry}
            </button>
          </>
        )

      default: {
        if (!id.startsWith("custom:")) return null

        const section = customSections.find(
          (item) => item.id === id.slice("custom:".length),
        )

        if (!section) return null

        return (
          <>
            <EntryFields
              label={copy.title}
              value={section.title}
              onChange={(title) => updateCustomSection(section.id, { title })}
              placeholder={copy.customTitlePlaceholder}
              required
              isArabic={isArabic}
            />
            {section.entries.map((entry, index) => (
              <EntryCard
                key={entry.id}
                title={`${copy.customEntry} ${index + 1}`}
                onRemove={() => removeCustomEntry(section.id, entry.id)}
                onDuplicate={() => duplicateEntry(id, entry.id)}
                onMove={(direction) => moveEntry(id, entry.id, direction)}
                isFirst={index === 0}
                isLast={index === section.entries.length - 1}
              >
                <EntryFields
                  label={copy.title}
                  value={entry.title}
                  onChange={(title) =>
                    updateCustomEntry(section.id, entry.id, { title })
                  }
                  placeholder={copy.customEntryPlaceholder}
                  required
                  isArabic={isArabic}
                />
                <EntryFields
                  label={copy.subtitle}
                  value={entry.subtitle}
                  onChange={(subtitle) =>
                    updateCustomEntry(section.id, entry.id, { subtitle })
                  }
                  isArabic={isArabic}
                />
                <EntryFields
                  label={copy.date}
                  value={entry.date}
                  onChange={(date) =>
                    updateCustomEntry(section.id, entry.id, { date })
                  }
                  isArabic={isArabic}
                />
                <EntryFields
                  label={copy.description}
                  value={entry.description}
                  onChange={(description) =>
                    updateCustomEntry(section.id, entry.id, { description })
                  }
                  multiline
                  isArabic={isArabic}
                />
                {entry.fields.map((field) => (
                  <div className="custom-field-editor" key={field.id}>
                    <EntryFields
                      label={copy.fieldName}
                      value={field.label}
                      onChange={(label) =>
                        updateCustomField(section.id, entry.id, field.id, {
                          label,
                        })
                      }
                      isArabic={isArabic}
                    />
                    <EntryFields
                      label={copy.fieldValue}
                      value={field.value}
                      onChange={(value) =>
                        updateCustomField(section.id, entry.id, field.id, {
                          value,
                        })
                      }
                      isArabic={isArabic}
                    />
                    <button
                      className="remove-item-button"
                      type="button"
                      onClick={() =>
                        removeCustomField(section.id, entry.id, field.id)
                      }
                    >
                      {copy.remove}
                    </button>
                  </div>
                ))}
                <button
                  className="add-item-button"
                  type="button"
                  onClick={() => addCustomField(section.id, entry.id)}
                >
                  {copy.addField}
                </button>
              </EntryCard>
            ))}
            <button
              className="add-item-button"
              type="button"
              onClick={() => addCustomEntry(section.id)}
            >
              {copy.addEntry}
            </button>
            <button
              className="remove-item-button section-remove-button"
              type="button"
              onClick={() => removeCustomSection(section.id)}
            >
              {copy.remove}
            </button>
          </>
        )
      }
    }
  }

  return (
    <section className="resume-section-manager" aria-label={copy.open}>
      <div className="section-manager-heading">
        <strong>{isArabic ? "الأقسام وترتيبها" : "Sections & order"}</strong>
        <button
          className="add-item-button"
          type="button"
          onClick={() => {
            const id = addCustomSection()

            setActiveSection(`custom:${id}`)
          }}
        >
          {copy.addSection}
        </button>
      </div>
      <div className="section-manager-list">
        {allSectionIds.map((id, index) => {
          const label = id.startsWith("custom:")
            ? customSections.find(
                (section) => section.id === id.slice("custom:".length),
              )?.title || copy.custom
            : labels[id]

          const visible = !sectionLayout.hidden.includes(id)

          const open = activeSection === id
          const sectionComplete = hasSectionContent(id)

          return (
            <div className="section-manager-item" key={id}>
              <div className="section-manager-row">
                <button
                  className={`section-manager-open${open ? " active" : ""}`}
                  type="button"
                  aria-label={`${copy.open}: ${label}`}
                  aria-expanded={open}
                  onClick={() => setActiveSection(open ? "" : id)}
                >
                  <SectionGlyph sectionId={id} />
                  <span className="section-manager-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {label}
                  <small
                    className={`section-completion${
                      sectionComplete ? " complete" : ""
                    }`}
                  >
                    {sectionComplete
                      ? copy.complete
                      : sectionEntryCount(id) > 0
                        ? copy.incomplete
                        : copy.startHere}
                  </small>
                  <b>{open ? "−" : "+"}</b>
                </button>
                <label className="section-visibility-control">
                  <input
                    type="checkbox"
                    checked={visible}
                    aria-label={`${copy.visible}: ${label}`}
                    onChange={(event) =>
                      setSectionVisible(id, event.target.checked)
                    }
                  />
                </label>
                <div className="section-order-controls">
                  <button
                    type="button"
                    aria-label={`${
                      isArabic ? "تحريك القسم لأعلى" : "Move section up"
                    }: ${label}`}
                    disabled={index === 0}
                    onClick={() => moveSection(id, -1)}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    aria-label={`${
                      isArabic ? "تحريك القسم لأسفل" : "Move section down"
                    }: ${label}`}
                    disabled={index === allSectionIds.length - 1}
                    onClick={() => moveSection(id, 1)}
                  >
                    ↓
                  </button>
                </div>
              </div>
              {open && (
                <div
                  className="sub-form section-manager-form"
                  data-section-editor={id}
                >
                  {id !== "summary" && sectionEntryCount(id) === 0 && (
                    <p className="section-empty-state">{copy.emptyState}</p>
                  )}
                  {panelFor(id)}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
