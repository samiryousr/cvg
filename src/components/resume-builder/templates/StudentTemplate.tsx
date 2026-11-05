import {
  getLabels,
  getTemplateAccent,
  OrderedResumeSections,
  ResumeHeader,
  type ResumeTemplateProps,
} from "@/components/resume-builder/templates/shared-sections"

export function StudentResumeTemplate(props: ResumeTemplateProps) {
  const labels = getLabels(props.documentLanguage)
  const accent = getTemplateAccent(props, "#49658a")

  return (
    <div className="resume-layout resume-layout-student">
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
          templateId="student"
        />
      </main>
    </div>
  )
}
