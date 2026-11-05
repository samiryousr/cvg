"use client"

import Image from "next/image"
import { memo, useState, type ChangeEvent } from "react"
import { LoadingScreen } from "@/components/LoadingScreen"
import type {
  Certification,
  Education,
  Experience,
  PersonalInfo,
  Project,
} from "@/features/resume-builder/model"
import { previewResume } from "@/features/resume-builder/model"
import { useResumeStore } from "@/features/resume-builder/store"

function useEditorCopy() {
  const isArabic = useResumeStore((state) => state.editorLanguage === "ar")

  return isArabic
    ? {
        summary: "نبذة عنك",
        job: "المسمى الوظيفي",
        company: "الشركة",
        period: "الفترة",
        achievements: "المهام والإنجازات (كل إنجاز في سطر)",
        degree: "الدرجة العلمية",
        school: "الجامعة أو المؤسسة",
        projectName: "اسم المشروع",
        stack: "التقنيات المستخدمة",
        projectDetails: "التحدي والحل والنتائج (كل إنجاز في سطر)",
        projectUrl: "رابط المشروع",
        certificationName: "اسم الشهادة",
        issuer: "الجهة المانحة",
        year: "السنة أو الفترة",
        skills: "المهارات (افصل بينها بفاصلة)",
        experienceTitle: "خبرة عملية",
        educationTitle: "تعليم",
        projectTitle: "مشروع",
        certificationTitle: "شهادة مهنية",
        remove: "حذف",
        fullNamePlaceholder: "مثال: Alex Morgan",
        rolePlaceholder: "مثال: Frontend Developer",
        emailPlaceholder: "alex.morgan@example.com",
        phonePlaceholder: "مثال: +1 (212) 555-0142",
        locationPlaceholder: "مثال: Austin, TX",
        githubPlaceholder: "https://github.com/username",
        linkedInPlaceholder: "https://linkedin.com/in/username",
        portfolioPlaceholder: "https://example.com",
        summaryGuidance:
          "اكتبي نبذة من ٢–٤ جمل: خبرتك، تخصصك، وأبرز قيمة تضيفينها. استخدمي أرقامًا حقيقية فقط.",
        summaryPlaceholder:
          "مثال: مهندسة برمجيات متخصصة في تطوير تطبيقات الويب، مع خبرة في بناء واجهات سهلة الاستخدام...",
        experienceGuidance:
          "ابدأ بالفعل والنتيجة. فرّق بين مسؤولياتك وما أنجزته، واذكر أرقامًا قابلة للتحقق عند توفرها.",
        achievementPlaceholder:
          "مثال: حسّنت سرعة تحميل الصفحات عبر تقليل حجم الملفات...",
        degreePlaceholder: "مثال: بكالوريوس علوم الحاسب",
        schoolPlaceholder: "مثال: جامعة القاهرة",
        projectPlaceholder: "مثال: منصة إدارة المهام",
        stackPlaceholder: "مثال: React, TypeScript, Node.js",
        projectDetailsPlaceholder:
          "ما المشكلة التي حللتها؟ ما دورك؟ وما النتيجة؟",
        urlPlaceholder: "https://example.com",
        optional: "اختياري",
        required: "مطلوب",
        invalidImage: "اختار ملف صورة صالح.",
        imageTooLarge: "حجم الصورة لازم يكون أقل من 8 ميجابايت.",
        processingImage: "جارٍ تجهيز الصورة...",
        imageProcessingFailed: "تعذر تجهيز الصورة للمعاينة.",
        imageFailed: "تعذر تحميل الصورة. جرّب صورة أخرى.",
        photoAlt: "معاينة الصورة الشخصية",
        personalPhoto: "الصورة الشخصية",
        uploadPhoto: "رفع صورة",
        removePhoto: "إزالة الصورة",
        imageSavedLocally: "تُحفظ الصورة محليًا بعد تصغير حجمها.",
      }
    : {
        summary: "Professional summary",
        job: "Job title",
        company: "Company",
        period: "Date / period",
        achievements: "Responsibilities and achievements (one per line)",
        degree: "Degree",
        school: "School or institution",
        projectName: "Project name",
        stack: "Technologies used",
        projectDetails: "Challenge, solution, and results (one per line)",
        projectUrl: "Project URL",
        certificationName: "Certification name",
        issuer: "Issuing organization",
        year: "Year / period",
        skills: "Skills (separate with commas)",
        experienceTitle: "Work experience",
        educationTitle: "Education",
        projectTitle: "Project",
        certificationTitle: "Certification",
        remove: "Remove",
        fullNamePlaceholder: "Example: Alex Morgan",
        rolePlaceholder: "Example: Frontend Developer",
        emailPlaceholder: "alex.morgan@example.com",
        phonePlaceholder: "Example: +1 (212) 555-0142",
        locationPlaceholder: "Example: Austin, TX",
        githubPlaceholder: "https://github.com/username",
        linkedInPlaceholder: "https://linkedin.com/in/username",
        portfolioPlaceholder: "https://example.com",
        summaryGuidance:
          "Write 2–4 sentences covering your focus, experience, and value. Use numbers only when they are accurate.",
        summaryPlaceholder:
          "Example: Software engineer focused on building accessible web applications...",
        experienceGuidance:
          "Lead with the action and result. Separate responsibilities from achievements and include real metrics when available.",
        achievementPlaceholder:
          "Example: Improved page load time by optimizing image delivery...",
        degreePlaceholder: "Example: B.Sc. Computer Science",
        schoolPlaceholder: "Example: Cairo University",
        projectPlaceholder: "Example: Task management platform",
        stackPlaceholder: "Example: React, TypeScript, Node.js",
        projectDetailsPlaceholder:
          "What problem did you solve, what was your role, and what changed?",
        urlPlaceholder: "https://example.com",
        optional: "Optional",
        required: "Required",
        invalidImage: "Choose a valid image file.",
        imageTooLarge: "The image must be smaller than 8 MB.",
        processingImage: "Preparing your photo...",
        imageProcessingFailed: "Could not prepare the image for preview.",
        imageFailed: "Could not upload the image. Please try another one.",
        photoAlt: "Profile photo preview",
        personalPhoto: "Profile photo",
        uploadPhoto: "Upload photo",
        removePhoto: "Remove photo",
        imageSavedLocally: "The resized photo is saved locally.",
      }
}

