"use client"

import { useEffect } from "react"
import type { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { useAuthStore } from "@/store/useAuthStore"
import { useResumeStore } from "@/features/resume-builder/store"

export function AppShell({ children }: { children: ReactNode }) {
  const colorMode = useResumeStore((state) => state.colorMode)
  const hasHydrated = useResumeStore((state) => state.hasHydrated)
  const loadUserResume = useResumeStore((state) => state.loadUserResume)
  const initializeAuth = useAuthStore((state) => state.initializeAuth)
  const userId = useAuthStore((state) => state.user?.id)
  const pathname = usePathname()

  useEffect(() => {
    void initializeAuth()
  }, [initializeAuth])

  useEffect(() => {
    if (!userId || !hasHydrated || pathname === "/resumes") return

    void loadUserResume().catch((error: unknown) => {
      console.error("Could not load the user's resume from Supabase.", error)
    })
  }, [hasHydrated, loadUserResume, pathname, userId])

  return (
    <div className={`app-theme${colorMode === "dark" ? " theme-dark" : ""}`}>
      {children}
    </div>
  )
}
