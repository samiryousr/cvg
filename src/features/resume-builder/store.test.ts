import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import {
  emptyResume,
  initialResume,
} from "@/features/resume-builder/model"
import {
  useResumeSaveStatus,
  useResumeStore,
} from "@/features/resume-builder/store"

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
  })
  useResumeSaveStatus.setState({ status: "idle" })
}

async function hydrateState(state: unknown, version = 2) {
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
    expect(state.personal).toEqual(emptyResume.personal)
    expect(state.summary).toBe(emptyResume.summary)
    expect(state.experiences).toEqual([])
    expect(state.customSections).toEqual(emptyResume.customSections)
    expect(state.templateId).toBe(emptyResume.templateId)
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

  it("hydrates a complete editable starter resume for a first-time user", async () => {
    await useResumeStore.persist.rehydrate()
    await vi.runAllTimersAsync()

    const starter = useResumeStore.getState()
    expect(starter.personal.name).toBe("Alex Morgan")
    expect(starter.personal.role).toBe("Frontend Developer")
    expect(starter.personal.email).toBe("alex.morgan@example.com")
    expect(starter.summary).toContain("React and TypeScript")
    expect(starter.experiences.length).toBeGreaterThan(0)
    expect(starter.education.length).toBeGreaterThan(0)
    expect(starter.skills.length).toBeGreaterThan(0)
    expect(starter.projects.length).toBeGreaterThan(0)

    const experienceId = starter.experiences[0].id
    starter.updatePersonal("name", "Taylor Example")
    starter.updateSummary("An updated professional summary.")
    starter.updateExperience(experienceId, { job: "Staff Frontend Developer" })
    starter.removeEducation(starter.education[0].id)
    starter.removeProject(starter.projects[0].id)
    starter.addProject()

    const updated = useResumeStore.getState()
    expect(updated.personal.name).toBe("Taylor Example")
    expect(updated.summary).toBe("An updated professional summary.")
    expect(updated.experiences[0].job).toBe("Staff Frontend Developer")
    expect(updated.education).toHaveLength(initialResume.education.length - 1)
    expect(updated.projects).toHaveLength(initialResume.projects.length)
    expect(updated.projects.at(-1)).toMatchObject({
      name: "",
      description: "",
    })

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
      version: 2,
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

  it("normalizes nested collections and custom sections", async () => {
    await hydrateState({
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
    expect(state.skills).toEqual(["TypeScript"])
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
})
