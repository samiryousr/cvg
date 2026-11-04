"use client"

import { useEffect, useRef, useState } from "react"
import { useResumeStore } from "@/features/resume-builder/store"
import {
  getTemplateDefinition,
  normalizeTemplateId,
  templateRegistryEntries,
} from "@/features/resume-builder/template-registry"
import {
  ProfilePhotoField,
  SummaryField,
  TextField,
} from "@/components/resume-builder/ResumeEditorFields"
import { LiveResumePreview } from "@/components/resume-builder/LiveResumePreview"
import { ResumeSectionManager } from "@/components/resume-builder/ResumeSectionManager"
import { ThemeToggle } from "@/components/ThemeToggle"

export function ResumeEditor({ onBack }: { onBack: () => void }) {
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

  const templateId = useResumeStore((state) => state.templateId)

  const editorLanguage = useResumeStore((state) => state.editorLanguage)

  const isArabic = editorLanguage === "ar"

  const documentLanguage = useResumeStore((state) => state.documentLanguage)

  const templateDefinition = getTemplateDefinition(templateId)

  const primaryColor = useResumeStore((state) => state.primaryColor)

  const setTemplate = useResumeStore((state) => state.setTemplate)

  const setEditorLanguage = useResumeStore((state) => state.setEditorLanguage)

  const setDocumentLanguage = useResumeStore(
    (state) => state.setDocumentLanguage,
  )

  const setPrimaryColor = useResumeStore((state) => state.setPrimaryColor)

  const [isSaving, setIsSaving] = useState(false)
  const hasMounted = useRef(false)

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true
      return
    }

    setIsSaving(true)
    const timer = window.setTimeout(() => setIsSaving(false), 450)
    return () => window.clearTimeout(timer)
  }, [
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
    templateId,
    documentLanguage,
    primaryColor,
  ])

  const copy = {
    saved: isArabic ? "محفوظ تلقائيًا على هذا الجهاز" : "Saved on this device",
    saving: isArabic ? "جارٍ حفظ التغييرات..." : "Saving changes...",
    savedChanges: isArabic
      ? "تم حفظ التغييرات على هذا الجهاز"
      : "Changes saved on this device",
    newResume: isArabic ? "سيرة ذاتية جديدة" : "Untitled resume",
    home: isArabic ? "العودة للرئيسية" : "Back to home",
    downloadPdf: isArabic ? "حفظ PDF" : "Save as PDF",
    checkingAts: isArabic
      ? "جارٍ فحص السيرة عبر ATS"
      : "Checking your CV with ATS",
    atsSimulationNote: isArabic
      ? "محاكاة مرئية وتجهيز للتنزيل، وليست نتيجة فحص حقيقية."
      : "A visual simulation while preparing your download, not a real ATS result.",
    completion: isArabic ? "اكتمال السيرة" : "Resume completion",
    basicInformation: isArabic ? "المعلومات الأساسية" : "Basic information",
    editHint: isArabic
      ? "أضف بياناتك واختر لغة السيرة من الإعدادات؛ ستظهر تعديلاتك مباشرة في المعاينة."
      : "Add your information and choose the resume language in settings. Changes appear in the preview as you edit.",
    template: isArabic ? "القالب" : "Template",
    documentLanguage: isArabic ? "لغة السيرة الذاتية" : "Resume language",
    portfolio: isArabic ? "رابط الموقع أو الأعمال" : "Portfolio URL",
    atsNote: isArabic
      ? "قالب أحادي العمود بتنسيق واضح. لغة السيرة مستقلة عن لغة خانات الإدخال."
      : "A clear single-column layout. Resume language is independent from input labels.",
    primaryColor: isArabic ? "اللون الأساسي" : "Primary color",
    primaryColorAria: isArabic
      ? "اختيار اللون الأساسي للقالب"
      : "Choose the template's primary color",
    experience: isArabic ? "الخبرات العملية" : "Work experience",
    education: isArabic ? "التعليم" : "Education",
    skills: isArabic ? "المهارات" : "Skills",
    projects: isArabic ? "المشاريع" : "Projects",
    certifications: isArabic ? "الشهادات" : "Certifications",
    addExperience: isArabic ? "+ إضافة خبرة" : "+ Add experience",
    addEducation: isArabic ? "+ إضافة مؤهل تعليمي" : "+ Add education",
    addProject: isArabic ? "+ إضافة مشروع" : "+ Add project",
    addCertification: isArabic ? "+ إضافة شهادة" : "+ Add certification",
    livePreview: isArabic ? "معاينة مباشرة" : "Live preview",
    previewHint: isArabic
      ? "التعديلات تظهر هنا تلقائيًا"
      : "Your changes appear here automatically",
    language: isArabic ? "لغة خانات الإدخال" : "Input language",
    arabic: "العربية",
    english: "English",
    edit: isArabic ? "التعديل" : "Edit",
    preview: isArabic ? "المعاينة" : "Preview",
  }

  const [activeMobilePanel, setActiveMobilePanel] =
    useState<"form" | "preview">("form")
  const [isCheckingAts, setIsCheckingAts] = useState(false)

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

    ...skills,
  ]

  const completion = Math.round(
    (completionFields.filter((field) => field.trim().length > 0).length /
      Math.max(completionFields.length, 1)) *
      100,
  )

  const printResume = async () => {
    const previousPanel = activeMobilePanel
    const previousTitle = document.title
    const isMobile = window.matchMedia("(max-width: 520px)").matches
    const shouldCheckAts = templateDefinition.atsOptimized === true
    const safeName =
      personal.name
        .trim()
        .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "-")
        .replace(/\s+/g, "-") || "resume"

    if (isMobile && previousPanel !== "preview") {
      setActiveMobilePanel("preview")
      await new Promise<void>((resolve) => {
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => resolve())
        })
      })
    }

    if (shouldCheckAts) {
      setIsCheckingAts(true)
      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, 2000)
      })
      setIsCheckingAts(false)
    }

    document.title = `CV-${safeName}`
    try {
      window.print()
    } finally {
      document.title = previousTitle
      setIsCheckingAts(false)
      if (isMobile && previousPanel !== "preview") {
        setActiveMobilePanel(previousPanel)
      }
    }
  }

  return (
    <div className="editor-shell" dir="ltr">
      {isCheckingAts && (
        <div className="ats-loading-overlay" role="status" aria-live="polite">
          <div className="ats-loading-card" dir={isArabic ? "rtl" : "ltr"}>
            <div className="ats-animation-stage" aria-hidden="true">
              <span className="ats-scanner-gate" />
              <span className="ats-resume-sheet">
                <i />
                <i />
                <i />
                <i />
                <i />
              </span>
            </div>
            <h2>{copy.checkingAts}</h2>
            <p>{copy.atsSimulationNote}</p>
            <div className="ats-progress-track" aria-hidden="true">
              <span />
            </div>
          </div>
        </div>
      )}
      <header className="editor-header" dir="ltr">
        <div className="editor-header-identity">
          <button
            className="home-button"
            type="button"
            onClick={onBack}
            aria-label={copy.home}
          >
            {copy.home}
          </button>
          <div className="editor-document-title" dir={isArabic ? "rtl" : "ltr"}>
            <strong>{personal.name.trim() || copy.newResume}</strong>
            <span
              className={`save-state${isSaving ? " saving" : ""}`}
              role="status"
              aria-live="polite"
            >
              <span />
              {isSaving
                ? copy.saving
                : hasMounted.current
                  ? copy.savedChanges
                  : copy.saved}
            </span>
          </div>
        </div>
        <div className="editor-toolbar-selects" dir={isArabic ? "rtl" : "ltr"}>
          <label className="toolbar-select">
            <span>{copy.template}</span>
            <select
              value={templateId}
              onChange={(event) =>
                setTemplate(normalizeTemplateId(event.target.value, "ats"))
              }
              aria-label={copy.template}
            >
              {templateRegistryEntries.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </label>
          <label className="toolbar-select">
            <span>{copy.documentLanguage}</span>
            <select
              value={documentLanguage}
              onChange={(event) =>
                setDocumentLanguage(event.target.value === "ar" ? "ar" : "en")
              }
              aria-label={copy.documentLanguage}
            >
              <option value="ar">العربية</option>
              <option value="en">English</option>
            </select>
          </label>
        </div>
        <div className="header-actions">
          <ThemeToggle />
          <button
            className="download-button"
            onClick={printResume}
            disabled={isCheckingAts}
            type="button"
          >
            {copy.downloadPdf}
          </button>
        </div>
      </header>

      <div className="editor-layout">
        <div
          className="mobile-editor-tabs"
          role="tablist"
          aria-label={isArabic ? "عرض السيرة الذاتية" : "Resume view"}
        >
          <button
            id="mobile-form-tab"
            type="button"
            role="tab"
            aria-selected={activeMobilePanel === "form"}
            aria-controls="editor-form-panel"
            className={activeMobilePanel === "form" ? "active" : ""}
            onClick={() => setActiveMobilePanel("form")}
          >
            {copy.edit}
          </button>
          <button
            id="mobile-preview-tab"
            type="button"
            role="tab"
            aria-selected={activeMobilePanel === "preview"}
            aria-controls="editor-preview-panel"
            className={activeMobilePanel === "preview" ? "active" : ""}
            onClick={() => setActiveMobilePanel("preview")}
          >
            {copy.preview}
          </button>
        </div>
        <aside
          id="editor-form-panel"
          className={`form-panel${
            activeMobilePanel === "form" ? "" : " mobile-panel-hidden"
          }`}
          dir={isArabic ? "rtl" : "ltr"}
          role="tabpanel"
          aria-labelledby="mobile-form-tab"
        >
          <div className="progress-row">
            <span>{copy.completion}</span>
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

          <div
            className="editor-language-switch"
            role="group"
            aria-label={copy.language}
          >
            <span>{copy.language}</span>
            <div>
              <button
                type="button"
                aria-pressed={isArabic}
                className={isArabic ? "active" : ""}
                onClick={() => setEditorLanguage("ar")}
              >
                {copy.arabic}
              </button>
              <button
                type="button"
                aria-pressed={!isArabic}
                className={!isArabic ? "active" : ""}
                onClick={() => setEditorLanguage("en")}
              >
                {copy.english}
              </button>
            </div>
          </div>

          <div className="form-title">
            <span>01</span>
            <div>
              <h2>{copy.basicInformation}</h2>
              <p>{copy.editHint}</p>
            </div>
          </div>

          <section className="editor-settings" aria-label={copy.template}>
            {templateDefinition.atsOptimized && (
              <p className="template-note">{copy.atsNote}</p>
            )}
            {templateDefinition.supportsColor && (
              <label className="color-field">
                <span>{copy.primaryColor}</span>
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(event) => setPrimaryColor(event.target.value)}
                  aria-label={copy.primaryColorAria}
                />
              </label>
            )}
            {templateDefinition.supportsPhoto && <ProfilePhotoField />}
          </section>

          <div
            className="form-grid"
            data-field-language={isArabic ? "ar" : "en"}
          >
            <TextField
              labelAr="الاسم بالكامل"
              labelEn="Full name"
              field="name"
              wide
            />
            <TextField
              labelAr="المسمى الوظيفي"
              labelEn="Job title"
              field="role"
              wide
            />
            <TextField
              labelAr="البريد الإلكتروني"
              labelEn="Email address"
              field="email"
            />
            <TextField
              labelAr="رقم الهاتف"
              labelEn="Phone number"
              field="phone"
            />
            <TextField
              labelAr="الموقع"
              labelEn="Location"
              field="location"
              wide
            />
            {templateDefinition.supportsProfessionalLinks && (
              <>
                <TextField
                  labelAr="رابط GitHub"
                  labelEn="GitHub URL"
                  field="github"
                  wide
                />
                <TextField
                  labelAr="رابط LinkedIn"
                  labelEn="LinkedIn URL"
                  field="linkedIn"
                  wide
                />
                <TextField
                  labelAr="رابط الموقع أو الأعمال"
                  labelEn={copy.portfolio}
                  field="portfolio"
                  wide
                />
              </>
            )}
            <SummaryField />
          </div>

          <ResumeSectionManager />
        </aside>

        <main
          id="editor-preview-panel"
          className={`preview-panel${
            activeMobilePanel === "preview" ? "" : " mobile-panel-hidden"
          }`}
          dir="ltr"
          role="tabpanel"
          aria-labelledby="mobile-preview-tab"
        >
          <div className="preview-toolbar">
            <p>
              <span /> {copy.livePreview}
            </p>
            <span>A4</span>
          </div>
          <LiveResumePreview />
          <p className="preview-hint">{copy.previewHint}</p>
        </main>
      </div>
    </div>
  )
}
