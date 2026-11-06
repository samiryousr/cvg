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
      cloudResumeId: undefined,
      cloudResumeOwnerId: undefined,
      hasHydrated: true,
    })
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it("saves the current resume for the signed-in user and tracks its cloud ID", async () => {
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
      expect.objectContaining({ personal: emptyResume.personal }),
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
    const remoteResume = {
      id: "cloud-resume-2",
      user_id: "user-1",
      resume_data: {
        ...emptyResume,
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

  it("does not silently mark a failed save as successful", async () => {
    mocks.saveResume.mockRejectedValue(new Error("Save failed"))

    await expect(useResumeStore.getState().saveCurrentResume()).rejects.toThrow(
      "Save failed",
    )
    expect(useResumeStore.getState().isSaving).toBe(false)
  })
})
