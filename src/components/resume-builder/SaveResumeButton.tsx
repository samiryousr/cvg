"use client"

import { useState } from "react"

import { useResumeStore } from "@/features/resume-builder/store"
import { ResumeValidationError } from "@/features/resume-builder/validation"

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
      if (error instanceof ResumeValidationError) {
        setMessage(null)
        return
      }
      console.error("Could not save the resume to the user's account.", error)
      setMessage({
        text: isArabic
          ? "تعذر حفظ السيرة في حسابك. حاول مرة أخرى."
          : "Could not save your resume. Please try again.",
        isError: true,
      })
    }
  }

  const isSaved = message !== null && !message.isError

  return (
    <>
      <button
        className={`cloud-save-button gap-2${isSaved ? " is-saved" : ""}`}
        type="button"
        onClick={() => void save()}
        disabled={isSaving}
        aria-busy={isSaving}
      >
        {isSaving && (
          <svg
            className="size-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="opacity-75"
              d="M21 12a9 9 0 0 0-9-9"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        )}
        {isSaved && (
          <svg
            className="save-success-icon"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="m4.5 10.2 3.6 3.5 7.4-7.4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
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
