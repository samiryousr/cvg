import {
  getLabels,
  OrderedResumeSections,
  ResumeHeader,
  type ResumeTemplateProps,
} from "@/components/resume-builder/templates/shared-sections"

export function AtsResumeTemplate(props: ResumeTemplateProps) {
  const labels = getLabels(props.documentLanguage)
  const sectionOrder = [
    "summary",
    "experience",
    "projects",
    "skills",
    "education",
    "certifications",
    "languages",
    "awards",
    "volunteer",
    "publications",
    "references",
    ...props.customSections.map((section) => `custom:${section.id}` as const),
  ] as const
  const atsProps = {
    ...props,
    primaryColor: "#000000",
    sectionLayout: {
      ...props.sectionLayout,
      order: [...new Set([...sectionOrder, ...props.sectionLayout.order])],
    },
  }

  return (
    <div className="resume-layout resume-layout-ats">
      <ResumeHeader
        props={atsProps}
        labels={labels}
        variant="ats"
        showPhoto={false}
      />
      <main className="resume-main">
        <OrderedResumeSections
          props={atsProps}
          labels={labels}
          accent="#000000"
          templateId="ats"
        />
      </main>
    </div>
  )
}
