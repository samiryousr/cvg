import { ResumeEditorRoute } from "@/components/resume-builder/ResumeEditorRoute"
import { normalizeTemplateId } from "@/features/resume-builder/template-registry"

type EditorPageProps = {
  searchParams: Promise<{ template?: string | string[] }>
}

export default async function EditorPage({ searchParams }: EditorPageProps) {
  const { template } = await searchParams
  const templateId =
    typeof template === "string"
      ? normalizeTemplateId(template, "ats")
      : undefined

  return <ResumeEditorRoute templateId={templateId} />
}
