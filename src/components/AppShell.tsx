"use client"

import type { ReactNode } from "react"
import { useResumeStore } from "@/features/resume-builder/store"

export function AppShell({ children }: { children: ReactNode }) {
  const colorMode = useResumeStore((state) => state.colorMode)

  return (
    <div className={`app-theme${colorMode === "dark" ? " theme-dark" : ""}`}>
      {children}
    </div>
  )
}
