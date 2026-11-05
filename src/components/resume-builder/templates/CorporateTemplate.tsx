import {
  getLabels,
  getTemplateAccent,
  OrderedResumeSections,
  ResumeHeader,
  type ResumeTemplateProps,
} from "@/components/resume-builder/templates/shared-sections"

export function CorporateResumeTemplate(props: ResumeTemplateProps) {
  const labels = getLabels(props.documentLanguage)
  const accent = getTemplateAccent(props, "#2b4d60")

  return (
    <div className="resume-layout resume-layout-corporate">
      <ResumeHeader props={props} labels={labels} variant="centered" />
      <main className="resume-main">
        <OrderedResumeSections
          props={props}
          labels={labels}
          accent={accent}
          templateId="corporate"
        />
      </main>
    </div>
  )
}
