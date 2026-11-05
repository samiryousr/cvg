"use client"

import { useEffect } from "react"
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
  const selectedTemplateId = useResumeStore((state) => state.templateId)
  const setTemplate = useResumeStore((state) => state.setTemplate)

  useEffect(() => {
    if (templateId) setTemplate(templateId)
  }, [setTemplate, templateId])

  if (templateId && selectedTemplateId !== templateId) {
    return <LoadingScreen message="جارٍ تجهيز محرر السيرة..." />
  }

  return <ResumeEditor onBack={() => router.push("/")} />
}
