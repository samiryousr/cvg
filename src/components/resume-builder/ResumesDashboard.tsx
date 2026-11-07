"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

import { Navbar } from "@/components/Navbar"
import type { SavedResume } from "@/services/resumeService"
import { fetchUserResumes } from "@/services/resumeService"
import { useResumeStore } from "@/features/resume-builder/store"
import { useAuthStore } from "@/store/useAuthStore"

function getResumeSummary(resume: SavedResume) {
  const data = resume.resume_data
  const personal = data?.personal ?? {
    name: "",
    role: "",
    email: "",
    location: "",
  }
  const experiences = Array.isArray(data?.experiences) ? data.experiences : []
  const education = Array.isArray(data?.education) ? data.education : []
  const skills = Array.isArray(data?.skills) ? data.skills : []
  const details = [
    personal.role,
    personal.email,
    personal.location,
  ].filter(Boolean)

  return {
    name: personal.name || resume.title || "سيرتي الذاتية",
    details,
    sections: [
      data?.summary,
      ...experiences.slice(0, 2).map((item) => item.job || item.company),
      ...education.slice(0, 1).map((item) => item.degree || item.school),
      skills
        .map((category) => category.skills)
        .filter(Boolean)
        .join(", "),
    ].filter(Boolean),
  }
}