export const TextField = memo(function TextField({
  labelAr,
  labelEn,

  field,

  wide = false,
}: {
  labelAr: string

  labelEn: string

  field: keyof Omit<PersonalInfo, "photoUrl">

  wide?: boolean
}) {
  const copy = useEditorCopy()
  const value = useResumeStore((state) => state.personal[field])

  const updatePersonal = useResumeStore((state) => state.updatePersonal)
  const isArabic = useResumeStore((state) => state.editorLanguage === "ar")
  const inputType =
    field === "email"
      ? "email"
      : field === "phone"
        ? "tel"
        : field === "github" || field === "linkedIn" || field === "portfolio"
          ? "url"
          : "text"
  const placeholders: Record<typeof field, string> = {
    name: copy.fullNamePlaceholder,
    role: copy.rolePlaceholder,
    email: copy.emailPlaceholder,
    phone: copy.phonePlaceholder,
    location: copy.locationPlaceholder,
    github: copy.githubPlaceholder,
    linkedIn: copy.linkedInPlaceholder,
    portfolio: copy.portfolioPlaceholder,
  }

  return (
    <label
      className={`${wide ? "wide-field " : ""}${
        isArabic ? "" : "field-label-en"
      }`}
    >
      <span>
        {isArabic ? labelAr : labelEn}
        {field === "name" ? ` · ${copy.required}` : ` · ${copy.optional}`}
      </span>
      <input
        type={inputType}
        dir={
          field === "github" ||
          field === "linkedIn" ||
          field === "portfolio" ||
          field === "email" ||
          field === "phone"
            ? "ltr"
            : isArabic
              ? "rtl"
              : "ltr"
        }
        placeholder={placeholders[field]}
        required={field === "name"}
        value={value}
        onChange={(event) => updatePersonal(field, event.target.value)}
      />
    </label>
  )
})

