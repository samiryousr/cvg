import { describe, expect, it } from "vitest"

import {
  MAX_RESUME_TEXT_LENGTH,
  MAX_SUMMARY_LENGTH,
  sanitizeResumeText,
  sanitizeSkills,
  validatePersonalInfo,
} from "@/features/resume-builder/validation"

describe("resume input validation", () => {
  it("removes unsafe control characters and enforces a length limit", () => {
    expect(sanitizeResumeText("Hello\u0000\tworld\r\nNext line")).toBe(
      "Hello\tworld\nNext line",
    )
    expect(sanitizeResumeText("x".repeat(MAX_RESUME_TEXT_LENGTH + 1))).toHaveLength(
      MAX_RESUME_TEXT_LENGTH,
    )
    expect(
      sanitizeResumeText("x".repeat(MAX_SUMMARY_LENGTH + 1), MAX_SUMMARY_LENGTH),
    ).toHaveLength(MAX_SUMMARY_LENGTH)
  })

  it("sanitizes categorized skills and enforces field length limits", () => {
    expect(
      sanitizeSkills([
        {
          id: "frontend",
          category: "Frontend\u0000",
          skills: "React, Next.js\u0000",
        },
        {
          id: "long",
          category: "x".repeat(121),
          skills: "x".repeat(2_001),
        },
      ]),
    ).toEqual([
      {
        id: "frontend",
        category: "Frontend",
        skills: "React, Next.js",
      },
      {
        id: "long",
        category: "x".repeat(120),
        skills: "x".repeat(2_000),
      },
    ])
  })

  it("reports missing names and malformed optional email addresses", () => {
    expect(validatePersonalInfo({ name: " ", email: "" })).toEqual({
      name: "required",
    })
    expect(
      validatePersonalInfo({ name: "Amina", email: "not-an-email" }),
    ).toEqual({ email: "invalid" })
    expect(
      validatePersonalInfo({ name: "Amina", email: "amina@example.com" }),
    ).toEqual({})
  })
})
