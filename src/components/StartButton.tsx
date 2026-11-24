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

  const [isCheckingResumes, setIsCheckingResumes] = useState(false)

  const [isResolvingAuth, setIsResolvingAuth] = useState(false)

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

  const handleClick = async () => {
    if (isResolvingAuth || isCheckingResumes) return

    let currentUser = useAuthStore.getState().user

    if (useAuthStore.getState().isLoading) {
      setIsResolvingAuth(true)
      try {
        await useAuthStore.getState().initializeAuth()
        currentUser = useAuthStore.getState().user
      } finally {
        setIsResolvingAuth(false)
      }
    }

    if (!currentUser) {
      setIsAuthModalOpen(true)

      return
    }

    void continueStartFlow()
  }

  return (
    <>
      <button
        className={className}
        disabled={isResolvingAuth || isCheckingResumes}
        onClick={() => void handleClick()}
        type="button"
      >
        {isResolvingAuth
          ? "جارٍ التحقق من الحساب..."
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
