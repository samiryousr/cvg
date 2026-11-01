"use client"

import { useState } from "react"
import { templates } from "@/features/resume-builder/model"
import { useResumeStore } from "@/features/resume-builder/store"
import {
  EducationFields,
  ExperienceFields,
  ProjectFields,
  CertificationFields,
  ProfilePhotoField,
  SkillsField,
  SummaryField,
  TextField,
} from "@/components/resume-builder/ResumeEditorFields"
import { LiveResumePreview } from "@/components/resume-builder/LiveResumePreview"
import { ThemeToggle } from "@/components/ThemeToggle"

export function ResumeEditor({ onBack }: { onBack: () => void }) {
  const personal = useResumeStore((state) => state.personal)

  const summary = useResumeStore((state) => state.summary)

  const experiences = useResumeStore((state) => state.experiences)

  const education = useResumeStore((state) => state.education)

  const projects = useResumeStore((state) => state.projects)

  const certifications = useResumeStore((state) => state.certifications)

  const skills = useResumeStore((state) => state.skills)

  const templateId = useResumeStore((state) => state.templateId)

  const editorLanguage = useResumeStore((state) => state.editorLanguage)

  const isArabic = editorLanguage === "ar"

  const primaryColor = useResumeStore((state) => state.primaryColor)

  const addExperience = useResumeStore((state) => state.addExperience)

  const addEducation = useResumeStore((state) => state.addEducation)

  const addProject = useResumeStore((state) => state.addProject)

  const addCertification = useResumeStore((state) => state.addCertification)

  const setTemplate = useResumeStore((state) => state.setTemplate)

  const setEditorLanguage = useResumeStore((state) => state.setEditorLanguage)

  const setPrimaryColor = useResumeStore((state) => state.setPrimaryColor)

  const copy = {
    saved: isArabic ? "محفوظ تلقائيًا على هذا الجهاز" : "Saved on this device",
    home: isArabic ? "العودة للرئيسية" : "Back to home",
    downloadPdf: isArabic ? "تحميل PDF" : "Download PDF",
    completion: isArabic ? "اكتمال السيرة" : "Resume completion",
    basicInformation: isArabic ? "المعلومات الأساسية" : "Basic information",
    editHint: isArabic
      ? "عدّل بياناتك؛ تنسيق السيرة وعناوينها بالإنجليزية دائمًا."
      : "Edit your details; the resume is always formatted in English.",
    template: isArabic ? "القالب" : "Template",
    atsNote: isArabic
      ? "السيرة تُعرض بالإنجليزية. اختر لغة تسميات خانات الإدخال."
      : "The resume is displayed in English. Choose a language for the input labels.",
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
    addEducation: isArabic
      ? "+ إضافة مؤهل تعليمي"
      : "+ Add education",
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

  const [activeSection, setActiveSection] = useState("personal")
  const [activeMobilePanel, setActiveMobilePanel] = useState<"form" | "preview">(
    "form",
  )

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

    ...skills,
  ]

  const completion = Math.round(
    (completionFields.filter((field) => field.trim().length > 0).length /
      Math.max(completionFields.length, 1)) *
      100,
  )

  return (
    <div className="editor-shell" dir="ltr">
      <header className="editor-header" dir="rtl">
        <button
          className="home-button"
          type="button"
          onClick={onBack}
          aria-label={copy.home}
        >
          {copy.home}
        </button>
        <div className="save-state">
          <span />
          {copy.saved}
        </div>
        <div className="header-actions">
          <ThemeToggle />
          <button
            className="download-button"
            onClick={() => window.print()}
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
          className={`form-panel${activeMobilePanel === "form" ? "" : " mobile-panel-hidden"}`}
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
            <fieldset>
              <legend>{copy.template}</legend>
              <div className="template-switcher">
                {templates.map((template) => (
                  <button
                    className={templateId === template.id ? "active" : ""}
                    key={template.id}
                    type="button"
                    aria-pressed={templateId === template.id}
                    onClick={() => setTemplate(template.id)}
                  >
                    <span>{template.name}</span>
                    <small>{template.tone}</small>
                  </button>
                ))}
              </div>
            </fieldset>
            {templateId === "ats" && (
              <p className="template-note">{copy.atsNote}</p>
            )}
            {templateId !== "ats" && (
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
            {templateId !== "ats" && <ProfilePhotoField />}
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
            {templateId === "ats" && (
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
              </>
            )}
            <SummaryField />
          </div>

          <div className="section-tabs">
            {[
              ["experience", "02", copy.experience],

              ["education", "03", copy.education],

              ["skills", "04", copy.skills],

              ["projects", "05", copy.projects],

              ["certifications", "06", copy.certifications],
            ].map(([id, number, label]) => (
              <button
                key={id}
                className={activeSection === id ? "active" : ""}
                onClick={() => setActiveSection(activeSection === id ? "" : id)}
                type="button"
                aria-expanded={activeSection === id}
              >
                <span>{number}</span>
                {label}
                <b>{activeSection === id ? "−" : "+"}</b>
              </button>
            ))}
          </div>

          {activeSection === "experience" && (
            <div className="sub-form">
              {experiences.map((experience) => (
                <ExperienceFields key={experience.id} experience={experience} />
              ))}
              <button
                className="add-item-button"
                onClick={addExperience}
                type="button"
              >
                {copy.addExperience}
              </button>
            </div>
          )}
          {activeSection === "education" && (
            <div className="sub-form">
              {education.map((item) => (
                <EducationFields key={item.id} education={item} />
              ))}
              <button
                className="add-item-button"
                onClick={addEducation}
                type="button"
              >
                {copy.addEducation}
              </button>
            </div>
          )}
          {activeSection === "skills" && (
            <div className="sub-form">
              <SkillsField />
            </div>
          )}
          {activeSection === "projects" && (
            <div className="sub-form">
              {projects.map((project) => (
                <ProjectFields key={project.id} project={project} />
              ))}
              <button
                className="add-item-button"
                onClick={addProject}
                type="button"
              >
                {copy.addProject}
              </button>
            </div>
          )}
          {activeSection === "certifications" && (
            <div className="sub-form">
              {certifications.map((certification) => (
                <CertificationFields
                  key={certification.id}
                  certification={certification}
                />
              ))}
              <button
                className="add-item-button"
                onClick={addCertification}
                type="button"
              >
                {copy.addCertification}
              </button>
            </div>
          )}
        </aside>

        <main
          id="editor-preview-panel"
          className={`preview-panel${activeMobilePanel === "preview" ? "" : " mobile-panel-hidden"}`}
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