export const SummaryField = memo(function SummaryField() {
  const copy = useEditorCopy()
  const isArabic = useResumeStore((state) => state.editorLanguage === "ar")
  const summary = useResumeStore((state) => state.summary)

  const updateSummary = useResumeStore((state) => state.updateSummary)

  return (
    <label className={`wide-field${isArabic ? "" : " field-label-en"}`}>
      <span>
        {copy.summary} · {copy.optional}
      </span>
      <textarea
        dir={isArabic ? "rtl" : "ltr"}
        placeholder={copy.summaryPlaceholder}
        maxLength={500}
        value={summary}
        onChange={(event) => updateSummary(event.target.value)}
      />
      <small className="field-guidance">{copy.summaryGuidance}</small>
      <small>{summary.length} / 500</small>
    </label>
  )
})

export const ExperienceFields = memo(function ExperienceFields({
  experience,
}: {
  experience: Experience
}) {
  const copy = useEditorCopy()
  const isArabic = useResumeStore((state) => state.editorLanguage === "ar")
  const updateExperience = useResumeStore((state) => state.updateExperience)

  const removeExperience = useResumeStore((state) => state.removeExperience)

  return (
    <article className="repeatable-form-card">
      <div className="repeatable-form-heading">
        <strong>{copy.experienceTitle}</strong>
        <button
          className="remove-item-button"
          type="button"
          onClick={() => removeExperience(experience.id)}
        >
          {copy.remove}
        </button>
      </div>
      <div className="form-grid" data-field-language={isArabic ? "ar" : "en"}>
        <label className="wide-field">
          <span>{copy.job}</span>
          <input
            dir={isArabic ? "rtl" : "ltr"}
            placeholder={previewResume.experiences[0].job}
            value={experience.job}
            onChange={(event) =>
              updateExperience(experience.id, { job: event.target.value })
            }
          />
        </label>
        <label>
          <span>{copy.company}</span>
          <input
            dir={isArabic ? "rtl" : "ltr"}
            placeholder={previewResume.experiences[0].company}
            value={experience.company}
            onChange={(event) =>
              updateExperience(experience.id, { company: event.target.value })
            }
          />
        </label>
        <label>
          <span>{copy.period}</span>
          <input
            dir="ltr"
            placeholder={previewResume.experiences[0].period}
            value={experience.period}
            onChange={(event) =>
              updateExperience(experience.id, { period: event.target.value })
            }
          />
        </label>
        <label className="wide-field">
          <span>{copy.achievements}</span>
          <textarea
            dir={isArabic ? "rtl" : "ltr"}
            placeholder={
              previewResume.experiences[0].description.split("\n")[0]
            }
            value={experience.description}
            onChange={(event) =>
              updateExperience(experience.id, {
                description: event.target.value,
              })
            }
          />
          <small className="field-guidance wide-field">
            {copy.experienceGuidance}
          </small>
        </label>
      </div>
    </article>
  )
})

