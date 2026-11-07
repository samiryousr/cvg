import type { ResumeData } from "@/features/resume-builder/model"
import { getSupabaseClient } from "@/lib/supabase"

export type SavedResume = {
  id: string
  user_id: string
  title: string
  resume_data: ResumeData
  created_at: string
  updated_at: string
}

const resumeColumns =
  "id, user_id, title, resume_data, created_at, updated_at"

async function assertCurrentUser(userId: string) {
  const { data, error } = await getSupabaseClient().auth.getUser()
  if (error) throw error
  if (!data.user || data.user.id !== userId) {
    throw new Error("You must be signed in as this user to access these resumes.")
  }
}

export async function saveResume(
  userId: string,
  resumeData: ResumeData,
  resumeId?: string,
): Promise<SavedResume> {
  if (!userId.trim()) throw new Error("A signed-in user is required.")
  await assertCurrentUser(userId)

  const supabase = getSupabaseClient()
  const title = resumeData.personal.name.trim() || "My resume"

  const result = resumeId
    ? await supabase
        .from("resumes")
        .update({
          resume_data: resumeData,
          updated_at: new Date().toISOString(),
        })
        .eq("id", resumeId)
        .eq("user_id", userId)
        .select(resumeColumns)
        .single()
    : await supabase
        .from("resumes")
        .insert({
          user_id: userId,
          title,
          resume_data: resumeData,
        })
        .select(resumeColumns)
        .single()

  if (result.error) throw result.error
  if (!result.data) throw new Error("Supabase did not return the saved resume.")

  return result.data
}

export async function fetchUserResumes(
  userId: string,
): Promise<SavedResume[]> {
  if (!userId.trim()) throw new Error("A signed-in user is required.")
  await assertCurrentUser(userId)

  const { data, error } = await getSupabaseClient()
    .from("resumes")
    .select(resumeColumns)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error

  return data ?? []
}

export async function renameResume(
  userId: string,
  resumeId: string,
  title: string,
): Promise<SavedResume> {
  if (!userId.trim()) throw new Error("A signed-in user is required.")

  const safeTitle = title.trim()
  if (!safeTitle) throw new Error("A resume title is required.")

  await assertCurrentUser(userId)

  const { data, error } = await getSupabaseClient()
    .from("resumes")
    .update({
      title: safeTitle,
      updated_at: new Date().toISOString(),
    })
    .eq("id", resumeId)
    .eq("user_id", userId)
    .select(resumeColumns)
    .single()

  if (error) throw error
  if (!data) throw new Error("Supabase did not return the renamed resume.")

  return data
}

export async function deleteResume(
  userId: string,
  resumeId: string,
): Promise<void> {
  if (!userId.trim()) throw new Error("A signed-in user is required.")
  await assertCurrentUser(userId)

  const { data, error } = await getSupabaseClient()
    .from("resumes")
    .delete()
    .eq("id", resumeId)
    .eq("user_id", userId)
    .select("id")
    .single()

  if (error) throw error
  if (!data) throw new Error("Supabase did not confirm the resume deletion.")
}
