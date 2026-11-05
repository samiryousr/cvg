import type { Metadata } from "next"

import type { ReactNode } from "react"

import { AppShell } from "@/components/AppShell"

import "./globals.css"

export const metadata: Metadata = {
  title: "سيرتي | أنشئ سيرتك الذاتية",

  description:
    "أنشئ سيرة ذاتية احترافية بسهولة مع قوالب قابلة للتخصيص ومعاينة مباشرة.",

  robots: {
    index: true,

    follow: true,
  },

  icons: {
    icon: "/favicon.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