export const EducationFields = memo(function EducationFields({
  education,
}: {
  education: Education
}) {
  const copy = useEditorCopy()
  const isArabic = useResumeStore((state) => state.editorLanguage === "ar")
  const updateEducation = useResumeStore((state) => state.updateEducation)

  const removeEducation = useResumeStore((state) => state.removeEducation)

  return (
    <article className="repeatable-form-card">
      <div className="repeatable-form-heading">
        <strong>{copy.educationTitle}</strong>
        <button
          className="remove-item-button"
          type="button"
          onClick={() => removeEducation(education.id)}
        >
          {copy.remove}
        </button>
      </div>
      <div className="form-grid" data-field-language={isArabic ? "ar" : "en"}>
        <label className="wide-field">
          <span>{copy.degree}</span>
          <input
            dir={isArabic ? "rtl" : "ltr"}
            placeholder={copy.degreePlaceholder}
            value={education.degree}
            onChange={(event) =>
              updateEducation(education.id, { degree: event.target.value })
            }
          />
        </label>
        <label>
          <span>{copy.school}</span>
          <input
            dir={isArabic ? "rtl" : "ltr"}
            placeholder={copy.schoolPlaceholder}
            value={education.school}
            onChange={(event) =>
              updateEducation(education.id, { school: event.target.value })
            }
          />
        </label>
        <label>
          <span>{copy.year}</span>
          <input
            dir="ltr"
            placeholder={previewResume.education[0].period}
            value={education.period}
            onChange={(event) =>
              updateEducation(education.id, { period: event.target.value })
            }
          />
        </label>
      </div>
    </article>
  )
})

export const ProjectFields = memo(function ProjectFields({
  project,
}: {
  project: Project
}) {
  const copy = useEditorCopy()
  const isArabic = useResumeStore((state) => state.editorLanguage === "ar")
  const updateProject = useResumeStore((state) => state.updateProject)
  const removeProject = useResumeStore((state) => state.removeProject)

  return (
    <article className="repeatable-form-card">
      <div className="repeatable-form-heading">
        <strong>{copy.projectTitle}</strong>
        <button
          className="remove-item-button"
          type="button"
          onClick={() => removeProject(project.id)}
        >
          {copy.remove}
        </button>
      </div>
      <div className="form-grid" data-field-language={isArabic ? "ar" : "en"}>
        <label className="wide-field">
          <span>{copy.projectName}</span>
          <input
            dir={isArabic ? "rtl" : "ltr"}
            placeholder={previewResume.projects[0].name}
            value={project.name}
            onChange={(event) =>
              updateProject(project.id, { name: event.target.value })
            }
          />
        </label>
        <label>
          <span>{copy.stack}</span>
          <input
            dir={isArabic ? "rtl" : "ltr"}
            placeholder={previewResume.projects[0].stack}
            value={project.stack}
            onChange={(event) =>
              updateProject(project.id, { stack: event.target.value })
            }
          />
        </label>
        <label>
          <span>{copy.period}</span>
          <input
            dir="ltr"
            placeholder={previewResume.projects[0].period}
            value={project.period}
            onChange={(event) =>
              updateProject(project.id, { period: event.target.value })
            }
          />
        </label>
        <label className="wide-field">
          <span>{copy.projectDetails}</span>
          <textarea
            dir={isArabic ? "rtl" : "ltr"}
            placeholder={previewResume.projects[0].description}
            value={project.description}
            onChange={(event) =>
              updateProject(project.id, { description: event.target.value })
            }
          />
        </label>
        <label className="wide-field">
          <span>{copy.projectUrl}</span>
          <input
            type="url"
            dir="ltr"
            placeholder={previewResume.projects[0].url}
            value={project.url}
            onChange={(event) =>
              updateProject(project.id, { url: event.target.value })
            }
          />
        </label>
      </div>
    </article>
  )
})

