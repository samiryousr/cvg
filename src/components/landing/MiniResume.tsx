import { getTemplateDefinition } from "@/features/resume-builder/template-registry"
import type { ResumeTemplateProps } from "@/components/resume-builder/templates/shared-sections"
import {
  defaultHiddenResumeSections,
  defaultResumeSectionOrder,
  type Template,
} from "@/features/resume-builder/model"

const sampleResume: Pick<ResumeTemplateProps, "personal" | "summary" | "experiences" | "education" | "projects" | "certifications" | "skills" | "languages" | "awards" | "volunteerExperiences" | "publications" | "references" | "customSections" | "sectionLayout"> =
  {
    personal: {
      name: "Omar Khaled",
      role: "Senior Frontend Engineer",
      email: "omar.khaled@example.com",
      phone: "+20 100 123 4567",
      location: "Cairo, Egypt",
      github: "github.com/omarkhaled",
      linkedIn: "linkedin.com/in/omarkhaled",
      portfolio: "omarkhaled.dev",
      photoUrl: "/resume-profile.svg",
    },
    summary:
      "Frontend engineer with 7+ years of experience building accessible, high-performing web applications. Led platform improvements that reduced page load time by 40% and established reusable UI standards across six teams.",
    experiences: [
      {
        id: "sample-experience-1",
        job: "Senior Frontend Engineer",
        company: "Nawa Technology",
        period: "May 2021 — Present",
        description:
          "Led the migration of a high-traffic customer platform to Next.js, reducing page load time by 40%.\nBuilt a shared component library adopted by six product teams.\nImproved accessibility audit scores from 71 to 96.",
      },
      {
        id: "sample-experience-2",
        job: "Frontend Engineer",
        company: "BrightWare",
        period: "Jan 2018 — Apr 2021",
        description:
          "Delivered responsive React features for products serving 80,000+ monthly users.\nReduced JavaScript bundle size by 28% through code splitting.\nExpanded automated test coverage from 45% to 82%.",
      },
    ],
    education: [
      {
        id: "sample-education",
        degree: "B.Sc. in Computer Science",
        school: "Cairo University",
        period: "2014 — 2018",
      },
    ],
    projects: [
      {
        id: "sample-project",
        name: "Customer Portal Performance Upgrade",
        stack: "Next.js, React, TypeScript",
        period: "2024",
        description:
          "Introduced route-level code splitting and improved Core Web Vitals, reducing largest contentful paint by 40%.",
        url: "omarkhaled.dev/projects",
      },
    ],
    certifications: [],
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "Accessibility",
      "Performance Optimization",
      "Jest",
      "Playwright",
    ],
    languages: [],
    awards: [],
    volunteerExperiences: [],
    publications: [],
    references: [],
    customSections: [],
    sectionLayout: {
      order: [...defaultResumeSectionOrder],
      hidden: [...defaultHiddenResumeSections],
    },
  }

export function MiniResume({ template }: { template: Template }) {
  const TemplateRenderer = getTemplateDefinition(template.id).component

  return (
    <article
      className={`resume-paper template-${template.id} template-miniature`}
      lang="en"
      dir="ltr"
      aria-hidden="true"
      inert
    >
      <TemplateRenderer
        {...sampleResume}
        primaryColor={template.accent}
        documentLanguage="en"
      />
    </article>
  )
}
