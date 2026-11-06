import { describe, expect, it } from "vitest"

import { emptyResume, previewResume } from "@/features/resume-builder/model"

import { createResumePreviewData } from "@/features/resume-builder/preview-data"

describe("resume preview placeholders", () => {
  it("uses example text only for fields that are still empty", () => {
    const preview = createResumePreviewData(
      {
        ...emptyResume,

        personal: { ...emptyResume.personal, name: "Taylor Example" },
      },

      previewResume,
    )

    expect(preview.personal.name).toBe("Taylor Example")

    expect(preview.personal.role).toBe(previewResume.personal.role)

    expect(preview.summary).toBe(previewResume.summary)

    expect(preview.placeholderFields.has("personal.name")).toBe(false)

    expect(preview.placeholderFields.has("personal.role")).toBe(true)

    expect(preview.placeholderFields.has("summary")).toBe(true)
  })

  it("updates one work field without removing the other faded examples", () => {
    const preview = createResumePreviewData(
      {
        ...emptyResume,

        experiences: [
          {
            id: "experience-1",

            job: "Product Engineer",

            company: "",

            period: "",

            description: "",
          },
        ],
      },

      previewResume,
    )

    expect(preview.experiences[0].job).toBe("Product Engineer")

    expect(preview.experiences[0].company).toBe(
      previewResume.experiences[0].company,
    )

    expect(preview.placeholderFields.has("experiences.0.job")).toBe(false)

    expect(preview.placeholderFields.has("experiences.0.company")).toBe(true)

    expect(preview.placeholderFields.has("experiences.0.description")).toBe(
      true,
    )
  })

  it("keeps the sample lightweight and leaves unfilled store data untouched", () => {
    const preview = createResumePreviewData(emptyResume, previewResume)

    expect(preview.experiences).toHaveLength(1)

    expect(preview.education).toHaveLength(1)

    expect(preview.projects).toHaveLength(1)
    expect(preview.personal.name).toBe("Alex Morgan")
    expect(preview.placeholderFields.has("experiences.0.job")).toBe(true)
    expect(preview.placeholderFields.has("education.0.degree")).toBe(true)
    expect(preview.placeholderFields.has("projects.0.name")).toBe(true)
    expect(preview.placeholderFields.has("skills.0.category")).toBe(true)
    expect(preview.placeholderFields.has("skills.0.skills")).toBe(true)
    expect(emptyResume.personal.name).toBe("")

    expect(emptyResume.experiences).toEqual([])
  })

  it("does not invent a category for a user-created uncategorized skills row", () => {
    const preview = createResumePreviewData(
      {
        ...emptyResume,
        skills: [
          {
            id: "uncategorized",
            category: "",
            skills: "TypeScript, React",
          },
        ],
      },
      previewResume,
    )

    expect(preview.skills).toEqual([
      {
        id: "uncategorized",
        category: "",
        skills: "TypeScript, React",
      },
    ])
    expect(preview.placeholderFields.has("skills.0.category")).toBe(false)
  })
})
