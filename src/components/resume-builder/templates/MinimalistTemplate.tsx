import {
  getLabels,
  getTemplateAccent,
  OrderedResumeSections,
  ResumeHeader,
  type ResumeTemplateProps,
} from "@/components/resume-builder/templates/shared-sections"

export function MinimalistResumeTemplate(props: ResumeTemplateProps) {
  const labels = getLabels(props.documentLanguage)
  const accent = getTemplateAccent(props, "#6b6258")

  return (
    <div className="resume-layout resume-layout-minimalist">
      <ResumeHeader props={props} labels={labels} variant="centered" />
      <main className="resume-main">
        <OrderedResumeSections
          props={props}
          labels={labels}
          accent={accent}
          templateId="minimalist"
        />
      </main>
    </div>
  )
}