export function ResumesDashboard() {
  const router = useRouter()
  const user = useAuthStore((state) => state.user)
  const userId = useAuthStore((state) => state.user?.id)
  const authLoading = useAuthStore((state) => state.isLoading)
  const hasHydrated = useResumeStore((state) => state.hasHydrated)
  const openSavedResume = useResumeStore((state) => state.openSavedResume)
  const resetResume = useResumeStore((state) => state.resetResume)
  const [resumes, setResumes] = useState<SavedResume[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const startedHydration = useRef(false)

  useEffect(() => {
    if (hasHydrated || startedHydration.current) return

    startedHydration.current = true
    void useResumeStore.persist.rehydrate()
  }, [hasHydrated])

  useEffect(() => {
    if (authLoading || !hasHydrated || !userId) {
      setResumes([])
      setIsLoading(false)
      setError(null)
      return
    }

    let active = true
    setResumes([])
    setIsLoading(true)
    setError(null)

    const loadResumes = async () => {
      try {
        const items = await fetchUserResumes(userId)
        if (!active) return
        setResumes(items)
      } catch (cause: unknown) {
        if (!active) return
        console.error("Could not fetch the user's saved resumes.", cause)
        setError("تعذر تحميل سيرك الذاتية الآن. تحقق من اتصالك وحاول مرة أخرى.")
      } finally {
        if (active) setIsLoading(false)
      }
    }

    void loadResumes()

    return () => {
      active = false
    }
  }, [authLoading, hasHydrated, userId])

  const retryLoad = async () => {
    if (!userId) return

    setError(null)
    setIsLoading(true)
    try {
      const items = await fetchUserResumes(userId)
      setResumes(items)
    } catch (cause: unknown) {
      console.error("Could not reload the user's saved resumes.", cause)
      setError("تعذر تحميل سيرك الذاتية الآن. تحقق من اتصالك وحاول مرة أخرى.")
    } finally {
      setIsLoading(false)
    }
  }

  const createResume = () => {
    resetResume()
    router.push("/editor?template=ats")
  }

  const continueResume = (resume: SavedResume) => {
    openSavedResume(resume)
    router.push(
      `/editor?template=${encodeURIComponent(resume.resume_data.templateId)}`,
    )
  }

  return (
    <main className="dashboard-shell min-h-screen bg-[#f7f6f1] text-[#18302c] transition-colors dark:bg-[#111816] dark:text-[#e7eeeb]">
      <Navbar compact />
      <section className="dashboard-content mx-auto max-w-6xl px-5 pb-20 pt-12 sm:px-8 sm:pt-16">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="mb-2 text-sm font-bold text-[#648078] dark:text-[#9cc4b0]">
              مساحة عملك
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              سيرتي الذاتية
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-7 text-[#687670] dark:text-[#aab8b2]">
              ابدأ سيرة جديدة أو تابع آخر نسخة محفوظة في حسابك.
            </p>
          </div>
          {user?.email && (
            <p className="max-w-full min-w-0 [overflow-wrap:anywhere] rounded-full border border-[#dce4df] bg-white/70 px-4 py-2 text-xs text-[#687670] dark:border-[#34443f] dark:bg-[#19221f] dark:text-[#aab8b2]" dir="ltr">
              {user.email}
            </p>
          )}
        </div>

        {authLoading || (user && !hasHydrated) ? (
          <div className="max-w-[260px] animate-pulse overflow-hidden rounded-xl border border-[#e1e6e2] bg-white dark:border-[#34443f] dark:bg-[#19221f]">
            <div className="aspect-[210/297] bg-[#edf1ee] dark:bg-[#263630]" />
            <div className="space-y-2 p-4">
              <div className="h-4 w-2/3 rounded bg-[#edf1ee] dark:bg-[#263630]" />
              <div className="h-3 w-1/2 rounded bg-[#edf1ee] dark:bg-[#263630]" />
            </div>
          </div>
        ) : !user ? (
          <div className="max-w-xl rounded-2xl border border-[#e1e6e2] bg-white p-7 shadow-sm dark:border-[#34443f] dark:bg-[#19221f] sm:p-9">
            <h2 className="text-xl font-bold">سجّل الدخول لعرض سيرتك الذاتية</h2>
            <p className="mt-3 text-sm leading-7 text-[#687670] dark:text-[#aab8b2]">
              يمكنك إنشاء سيرة ذاتية دون حساب، لكن يلزم تسجيل الدخول للوصول إلى
              النسخ المحفوظة في السحابة.
            </p>
            <Link
              href="/auth"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#173f38] px-5 text-sm font-bold text-white no-underline transition hover:bg-[#0f302a]"
            >
              تسجيل الدخول
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div
                className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
                role="alert"
              >
                <span>{error}</span>
                <button
                  type="button"
                  className="font-bold underline underline-offset-4"
                  disabled={isLoading}
                  onClick={() => void retryLoad()}
                >
                  {isLoading ? "جارٍ التحميل..." : "إعادة المحاولة"}
                </button>
              </div>
            )}

            {isLoading ? (
              <div
                className="dashboard-resume-grid grid grid-cols-1 items-start gap-5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-7"
                aria-label="جارٍ تحميل السير الذاتية"
                role="status"
              >
                <span className="sr-only">جارٍ تحميل السير الذاتية</span>
                {[0, 1, 2].map((item) => (
                  <div
                    className="aspect-[210/297] animate-pulse rounded-2xl border border-[#e1e6e2] bg-[#edf1ee] dark:border-[#34443f] dark:bg-[#263630]"
                    key={item}
                  />
                ))}
              </div>
            ) : (
              <div className="dashboard-resume-grid grid grid-cols-1 items-start gap-5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-7">
                {resumes.map((resume) => {
                  const summary = getResumeSummary(resume)
                  const updatedAt = new Intl.DateTimeFormat("ar", {
                    dateStyle: "medium",
                  }).format(new Date(resume.updated_at))

                  return (
                    <article
                      className="dashboard-resume-card group overflow-hidden rounded-2xl border border-[#e1e6e2] bg-white shadow-[0_12px_36px_rgba(27,62,54,0.07)] transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-[0_22px_48px_rgba(27,62,54,0.14)] dark:border-[#34443f] dark:bg-[#19221f]"
                      key={resume.id}
                    >
                      <div className="dashboard-resume-art relative aspect-[210/297] overflow-hidden bg-white p-[7%] text-black">
                        <div className="h-full overflow-hidden border-t-[3px] border-[#173f38] pt-[5%] font-sans">
                          <h2 className="truncate text-[clamp(10px,2.4vw,18px)] font-extrabold">
                            {summary.name}
                          </h2>
                          <p className="mt-1 truncate text-[clamp(5px,1vw,8px)] text-gray-600">
                            {summary.details.join(" • ")}
                          </p>
                          <div className="mt-[8%] space-y-[6%]">
                            {summary.sections.map((section, index) => (
                              <div key={`${index}-${section.slice(0, 24)}`}>
                                {index > 0 && (
                                  <div className="mb-[2%] border-b border-gray-300 pb-[1%] text-[clamp(5px,1vw,8px)] font-bold uppercase">
                                    {index === 1 ? "Experience" : "Resume"}
                                  </div>
                                )}
                                <p className="line-clamp-3 [overflow-wrap:anywhere] text-[clamp(5px,1vw,8px)] leading-[1.55] text-gray-700">
                                  {section}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                        <button
                          type="button"
                          className="dashboard-resume-overlay"
                          onClick={() => continueResume(resume)}
                          aria-label={`تعديل ${summary.name}`}
                        >
                          تعديل السيرة
                          <span aria-hidden="true">←</span>
                        </button>
                      </div>
                      <div className="p-4">
                        <h2 className="truncate text-sm font-bold">
                          {summary.name}
                        </h2>
                        <p className="dashboard-resume-date mt-2 inline-flex items-center gap-2 text-[11px] text-[#77817e] dark:text-[#aab8b2]">
                          <span aria-hidden="true" />
                          <span className="dashboard-resume-badge">آخر تعديل</span>
                          {updatedAt}
                        </p>
                      </div>
                    </article>
                  )
                })}

                {!error && (
                  <button
                    type="button"
                    onClick={createResume}
                    className={`dashboard-create-card group flex min-h-64 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[#bdcec5] bg-white/65 p-7 text-center text-[#315d53] transition-all duration-200 ease-in-out hover:-translate-y-1 hover:border-[#668f7b] hover:bg-white dark:border-[#446958] dark:bg-[#19221f]/70 dark:text-[#bde2ca] dark:hover:bg-[#19221f] ${
                      resumes.length === 0 ? "sm:col-span-2 lg:col-span-3" : ""
                    }`}
                  >
                    <span className="dashboard-create-icon grid size-14 place-items-center rounded-2xl border border-current text-3xl font-light transition group-hover:scale-105">
                      +
                    </span>
                    <span className="text-base font-bold">
                      {resumes.length === 0
                        ? "لا توجد سير ذاتية محفوظة بعد"
                        : "إنشاء سيرة جديدة"}
                    </span>
                    <span className="max-w-sm text-sm leading-7 text-[#687670] dark:text-[#aab8b2]">
                      {resumes.length === 0
                        ? "ابدأ سيرتك الأولى، أضف خبراتك ومهاراتك، ثم احفظها في حسابك لتعود إليها في أي وقت."
                        : "ابدأ بتصميم جديد واحتفظ بكل سيرك الذاتية في مكان واحد."}
                    </span>
                    <span className="rounded-xl bg-[#173f38] px-5 py-3 text-sm font-bold text-white transition group-hover:bg-[#0f302a]">
                      إنشاء سيرة جديدة
                    </span>
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  )
}
