"use client"

import Link from "next/link"

import { useEffect, useRef, useState } from "react"

import { ThemeToggle } from "@/components/ThemeToggle"
import { NavbarAuthModal } from "@/components/NavbarAuthModal"
import { StartButton } from "@/components/StartButton"
import { useAuthStore } from "@/store/useAuthStore"

type NavbarProps = {
  floating?: boolean

  landing?: boolean

  compact?: boolean
}

export function Navbar({
  floating = false,

  landing = false,

  compact = false,
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const [authModalOpen, setAuthModalOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!menuOpen) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      setMenuOpen(false)
      menuButtonRef.current?.focus()
    }

    document.addEventListener("keydown", closeOnEscape)
    return () => document.removeEventListener("keydown", closeOnEscape)
  }, [menuOpen])

  const user = useAuthStore((state) => state.user)

  const isLoading = useAuthStore((state) => state.isLoading)

  const isSubmitting = useAuthStore((state) => state.isSubmitting)

  const error = useAuthStore((state) => state.error)

  const signOut = useAuthStore((state) => state.signOut)

  const displayName =
    (typeof user?.user_metadata.full_name === "string" &&
      user.user_metadata.full_name.trim()) ||
    (typeof user?.user_metadata.name === "string" &&
      user.user_metadata.name.trim()) ||
    user?.email?.split("@")[0] ||
    ""

  return (
    <>
      <header
        className={`site-header${floating ? " is-scrolled" : ""}${
          compact ? " templates-page-header" : ""
        }`}
        dir="rtl"
      >
        <Link className="brand" href="/" aria-label="سيرتي الرئيسية">
          <span>س</span>
          <strong>سيرتي</strong>
        </Link>

        <nav aria-label="التنقل الرئيسي">
          {landing ? (
            <>
              <a href="#top">الرئيسية</a>
              <a href="#templates">القوالب</a>
              <a href="#features">المميزات</a>
              <a href="#how">طريقة الاستخدام</a>
            </>
          ) : (
            <>
              <Link href="/">الرئيسية</Link>
              <Link href="/templates">القوالب</Link>
              {user && <Link href="/resumes">سيرتي الذاتية</Link>}
            </>
          )}
        </nav>

        <div className="site-header-actions">
          <ThemeToggle />
          {isLoading ? (
            <span className="navbar-auth-loading" role="status">
              جارٍ التحقق...
            </span>
          ) : user ? (
            <details className="account-menu">
              <summary
                aria-label={`قائمة حساب ${displayName}`}
                title={displayName}
              >
                <UserIcon className="account-user-icon" />
                <span className="account-name" dir="ltr">
                  {displayName}
                </span>
                <span className="account-chevron" aria-hidden="true">
                  ▾
                </span>
              </summary>
              <div className="account-dropdown">
                <span className="account-email" dir="ltr">
                  {user.email}
                </span>
                <Link href="/resumes" onClick={() => setMenuOpen(false)}>
                  سيرتي الذاتية
                </Link>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => void signOut()}
                >
                  {isSubmitting ? "جارٍ تسجيل الخروج..." : "تسجيل الخروج"}
                </button>
                {error && (
                  <span className="account-error" role="alert">
                    {error}
                  </span>
                )}
              </div>
            </details>
          ) : (
            <button
              aria-label="تسجيل الدخول أو إنشاء حساب"
              className="navbar-user-button"
              onClick={() => setAuthModalOpen(true)}
              title="تسجيل الدخول"
              type="button"
            >
              <UserIcon className="navbar-user-icon" />
            </button>
          )}
          {landing && (
            <StartButton className="text-button navbar-create">
              أنشئ سيرتك <span aria-hidden="true">←</span>
            </StartButton>
          )}
        </div>

        <button
          className={`menu-button ${menuOpen ? "open" : ""}`}
          type="button"
          ref={menuButtonRef}
          aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <i />
          <i />
          <i />
        </button>
        <div
          id="mobile-menu"
          className={`mobile-menu ${menuOpen ? "open" : ""}`}
          aria-hidden={!menuOpen}
          inert={!menuOpen}
        >
          {landing ? (
            <>
              <a href="#top" onClick={() => setMenuOpen(false)}>
                الرئيسية
              </a>
              <a href="#templates" onClick={() => setMenuOpen(false)}>
                القوالب
              </a>
              <a href="#features" onClick={() => setMenuOpen(false)}>
                المميزات
              </a>
              <a href="#how" onClick={() => setMenuOpen(false)}>
                طريقة الاستخدام
              </a>
            </>
          ) : (
            <>
              <Link href="/" onClick={() => setMenuOpen(false)}>
                الرئيسية
              </Link>
              <Link href="/templates" onClick={() => setMenuOpen(false)}>
                القوالب
              </Link>
              {user && (
                <Link href="/resumes" onClick={() => setMenuOpen(false)}>
                  سيرتي الذاتية
                </Link>
              )}
            </>
          )}
          {!isLoading &&
            (user ? (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => void signOut()}
              >
                {isSubmitting ? "جارٍ تسجيل الخروج..." : "تسجيل الخروج"}
              </button>
            ) : null)}
          {landing && (
            <StartButton className="mobile-start-button">
              أنشئ سيرتك مجانًا
            </StartButton>
          )}
        </div>
      </header>
      {authModalOpen && (
        <NavbarAuthModal onClose={() => setAuthModalOpen(false)} />
      )}
    </>
  )
}

function UserIcon({ className }: { className: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.4 2.8-6 7-6s7 2.6 7 6" />
    </svg>
  )
}
