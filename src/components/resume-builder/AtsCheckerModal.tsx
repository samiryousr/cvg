"use client"

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react"
import {
  analyzeResumeForAts,
  type AtsCheckCategory,
} from "@/features/resume-builder/atsChecker"
import { useResumeStore } from "@/features/resume-builder/store"

const categoryOrder: AtsCheckCategory[] = [
  "contact",
  "summary",
  "experience",
  "skills",
  "education",
]

const categoryLabels = {
  en: {
    contact: "Contact details",
    summary: "Professional summary",
    experience: "Work experience",
    skills: "Skills",
    education: "Education",
  },
  ar: {
    contact: "معلومات التواصل",
    summary: "الملخص المهني",
    experience: "الخبرات العملية",
    skills: "المهارات",
    education: "التعليم",
  },
} as const

const checkMessages: Record<string, { en: string; ar: string }> = {
  "contact-name": {
    en: "Add your full name.",
    ar: "أضف اسمك الكامل.",
  },
  "contact-email": {
    en: "Add a valid email address.",
    ar: "أضف عنوان بريد إلكتروني صالحًا.",
  },
  "contact-phone": {
    en: "Add a phone number.",
    ar: "أضف رقم هاتف.",
  },
  "summary-present": {
    en: "Write a concise professional summary of at least 40 characters.",
    ar: "اكتب ملخصًا مهنيًا موجزًا لا يقل عن 40 حرفًا.",
  },
  "summary-role": {
    en: "Add your target role or professional title.",
    ar: "أضف المسمى الوظيفي أو الدور المستهدف.",
  },
  "experience-present": {
    en: "Add at least one work experience entry.",
    ar: "أضف خبرة عملية واحدة على الأقل.",
  },
  "experience-context": {
    en: "Include a job title and employer for an experience entry.",
    ar: "أضف المسمى الوظيفي واسم جهة العمل لإحدى الخبرات.",
  },
  "experience-depth": {
    en: "Add specific responsibilities or achievements to your experience.",
    ar: "أضف مسؤوليات أو إنجازات محددة إلى خبراتك.",
  },
  "skills-count": {
    en: "List at least five distinct relevant skills.",
    ar: "أدرج خمس مهارات مختلفة وذات صلة على الأقل.",
  },
  "skills-category": {
    en: "Group your skills under a clear category.",
    ar: "رتّب مهاراتك ضمن فئة واضحة.",
  },
  "education-present": {
    en: "Add an education entry.",
    ar: "أضف مؤهلًا تعليميًا.",
  },
  "education-details": {
    en: "Include both your degree and institution.",
    ar: "أضف الدرجة العلمية والمؤسسة التعليمية.",
  },
}

