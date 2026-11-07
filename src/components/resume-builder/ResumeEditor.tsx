"use client"

import Link from "next/link"
import { useState } from "react"
import { useAuthStore } from "@/store/useAuthStore"
import {
  useResumeSaveStatus,
  useResumeStore,
} from "@/features/resume-builder/store"
import {
  getTemplateDefinition,
  normalizeTemplateId,
  templateRegistryEntries,
} from "@/features/resume-builder/template-registry"
import { hasResumeContent } from "@/features/resume-builder/model"
import {
  ProfilePhotoField,
  SummaryField,
  TextField,
} from "@/components/resume-builder/ResumeEditorFields"
import { LiveResumePreview } from "@/components/resume-builder/LiveResumePreview"
import { ResumeSectionManager } from "@/components/resume-builder/ResumeSectionManager"
import { SaveResumeButton } from "@/components/resume-builder/SaveResumeButton"
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

  const saveStatus = useResumeSaveStatus((state) => state.status)

  const user = useAuthStore((state) => state.user)

  const cloudResumeLoadStatus = useResumeStore(
    (state) => state.cloudResumeLoadStatus,
  )

  const loadUserResume = useResumeStore((state) => state.loadUserResume)

  const hasUserResumeContent = useResumeStore(hasResumeContent)

  const copy = {
    saved: isArabic ? "محفوظ تلقائيًا على هذا الجهاز" : "Saved on this device",
    saving: isArabic ? "جارٍ حفظ التغييرات..." : "Saving changes...",
    savedChanges: isArabic
      ? "تم حفظ التغييرات على هذا الجهاز"
      : "Changes saved on this device",
    saveError: isArabic
      ? "تعذر حفظ التغييرات على هذا الجهاز"
      : "Could not save changes on this device",
    loadingCloudResume: isArabic
      ? "جارٍ تحميل السيرة المحفوظة من حسابك..."
      : "Loading your saved resume from your account...",
    cloudResumeLoadError: isArabic
      ? "تعذر تحميل السيرة من حسابك. يمكنك المحاولة مرة أخرى."
      : "Could not load your resume from your account. Please try again.",
    localDraftPreserved: isArabic
      ? "احتفظنا بمسودتك المحلية ولم نستبدلها بالسيرة المحفوظة في حسابك."
      : "Your local draft was preserved instead of being replaced by your saved resume.",
    viewSavedResumes: isArabic ? "عرض السير المحفوظة" : "View saved resumes",
    retry: isArabic ? "إعادة المحاولة" : "Retry",
    newResume: isArabic ? "سيرة ذاتية جديدة" : "Untitled resume",
    home: isArabic ? "العودة للرئيسية" : "Back to home",
    downloadPdf: isArabic ? "حفظ PDF" : "Save as PDF",
    exportingPdf: isArabic ? "جارٍ إنشاء PDF..." : "Generating PDF...",
    exportFailed: isArabic
      ? "تعذر إنشاء ملف PDF. حاول مرة أخرى."
      : "Could not generate the PDF. Please try again.",
    addDetailsBeforeExport: isArabic
      ? "أضف بعض بياناتك قبل تصدير السيرة الذاتية."
      : "Add some of your own details before exporting your resume.",
    printPdf: isArabic ? "طباعة / حفظ PDF" : "Print / Save PDF",
    printPdfHint: isArabic
      ? "استخدم نافذة الطباعة واختر الحفظ كـ PDF للاحتفاظ بنص قابل للتحديد."
      : "Use the print dialog and choose Save as PDF to keep selectable text.",
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
  const [isExportingPdf, setIsExportingPdf] = useState(false)
  const [exportError, setExportError] = useState("")

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

  const printResume = async () => {
    if (isExportingPdf) return

    if (!hasUserResumeContent) {
      setExportError(copy.addDetailsBeforeExport)
      return
    }

    const previousPanel = activeMobilePanel
    const previousTitle = document.title
    const isMobile = window.matchMedia("(max-width: 520px)").matches
    const usesNativePrint = templateDefinition.atsOptimized === true
    const resumeElement = document.querySelector<HTMLElement>(".resume-paper")
    const safeName =
      personal.name
        .trim()
        .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "-")
        .replace(/\s+/g, "-") || "resume"

    if (!resumeElement) {
      setExportError(copy.exportFailed)
      return
    }

    setExportError("")
    setIsExportingPdf(true)

    if (usesNativePrint) {
      document.title = `CV-${safeName}`
      try {
        window.print()
      } catch (error) {
        console.error("Could not print the ATS resume.", error)
        setExportError(copy.exportFailed)
      } finally {
        document.title = previousTitle
        setIsExportingPdf(false)
      }
      return
    }

    if (isMobile && previousPanel !== "preview") {
      setActiveMobilePanel("preview")
      await new Promise<void>((resolve) => {
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => resolve())
        })
      })
    }

    const previousStyle = resumeElement.getAttribute("style")
    document.title = `CV-${safeName}`
    try {
      const { default: html2pdf } = await import("html2pdf.js")
      resumeElement.style.width = "794px"
      resumeElement.style.minWidth = "794px"
      resumeElement.style.maxWidth = "none"
      resumeElement.style.minHeight = "1123px"
      resumeElement.style.aspectRatio = "210 / 297"
      resumeElement.style.margin = "0"
      resumeElement.style.border = "0"
      resumeElement.style.borderRadius = "0"
      resumeElement.style.boxShadow = "none"

      await html2pdf()
        .set({
          margin: 0,
          filename: `CV-${safeName}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          enableLinks: true,
          html2canvas: {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
            windowWidth: 1024,
            onclone: (clonedDocument: Document) => {
              clonedDocument
                .querySelectorAll('[data-placeholder-only="true"]')
                .forEach((element) => element.remove())
              clonedDocument
                .querySelectorAll(".resume-live-placeholder")
                .forEach((element) => element.remove())
              clonedDocument
                .querySelectorAll("article.resume-item")
                .forEach((item) => {
                  if (!item.textContent?.trim()) item.remove()
                })
              clonedDocument
                .querySelectorAll(".resume-section-shell")
                .forEach((shell) => {
                  const section = shell.querySelector(".resume-section")
                  const heading =
                    section?.querySelector("h2")?.textContent ?? ""
                  const content = (section?.textContent ?? "")
                    .replace(heading, "")
                    .trim()
                  if (section && !content) shell.remove()
                })
            },
          },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(resumeElement)
        .save()
    } catch (error) {
      console.error("Could not export the resume as a PDF.", error)
      setExportError(copy.exportFailed)
    } finally {
      if (previousStyle === null) resumeElement.removeAttribute("style")
      else resumeElement.setAttribute("style", previousStyle)
      document.title = previousTitle
      setIsExportingPdf(false)
      if (isMobile && previousPanel !== "preview") {
        setActiveMobilePanel(previousPanel)
      }
    }
  }

  return (
    <div className="editor-shell" dir="ltr">
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
              className={`save-state${
                saveStatus === "saving" ? " saving" : ""
              }`}
              role="status"
              aria-live="polite"
            >
              <span />
              {saveStatus === "saving"
                ? copy.saving
                : saveStatus === "error"
                  ? copy.saveError
                  : saveStatus === "saved"
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
          {user ? (
            <SaveResumeButton isArabic={isArabic} />
          ) : (
            <Link className="cloud-save-button" href="/auth">
              {isArabic ? "دخول للحفظ السحابي" : "Sign in to save"}
            </Link>
          )}
          <button
            className="download-button"
            onClick={printResume}
            disabled={isExportingPdf}
            type="button"
            title={
              templateDefinition.atsOptimized ? copy.printPdfHint : undefined
            }
          >
            {isExportingPdf
              ? copy.exportingPdf
              : templateDefinition.atsOptimized
                ? copy.printPdf
                : copy.downloadPdf}
          </button>
        </div>
      </header>
      {exportError && (
        <p className="pdf-export-error" role="alert">
          {exportError}
        </p>
      )}
      {user && cloudResumeLoadStatus === "loading" && (
        <p
          className="cloud-save-feedback"
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <svg
            className="me-2 inline size-4 animate-spin align-[-3px]"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="opacity-75"
              d="M21 12a9 9 0 0 0-9-9"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          {copy.loadingCloudResume}
        </p>
      )}
      {user && cloudResumeLoadStatus === "error" && (
        <div className="pdf-export-error" role="alert">
          <span>{copy.cloudResumeLoadError}</span>{" "}
          <button
            type="button"
            className="font-bold underline underline-offset-4"
            onClick={() =>
              void loadUserResume().catch((error: unknown) => {
                console.error("Could not retry loading the cloud resume.", error)
              })
            }
          >
            {copy.retry}
          </button>
        </div>
      )}
      {user && cloudResumeLoadStatus === "local-draft-preserved" && (
        <p className="cloud-save-feedback" role="status" aria-live="polite">
          {copy.localDraftPreserved}{" "}
          <Link className="font-bold underline underline-offset-4" href="/resumes">
            {copy.viewSavedResumes}
          </Link>
        </p>
      )}
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
