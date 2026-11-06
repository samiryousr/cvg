"use client"

import Link from "next/link"
import { useState, type FormEvent } from "react"

import { ThemeToggle } from "@/components/ThemeToggle"
import { useAuthStore } from "@/store/useAuthStore"

type AuthMode = "sign-in" | "sign-up"

export function Auth() {
  const [mode, setMode] = useState<AuthMode>("sign-in")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [formError, setFormError] = useState("")
  const user = useAuthStore((state) => state.user)
  const isLoading = useAuthStore((state) => state.isLoading)
  const isSubmitting = useAuthStore((state) => state.isSubmitting)
  const error = useAuthStore((state) => state.error)
  const notice = useAuthStore((state) => state.notice)
  const signIn = useAuthStore((state) => state.signIn)
  const signUp = useAuthStore((state) => state.signUp)
  const signOut = useAuthStore((state) => state.signOut)
  const clearMessages = useAuthStore((state) => state.clearMessages)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    clearMessages()
    setFormError("")

    if (mode === "sign-in") {
      await signIn(email, password)
    } else {
      if (!name.trim()) {
        setFormError("الاسم مطلوب.")
        return
      }

      if (password !== confirmPassword) {
        setFormError("كلمتا المرور غير متطابقتين.")
        return
      }

      await signUp(name, email, password)
    }
  }

  return (
    <main
      className="flex min-h-screen items-center justify-center bg-[#f7f6f1] px-4 py-10 text-[#18302c] transition-colors dark:bg-[#111816] dark:text-[#e7eeeb]"
      dir="rtl"
    >
      <section className="w-full max-w-md rounded-2xl border border-[#e3e7e3] bg-white p-6 shadow-[0_20px_60px_rgba(27,62,54,0.10)] transition-colors dark:border-[#34443f] dark:bg-[#19221f] dark:shadow-[0_20px_60px_rgba(0,0,0,0.3)] sm:p-9">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#173f38] no-underline dark:text-[#dce6e1]"
          >
            <span className="grid size-9 place-items-center rounded-full bg-[#173f38] text-lg text-white dark:bg-[#34775b]">
              س
            </span>
            سيرتي
          </Link>
          <ThemeToggle />
        </div>

        <h1 className="text-2xl font-extrabold tracking-tight">
          {user
            ? "حسابك"
            : mode === "sign-in"
              ? "تسجيل الدخول"
              : "إنشاء حساب جديد"}
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#687670] dark:text-[#aab8b2]">
          {user
            ? "أنت مسجل الدخول ويمكنك متابعة استخدام سيرتي."
            : mode === "sign-up"
              ? "أدخل اسمك وبريدك الإلكتروني وأنشئ كلمة مرور لتسجيل حسابك."
              : "سجّل الدخول لمتابعة استخدام حسابك."}
        </p>

        {(formError || error) && (
            <p
              className="mt-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm leading-6 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
              role="alert"
            >
              {formError || error}
          </p>
        )}
        {notice && (
          <p
            className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm leading-6 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200"
            role="status"
          >
            {notice}
          </p>
        )}

        {isLoading ? (
          <div
            className="mt-8 space-y-4"
            aria-label="جارٍ التحقق من الجلسة"
            role="status"
          >
            <span className="sr-only">جارٍ التحقق من الجلسة</span>
            <div className="h-11 animate-pulse rounded-lg bg-[#edf1ee] dark:bg-[#263630]" />
            <div className="h-11 animate-pulse rounded-lg bg-[#edf1ee] dark:bg-[#263630]" />
            <div className="h-11 animate-pulse rounded-lg bg-[#edf1ee] dark:bg-[#263630]" />
          </div>
        ) : user ? (
          <div className="mt-7 space-y-4">
            <p
              className="rounded-lg bg-[#f7f8f6] px-4 py-3 text-sm text-[#46544f] dark:bg-[#222e2a] dark:text-[#d0ddd6]"
              dir="ltr"
            >
              {user.email}
            </p>
            <Link
              href="/resumes"
              className="block w-full rounded-lg bg-[#173f38] px-4 py-3 text-center text-sm font-bold text-white no-underline transition hover:bg-[#0f302a] dark:bg-[#34775b] dark:hover:bg-[#286349]"
            >
              عرض سيرتي الذاتية
            </Link>
            <button
              type="button"
              onClick={() => void signOut()}
              className="w-full rounded-lg border border-[#d6dfda] px-4 py-3 text-sm font-bold text-[#173f38] transition hover:bg-[#f4f7f5] disabled:cursor-not-allowed disabled:opacity-60 dark:border-[#446958] dark:text-[#bde2ca] dark:hover:bg-[#24352d]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "جارٍ تسجيل الخروج..." : "تسجيل الخروج"}
            </button>
          </div>
        ) : (
          <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
            {mode === "sign-up" && (
              <label className="block space-y-2 text-sm font-semibold">
                <span>الاسم</span>
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  required
                  maxLength={100}
                  disabled={isSubmitting}
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value)
                    setFormError("")
                  }}
                  placeholder="الاسم الكامل"
                  className="w-full rounded-lg border border-[#d6dfda] bg-white px-3 py-3 text-sm text-[#18302c] outline-none transition placeholder:text-[#9aa6a1] focus:border-[#568478] focus:ring-4 focus:ring-[#568478]/10 dark:border-[#446958] dark:bg-[#222e2a] dark:text-[#e7eeeb] dark:placeholder:text-[#85968e]"
                />
              </label>
            )}

            <label className="block space-y-2 text-sm font-semibold">
              <span>البريد الإلكتروني</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                required
                disabled={isSubmitting}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@example.com"
                dir="ltr"
                className="w-full rounded-lg border border-[#d6dfda] bg-white px-3 py-3 text-left text-sm text-[#18302c] outline-none transition placeholder:text-[#9aa6a1] focus:border-[#568478] focus:ring-4 focus:ring-[#568478]/10 dark:border-[#446958] dark:bg-[#222e2a] dark:text-[#e7eeeb] dark:placeholder:text-[#85968e]"
              />
            </label>

            <label className="block space-y-2 text-sm font-semibold">
              <span>كلمة المرور</span>
              <input
                type="password"
                name="password"
                autoComplete={
                  mode === "sign-in" ? "current-password" : "new-password"
                }
                minLength={6}
                required
                disabled={isSubmitting}
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)
                  setFormError("")
                }}
                placeholder="٦ أحرف على الأقل"
                className="w-full rounded-lg border border-[#d6dfda] bg-white px-3 py-3 text-sm text-[#18302c] outline-none transition placeholder:text-[#9aa6a1] focus:border-[#568478] focus:ring-4 focus:ring-[#568478]/10 dark:border-[#446958] dark:bg-[#222e2a] dark:text-[#e7eeeb] dark:placeholder:text-[#85968e]"
              />
            </label>

            {mode === "sign-up" && (
              <label className="block space-y-2 text-sm font-semibold">
                <span>تأكيد كلمة المرور</span>
                <input
                  type="password"
                  name="confirmPassword"
                  autoComplete="new-password"
                  minLength={6}
                  required
                  disabled={isSubmitting}
                  value={confirmPassword}
                  onChange={(event) => {
                    setConfirmPassword(event.target.value)
                    setFormError("")
                  }}
                  placeholder="أعد كتابة كلمة المرور"
                  className="w-full rounded-lg border border-[#d6dfda] bg-white px-3 py-3 text-sm text-[#18302c] outline-none transition placeholder:text-[#9aa6a1] focus:border-[#568478] focus:ring-4 focus:ring-[#568478]/10 dark:border-[#446958] dark:bg-[#222e2a] dark:text-[#e7eeeb] dark:placeholder:text-[#85968e]"
                />
              </label>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-[#173f38] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#0f302a] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-[#34775b] dark:hover:bg-[#286349]"
            >
              {isSubmitting
                ? mode === "sign-in"
                  ? "جارٍ تسجيل الدخول..."
                  : "جارٍ إنشاء الحساب..."
                : mode === "sign-in"
                  ? "تسجيل الدخول"
                  : "إنشاء الحساب"}
            </button>

            <p className="text-center text-sm text-[#687670] dark:text-[#aab8b2]">
              {mode === "sign-in" ? "ليس لديك حساب؟" : "لديك حساب بالفعل؟"}{" "}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => {
                  clearMessages()
                  setFormError("")
                  setMode(mode === "sign-in" ? "sign-up" : "sign-in")
                }}
                className="font-bold text-[#173f38] underline underline-offset-4 dark:text-[#bde2ca]"
              >
                {mode === "sign-in" ? "إنشاء حساب" : "تسجيل الدخول"}
              </button>
            </p>
          </form>
        )}

        <Link
          href="/"
          className="mt-7 block text-center text-sm text-[#687670] underline underline-offset-4 dark:text-[#aab8b2]"
        >
          العودة إلى الرئيسية
        </Link>
      </section>
    </main>
  )
}
