import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import {
  emptyResume,
  initialResume,
  legacyPreviewResume,
  previewResume,
} from "@/features/resume-builder/model"

import {
  getPreferredColorMode,
  useResumeSaveStatus,
  useResumeStore,
} from "@/features/resume-builder/store"
import { MAX_SUMMARY_LENGTH } from "@/features/resume-builder/validation"

function createMemoryStorage() {
  const values = new Map<string, string>()

  return {
    getItem: (key: string) => values.get(key) ?? null,

    setItem: (key: string, value: string) => values.set(key, value),

    removeItem: (key: string) => values.delete(key),

    clear: () => values.clear(),
  }
}

function resetStore() {
  useResumeStore.setState({
    ...initialResume,

    personal: { ...initialResume.personal },

    sectionLayout: {
      order: [...initialResume.sectionLayout.order],

      hidden: [...initialResume.sectionLayout.hidden],
    },

    hasHydrated: false,
    cloudResumeLoadStatus: "idle",
    cloudResumeId: undefined,
    cloudResumeOwnerId: undefined,
    cloudResumeSnapshot: undefined,
    cloudResumeLoadedThisSession: false,
  })

  useResumeSaveStatus.setState({ status: "idle" })
}

async function hydrateState(state: unknown, version = 3) {
  localStorage.setItem(
    "sirti-resume",

    JSON.stringify({ state, version }),
  )

  await useResumeStore.persist.rehydrate()

  await vi.runAllTimersAsync()
}

