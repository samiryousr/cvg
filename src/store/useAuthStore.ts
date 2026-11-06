import { create } from "zustand"
import type { Session, User } from "@supabase/supabase-js"

import { getSupabaseClient } from "@/lib/supabase"

export type AuthState = {
  user: User | null
  session: Session | null
  isLoading: boolean
  isSubmitting: boolean
  error: string | null
  notice: string | null
  setUser: (user: User | null) => void
  setSession: (session: Session | null) => void
  initializeAuth: () => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signUp: (name: string, email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  clearMessages: () => void
}

let authSubscription: { unsubscribe: () => void } | null = null
let initialization: Promise<void> | null = null

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "حدث خطأ غير متوقع. حاول مرة أخرى."
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: true,
  isSubmitting: false,
  error: null,
  notice: null,

  setUser: (user) => set({ user }),

  setSession: (session) =>
    set({
      session,
      user: session?.user ?? null,
    }),

  initializeAuth: () => {
    if (authSubscription) return Promise.resolve()
    if (initialization) return initialization

    set({ isLoading: true, error: null })

    const pendingInitialization = (async () => {
      let authEventRevision = 0

      try {
        const supabase = getSupabaseClient()
        const { data } = supabase.auth.onAuthStateChange((_event, session) => {
          authEventRevision += 1
          set({
            session,
            user: session?.user ?? null,
            isLoading: false,
            error: null,
            notice: null,
          })
        })
        authSubscription = data.subscription

        const revisionBeforeGetSession = authEventRevision
        const { data: sessionData, error } = await supabase.auth.getSession()
        if (error) throw error

        if (authEventRevision === revisionBeforeGetSession) {
          useAuthStore.getState().setSession(sessionData.session)
        }
      } catch (error) {
        console.error("Could not initialize Supabase authentication.", error)
        set({
          session: null,
          user: null,
          error: getErrorMessage(error),
        })
      } finally {
        set({ isLoading: false })
      }
    })()

    initialization = pendingInitialization
    void pendingInitialization.then(
      () => {
        if (initialization === pendingInitialization) initialization = null
      },
      () => {
        if (initialization === pendingInitialization) initialization = null
      },
    )

    return pendingInitialization
  },

  signIn: async (email, password) => {
    set({ isSubmitting: true, error: null, notice: null })

    try {
      const { data, error } = await getSupabaseClient().auth.signInWithPassword({
        email: email.trim(),
        password,
      })
      if (error) throw error

      useAuthStore.getState().setSession(data.session)
    } catch (error) {
      set({ error: getErrorMessage(error) })
    } finally {
      set({ isSubmitting: false })
    }
  },

  signUp: async (name, email, password) => {
    set({ isSubmitting: true, error: null, notice: null })

    try {
      const displayName = name.trim()
      if (!displayName) throw new Error("الاسم مطلوب لإنشاء الحساب.")

      const { data, error } = await getSupabaseClient().auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            name: displayName,
            full_name: displayName,
          },
        },
      })
      if (error) throw error

      useAuthStore.getState().setSession(data.session)
      set({
        notice: data.session
          ? "تم إنشاء الحساب وتسجيل الدخول بنجاح."
          : "تم إنشاء الحساب. تحقق من بريدك الإلكتروني لتأكيده قبل تسجيل الدخول.",
      })
    } catch (error) {
      set({ error: getErrorMessage(error) })
    } finally {
      set({ isSubmitting: false })
    }
  },

  signOut: async () => {
    set({ isSubmitting: true, error: null, notice: null })

    try {
      const { error } = await getSupabaseClient().auth.signOut()
      if (error) throw error

      useAuthStore.getState().setSession(null)
    } catch (error) {
      set({ error: getErrorMessage(error) })
    } finally {
      set({ isSubmitting: false })
    }
  },

  clearMessages: () => set({ error: null, notice: null }),
}))
