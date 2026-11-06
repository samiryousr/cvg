import type { Metadata } from "next"

import { ResumesDashboard } from "@/components/resume-builder/ResumesDashboard"

export const metadata: Metadata = {
  title: "سيرتي الذاتية | سيرتي",
  description: "تابع سيرك الذاتية المحفوظة أو ابدأ سيرة ذاتية جديدة.",
}

export default function ResumesPage() {
  return <ResumesDashboard />
}
