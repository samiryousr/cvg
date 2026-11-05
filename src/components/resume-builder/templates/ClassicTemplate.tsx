import {
  getLabels,
  getTemplateAccent,
  OrderedResumeSections,
  ResumeHeader,
  type ResumeTemplateProps,
} from "@/components/resume-builder/templates/shared-sections"

export function ClassicResumeTemplate(props: ResumeTemplateProps) {
  const labels = getLabels(props.documentLanguage)
  const accent = getTemplateAccent(props, "#343b45")

  return (
    <div className="resume-layout resume-layout-classic">
      <ResumeHeader
        props={props}
        labels={labels}
        variant="centered"
        showPhoto={false}
      />
      <main className="resume-main">
        <OrderedResumeSections
          props={props}
          labels={labels}
          accent={accent}
          templateId="classic"
        />
      </main>
    </div>
  )
}
