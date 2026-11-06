"use client"

import { useRouter } from "next/navigation"
import { MiniResume } from "@/components/landing/MiniResume"
import { Navbar } from "@/components/Navbar"
import { templateRegistryEntries } from "@/features/resume-builder/template-registry"

export function TemplatesGallery() {
  const router = useRouter()

  return (
    <div className="landing templates-page" dir="rtl">
      <Navbar compact />

      <main className="all-templates-content">
        <div className="section-heading">
          <div>
            <span className="section-kicker">اختر التصميم المناسب لك</span>
            <h1>كل قوالب السيرة الذاتية</h1>
          </div>
          <p>
            استعرض القوالب كاملة، وتعرّف على أسلوب كل تصميم قبل البدء في إنشاء
            سيرتك.
          </p>
        </div>

        <div className="all-templates-grid">
          {templateRegistryEntries.map((template) => (
            <article className="all-template-card" key={template.id}>
              <div className="template-preview">
                <MiniResume template={template} />
              </div>
              <div className="all-template-info">
                <div className="all-template-heading">
                  <h2>{template.name}</h2>
                  {template.atsOptimized && <span>متوافق مع ATS</span>}
                </div>
                <p>{template.description}</p>
                <small>{template.audience}</small>
                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      `/editor?template=${encodeURIComponent(template.id)}`,
                    )
                  }
                >
                  استخدم هذا القالب
                  <span aria-hidden="true">←</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}
