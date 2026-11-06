import type { Metadata } from "next"

import { Auth } from "@/components/Auth"

export const metadata: Metadata = {
  title: "تسجيل الدخول | سيرتي",
  description: "سجّل الدخول أو أنشئ حسابًا في سيرتي.",
}

export default function AuthPage() {
  return <Auth />
}
