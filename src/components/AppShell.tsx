"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { LoadingScreen } from "@/components/LoadingScreen"
import { useResumeStore } from "@/features/resume-builder/store"

export function AppShell({ children }: { children: ReactNode }) {
  const hasHydrated = useResumeStore((state) => state.hasHydrated)
  const colorMode = useResumeStore((state) => state.colorMode)
  const startedRehydration = useRef(false)

  useEffect(() => {
    if (startedRehydration.current) return

    startedRehydration.current = true
    void useResumeStore.persist.rehydrate()
  }, [])

  return (
    <div className={`app-theme${colorMode === "dark" ? " theme-dark" : ""}`}>
      {hasHydrated ? children : <LoadingScreen message="نجهّز لك تجربة أفضل..." />}
    </div>
  )
}
