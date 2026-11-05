import {
  getLabels,
  getTemplateAccent,
  OrderedResumeSections,
  ResumeHeader,
  type ResumeTemplateProps,
} from "@/components/resume-builder/templates/shared-sections"

export function DeveloperResumeTemplate(props: ResumeTemplateProps) {
  const labels = getLabels(props.documentLanguage)
  const accent = getTemplateAccent(props, "#17657a")

  return (
    <div className="resume-layout resume-layout-developer">
      <ResumeHeader
        props={props}
        labels={labels}
        variant="technical"
        showPhoto={false}
      />
      <main className="resume-main">
        <OrderedResumeSections
          props={props}
          labels={labels}
          accent={accent}
          templateId="developer"
        />
      </main>
    </div>
  )
}
