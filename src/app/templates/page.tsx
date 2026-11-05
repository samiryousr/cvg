import type { Metadata } from "next"
import { TemplatesGallery } from "@/components/landing/TemplatesGallery"

export const metadata: Metadata = {
  title: "قوالب السيرة الذاتية | سيرتي",
  description:
    "تصفح جميع قوالب السير الذاتية واختر التصميم المناسب لمجالك وخبرتك.",
}

export default function TemplatesPage() {
  return <TemplatesGallery />
}