describe("resume store persistence normalization", () => {
  beforeEach(() => {
    vi.useFakeTimers()

    vi.stubGlobal("localStorage", createMemoryStorage())

    resetStore()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()

    vi.restoreAllMocks()

    vi.useRealTimers()

    vi.unstubAllGlobals()
  })

  it.each([
    ["null state", { state: null, version: 1 }],

    ["undefined state", { version: 1 }],

    ["primitive state", { state: 42, version: 1 }],

    ["array state", { state: [], version: 1 }],
  ])("falls back safely for %s", async (_label, payload) => {
    localStorage.setItem("sirti-resume", JSON.stringify(payload))

    await useResumeStore.persist.rehydrate()

    await vi.runAllTimersAsync()

    const state = useResumeStore.getState()

    expect(state.personal).toEqual(initialResume.personal)

    expect(state.summary).toBe(initialResume.summary)

    expect(state.experiences).toEqual(initialResume.experiences)

    expect(state.customSections).toEqual(initialResume.customSections)

    expect(state.templateId).toBe(initialResume.templateId)

    expect(state.hasHydrated).toBe(true)
  })

  it("falls back safely when storage is missing or contains invalid JSON", async () => {
    await useResumeStore.persist.rehydrate()

    expect(useResumeStore.getState().personal).toEqual(initialResume.personal)

    localStorage.setItem("sirti-resume", "{not-json")

    await expect(useResumeStore.persist.rehydrate()).resolves.toBeUndefined()

    await vi.runAllTimersAsync()

    expect(useResumeStore.getState().personal).toEqual(initialResume.personal)

    expect(useResumeStore.getState().experiences).toEqual(
      initialResume.experiences,
    )
  })

  it("keeps resume fields empty while providing a separate preview sample", async () => {
    await useResumeStore.persist.rehydrate()

    await vi.runAllTimersAsync()

    const blank = useResumeStore.getState()

    expect(blank.personal).toEqual(emptyResume.personal)

    expect(blank.summary).toBe("")

    expect(blank.experiences).toEqual([])

    expect(blank.education).toEqual([])

    expect(blank.skills).toEqual([])

    expect(blank.projects).toEqual([])

    expect(blank.certifications).toEqual([])

    expect(blank.languages).toEqual([])

    expect(blank.awards).toEqual([])

    expect(blank.volunteerExperiences).toEqual([])

    expect(blank.publications).toEqual([])

    expect(blank.references).toEqual([])

    expect(previewResume.personal.name).toBe("Alex Morgan")

    expect(previewResume.summary).toContain("accessible web experiences")
    expect(previewResume.education).toHaveLength(1)
    expect(previewResume.experiences).toHaveLength(1)
    expect(previewResume.projects).toHaveLength(1)

    expect(previewResume.experiences).not.toHaveLength(0)

    expect(previewResume.projects).not.toHaveLength(0)

    expect(useResumeStore.getState().personal.name).toBe("")

    blank.updatePersonal("name", "Taylor Example")

    blank.updateSummary("An updated professional summary.")

    blank.addExperience()

    blank.addProject()

    const updated = useResumeStore.getState()

    expect(updated.personal.name).toBe("Taylor Example")

    expect(updated.summary).toBe("An updated professional summary.")

    expect(updated.experiences[0]).toMatchObject({
      job: "",

      company: "",

      description: "",
    })

    expect(updated.projects[0]).toMatchObject({ name: "", description: "" })

    updated.resetResume()

    expect(useResumeStore.getState().personal).toEqual(emptyResume.personal)

    expect(useResumeStore.getState().experiences).toEqual([])

    expect(useResumeStore.getState().projects).toEqual([])
  })

  it("does not overwrite saved data with pre-hydration landing changes", async () => {
    const savedValue = JSON.stringify({
      state: {
        personal: { name: "Saved resume" },

        colorMode: "light",
      },

      version: 3,
    })

    localStorage.setItem("sirti-resume", savedValue)

    useResumeStore.getState().setColorMode("dark")

    await vi.runAllTimersAsync()

    expect(localStorage.getItem("sirti-resume")).toBe(savedValue)

    await useResumeStore.persist.rehydrate()

    await vi.runAllTimersAsync()

    expect(useResumeStore.getState().personal.name).toBe("Saved resume")

    expect(useResumeStore.getState().colorMode).toBe("light")
  })

  it("migrates valid legacy data and fills missing fields", async () => {
    await hydrateState(
      {
        personal: { name: "Rana" },

        experiences: [{ id: "exp-1", job: "Designer", company: "Studio" }],
      },

      1,
    )

    const state = useResumeStore.getState()

    expect(state.personal).toEqual({
      ...emptyResume.personal,

      name: "Rana",
    })

    expect(state.experiences).toEqual([
      {
        id: "exp-1",

        job: "Designer",

        company: "Studio",

        period: "",

        description: "",
      },
    ])

    expect(state.education).toEqual(emptyResume.education)

    expect(state.documentLanguage).toBe(initialResume.documentLanguage)
  })

  it("keeps a previously saved blank resume empty during migration", async () => {
    await hydrateState(
      {
        ...emptyResume,

        personal: { ...emptyResume.personal },

        sectionLayout: {
          order: [...emptyResume.sectionLayout.order],

          hidden: [...emptyResume.sectionLayout.hidden],
        },
      },

      2,
    )

    const state = useResumeStore.getState()

    expect(state.personal).toEqual(emptyResume.personal)

    expect(state.experiences).toEqual([])

    expect(state.projects).toEqual([])

    expect(state.sectionLayout.hidden).toEqual(emptyResume.sectionLayout.hidden)
  })

  it("removes the old persisted sample without dropping user edits", async () => {
    await hydrateState(legacyPreviewResume, 3)

    const migratedSample = useResumeStore.getState()

    expect(migratedSample.personal).toEqual(emptyResume.personal)

    expect(migratedSample.experiences).toEqual([])

    expect(migratedSample.education).toEqual([])

    expect(migratedSample.projects).toEqual([])

    expect(migratedSample.skills).toEqual([])

    expect(migratedSample.sectionLayout.hidden).toEqual(
      emptyResume.sectionLayout.hidden,
    )

    await hydrateState(
      {
        ...legacyPreviewResume,
        personal: {
          ...legacyPreviewResume.personal,
          name: "Taylor Example",
        },
      },

      3,
    )

    const editedSample = useResumeStore.getState()

    expect(editedSample.personal.name).toBe("Taylor Example")

    expect(editedSample.personal.role).toBe("")

    expect(editedSample.summary).toBe("")

    expect(editedSample.experiences).toEqual([])
  })

  it("normalizes nested collections and custom sections", async () => {
    await hydrateState({
      personal: {
        name: "Amina\u0000 Example",
        photoUrl: "javascript:alert(1)",
      },

      experiences: [
        null,

        { id: 12, job: "Engineer", company: "Example", description: 5 },

        { id: "duplicate", job: "Writer" },

        { id: "duplicate", company: "Publisher" },
      ],

      education: { invalid: true },

      projects: [{ id: "project-1", name: "Portfolio", url: 3 }],

      skills: ["TypeScript", 4, null],

      customSections: [
        null,

        {
          id: "custom-1",

          title: "Activities",

          entries: [
            null,

            {
              id: "entry-1",

              title: "Mentoring",

              fields: [
                null,

                { id: "field-1", label: "Hours", value: 30 },

                { id: "field-1", label: "Focus", value: "Students" },
              ],
            },

            { id: "entry-2", subtitle: "Community" },
          ],
        },

        { id: "custom-2" },
      ],
    })

    const state = useResumeStore.getState()

    expect(state.personal.name).toBe("Amina Example")
    expect(state.personal.photoUrl).toBeNull()

    expect(state.experiences).toHaveLength(3)

    expect(state.experiences[0]).toMatchObject({
      job: "Engineer",

      company: "Example",

      description: "",

      period: "",
    })

    expect(state.experiences[0].id).not.toBe("12")

    expect(new Set(state.experiences.map((item) => item.id)).size).toBe(3)

    expect(state.education).toEqual(emptyResume.education)

    expect(state.projects[0]).toMatchObject({
      name: "Portfolio",

      url: "",

      stack: "",
    })

    expect(state.skills).toEqual([
      {
        id: "legacy-skills",
        category: "Skills",
        skills: "TypeScript",
      },
    ])

    expect(state.customSections).toHaveLength(2)

    expect(state.customSections[0].entries[0].fields).toEqual([
      { id: "field-1", label: "Hours", value: "" },

      { id: expect.any(String), label: "Focus", value: "Students" },
    ])

    expect(state.customSections[0].entries[0].fields[1].id).not.toBe("field-1")

    expect(state.customSections[1].entries).toEqual([])

    expect(state.sectionLayout.order).toContain("custom:custom-1")

    expect(state.sectionLayout.order).toContain("custom:custom-2")
  })

  it("normalizes configuration flags and section ordering", async () => {
    await hydrateState({
      sectionLayout: {
        order: ["experience", "experience", "unknown", "custom:removed"],

        hidden: ["skills", "skills", "invalid"],
      },

      templateId: "unavailable",

      documentLanguage: "fr",

      editorLanguage: "de",

      colorMode: "blue",

      primaryColor: "red",
    })

    const state = useResumeStore.getState()

    expect(state.templateId).toBe(initialResume.templateId)

    expect(state.documentLanguage).toBe(initialResume.documentLanguage)

    expect(state.editorLanguage).toBe(initialResume.editorLanguage)

    expect(state.colorMode).toBe(initialResume.colorMode)

    expect(state.primaryColor).toBe(initialResume.primaryColor)

    expect(state.sectionLayout.order[0]).toBe("experience")

    expect(state.sectionLayout.order).toHaveLength(
      initialResume.sectionLayout.order.length,
    )

    expect(state.sectionLayout.hidden).toEqual(["skills"])
  })

  it("preserves valid configuration and existing section preferences", async () => {
    await hydrateState({
      personal: { name: "Mina", photoUrl: null },

      templateId: "modern",

      documentLanguage: "ar",

      editorLanguage: "en",

      colorMode: "dark",

      primaryColor: "#123abc",

      sectionLayout: {
        order: ["projects", "summary"],

        hidden: ["references"],
      },
    })

    const state = useResumeStore.getState()

    expect(state.personal.name).toBe("Mina")

    expect(state.templateId).toBe("modern")

    expect(state.documentLanguage).toBe("ar")

    expect(state.editorLanguage).toBe("en")

    expect(state.colorMode).toBe("dark")

    expect(state.primaryColor).toBe("#123abc")

    expect(state.sectionLayout.order.slice(0, 2)).toEqual([
      "projects",

      "summary",
    ])

    expect(state.sectionLayout.hidden).toContain("references")
  })

  it("supports adding, updating, and removing experience and education", () => {
    const store = useResumeStore.getState()

    store.addExperience()
    store.addEducation()

    const experienceId = useResumeStore.getState().experiences[0].id
    const educationId = useResumeStore.getState().education[0].id

    useResumeStore.getState().updateExperience(experienceId, {
      job: "Frontend Engineer",
      company: "Example Studio",
    })
    useResumeStore.getState().updateEducation(educationId, {
      degree: "B.Sc. Computer Science",
      school: "Example University",
    })

    expect(useResumeStore.getState().experiences[0]).toMatchObject({
      id: experienceId,
      job: "Frontend Engineer",
      company: "Example Studio",
    })
    expect(useResumeStore.getState().education[0]).toMatchObject({
      id: educationId,
      degree: "B.Sc. Computer Science",
      school: "Example University",
    })

    useResumeStore.getState().removeExperience(experienceId)
    useResumeStore.getState().removeEducation(educationId)

    expect(useResumeStore.getState().experiences).toEqual([])
    expect(useResumeStore.getState().education).toEqual([])
  })

  it("adds an empty skill field so it can be filled in the editor", () => {
    useResumeStore.getState().addSkillCategory()

    expect(useResumeStore.getState().skills).toMatchObject([
      { category: "", skills: "" },
    ])

    const category = useResumeStore.getState().skills[0]
    useResumeStore.getState().updateSkills([
      { ...category, category: "Languages", skills: "TypeScript" },
    ])
    expect(useResumeStore.getState().skills).toMatchObject([
      { category: "Languages", skills: "TypeScript" },
    ])
  })

  it("migrates uncategorized skill strings as a regular skills group", async () => {
    await hydrateState({ skills: ["TypeScript", " React "] })

    expect(useResumeStore.getState().skills).toEqual([
      {
        id: "legacy-skills",
        category: "Skills",
        skills: "TypeScript, React",
      },
    ])
  })

  it("sanitizes direct text updates, skills, colors, and profile photos", () => {
    const store = useResumeStore.getState()

    store.updatePersonal("name", "Amina\u0000 Example")
    store.updateSummary("x".repeat(MAX_SUMMARY_LENGTH + 1))
    store.addExperience()
    const experienceId = useResumeStore.getState().experiences[0].id
    useResumeStore
      .getState()
      .updateExperience(experienceId, { job: "Engineer\u0000" })
    store.updateSkills([
      {
        id: "skill-category",
        category: " Frontend ",
        skills: " React\u0000, TypeScript ",
      },
    ])
    store.setPrimaryColor("javascript:alert(1)")
    store.updatePersonal("photoUrl", "javascript:alert(1)")

    expect(useResumeStore.getState().personal.name).toBe("Amina Example")
    expect(useResumeStore.getState().summary).toHaveLength(MAX_SUMMARY_LENGTH)
    expect(useResumeStore.getState().experiences[0].job).toBe("Engineer")
    expect(useResumeStore.getState().skills).toEqual([
      {
        id: "skill-category",
        category: " Frontend ",
        skills: " React, TypeScript ",
      },
    ])
    expect(useResumeStore.getState().primaryColor).toBe(emptyResume.primaryColor)
    expect(useResumeStore.getState().personal.photoUrl).toBeNull()

    store.updateSkills([{ id: "skill-category", category: "", skills: "React" }])
    expect(useResumeStore.getState().skills).toEqual([
      { id: "skill-category", category: "", skills: "React" },
    ])

    store.setPrimaryColor("#123abc")
    store.updatePersonal("photoUrl", "data:image/jpeg;base64,Zm9v")

    expect(useResumeStore.getState().primaryColor).toBe("#123abc")
    expect(useResumeStore.getState().personal.photoUrl).toBe(
      "data:image/jpeg;base64,Zm9v",
    )
  })

  it("reports localStorage write failures through save status", async () => {
    const storage = createMemoryStorage()
    const error = new Error("Storage quota exceeded")
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {})
    vi.stubGlobal("localStorage", {
      ...storage,
      setItem: () => {
        throw error
      },
    })

    await useResumeStore.persist.rehydrate()
    useResumeStore.getState().updateSummary("A resume summary")
    await vi.runAllTimersAsync()

    expect(useResumeSaveStatus.getState().status).toBe("error")
    expect(consoleError).toHaveBeenCalledWith(
      "Could not save the resume to localStorage.",
      error,
    )
  })

  it("switches templates without changing resume content", () => {
    const store = useResumeStore.getState()
    store.updatePersonal("name", "Amina Example")
    store.addExperience()

    store.setTemplate("modern")

    expect(useResumeStore.getState().templateId).toBe("modern")
    expect(useResumeStore.getState().personal.name).toBe("Amina Example")
    expect(useResumeStore.getState().experiences).toHaveLength(1)

    store.setTemplate("classic")
    expect(useResumeStore.getState().templateId).toBe("classic")
  })

  it("keeps the selected theme when creating a blank resume", () => {
    const store = useResumeStore.getState()
    store.setColorMode("dark")

    store.resetResume()

    expect(useResumeStore.getState().colorMode).toBe("dark")
    expect(useResumeStore.getState().personal).toEqual(emptyResume.personal)
  })

  it("uses the system theme by default and persists explicit theme choices", () => {
    vi.stubGlobal("window", {
      matchMedia: () => ({ matches: true }),
    })

    expect(getPreferredColorMode()).toBe("dark")

    useResumeStore.getState().setColorMode("light")

    expect(localStorage.getItem("sirti-theme")).toBe("light")
    expect(getPreferredColorMode()).toBe("light")
  })
})
