"use client"

import { useResumeStore } from "@/features/resume-builder/store"

export function ThemeToggle() {
  const colorMode = useResumeStore((state) => state.colorMode)

  const setColorMode = useResumeStore((state) => state.setColorMode)

  const isDark = colorMode === "dark"

  return (
    <button
      className="theme-toggle"
      type="button"
      aria-label={isDark ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"}
      aria-pressed={isDark}
      title={isDark ? "الوضع الفاتح" : "الوضع الداكن"}
      onClick={() => setColorMode(isDark ? "light" : "dark")}
    >
      {isDark ? (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.2 15.4A8.3 8.3 0 0 1 8.6 3.8 8.6 8.6 0 1 0 20.2 15.4Z" />
        </svg>
      )}
    </button>
  )
}
