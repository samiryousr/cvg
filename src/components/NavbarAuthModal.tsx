"use client"

import { useEffect, useState, type FormEvent } from "react"
import { createPortal } from "react-dom"

import { useAuthStore } from "@/store/useAuthStore"

type AuthMode = "sign-in" | "sign-up"

type NavbarAuthModalProps = {
  onClose: () => void
  onAuthenticated?: () => void
}

export function NavbarAuthModal({
  onClose,
  onAuthenticated,
}: NavbarAuthModalProps) {
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null)

  const [mode, setMode] = useState<AuthMode>("sign-in")

  const [name, setName] = useState("")

  const [email, setEmail] = useState("")

  const [password, setPassword] = useState("")

  const [confirmPassword, setConfirmPassword] = useState("")

  const [formError, setFormError] = useState("")

  const isSubmitting = useAuthStore((state) => state.isSubmitting)

  const error = useAuthStore((state) => state.error)

  const notice = useAuthStore((state) => state.notice)

  const signIn = useAuthStore((state) => state.signIn)

  const signUp = useAuthStore((state) => state.signUp)

  const clearMessages = useAuthStore((state) => state.clearMessages)

  useEffect(() => {
    setPortalRoot(document.body)

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    clearMessages()

    setFormError("")

    if (mode === "sign-up") {
      if (!name.trim()) {
        setFormError("الاسم مطلوب.")

        return
      }

      if (password !== confirmPassword) {
        setFormError("كلمتا المرور غير متطابقتين.")

        return
      }

      await signUp(name, email, password)
      if (useAuthStore.getState().user) onAuthenticated?.()
      return
    }

    await signIn(email, password)
    if (useAuthStore.getState().user) {
      if (onAuthenticated) onAuthenticated()
      else onClose()
    }
  }

  if (!portalRoot) return null

  return createPortal(
    <div
      className="navbar-auth-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        aria-labelledby="navbar-auth-title"
        aria-modal="true"
        className="relative max-h-full w-full max-w-md overflow-y-auto rounded-2xl border border-[#e3e7e3] bg-white p-6 text-[#18302c] shadow-2xl dark:border-[#34443f] dark:bg-[#19221f] dark:text-[#e7eeeb] sm:p-8"
        role="dialog"
        dir="rtl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="إغلاق"
          className="absolute left-4 top-4 grid size-9 place-items-center rounded-full text-xl text-[#687670] hover:bg-[#f1f5f2] dark:text-[#aab8b2] dark:hover:bg-[#263630]"
        >
          ×
        </button>
        <h2 id="navbar-auth-title" className="pl-10 text-2xl font-extrabold">
          {mode === "sign-in" ? "تسجيل الدخول" : "إنشاء حساب جديد"}
        </h2>
        <p className="mt-2 text-sm leading-6 text-[#687670] dark:text-[#aab8b2]">
          {mode === "sign-in"
            ? "سجّل الدخول لمتابعة استخدام حسابك."
            : "أدخل اسمك وبريدك الإلكتروني لإنشاء حساب."}
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

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {mode === "sign-up" && (
            <label className="block space-y-2 text-sm font-semibold">
              <span>الاسم</span>
              <input
                autoComplete="name"
                className="w-full rounded-lg border border-[#d6dfda] bg-white px-3 py-3 text-sm outline-none focus:border-[#568478] focus:ring-4 focus:ring-[#568478]/10 dark:border-[#446958] dark:bg-[#222e2a]"
                disabled={isSubmitting}
                maxLength={100}
                name="name"
                onChange={(event) => setName(event.target.value)}
                placeholder="الاسم الكامل"
                required
                value={name}
              />
            </label>
          )}
          <label className="block space-y-2 text-sm font-semibold">
            <span>البريد الإلكتروني</span>
            <input
              autoComplete="email"
              className="w-full rounded-lg border border-[#d6dfda] bg-white px-3 py-3 text-left text-sm outline-none focus:border-[#568478] focus:ring-4 focus:ring-[#568478]/10 dark:border-[#446958] dark:bg-[#222e2a]"
              dir="ltr"
              disabled={isSubmitting}
              name="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
              required
              type="email"
              value={email}
            />
          </label>
          <label className="block space-y-2 text-sm font-semibold">
            <span>كلمة المرور</span>
            <input
              autoComplete={
                mode === "sign-in" ? "current-password" : "new-password"
              }
              className="w-full rounded-lg border border-[#d6dfda] bg-white px-3 py-3 text-sm outline-none focus:border-[#568478] focus:ring-4 focus:ring-[#568478]/10 dark:border-[#446958] dark:bg-[#222e2a]"
              disabled={isSubmitting}
              minLength={6}
              name="password"
              onChange={(event) => {
                setPassword(event.target.value)

                setFormError("")
              }}
              placeholder="٦ أحرف على الأقل"
              required
              type="password"
              value={password}
            />
          </label>
          {mode === "sign-up" && (
            <label className="block space-y-2 text-sm font-semibold">
              <span>تأكيد كلمة المرور</span>
              <input
                autoComplete="new-password"
                className="w-full rounded-lg border border-[#d6dfda] bg-white px-3 py-3 text-sm outline-none focus:border-[#568478] focus:ring-4 focus:ring-[#568478]/10 dark:border-[#446958] dark:bg-[#222e2a]"
                disabled={isSubmitting}
                minLength={6}
                name="confirmPassword"
                onChange={(event) => {
                  setConfirmPassword(event.target.value)

                  setFormError("")
                }}
                placeholder="أعد كتابة كلمة المرور"
                required
                type="password"
                value={confirmPassword}
              />
            </label>
          )}
          <button
            className="w-full rounded-lg bg-[#173f38] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#0f302a] disabled:cursor-wait disabled:opacity-60 dark:bg-[#34775b] dark:hover:bg-[#286349]"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting
              ? "جارٍ التنفيذ..."
              : mode === "sign-in"
                ? "تسجيل الدخول"
                : "إنشاء الحساب"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-[#687670] dark:text-[#aab8b2]">
          {mode === "sign-in" ? "ليس لديك حساب؟" : "لديك حساب بالفعل؟"}{" "}
          <button
            className="font-bold text-[#173f38] underline underline-offset-4 dark:text-[#bde2ca]"
            disabled={isSubmitting}
            onClick={() => {
              clearMessages()

              setFormError("")

              setMode(mode === "sign-in" ? "sign-up" : "sign-in")
            }}
            type="button"
          >
            {mode === "sign-in" ? "إنشاء حساب" : "تسجيل الدخول"}
          </button>
        </p>
      </section>
    </div>,
    portalRoot,
  )
}
