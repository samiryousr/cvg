import {
  getLabels,
  OrderedResumeSections,
  ResumeHeader,
  type ResumeTemplateProps,
} from "@/components/resume-builder/templates/shared-sections"

export function AtsResumeTemplate(props: ResumeTemplateProps) {
  const labels = getLabels(props.documentLanguage)
  const accent = "#263238"

  return (
    <div className="resume-layout resume-layout-ats">
      <ResumeHeader
        props={props}
        labels={labels}
        variant="ats"
        showPhoto={false}
      />
      <main className="resume-main">
        <OrderedResumeSections
          props={props}
          labels={labels}
          accent={accent}
          templateId="ats"
        />
      </main>
    </div>
  )
}
