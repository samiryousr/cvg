import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const mocks = vi.hoisted(() => ({
  user: null as { id: string } | null,
  saveResume: vi.fn(),
  fetchUserResumes: vi.fn(),
}))

vi.mock("@/store/useAuthStore", () => ({
  useAuthStore: {
    getState: () => ({ user: mocks.user }),
  },
}))

vi.mock("@/services/resumeService", () => ({
  saveResume: mocks.saveResume,
  fetchUserResumes: mocks.fetchUserResumes,
}))

import { emptyResume } from "@/features/resume-builder/model"
import type { SavedResume } from "@/services/resumeService"
import { useResumeStore } from "@/features/resume-builder/store"

function createMemoryStorage() {
  const values = new Map<string, string>()
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  }
}

describe("resume store cloud actions", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.stubGlobal("localStorage", createMemoryStorage())
    mocks.user = { id: "user-1" }
    mocks.saveResume.mockReset()
    mocks.fetchUserResumes.mockReset()
    useResumeStore.setState({
      ...emptyResume,
      personal: { ...emptyResume.personal },
      isSaving: false,
      personalInfoErrors: {},
      cloudResumeLoadStatus: "idle",
      cloudResumeId: undefined,
      cloudResumeOwnerId: undefined,
      cloudResumeSnapshot: undefined,
      cloudResumeLoadedThisSession: false,
      hasHydrated: true,
    })
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it("saves the current resume for the signed-in user and tracks its cloud ID", async () => {
    useResumeStore.getState().updatePersonal("name", "Amina Example")
    useResumeStore.getState().updatePersonal("email", "amina@example.com")
    useResumeStore.getState().updatePersonal("phone", "+1 212 555 0142")
    const savedResume = {
      id: "cloud-resume-1",
      user_id: "user-1",
      resume_data: emptyResume,
    }
    mocks.saveResume.mockResolvedValue(savedResume)

    await expect(useResumeStore.getState().saveCurrentResume()).resolves.toEqual(
      savedResume,
    )

    expect(mocks.saveResume).toHaveBeenCalledWith(
      "user-1",
      expect.objectContaining({
        personal: expect.objectContaining({
          name: "Amina Example",
          email: "amina@example.com",
          phone: "+1 212 555 0142",
        }),
      }),
      undefined,
    )
    expect(useResumeStore.getState().cloudResumeId).toBe("cloud-resume-1")
    expect(useResumeStore.getState().isSaving).toBe(false)

    mocks.saveResume.mockResolvedValue({ ...savedResume, id: "updated-id" })
    await useResumeStore.getState().saveCurrentResume()
    expect(mocks.saveResume).toHaveBeenLastCalledWith(
      "user-1",
      expect.any(Object),
      "cloud-resume-1",
    )
  })

  it("restores the latest saved resume and its ID", async () => {
    useResumeStore.getState().setColorMode("dark")
    const remoteResume = {
      id: "cloud-resume-2",
      user_id: "user-1",
      resume_data: {
        ...emptyResume,
        colorMode: "light" as const,
        personal: { ...emptyResume.personal, name: "Cloud User" },
      },
    }
    mocks.fetchUserResumes.mockResolvedValue([remoteResume])

    await expect(useResumeStore.getState().loadUserResume()).resolves.toEqual(
      remoteResume,
    )

    expect(mocks.fetchUserResumes).toHaveBeenCalledWith("user-1")
    expect(useResumeStore.getState().personal.name).toBe("Cloud User")
    expect(useResumeStore.getState().cloudResumeId).toBe("cloud-resume-2")
    expect(useResumeStore.getState().colorMode).toBe("dark")
    expect(useResumeStore.getState().cloudResumeSnapshot).toBeDefined()
    expect(useResumeStore.getState().cloudResumeLoadedThisSession).toBe(true)
  })

  it("refreshes an unchanged local copy of a cloud resume after rehydration", async () => {
    const remoteResume: SavedResume = {
      id: "cloud-resume-2",
      user_id: "user-1",
      title: "Cloud User",
      created_at: "2026-01-01T00:00:00.000Z",
      updated_at: "2026-01-01T00:00:00.000Z",
      resume_data: {
        ...emptyResume,
        personal: { ...emptyResume.personal, name: "Cloud User" },
      },
    }
    mocks.fetchUserResumes.mockResolvedValue([remoteResume])

    await useResumeStore.getState().loadUserResume()
    useResumeStore.setState({ cloudResumeLoadedThisSession: false })
    await useResumeStore.getState().loadUserResume()

    expect(mocks.fetchUserResumes).toHaveBeenCalledTimes(2)
    expect(useResumeStore.getState().cloudResumeId).toBe("cloud-resume-2")
    expect(useResumeStore.getState().personal.name).toBe("Cloud User")
  })

  it("retains the cloud link when an existing local cloud draft is edited", async () => {
    useResumeStore.setState({
      personal: { ...emptyResume.personal, name: "Edited cloud draft" },
      cloudResumeId: "cloud-resume-4",
      cloudResumeOwnerId: "user-1",
      cloudResumeSnapshot: "previously-saved-snapshot",
    })

    await useResumeStore.getState().loadUserResume()

    expect(mocks.fetchUserResumes).not.toHaveBeenCalled()
    expect(useResumeStore.getState().personal.name).toBe("Edited cloud draft")
    expect(useResumeStore.getState().cloudResumeId).toBe("cloud-resume-4")
    expect(useResumeStore.getState().cloudResumeOwnerId).toBe("user-1")
  })

  it("keeps an explicitly selected resume when the auth shell requests a default", async () => {
    const selectedResume: SavedResume = {
      id: "selected-resume",
      user_id: "user-1",
      title: "Selected resume",
      created_at: "2026-01-01T00:00:00.000Z",
      updated_at: "2026-01-01T00:00:00.000Z",
      resume_data: {
        ...emptyResume,
        personal: { ...emptyResume.personal, name: "Selected resume" },
      },
    }

    useResumeStore.getState().openSavedResume(selectedResume)
    await useResumeStore.getState().loadUserResume()

    expect(mocks.fetchUserResumes).not.toHaveBeenCalled()
    expect(useResumeStore.getState().personal.name).toBe("Selected resume")
    expect(useResumeStore.getState().cloudResumeId).toBe("selected-resume")
  })

  it("does not replace a newly created blank resume with an older cloud copy", async () => {
    useResumeStore.getState().resetResume()
    await useResumeStore.getState().loadUserResume()

    expect(mocks.fetchUserResumes).not.toHaveBeenCalled()
    expect(useResumeStore.getState().personal.name).toBe("")
  })

  it("preserves an existing local draft instead of replacing it with cloud data", async () => {
    useResumeStore.getState().updatePersonal("name", "Local draft")

    await useResumeStore.getState().loadUserResume()

    expect(mocks.fetchUserResumes).not.toHaveBeenCalled()
    expect(useResumeStore.getState().personal.name).toBe("Local draft")
    expect(useResumeStore.getState().cloudResumeLoadStatus).toBe(
      "local-draft-preserved",
    )
    expect(useResumeStore.getState().cloudResumeOwnerId).toBeUndefined()
    expect(useResumeStore.getState().cloudResumeId).toBeUndefined()
  })

  it("preserves edits made while the cloud resume is loading", async () => {
    let resolveFetch!: (resumes: SavedResume[]) => void
    mocks.fetchUserResumes.mockImplementation(
      () =>
        new Promise<SavedResume[]>((resolve) => {
          resolveFetch = resolve
        }),
    )

    const loading = useResumeStore.getState().loadUserResume()
    useResumeStore.getState().updatePersonal("name", "Edited during sync")
    resolveFetch([
      {
        id: "cloud-resume-3",
        user_id: "user-1",
        title: "Cloud resume",
        created_at: "2026-01-01T00:00:00.000Z",
        updated_at: "2026-01-01T00:00:00.000Z",
        resume_data: {
          ...emptyResume,
          personal: { ...emptyResume.personal, name: "Cloud resume" },
        },
      },
    ])
    await loading

    expect(useResumeStore.getState().personal.name).toBe("Edited during sync")
    expect(useResumeStore.getState().cloudResumeLoadStatus).toBe(
      "local-draft-preserved",
    )
    expect(useResumeStore.getState().cloudResumeId).toBeUndefined()
  })

  it("does not silently mark a failed save as successful", async () => {
    useResumeStore.getState().updatePersonal("name", "Amina Example")
    useResumeStore.getState().updatePersonal("email", "amina@example.com")
    useResumeStore.getState().updatePersonal("phone", "+1 212 555 0142")
    mocks.saveResume.mockRejectedValue(new Error("Save failed"))

    await expect(useResumeStore.getState().saveCurrentResume()).rejects.toThrow(
      "Save failed",
    )
    expect(useResumeStore.getState().isSaving).toBe(false)
  })

  it("blocks cloud saves until required personal information is valid", async () => {
    await expect(useResumeStore.getState().saveCurrentResume()).rejects.toThrow(
      "Please correct the highlighted resume fields.",
    )

    expect(mocks.saveResume).not.toHaveBeenCalled()
    expect(useResumeStore.getState().personalInfoErrors).toEqual({
      name: "required",
      email: "required",
      phone: "required",
    })
    expect(useResumeStore.getState().isSaving).toBe(false)
  })

  it("records cloud-load failures for the editor to display", async () => {
    mocks.fetchUserResumes.mockRejectedValue(new Error("Fetch failed"))

    await expect(useResumeStore.getState().loadUserResume()).rejects.toThrow(
      "Fetch failed",
    )

    expect(useResumeStore.getState().cloudResumeLoadStatus).toBe("error")
  })
})
