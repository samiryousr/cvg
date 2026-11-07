import { beforeEach, describe, expect, it, vi } from "vitest"

const supabase = vi.hoisted(() => {
  const builder = {
    update: vi.fn(),
    insert: vi.fn(),
    delete: vi.fn(),
    select: vi.fn(),
    eq: vi.fn(),
    single: vi.fn(),
    order: vi.fn(),
  }

  for (const method of [
    builder.update,
    builder.insert,
    builder.delete,
    builder.select,
    builder.eq,
  ]) {
    method.mockReturnValue(builder)
  }

  return {
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn(() => builder),
    builder,
  }
})

vi.mock("@/lib/supabase", () => ({
  getSupabaseClient: () => supabase,
}))

import { emptyResume } from "@/features/resume-builder/model"
import {
  deleteResume,
  fetchUserResumes,
  renameResume,
  saveResume,
} from "@/services/resumeService"

describe("resume Supabase service", () => {
  beforeEach(() => {
    supabase.auth.getUser.mockReset()
    supabase.from.mockClear()
    supabase.builder.update.mockClear()
    supabase.builder.insert.mockClear()
    supabase.builder.delete.mockClear()
    supabase.builder.select.mockClear()
    supabase.builder.eq.mockClear()
    supabase.builder.single.mockReset()
    supabase.builder.order.mockReset()
    supabase.auth.getUser.mockResolvedValue({
      data: { user: { id: "user-1" } },
      error: null,
    })
  })

  it("inserts a new resume for the authenticated owner", async () => {
    const saved = {
      id: "resume-1",
      user_id: "user-1",
      title: "My resume",
      resume_data: emptyResume,
      created_at: "2026-01-01T00:00:00.000Z",
      updated_at: "2026-01-01T00:00:00.000Z",
    }
    supabase.builder.single.mockResolvedValue({ data: saved, error: null })

    await expect(saveResume("user-1", emptyResume)).resolves.toEqual(saved)

    expect(supabase.from).toHaveBeenCalledWith("resumes")
    expect(supabase.builder.insert).toHaveBeenCalledWith({
      user_id: "user-1",
      title: "My resume",
      resume_data: emptyResume,
    })
    expect(supabase.builder.eq).not.toHaveBeenCalled()
  })

  it("updates only the requested resume owned by the user", async () => {
    const saved = {
      id: "resume-1",
      user_id: "user-1",
      title: "My resume",
      resume_data: emptyResume,
      created_at: "2026-01-01T00:00:00.000Z",
      updated_at: "2026-01-02T00:00:00.000Z",
    }
    supabase.builder.single.mockResolvedValue({ data: saved, error: null })

    await saveResume("user-1", emptyResume, "resume-1")

    expect(supabase.builder.update).toHaveBeenCalledWith(
      expect.objectContaining({
        resume_data: emptyResume,
        updated_at: expect.any(String),
      }),
    )
    expect(supabase.builder.eq).toHaveBeenNthCalledWith(1, "id", "resume-1")
    expect(supabase.builder.eq).toHaveBeenNthCalledWith(
      2,
      "user_id",
      "user-1",
    )
  })

  it("rejects access when the supplied user is not the signed-in user", async () => {
    await expect(fetchUserResumes("other-user")).rejects.toThrow(
      "You must be signed in as this user",
    )
    expect(supabase.from).not.toHaveBeenCalled()
  })

  it("fetches the authenticated user's resumes newest-created first", async () => {
    const saved = [
      {
        id: "resume-1",
        user_id: "user-1",
        title: "My resume",
        resume_data: emptyResume,
        created_at: "2026-01-01T00:00:00.000Z",
        updated_at: "2026-01-02T00:00:00.000Z",
      },
    ]
    supabase.builder.order.mockResolvedValue({ data: saved, error: null })

    await expect(fetchUserResumes("user-1")).resolves.toEqual(saved)

    expect(supabase.builder.eq).toHaveBeenCalledWith("user_id", "user-1")
    expect(supabase.from).toHaveBeenCalledWith("resumes")
    expect(supabase.builder.select).toHaveBeenCalledWith(
      "id, user_id, title, resume_data, created_at, updated_at",
    )
    expect(supabase.builder.order).toHaveBeenCalledWith("created_at", {
      ascending: false,
    })
  })

  it("renames only the requested resume owned by the authenticated user", async () => {
    const renamed = {
      id: "resume-1",
      user_id: "user-1",
      title: "Product Designer",
      resume_data: emptyResume,
      created_at: "2026-01-01T00:00:00.000Z",
      updated_at: "2026-01-02T00:00:00.000Z",
    }
    supabase.builder.single.mockResolvedValue({ data: renamed, error: null })

    await expect(
      renameResume("user-1", "resume-1", "  Product Designer  "),
    ).resolves.toEqual(renamed)

    expect(supabase.builder.update).toHaveBeenCalledWith({
      title: "Product Designer",
      updated_at: expect.any(String),
    })
    expect(supabase.builder.eq).toHaveBeenNthCalledWith(1, "id", "resume-1")
    expect(supabase.builder.eq).toHaveBeenNthCalledWith(
      2,
      "user_id",
      "user-1",
    )
  })

  it("deletes only the requested resume owned by the authenticated user", async () => {
    supabase.builder.single.mockResolvedValue({
      data: { id: "resume-1" },
      error: null,
    })

    await expect(deleteResume("user-1", "resume-1")).resolves.toBeUndefined()

    expect(supabase.builder.delete).toHaveBeenCalledOnce()
    expect(supabase.builder.eq).toHaveBeenNthCalledWith(1, "id", "resume-1")
    expect(supabase.builder.eq).toHaveBeenNthCalledWith(
      2,
      "user_id",
      "user-1",
    )
  })
})
