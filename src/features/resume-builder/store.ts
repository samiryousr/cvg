import { create } from "zustand"

import { createJSONStorage, persist } from "zustand/middleware"

import {
  initialResume,
  type Education,
  type Experience,
  type Project,
  type Certification,
  type ColorMode,
  type EditorLanguage,
  type PersonalInfo,
  type ResumeData,
  type TemplateId,
} from "@/features/resume-builder/model"

type ResumeActions = {
  updatePersonal: <K extends keyof PersonalInfo,>(
    key: K,

    value: PersonalInfo[K],
  ) => void

  updateSummary: (summary: string) => void

  updateExperience: (
    id: string,
    updates: Partial<Omit<Experience, "id">>,
  ) => void

  addExperience: () => void

  removeExperience: (id: string) => void

  updateEducation: (id: string, updates: Partial<Omit<Education, "id">>) => void

  addEducation: () => void

  removeEducation: (id: string) => void

  updateProject: (id: string, updates: Partial<Omit<Project, "id">>) => void

  addProject: () => void

  removeProject: (id: string) => void

  updateCertification: (
    id: string,
    updates: Partial<Omit<Certification, "id">>,
  ) => void

  addCertification: () => void

  removeCertification: (id: string) => void

  updateSkills: (skills: string[]) => void

  setTemplate: (templateId: TemplateId) => void

  setPrimaryColor: (primaryColor: string) => void
  setColorMode: (colorMode: ColorMode) => void

  setEditorLanguage: (language: EditorLanguage) => void

  resetResume: () => void
}

export type ResumeStore = ResumeData & {
  hasHydrated: boolean
} & ResumeActions

const createId = () => globalThis.crypto.randomUUID()

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      ...initialResume,

      hasHydrated: false,

      updatePersonal: (key, value) =>
        set((state) => ({
          personal: { ...state.personal, [key]: value },
        })),

      updateSummary: (summary) => set({ summary }),

      updateExperience: (id, updates) =>
        set((state) => ({
          experiences: state.experiences.map((experience) =>
            experience.id === id ? { ...experience, ...updates } : experience,
          ),
        })),

      addExperience: () =>
        set((state) => ({
          experiences: [
            ...state.experiences,

            {
              id: createId(),
              job: "",
              company: "",
              period: "",
              description: "",
            },
          ],
        })),

      removeExperience: (id) =>
        set((state) => ({
          experiences: state.experiences.filter(
            (experience) => experience.id !== id,
          ),
        })),

      updateEducation: (id, updates) =>
        set((state) => ({
          education: state.education.map((item) =>
            item.id === id ? { ...item, ...updates } : item,
          ),
        })),

      addEducation: () =>
        set((state) => ({
          education: [
            ...state.education,

            { id: createId(), degree: "", school: "", period: "" },
          ],
        })),

      removeEducation: (id) =>
        set((state) => ({
          education: state.education.filter((item) => item.id !== id),
        })),

      updateProject: (id, updates) =>
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id ? { ...project, ...updates } : project,
          ),
        })),

      addProject: () =>
        set((state) => ({
          projects: [
            ...state.projects,
            {
              id: createId(),
              name: "",
              stack: "",
              period: "",
              description: "",
              url: "",
            },
          ],
        })),

      removeProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((project) => project.id !== id),
        })),

      updateCertification: (id, updates) =>
        set((state) => ({
          certifications: state.certifications.map((certification) =>
            certification.id === id
              ? { ...certification, ...updates }
              : certification,
          ),
        })),

      addCertification: () =>
        set((state) => ({
          certifications: [
            ...state.certifications,
            { id: createId(), name: "", issuer: "", period: "" },
          ],
        })),

      removeCertification: (id) =>
        set((state) => ({
          certifications: state.certifications.filter(
            (certification) => certification.id !== id,
          ),
        })),

      updateSkills: (skills) => set({ skills }),

      setTemplate: (templateId) => set({ templateId }),

      setPrimaryColor: (primaryColor) => set({ primaryColor }),

      setColorMode: (colorMode) => set({ colorMode }),

      setEditorLanguage: (editorLanguage) => set({ editorLanguage }),

      resetResume: () =>
        set({
          ...initialResume,

          personal: { ...initialResume.personal },

          experiences: initialResume.experiences.map((item) => ({ ...item })),

          education: initialResume.education.map((item) => ({ ...item })),

          projects: initialResume.projects.map((item) => ({ ...item })),

          certifications: initialResume.certifications.map((item) => ({
            ...item,
          })),

          skills: [...initialResume.skills],
        }),
    }),

    {
      name: "sirti-resume",

      version: 1,

      storage: createJSONStorage(() => localStorage),

      skipHydration: true,

      partialize: (state) => ({
        personal: state.personal,

        summary: state.summary,

        experiences: state.experiences,

        education: state.education,

        projects: state.projects,

        certifications: state.certifications,

        skills: state.skills,

        templateId: state.templateId,

        primaryColor: state.primaryColor,

        colorMode: state.colorMode,

        editorLanguage: state.editorLanguage,
      }),

      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<ResumeData>

        return {
          ...currentState,
          ...persisted,
          personal: { ...currentState.personal, ...persisted.personal },
          projects: persisted.projects ?? currentState.projects,
          certifications:
            persisted.certifications ?? currentState.certifications,
        }
      },

      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error(
            "Could not restore the saved resume from localStorage.",
            error,
          )
        }

        useResumeStore.setState({ hasHydrated: true })
      },
    },
  ),
)