export const CertificationFields = memo(function CertificationFields({
  certification,
}: {
  certification: Certification
}) {
  const copy = useEditorCopy()
  const isArabic = useResumeStore((state) => state.editorLanguage === "ar")
  const updateCertification = useResumeStore(
    (state) => state.updateCertification,
  )
  const removeCertification = useResumeStore(
    (state) => state.removeCertification,
  )

  return (
    <article className="repeatable-form-card">
      <div className="repeatable-form-heading">
        <strong>{copy.certificationTitle}</strong>
        <button
          className="remove-item-button"
          type="button"
          onClick={() => removeCertification(certification.id)}
        >
          {copy.remove}
        </button>
      </div>
      <div className="form-grid" data-field-language={isArabic ? "ar" : "en"}>
        <label className={`wide-field${isArabic ? "" : " field-label-en"}`}>
          <span>{copy.certificationName}</span>
          <input
            dir={isArabic ? "rtl" : "ltr"}
            value={certification.name}
            onChange={(event) =>
              updateCertification(certification.id, {
                name: event.target.value,
              })
            }
          />
        </label>
        <label>
          <span>{copy.issuer}</span>
          <input
            dir={isArabic ? "rtl" : "ltr"}
            value={certification.issuer}
            onChange={(event) =>
              updateCertification(certification.id, {
                issuer: event.target.value,
              })
            }
          />
        </label>
        <label>
          <span>{copy.year}</span>
          <input
            dir="ltr"
            value={certification.period}
            onChange={(event) =>
              updateCertification(certification.id, {
                period: event.target.value,
              })
            }
          />
        </label>
      </div>
    </article>
  )
})

export const SkillsField = memo(function SkillsField() {
  const copy = useEditorCopy()
  const isArabic = useResumeStore((state) => state.editorLanguage === "ar")
  const skills = useResumeStore((state) => state.skills)

  const updateSkills = useResumeStore((state) => state.updateSkills)

  return (
    <label className="wide-field">
      <span>{copy.skills}</span>
      <input
        dir={isArabic ? "rtl" : "ltr"}
        value={skills.join(isArabic ? "، " : ", ")}
        onChange={(event) =>
          updateSkills(
            event.target.value

              .split(/[,،]/)

              .map((skill) => skill.trim())

              .filter(Boolean),
          )
        }
      />
    </label>
  )
})

export const ProfilePhotoField = memo(function ProfilePhotoField() {
  const copy = useEditorCopy()
  const photoUrl = useResumeStore((state) => state.personal.photoUrl)

  const updatePersonal = useResumeStore((state) => state.updatePersonal)

  const [error, setError] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePhotoChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    event.target.value = ""

    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError(copy.invalidImage)

      return
    }

    if (file.size > 8 * 1024 * 1024) {
      setError(copy.imageTooLarge)

      return
    }

    setIsProcessing(true)
    let bitmap: ImageBitmap | undefined
    try {
      bitmap = await createImageBitmap(file)

      const scale = Math.min(1, 512 / Math.max(bitmap.width, bitmap.height))

      const canvas = document.createElement("canvas")

      canvas.width = Math.max(1, Math.round(bitmap.width * scale))

      canvas.height = Math.max(1, Math.round(bitmap.height * scale))

      const context = canvas.getContext("2d")

      if (!context) throw new Error(copy.imageProcessingFailed)

      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)

      updatePersonal("photoUrl", canvas.toDataURL("image/jpeg", 0.82))

      setError("")
    } catch (cause) {
      console.error("Could not process the uploaded resume photo.", cause)

      setError(copy.imageFailed)
    } finally {
      bitmap?.close()
      setIsProcessing(false)
    }
  }

  return (
    <div className="photo-field">
      {isProcessing && <LoadingScreen message={copy.processingImage} overlay />}
      <div className="photo-preview">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={copy.photoAlt}
            width={512}
            height={512}
            unoptimized
          />
        ) : (
          <span>{copy.personalPhoto}</span>
        )}
      </div>
      <label className="photo-upload-button">
        {copy.uploadPhoto}
        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          aria-label={copy.uploadPhoto}
        />
      </label>
      {photoUrl && (
        <button
          className="remove-item-button"
          type="button"
          onClick={() => updatePersonal("photoUrl", null)}
        >
          {copy.removePhoto}
        </button>
      )}
      <p className="field-message" aria-live="polite">
        {error || copy.imageSavedLocally}
      </p>
    </div>
  )
})