export function AtsCheckerModal({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLElement>(null)
  const onCloseRef = useRef(onClose)
  const [isScanning, setIsScanning] = useState(true)
  const [scanStage, setScanStage] = useState(0)
  const [scanRun, setScanRun] = useState(0)
  const personal = useResumeStore((state) => state.personal)
  const summary = useResumeStore((state) => state.summary)
  const experiences = useResumeStore((state) => state.experiences)
  const education = useResumeStore((state) => state.education)
  const skills = useResumeStore((state) => state.skills)
  const editorLanguage = useResumeStore((state) => state.editorLanguage)
  const triggerElementRef = useRef<HTMLElement | null>(null)
  const isArabic = editorLanguage === "ar"
  const labels = isArabic ? categoryLabels.ar : categoryLabels.en

  const analysis = useMemo(
    () =>
      analyzeResumeForAts({
        ...useResumeStore.getState(),
        personal,
        summary,
        experiences,
        education,
        skills,
      }),
    [education, experiences, personal, skills, summary],
  )

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    const activeElement = document.activeElement
    triggerElementRef.current =
      activeElement instanceof HTMLElement ? activeElement : null
    dialogRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault()
        onCloseRef.current()
        return
      }

      if (event.key !== "Tab" || !dialogRef.current) return
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      )
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (
        event.shiftKey &&
        (document.activeElement === first ||
          !dialogRef.current.contains(document.activeElement))
      ) {
        event.preventDefault()
        last?.focus()
      } else if (
        !event.shiftKey &&
        (document.activeElement === last ||
          !dialogRef.current.contains(document.activeElement))
      ) {
        event.preventDefault()
        first?.focus()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      if (triggerElementRef.current?.isConnected) {
        triggerElementRef.current.focus()
      }
    }
  }, [])

  const scoreLabel = isArabic ? "نتيجة التوافق مع ATS" : "ATS readiness score"
  const scoreStatus =
    analysis.score >= 80
      ? isArabic
        ? "ملف قوي وجاهز للمراجعة"
        : "Strong foundation"
      : analysis.score >= 50
        ? isArabic
          ? "جيد، مع وجود فرص للتحسين"
          : "Good start, with room to improve"
        : isArabic
          ? "أكمل البيانات الأساسية لتحسين النتيجة"
          : "Add key details to strengthen your resume"
  const scanStages = isArabic
    ? ["قراءة بياناتك", "مراجعة الخبرات والمهارات", "تجهيز النتيجة"]
    : ["Reading your resume", "Checking skills and experience", "Preparing results"]

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
    if (reducedMotion) {
      setIsScanning(false)
      return
    }

    const stageTimer = window.setInterval(() => {
      setScanStage((stage) => (stage + 1) % scanStages.length)
    }, 700)
    const finishTimer = window.setTimeout(() => setIsScanning(false), 2200)

    return () => {
      window.clearInterval(stageTimer)
      window.clearTimeout(finishTimer)
    }
  }, [scanRun])

  const runScanAgain = () => {
    setScanStage(0)
    setIsScanning(true)
    setScanRun((run) => run + 1)
  }

  return (
    <div
      className="ats-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        ref={dialogRef}
        aria-labelledby="ats-modal-title"
        aria-modal="true"
        className="ats-modal"
        dir={isArabic ? "rtl" : "ltr"}
        role="dialog"
        tabIndex={-1}
      >
        <div className="ats-overview">
          <header className="ats-modal-header">
            <div>
              <span className="ats-modal-eyebrow">
                <span aria-hidden="true" />
                {isArabic ? "مراجعة ذكية للسيرة الذاتية" : "SMART RESUME REVIEW"}
              </span>
              <h2 id="ats-modal-title">
                {isArabic ? "فاحص توافق ATS" : "ATS checker"}
              </h2>
              <small>
                {isArabic
                  ? "تحليل فوري للتوافق مع أنظمة تتبع المتقدمين"
                  : "Instant analysis for applicant tracking systems"}
              </small>
            </div>
            <button
              type="button"
              className="ats-modal-close"
              onClick={onClose}
              aria-label={isArabic ? "إغلاق الفاحص" : "Close ATS checker"}
            >
              ×
            </button>
          </header>
          {!isScanning && (
            <div className="ats-score-panel">
              <div
                className="ats-score-ring"
                role="img"
                aria-label={`${scoreLabel}: ${analysis.score}%`}
                style={
                  { "--ats-score": `${analysis.score}%` } as CSSProperties
                }
              >
                <strong>{analysis.score}%</strong>
              </div>
              <div className="ats-score-copy">
                <span className="ats-score-label">{scoreLabel}</span>
                <p>{scoreStatus}</p>
                <small>
                  {isArabic
                    ? `${analysis.passedCount} من ${analysis.checks.length} فحوصات مكتملة`
                    : `${analysis.passedCount} of ${analysis.checks.length} checks passed`}
                </small>
              </div>
              <div className="ats-score-stats">
                <span className="ats-stat passed">
                  <strong>{analysis.passedCount}</strong>
                  {isArabic ? "مكتمل" : "Passed"}
                </span>
                <span className="ats-stat needs-work">
                  <strong>{analysis.improvementCount}</strong>
                  {isArabic ? "تحسينات" : "To improve"}
                </span>
              </div>
            </div>
          )}
        </div>

        <div
          className={`ats-scanner${isScanning ? " is-scanning" : " is-complete"}`}
          role="status"
          aria-live="polite"
          aria-busy={isScanning}
        >
          <div className="ats-scanner-machine" aria-hidden="true">
            <div className="ats-scanner-paper">
              <i />
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
            <div className="ats-scanner-slot">
              <span className="ats-scanner-beam" />
            </div>
            <div className="ats-scanner-base">
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className="ats-scanner-copy">
            <strong>
              {isScanning
                ? scanStages[scanStage]
                : isArabic
                  ? "اكتمل فحص سيرتك الذاتية"
                  : "Resume scan complete"}
            </strong>
            <span>
              {isScanning
                ? isArabic
                  ? "نفحص التنسيق والمعلومات الأساسية والخبرات"
                  : "Reviewing structure, contact details, and experience"
                : isArabic
                  ? "راجع النتيجة والتوصيات أدناه"
                  : "Your score and recommendations are ready below"}
            </span>
            {isScanning && (
              <div className="ats-scanner-progress" aria-hidden="true">
                <span />
              </div>
            )}
          </div>
        </div>

        {!isScanning && (
          <>
            <div className="ats-check-groups">
              {categoryOrder.map((category) => {
                const checks = analysis.checks.filter(
                  (check) => check.category === category,
                )
                const passedChecks = checks.filter((check) => check.passed).length
                return (
                  <section className="ats-check-group" key={category}>
                    <header className="ats-check-group-header">
                      <h3>{labels[category]}</h3>
                      <span>
                        {passedChecks}/{checks.length}
                      </span>
                    </header>
                    <ul>
                      {checks.map((check) => {
                        const message = checkMessages[check.id]
                        const text = message
                          ? isArabic
                            ? message.ar
                            : message.en
                          : check.message
                        return (
                          <li
                            className={check.passed ? "passed" : "needs-work"}
                            key={check.id}
                          >
                            <span
                              className="ats-check-icon"
                              aria-hidden="true"
                            >
                              {check.passed ? (
                                <svg viewBox="0 0 20 20" fill="none">
                                  <path
                                    d="m5 10.2 3.2 3.1L15.3 6"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              ) : (
                                <svg viewBox="0 0 20 20" fill="none">
                                  <path
                                    d="M10 6v4.2m0 3h.01M10 2.8 18 17H2L10 2.8Z"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              )}
                            </span>
                            <span>{text}</span>
                            <span
                              className={`ats-check-badge ${check.passed ? "passed" : "needs-work"}`}
                            >
                              {check.passed
                                ? isArabic
                                  ? "مكتمل"
                                  : "Passed"
                                : isArabic
                                  ? "تحسين"
                                  : "Improve"}
                              <small>{check.points}</small>
                            </span>
                          </li>
                        )
                      })}
                    </ul>
                  </section>
                )
              })}
            </div>
            <div className="ats-results-footer">
              <p className="ats-modal-note">
                {isArabic
                  ? "هذه إرشادات عامة وليست ضمانًا لاجتياز أنظمة التوظيف؛ تختلف معايير ATS حسب جهة التوظيف."
                  : "This is general guidance, not a guarantee of passing an ATS. Screening criteria vary by employer."}
              </p>
              <button type="button" onClick={runScanAgain}>
                {isArabic ? "إعادة الفحص" : "Scan again"}
              </button>
            </div>
          </>
        )}
      </section>
      <style jsx>{`
        .ats-modal-backdrop {
          position: fixed;
          z-index: 11000;
          inset: 0;
          display: grid;
          place-items: center;
          padding: 18px;
          background: rgba(15, 25, 22, 0.62);
          backdrop-filter: blur(5px);
        }
        .ats-modal {
          width: min(100%, 900px);
          max-height: min(90vh, 850px);
          overflow: auto;
          padding: 28px;
          border: 1px solid #e1e9e3;
          border-radius: 20px;
          background:
            radial-gradient(ellipse at 100% 0%, rgba(80, 146, 111, 0.06), transparent 34%),
            #fff;
          color: #243b36;
          box-shadow: 0 30px 90px rgba(8, 24, 16, 0.25);
          outline: none;
        }
        .ats-overview {
          margin: -2px -2px 16px;
          padding: 18px 20px 16px;
          overflow: hidden;
          border: 1px solid rgba(148, 163, 184, 0.3);
          border-radius: 17px;
          background: rgba(248, 250, 252, 0.78);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.76);
        }
        .ats-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin: 0;
          padding-bottom: 0;
          border: 0;
        }
        .ats-modal-header h2,
        .ats-score-panel p {
          margin: 0;
        }
        .ats-modal-header h2 {
          margin-top: 1px;
          color: #193b30;
          font-size: 25px;
          font-weight: 800;
          letter-spacing: -0.5px;
        }
        .ats-modal-header small {
          display: block;
          margin-top: 4px;
          color: #87948c;
          font-size: 10px;
        }
        .ats-modal-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #55816a;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.08em;
        }
        .ats-modal-eyebrow > span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #5da477;
          box-shadow: 0 0 0 3px rgba(93, 164, 119, 0.13);
        }
        .ats-modal-close {
          width: 36px;
          height: 36px;
          flex: 0 0 auto;
          border: 1px solid #e3eae5;
          border-radius: 11px;
          background: #f7faf8;
          color: #53685b;
          font-size: 21px;
          line-height: 1;
          transition: background 0.18s ease, transform 0.18s ease;
        }
        .ats-modal-close:hover {
          transform: translateY(-1px);
          background: #edf5ef;
        }
        .ats-modal button:focus-visible {
          outline: 3px solid rgba(68, 139, 112, 0.55);
          outline-offset: 3px;
        }
        .ats-scanner {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 220px;
          align-items: center;
          gap: 20px;
          margin: 2px 0 16px;
          padding: 15px 20px;
          overflow: hidden;
          border: 1px solid #e1ebe4;
          border-radius: 15px;
          background: linear-gradient(115deg, #f8fbf8, #f1f7f2);
        }
        .ats-scanner-machine {
          position: relative;
          width: min(100%, 220px);
          height: 88px;
          justify-self: center;
        }
        .ats-scanner-paper {
          position: absolute;
          z-index: 1;
          top: 0;
          left: 50%;
          display: grid;
          width: 58px;
          height: 74px;
          gap: 5px;
          padding: 11px 8px;
          border: 1px solid #dfe7e2;
          border-radius: 5px;
          background: #fff;
          box-shadow: 0 5px 15px rgba(34, 69, 53, 0.13);
          transform: translateX(-50%);
        }
        .ats-scanner-paper i {
          display: block;
          width: 100%;
          height: 3px;
          border-radius: 4px;
          background: #dce8df;
        }
        .ats-scanner-paper i:first-child {
          width: 65%;
          height: 5px;
          background: #8eb6a0;
        }
        .ats-scanner-paper i:nth-child(4) {
          width: 78%;
        }
        .ats-scanner-paper i:last-child {
          width: 52%;
        }
        .ats-scanner-slot {
          position: absolute;
          z-index: 2;
          top: 37px;
          left: 50%;
          width: min(100%, 206px);
          height: 14px;
          overflow: hidden;
          border: 1px solid #315f4c;
          border-radius: 6px;
          background: linear-gradient(180deg, #274b3e, #18372d);
          box-shadow: 0 3px 0 #dce7df, 0 7px 14px rgba(31, 77, 54, 0.13);
          transform: translateX(-50%);
        }
        .ats-scanner-beam {
          position: absolute;
          top: 0;
          left: 5%;
          width: 32%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            #9cf0bf,
            #f3fff6,
            #9cf0bf,
            transparent
          );
          box-shadow: 0 0 14px 3px rgba(121, 255, 171, 0.65);
        }
        .ats-scanner-base {
          position: absolute;
          bottom: 3px;
          left: 50%;
          display: flex;
          width: min(100%, 204px);
          height: 25px;
          align-items: center;
          justify-content: center;
          gap: 5px;
          border: 1px solid #d8e3dc;
          border-radius: 4px 4px 9px 9px;
          background: linear-gradient(180deg, #eaf1ec, #dce7df);
          transform: translateX(-50%);
        }
        .ats-scanner-base span {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #9ab8a4;
        }
        .ats-scanner-copy {
          display: grid;
          justify-items: start;
          gap: 5px;
        }
        .ats-scanner-copy strong {
          color: #254c38;
          font-size: 13px;
          font-weight: 800;
        }
        .ats-scanner-copy > span {
          color: #7c8982;
          font-size: 10px;
          line-height: 1.6;
        }
        .ats-scanner-progress {
          width: min(100%, 270px);
          height: 5px;
          margin-top: 5px;
          overflow: hidden;
          border-radius: 999px;
          background: #dce8df;
        }
        .ats-scanner-progress span {
          display: block;
          width: 34%;
          height: 100%;
          border-radius: inherit;
          background: #4b9b70;
          animation: ats-scan-progress 2.2s ease-in-out forwards;
        }
        .ats-scanner.is-scanning .ats-scanner-paper {
          animation: ats-paper-pass 2.2s cubic-bezier(0.45, 0, 0.35, 1)
            forwards;
        }
        .ats-scanner.is-scanning .ats-scanner-beam {
          animation: ats-beam-scan 0.9s ease-in-out infinite alternate;
        }
        .ats-scanner.is-complete .ats-scanner-paper {
          top: 25px;
        }
        .ats-scanner.is-complete .ats-scanner-base {
          border-color: #9dc9aa;
          background: linear-gradient(180deg, #e9f7eb, #d8eddd);
        }
        .ats-scanner.is-complete .ats-scanner-base span {
          background: #3d9b5b;
        }
        .ats-scanner.is-complete .ats-scanner-copy strong {
          color: #2e7a49;
        }
        .ats-score-panel {
          display: flex;
          align-items: center;
          gap: 17px;
          margin-top: 17px;
          padding: 15px 0 0;
          border-top: 1px solid rgba(148, 163, 184, 0.22);
        }
        .ats-score-ring {
          position: relative;
          width: 84px;
          height: 84px;
          flex: 0 0 auto;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: conic-gradient(#428761 var(--ats-score), #e3ebe5 0);
          box-shadow:
            0 0 0 5px rgba(52, 141, 91, 0.08),
            0 0 26px rgba(52, 141, 91, 0.2);
        }
        .ats-score-ring::before {
          position: absolute;
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: #f8fbf8;
          content: "";
        }
        .ats-score-ring strong {
          position: relative;
          z-index: 1;
          color: #214e37;
          font-size: 19px;
          font-weight: 800;
        }
        .ats-score-copy {
          min-width: 0;
          flex: 1 1 auto;
        }
        .ats-score-label {
          color: #71817a;
          font-size: 10px;
          font-weight: 700;
        }
        .ats-score-panel p {
          margin-top: 5px;
          color: #244936;
          font-size: 15px;
          font-weight: 800;
          line-height: 1.4;
        }
        .ats-score-panel small {
          display: block;
          margin-top: 5px;
          color: #788780;
          font-size: 10px;
        }
        .ats-score-stats {
          display: flex;
          flex: 0 0 auto;
          gap: 8px;
        }
        .ats-stat {
          display: grid;
          min-width: 77px;
          justify-items: center;
          gap: 2px;
          padding: 8px 11px;
          border: 1px solid #e3ebe5;
          border-radius: 11px;
          background: rgba(255, 255, 255, 0.62);
          color: #748178;
          font-size: 9px;
          font-weight: 700;
        }
        .ats-stat strong {
          font-size: 17px;
          line-height: 1.1;
        }
        .ats-stat.passed strong { color: #278454; }
        .ats-stat.needs-work strong { color: #c17a36; }
        .ats-check-groups {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          align-items: start;
          gap: 13px;
        }
        .ats-check-group {
          min-width: 0;
          height: 100%;
          padding: 15px;
          border: 1px solid #e3e9e5;
          border-radius: 15px;
          background: linear-gradient(145deg, #fff, #f8faf8);
          box-shadow: 0 5px 16px rgba(25, 55, 39, 0.035);
          transition:
            border-color 0.2s ease,
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }
        .ats-check-group:hover {
          transform: translateY(-2px);
          border-color: #cbd9ce;
          box-shadow: 0 10px 24px rgba(25, 55, 39, 0.075);
        }
        .ats-check-group-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 10px;
        }
        .ats-check-group h3 {
          min-width: 0;
          margin: 0;
          color: #52675a;
          font-size: 11px;
          font-weight: 800;
        }
        .ats-check-group-header > span {
          flex: 0 0 auto;
          padding: 3px 7px;
          border: 1px solid #e3ebe5;
          border-radius: 999px;
          background: #f7faf7;
          color: #708077;
          font-size: 9px;
          font-weight: 700;
        }
        .ats-check-group ul {
          display: grid;
          gap: 6px;
          margin: 0;
          padding: 0;
          list-style: none;
        }
        .ats-check-group li {
          display: grid;
          grid-template-columns: 19px minmax(0, 1fr);
          align-items: start;
          gap: 7px 8px;
          padding: 9px;
          border: 1px solid transparent;
          border-radius: 10px;
          font-size: 10px;
          line-height: 1.55;
          transition:
            background 0.2s ease,
            border-color 0.2s ease,
            transform 0.2s ease;
        }
        .ats-check-icon {
          display: grid;
          width: 18px;
          height: 18px;
          place-items: center;
          border-radius: 6px;
        }
        .ats-check-icon svg {
          width: 14px;
          height: 14px;
        }
        .ats-check-badge {
          display: inline-flex;
          grid-column: 2;
          align-items: center;
          justify-self: start;
          gap: 5px;
          padding: 3px 7px;
          border: 1px solid transparent;
          border-radius: 999px;
          font-size: 8px;
          font-weight: 800;
          line-height: 1.2;
          white-space: nowrap;
          transition: background 0.2s ease, border-color 0.2s ease;
        }
        .ats-check-badge small {
          padding-inline-start: 5px;
          border-inline-start: 1px solid currentColor;
          opacity: 0.75;
          font-size: 8px;
        }
        .ats-check-group li.passed {
          border-color: #e6f1e8;
          background: #f7fbf8;
          color: #315d43;
        }
        .ats-check-group li.needs-work {
          border-color: #f4ebe5;
          background: #fffbf8;
          color: #785044;
        }
        .ats-check-group li.passed .ats-check-icon {
          background: #e7f5eb;
          color: #25834e;
        }
        .ats-check-group li.needs-work .ats-check-icon {
          background: #fff0df;
          color: #c17a36;
        }
        .ats-check-badge.passed {
          border-color: #d7ecdc;
          background: #eaf7ed;
          color: #277647;
        }
        .ats-check-badge.needs-work {
          border-color: #f3dfcb;
          background: #fff2e4;
          color: #a45e25;
        }
        .ats-results-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-top: 15px;
          padding-top: 12px;
          border-top: 1px solid #edf1ed;
        }
        .ats-modal-note {
          margin: 17px 0 0;
          color: #7d8983;
          font-size: 10px;
          line-height: 1.6;
        }
        .ats-results-footer button {
          flex: 0 0 auto;
          padding: 8px 12px;
          border: 1px solid #dce8df;
          border-radius: 8px;
          background: #f5faf6;
          color: #356044;
          font: inherit;
          font-size: 10px;
          font-weight: 700;
          transition: background 0.18s ease, border-color 0.18s ease;
        }
        .ats-results-footer button:hover {
          border-color: #b7d0bd;
          background: #eaf5ed;
        }
        :global(.theme-dark) .ats-modal {
          border-color: #354940;
          background:
            radial-gradient(ellipse at 100% 0%, rgba(80, 146, 111, 0.09), transparent 34%),
            #18221e;
          color: #e4eee8;
        }
        :global(.theme-dark) .ats-overview {
          border-color: rgba(71, 85, 105, 0.56);
          background: rgba(15, 23, 42, 0.58);
          box-shadow: inset 0 1px 0 rgba(148, 163, 184, 0.08);
        }
        :global(.theme-dark) .ats-check-group h3,
        :global(.theme-dark) .ats-modal-note,
        :global(.theme-dark) .ats-score-panel small,
        :global(.theme-dark) .ats-score-label {
          color: #adbbb3;
        }
        :global(.theme-dark) .ats-modal-header h2 {
          color: #e4eee8;
        }
        :global(.theme-dark) .ats-modal-header small {
          color: #9baa9f;
        }
        :global(.theme-dark) .ats-modal-eyebrow {
          color: #9ac5a5;
        }
        :global(.theme-dark) .ats-modal-close {
          border-color: #3b5044;
          background: #223129;
          color: #e1ece5;
        }
        :global(.theme-dark) .ats-modal-close:hover {
          background: #2a4032;
        }
        :global(.theme-dark) .ats-scanner {
          border-color: #354940;
          background: linear-gradient(115deg, #1d2b23, #213329);
        }
        :global(.theme-dark) .ats-scanner-paper {
          border-color: #526459;
          background: #eaf2ed;
        }
        :global(.theme-dark) .ats-scanner-slot {
          border-color: #456c54;
        }
        :global(.theme-dark) .ats-scanner-base {
          border-color: #3c5044;
          background: linear-gradient(180deg, #2b3a31, #24342a);
        }
        :global(.theme-dark) .ats-scanner-copy strong {
          color: #b7dfc2;
        }
        :global(.theme-dark) .ats-scanner-copy > span,
        :global(.theme-dark) .ats-score-panel small {
          color: #adbbb3;
        }
        :global(.theme-dark) .ats-scanner-copy strong {
          color: #c1e0c8;
        }
        :global(.theme-dark) .ats-scanner-progress {
          background: #354940;
        }
        :global(.theme-dark) .ats-score-panel {
          border-color: #354940;
          background: linear-gradient(110deg, #1d3026, #22342a);
        }
        :global(.theme-dark) .ats-score-ring {
          background: conic-gradient(#6fb68d var(--ats-score), #34433b 0);
          box-shadow:
            0 0 0 5px rgba(110, 231, 153, 0.08),
            0 0 28px rgba(52, 211, 112, 0.22);
        }
        :global(.theme-dark) .ats-score-ring::before {
          background: #17231d;
        }
        :global(.theme-dark) .ats-score-ring strong {
          color: #dcfce7;
        }
        :global(.theme-dark) .ats-score-panel p {
          color: #d1fae0;
        }
        :global(.theme-dark) .ats-score-stats .ats-stat {
          border-color: rgba(71, 85, 105, 0.62);
          background: rgba(30, 41, 59, 0.72);
          color: #a9b5c5;
        }
        :global(.theme-dark) .ats-score-stats .ats-stat.passed strong {
          color: #6ee7a0;
        }
        :global(.theme-dark) .ats-score-stats .ats-stat.needs-work strong {
          color: #fbbf77;
        }
        :global(.theme-dark) .ats-check-group {
          border-color: rgba(71, 85, 105, 0.58);
          background: linear-gradient(145deg, rgba(15, 23, 42, 0.82), rgba(17, 29, 25, 0.92));
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }
        :global(.theme-dark) .ats-check-group:hover {
          border-color: rgba(110, 231, 153, 0.3);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.2);
        }
        :global(.theme-dark) .ats-check-group-header > span {
          border-color: rgba(71, 85, 105, 0.6);
          background: rgba(30, 41, 59, 0.64);
          color: #b1bdca;
        }
        :global(.theme-dark) .ats-check-group li {
          border-color: rgba(71, 85, 105, 0.32);
          background: rgba(30, 41, 59, 0.52);
          color: #d7e1dc;
        }
        :global(.theme-dark) .ats-check-group li.passed {
          border-color: rgba(52, 211, 112, 0.19);
          background: rgba(20, 83, 45, 0.2);
          color: #d3f7de;
        }
        :global(.theme-dark) .ats-check-group li.needs-work {
          border-color: rgba(251, 191, 36, 0.17);
          background: rgba(120, 68, 18, 0.16);
          color: #f3dfc5;
        }
        :global(.theme-dark) .ats-check-group li.passed .ats-check-icon {
          background: rgba(34, 197, 94, 0.14);
          color: #6ee7a0;
        }
        :global(.theme-dark) .ats-check-group li.needs-work .ats-check-icon {
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf77;
        }
        :global(.theme-dark) .ats-check-badge.passed {
          border-color: rgba(52, 211, 112, 0.2);
          background: rgba(20, 83, 45, 0.28);
          color: #86efac;
        }
        :global(.theme-dark) .ats-check-badge.needs-work {
          border-color: rgba(251, 191, 36, 0.22);
          background: rgba(120, 68, 18, 0.24);
          color: #fcd08a;
        }
        :global(.theme-dark) .ats-results-footer {
          border-top-color: #2b3931;
        }
        :global(.theme-dark) .ats-results-footer button {
          border-color: #40574b;
          background: #22332a;
          color: #c3d8c9;
        }
        @keyframes ats-paper-pass {
          0% {
            top: -40px;
            opacity: 0.35;
          }
          18% {
            opacity: 1;
          }
          44%,
          68% {
            top: 16px;
          }
          100% {
            top: 25px;
          }
        }
        @keyframes ats-beam-scan {
          from {
            transform: translateX(-20%);
          }
          to {
            transform: translateX(210%);
          }
        }
        @keyframes ats-scan-progress {
          0% {
            width: 4%;
          }
          35% {
            width: 42%;
          }
          70% {
            width: 76%;
          }
          100% {
            width: 100%;
          }
        }
        @media (max-width: 520px) {
          .ats-modal-backdrop {
            padding: 10px;
          }
          .ats-modal {
            max-height: 94vh;
            padding: 16px;
            border-radius: 14px;
          }
          .ats-modal-header h2 {
            font-size: 19px;
          }
          .ats-modal-header small { max-width: 250px; line-height: 1.5; }
          .ats-scanner {
            grid-template-columns: minmax(0, 1fr) 135px;
            gap: 8px;
            margin-bottom: 12px;
            padding: 12px 9px;
          }
          .ats-scanner-machine {
            width: 135px;
            height: 76px;
          }
          .ats-scanner-paper { width: 48px; height: 64px; gap: 4px; padding: 9px 6px; }
          .ats-scanner-slot { top: 31px; width: 132px; height: 12px; }
          .ats-scanner-base { width: 130px; height: 20px; }
          .ats-scanner-copy strong { font-size: 11px; }
          .ats-scanner-copy > span { font-size: 9px; }
          .ats-score-panel {
            flex-wrap: wrap;
            gap: 11px;
            padding-top: 12px;
          }
          .ats-score-ring {
            width: 64px;
            height: 64px;
          }
          .ats-score-ring::before {
            width: 54px;
            height: 54px;
          }
          .ats-score-ring strong {
            font-size: 17px;
          }
          .ats-score-copy { flex-basis: calc(100% - 78px); }
          .ats-score-stats { width: 100%; }
          .ats-stat { flex: 1 1 0; }
          .ats-check-groups { grid-template-columns: minmax(0, 1fr); gap: 11px; }
          .ats-check-group li { min-height: 38px; }
          .ats-results-footer {
            align-items: flex-end;
          }
        }
        @media (min-width: 521px) and (max-width: 800px) {
          .ats-modal { padding: 21px; }
          .ats-check-groups { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .ats-overview { padding: 16px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ats-check-group,
          .ats-check-group li,
          .ats-check-badge,
          .ats-modal-close,
          .ats-results-footer button {
            transition: none;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .ats-scanner.is-scanning .ats-scanner-paper,
          .ats-scanner.is-scanning .ats-scanner-beam,
          .ats-scanner-progress span {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}
