import type {
  PersonalInfo,
  SkillCategory,
} from "@/features/resume-builder/model"

export const MAX_RESUME_TEXT_LENGTH = 10_000
export const MAX_SUMMARY_LENGTH = 500
export const PERSONAL_FIELD_LIMITS = {
  name: 120,
  role: 120,
  email: 254,
  phone: 50,
  location: 160,
  github: 2_048,
  linkedIn: 2_048,
  portfolio: 2_048,
  photoUrl: 0,
} satisfies Record<keyof PersonalInfo, number>

export type PersonalInfoValidationErrors = Partial<
  Record<"name" | "email", "required" | "invalid">
>

export function sanitizeResumeText(
  value: string,
  maxLength = MAX_RESUME_TEXT_LENGTH,
): string {
  return value
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, "")
    .slice(0, maxLength)
}

export function sanitizeSkills(skills: SkillCategory[]): SkillCategory[] {
  return skills
    .map((skill) => ({
      ...skill,
      category: sanitizeResumeText(skill.category, 120),
      skills: sanitizeResumeText(skill.skills, 2_000),
    }))
}

export function validatePersonalInfo(
  personal: Pick<PersonalInfo, "name" | "email">,
): PersonalInfoValidationErrors {
  const errors: PersonalInfoValidationErrors = {}

  if (!personal.name.trim()) errors.name = "required"

  const email = personal.email.trim()
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "invalid"
  }

  return errors
}
