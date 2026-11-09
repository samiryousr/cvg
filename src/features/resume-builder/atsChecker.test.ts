import { describe, expect, it } from "vitest"
import {
  analyzeResumeForAts,
  type AtsCheckCategory,
} from "@/features/resume-builder/atsChecker"
import { emptyResume } from "@/features/resume-builder/model"

const completeResume = {
  ...emptyResume,
  personal: {
    ...emptyResume.personal,
    name: "Amina Example",
    role: "Frontend Engineer",
    email: "amina@example.com",
    phone: "+1 212 555 0142",
  },
  summary:
    "Frontend engineer with a track record of building accessible, reliable user interfaces for growing product teams.",
  experiences: [
    {
      id: "experience-1",
      job: "Frontend Engineer",
      company: "Example Co.",
      period: "2022 - 2025",
      description:
        "Built accessible interfaces and improved application performance through measured code splitting.",
    },
  ],
  education: [
    {
      id: "education-1",
      degree: "BSc Computer Science",
      school: "Example University",
      period: "2018 - 2022",
    },
  ],
  skills: [
    {
      id: "skills-1",
      category: "Technical",
      skills: "TypeScript, React, Next.js, CSS, Testing",
    },
  ],
}

describe("ATS resume analysis", () => {
  it("uses a 100-point scale and reports each evaluation category", () => {
    const analysis = analyzeResumeForAts(completeResume)
    const categories = new Set(
      analysis.checks.map((check) => check.category satisfies AtsCheckCategory),
    )

    expect(analysis.checks.reduce((sum, check) => sum + check.points, 0)).toBe(
      100,
    )
    expect(analysis.score).toBe(100)
    expect(analysis.passedCount).toBe(analysis.checks.length)
    expect(analysis.improvementCount).toBe(0)
    expect(categories).toEqual(
      new Set(["contact", "summary", "experience", "skills", "education"]),
    )
  })

  it("scores incomplete resumes within range and identifies missing checks", () => {
    const analysis = analyzeResumeForAts(emptyResume)

    expect(analysis.score).toBe(0)
    expect(analysis.score).toBeGreaterThanOrEqual(0)
    expect(analysis.score).toBeLessThanOrEqual(100)
    expect(analysis.improvementCount).toBe(analysis.checks.length)
    expect(analysis.checks.every((check) => !check.passed)).toBe(true)
  })
})
