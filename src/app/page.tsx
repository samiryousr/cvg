"use client"

import { useEffect, useState } from "react"
import { LandingPage } from "@/components/landing/LandingPage"
import { ResumeEditor } from "@/components/resume-builder/ResumeEditor"
import { LoadingScreen } from "@/components/LoadingScreen"
import { templates } from "@/features/resume-builder/model"
import { useResumeStore } from "@/features/resume-builder/store"

export default function App() {
  const [isEditing, setIsEditing] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState(
    "نجهّز لك تجربة أفضل...",
  )
  const [isTransitioning, setIsTransitioning] = useState(false)
  const setTemplate = useResumeStore((state) => state.setTemplate)
  const hasHydrated = useResumeStore((state) => state.hasHydrated)
  const colorMode = useResumeStore((state) => state.colorMode)

  useEffect(() => {
    void useResumeStore.persist.rehydrate()
  }, [])

  const transitionTo = async (
    editing: boolean,
    message: string,
    templateId?: (typeof templates)[number]["id"],
  ) => {
    setLoadingMessage(message)
    setIsTransitioning(true)
    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, 450)
    })
    if (templateId) setTemplate(templateId)
    setIsEditing(editing)
    setIsTransitioning(false)
  }

  if (!hasHydrated || isTransitioning) {
    return (
      <div className={`app-theme${colorMode === "dark" ? " theme-dark" : ""}`}>
        <LoadingScreen message={loadingMessage} />
      </div>
    )
  }

  return (
    <div className={`app-theme${colorMode === "dark" ? " theme-dark" : ""}`}>
      {isEditing ? (
        <ResumeEditor
          onBack={() =>
            void transitionTo(false, "جارٍ العودة إلى الصفحة الرئيسية...")
          }
        />
      ) : (
        <LandingPage
          onChoose={(template) =>
            void transitionTo(
              true,
              "جارٍ تجهيز محرر السيرة...",
              template.id,
            )
          }
        />
      )}
    </div>
  )
}
