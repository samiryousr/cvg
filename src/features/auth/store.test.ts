import { beforeEach, describe, expect, it, vi } from "vitest"

const authApi = vi.hoisted(() => ({
  signInWithPassword: vi.fn(),
  signUp: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChange: vi.fn(),
  getSession: vi.fn(),
}))

vi.mock("@/lib/supabase", () => ({
  getSupabaseClient: () => ({ auth: authApi }),
}))

import { useAuthStore } from "@/store/useAuthStore"

describe("authentication store", () => {
  beforeEach(() => {
    authApi.signInWithPassword.mockReset()
    authApi.signUp.mockReset()
    authApi.signOut.mockReset()
    authApi.onAuthStateChange.mockReset()
    authApi.getSession.mockReset()
    useAuthStore.setState({
      user: null,
      session: null,
      isLoading: false,
      isSubmitting: false,
      error: null,
      notice: null,
    })
  })

  it("does not mark an unconfirmed sign-up as authenticated", async () => {
    authApi.signUp.mockResolvedValue({
      data: {
        session: null,
        user: { id: "user-1", email: "person@example.com" },
      },
      error: null,
    })

    await useAuthStore
      .getState()
      .signUp("Samir Yousri", " person@example.com ", "password")

    expect(authApi.signUp).toHaveBeenCalledWith({
      email: "person@example.com",
      password: "password",
      options: {
        data: {
          name: "Samir Yousri",
          full_name: "Samir Yousri",
        },
      },
    })
    expect(useAuthStore.getState()).toMatchObject({
      user: null,
      session: null,
      isLoading: false,
      isSubmitting: false,
      notice: expect.stringContaining("تحقق من بريدك الإلكتروني"),
      error: null,
    })
  })

  it("requires a name when creating an account", async () => {
    await useAuthStore.getState().signUp("  ", "person@example.com", "password")

    expect(authApi.signUp).not.toHaveBeenCalled()
    expect(useAuthStore.getState()).toMatchObject({
      isSubmitting: false,
      error: "الاسم مطلوب لإنشاء الحساب.",
    })
  })

  it("exposes sign-in errors and ends the loading state", async () => {
    authApi.signInWithPassword.mockResolvedValue({
      data: { session: null, user: null },
      error: new Error("Invalid login credentials"),
    })

    await useAuthStore.getState().signIn("person@example.com", "wrong")

    expect(useAuthStore.getState()).toMatchObject({
      isLoading: false,
      isSubmitting: false,
      error: "Invalid login credentials",
      session: null,
      user: null,
    })
  })

  it("syncs user and session from Supabase auth state changes", async () => {
    authApi.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    })
    authApi.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    })

    await useAuthStore.getState().initializeAuth()

    const listener = authApi.onAuthStateChange.mock.calls[0][0]
    const session = {
      access_token: "access-token",
      token_type: "bearer",
      expires_in: 3600,
      expires_at: 1_900_000_000,
      refresh_token: "refresh-token",
      user: {
        id: "user-1",
        app_metadata: {},
        user_metadata: {},
        aud: "authenticated",
        created_at: "2026-01-01T00:00:00.000Z",
      },
    }

    listener("SIGNED_IN", session)

    expect(useAuthStore.getState()).toMatchObject({
      session,
      user: session.user,
      isLoading: false,
    })

    useAuthStore.getState().setUser(null)
    expect(useAuthStore.getState().user).toBeNull()

    useAuthStore.getState().setSession(null)
    expect(useAuthStore.getState()).toMatchObject({
      session: null,
      user: null,
    })
  })
})
