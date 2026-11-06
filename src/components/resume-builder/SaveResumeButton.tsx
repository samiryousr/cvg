"use client"

import { useState } from "react"

import { useResumeStore } from "@/features/resume-builder/store"

type SaveResumeButtonProps = {
  isArabic: boolean
}

export function SaveResumeButton({ isArabic }: SaveResumeButtonProps) {
  const isSaving = useResumeStore((state) => state.isSaving)
  const cloudResumeId = useResumeStore((state) => state.cloudResumeId)
  const saveCurrentResume = useResumeStore((state) => state.saveCurrentResume)
  const [message, setMessage] = useState<{
    text: string
    isError: boolean
  } | null>(null)

  const save = async () => {
    setMessage(null)
    try {
      await saveCurrentResume()
      setMessage({
        text: isArabic
          ? "تم حفظ السيرة في حسابك."
          : "Resume saved to your account.",
        isError: false,
      })
    } catch (error) {
      setMessage({
        text:
          error instanceof Error
            ? error.message
            : isArabic
              ? "تعذر الحفظ في حسابك. حاول مرة أخرى."
              : "Could not save to your account. Please try again.",
        isError: true,
      })
    }
  }

  return (
    <>
      <button
        className="cloud-save-button"
        type="button"
        onClick={() => void save()}
        disabled={isSaving}
      >
        {isSaving
          ? isArabic
            ? "جارٍ الحفظ..."
            : "Saving..."
          : cloudResumeId
            ? isArabic
              ? "تحديث في حسابك"
              : "Update cloud copy"
            : isArabic
              ? "حفظ في حسابك"
              : "Save to account"}
      </button>
      {message && (
        <p
          className={`cloud-save-feedback${message.isError ? " error" : ""}`}
          role={message.isError ? "alert" : "status"}
          aria-live={message.isError ? "assertive" : "polite"}
        >
          {message.text}
        </p>
      )}
    </>
  )
}
