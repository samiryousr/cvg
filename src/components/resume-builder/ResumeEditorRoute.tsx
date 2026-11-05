"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { LoadingScreen } from "@/components/LoadingScreen"
import { ResumeEditor } from "@/components/resume-builder/ResumeEditor"
import type { TemplateId } from "@/features/resume-builder/model"
import { useResumeStore } from "@/features/resume-builder/store"

export function ResumeEditorRoute({
  templateId,
}: {
  templateId?: TemplateId
}) {
  const router = useRouter()
  const hasHydrated = useResumeStore((state) => state.hasHydrated)
  const setTemplate = useResumeStore((state) => state.setTemplate)
  const startedRehydration = useRef(false)
  const [appliedRouteTemplateId, setAppliedRouteTemplateId] =
    useState<TemplateId>()

  useEffect(() => {
    if (hasHydrated || startedRehydration.current) return

    startedRehydration.current = true
    void useResumeStore.persist.rehydrate()
  }, [hasHydrated])

  useEffect(() => {
    if (!hasHydrated || !templateId) return

    setTemplate(templateId)
    setAppliedRouteTemplateId(templateId)
  }, [hasHydrated, setTemplate, templateId])

  if (!hasHydrated || (templateId && appliedRouteTemplateId !== templateId)) {
    return <LoadingScreen message="جارٍ تجهيز محرر السيرة..." />
  }

  return <ResumeEditor onBack={() => router.push("/")} />
}
