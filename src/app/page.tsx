"use client"

import { useEffect, useState } from "react"
import { LandingPage } from "@/components/landing/LandingPage"
import { ResumeEditor } from "@/components/resume-builder/ResumeEditor"
import { templates } from "@/features/resume-builder/model"
import { useResumeStore } from "@/features/resume-builder/store"

export default function App() {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const setTemplate = useResumeStore((state) => state.setTemplate)
  const hasHydrated = useResumeStore((state) => state.hasHydrated)
  const colorMode = useResumeStore((state) => state.colorMode)

  useEffect(() => {
    void useResumeStore.persist.rehydrate()
    const timer = window.setTimeout(() => setLoading(false), 1600)
    return () => window.clearTimeout(timer)
  }, [])

  if (loading || !hasHydrated) {
    return (
      <div className={`app-theme${colorMode === "dark" ? " theme-dark" : ""}`}>
        <div className="loading-screen" dir="rtl">
          <div className="loading-glow" />
          <div className="loading-brand">
            <span>س</span>
            <strong>سيرتي</strong>
          </div>
          <div className="loading-line">
            <span />
          </div>
          <p>نجهّز لك تجربة أفضل...</p>
        </div>
      </div>
    )
  }

  const chooseTemplate = (templateId: typeof templates[number]["id"]) => {
    setTemplate(templateId)
    setIsEditing(true)
  }

  return (
    <div className={`app-theme${colorMode === "dark" ? " theme-dark" : ""}`}>
      {isEditing ? (
        <ResumeEditor onBack={() => setIsEditing(false)} />
      ) : (
        <LandingPage onChoose={(template) => chooseTemplate(template.id)} />
      )}
    </div>
  )
}
