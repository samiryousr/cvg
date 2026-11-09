import type { ResumeData } from "@/features/resume-builder/model"

export type AtsCheckCategory =
  | "contact"
  | "summary"
  | "experience"
  | "skills"
  | "education"

export type AtsCheck = {
  id: string
  category: AtsCheckCategory
  points: number
  passed: boolean
  message: string
}

export type AtsAnalysis = {
  score: number
  checks: AtsCheck[]
  passedCount: number
  improvementCount: number
}

function hasValue(value: string | null | undefined): boolean {
  return typeof value === "string" && value.trim().length > 0
}

function getDistinctSkills(resume: ResumeData): Set<string> {
  return new Set(
    resume.skills
      .flatMap((category) => category.skills.split(/[,\n،;；|]/))
      .map((skill) => skill.trim().toLocaleLowerCase())
      .filter(Boolean),
  )
}

export function analyzeResumeForAts(resume: ResumeData): AtsAnalysis {
  const distinctSkills = getDistinctSkills(resume)
  const checks: AtsCheck[] = [
    {
      id: "contact-name",
      category: "contact",
      points: 5,
      passed: hasValue(resume.personal.name),
      message: "Add your full name.",
    },
    {
      id: "contact-email",
      category: "contact",
      points: 8,
      passed: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resume.personal.email.trim()),
      message: "Add a valid email address.",
    },
    {
      id: "contact-phone",
      category: "contact",
      points: 7,
      passed: hasValue(resume.personal.phone),
      message: "Add a phone number.",
    },
    {
      id: "summary-present",
      category: "summary",
      points: 10,
      passed: resume.summary.trim().length >= 40,
      message: "Write a concise professional summary of at least 40 characters.",
    },
    {
      id: "summary-role",
      category: "summary",
      points: 5,
      passed: hasValue(resume.personal.role),
      message: "Add your target role or professional title.",
    },
    {
      id: "experience-present",
      category: "experience",
      points: 10,
      passed: resume.experiences.length > 0,
      message: "Add at least one work experience entry.",
    },
    {
      id: "experience-context",
      category: "experience",
      points: 5,
      passed: resume.experiences.some(
        (experience) => hasValue(experience.job) && hasValue(experience.company),
      ),
      message: "Include a job title and employer for an experience entry.",
    },
    {
      id: "experience-depth",
      category: "experience",
      points: 10,
      passed: resume.experiences.some(
        (experience) =>
          experience.description.trim().length >= 80 ||
          experience.description.trim().split(/\n+/).filter(Boolean).length >= 2,
      ),
      message: "Add specific responsibilities or achievements to your experience.",
    },
    {
      id: "skills-count",
      category: "skills",
      points: 15,
      passed: distinctSkills.size >= 5,
      message: "List at least five distinct relevant skills.",
    },
    {
      id: "skills-category",
      category: "skills",
      points: 5,
      passed: resume.skills.some(
        (category) =>
          hasValue(category.category) && hasValue(category.skills),
      ),
      message: "Group your skills under a clear category.",
    },
    {
      id: "education-present",
      category: "education",
      points: 12,
      passed: resume.education.length > 0,
      message: "Add an education entry.",
    },
    {
      id: "education-details",
      category: "education",
      points: 8,
      passed: resume.education.some(
        (education) => hasValue(education.degree) && hasValue(education.school),
      ),
      message: "Include both your degree and institution.",
    },
  ]

  const earnedPoints = checks.reduce(
    (total, check) => total + (check.passed ? check.points : 0),
    0,
  )
  const passedCount = checks.filter((check) => check.passed).length

  return {
    score: Math.round(earnedPoints),
    checks,
    passedCount,
    improvementCount: checks.length - passedCount,
  }
}
