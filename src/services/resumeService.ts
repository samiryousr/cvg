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

const resumeColumns = "id, user_id, title, resume_data, created_at, updated_at"

// دالة التحقق من هوية المستخدم
async function assertCurrentUser(userId: string) {
  const { data, error } = await getSupabaseClient().auth.getUser()
  if (error) throw error
  if (!data.user || data.user.id !== userId) {
    throw new Error("You must be signed in as this user to access these resumes.")
  }
}

/**
 * Higher-Order Wrapper باستخدام TypeScript Generics (<T>)
 * لمنع تكرار كود التحقق والأمان في كل دوال الـ API.
 */
async function withAuthenticatedUser<T>(
  userId: string,
  action: (supabase: ReturnType<typeof getSupabaseClient>) => Promise<T>
): Promise<T> {
  if (!userId.trim()) throw new Error("A signed-in user is required.")
  await assertCurrentUser(userId)
  return action(getSupabaseClient())
}

// 1. حفظ أو تعديل السي في
export async function saveResume(
  userId: string,
  resumeData: ResumeData,
  resumeId?: string,
): Promise<SavedResume> {
  return withAuthenticatedUser(userId, async (supabase) => {
    const title = resumeData.personal.name.trim() || "My resume"
    
    const query = resumeId
      ? supabase
          .from("resumes")
          .update({ 
            resume_data: resumeData, 
            title, 
            updated_at: new Date().toISOString() 
          })
          .eq("id", resumeId)
          .eq("user_id", userId)
      : supabase
          .from("resumes")
          .insert({ 
            user_id: userId, 
            title, 
            resume_data: resumeData 
          })

    const { data, error } = await query.select(resumeColumns).single()

    if (error) throw error
    if (!data) throw new Error("Supabase did not return the saved resume.")

    return data
  })
}

// 2. جلب كل سي فيات المستخدم
export async function fetchUserResumes(userId: string): Promise<SavedResume[]> {
  return withAuthenticatedUser(userId, async (supabase) => {
    const { data, error } = await supabase
      .from("resumes")
      .select(resumeColumns)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) throw error

    return data ?? []
  })
}

// 3. إعادة تسمية السي في
export async function renameResume(
  userId: string,
  resumeId: string,
  title: string,
): Promise<SavedResume> {
  return withAuthenticatedUser(userId, async (supabase) => {
    const safeTitle = title.trim()
    if (!safeTitle) throw new Error("A resume title is required.")

    const { data, error } = await supabase
      .from("resumes")
      .update({ 
        title: safeTitle, 
        updated_at: new Date().toISOString() 
      })
      .eq("id", resumeId)
      .eq("user_id", userId)
      .select(resumeColumns)
      .single()

    if (error) throw error
    if (!data) throw new Error("Supabase did not return the renamed resume.")

    return data
  })
}

// 4. حذف السي في
export async function deleteResume(userId: string, resumeId: string): Promise<void> {
  return withAuthenticatedUser(userId, async (supabase) => {
    const { data, error } = await supabase
      .from("resumes")
      .delete()
      .eq("id", resumeId)
      .eq("user_id", userId)
      .select("id")
      .single()

    if (error) throw error
    if (!data) throw new Error("Supabase did not confirm the resume deletion.")
  })
}