import {
  getLabels,
  getTemplateAccent,
  OrderedResumeSections,
  ResumeHeader,
  type ResumeTemplateProps,
} from "@/components/resume-builder/templates/shared-sections"

export function ExecutiveResumeTemplate(props: ResumeTemplateProps) {
  const labels = getLabels(props.documentLanguage)
  const accent = getTemplateAccent(props, "#3d3430")

  return (
    <div className="resume-layout resume-layout-executive">
      <ResumeHeader props={props} labels={labels} variant="executive" />
      <main className="resume-main">
        <OrderedResumeSections
          props={props}
          labels={labels}
          accent={accent}
          templateId="executive"
        />
      </main>
    </div>
  )
}
