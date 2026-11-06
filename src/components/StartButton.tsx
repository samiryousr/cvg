"use client"

import type { ReactNode } from "react"

import { useState } from "react"

import { useRouter } from "next/navigation"

import { NavbarAuthModal } from "@/components/NavbarAuthModal"

import { useAuthStore } from "@/store/useAuthStore"

import { fetchUserResumes } from "@/services/resumeService"

type StartButtonProps = {
  children: ReactNode

  className?: string
}

export function StartButton({
  children,

  className = "primary-button",
}: StartButtonProps) {
  const router = useRouter()

  const user = useAuthStore((state) => state.user)

  const authLoading = useAuthStore((state) => state.isLoading)

  const [isCheckingResumes, setIsCheckingResumes] = useState(false)

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

  const continueStartFlow = async () => {
    const currentUser = useAuthStore.getState().user

    if (!currentUser) return

    setIsCheckingResumes(true)

    try {
      const resumes = await fetchUserResumes(currentUser.id)

      if (useAuthStore.getState().user?.id !== currentUser.id) return

      if (resumes.length > 0) {
        router.push("/resumes")
      } else {
        router.push("/builder")
      }
    } catch (cause) {
      console.error("Could not check the user's saved resumes.", cause)
      if (useAuthStore.getState().user?.id === currentUser.id) {
        router.push("/builder")
      }
    } finally {
      setIsCheckingResumes(false)
    }
  }

  const handleClick = () => {
    if (authLoading || isCheckingResumes) return

    if (!user) {
      setIsAuthModalOpen(true)

      return
    }

    void continueStartFlow()
  }

  return (
    <>
      <button
        className={className}
        disabled={authLoading || isCheckingResumes}
        onClick={handleClick}
        type="button"
      >
        {authLoading
          ? "جارٍ التحقق..."
          : isCheckingResumes
            ? "جارٍ التحقق من سيرك..."
            : children}
      </button>
      {isAuthModalOpen && (
        <NavbarAuthModal
          onAuthenticated={() => {
            setIsAuthModalOpen(false)

            void continueStartFlow()
          }}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}
    </>
  )
}
