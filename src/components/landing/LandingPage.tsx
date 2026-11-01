"use client"

import { useEffect, useState } from "react"
import { MiniResume } from "@/components/landing/MiniResume"
import { ThemeToggle } from "@/components/ThemeToggle"
import { templates, type Template } from "@/features/resume-builder/model"

export function LandingPage({
  onChoose,
}: {
  onChoose: (template: Template) => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [headerFloating, setHeaderFloating] = useState(false)

  useEffect(() => {
    const updateHeader = () => setHeaderFloating(window.scrollY > 40)
    updateHeader()
    window.addEventListener("scroll", updateHeader, { passive: true })

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    )

    document
      .querySelectorAll(".scroll-reveal")
      .forEach((element) => revealObserver.observe(element))
    return () => {
      window.removeEventListener("scroll", updateHeader)
      revealObserver.disconnect()
    }
  }, [])

  return (
    <div className="landing" id="top" dir="rtl">
      <div className="site-header-slot">
        <header
          className={`site-header${headerFloating ? " is-scrolled" : ""}`}
        >
          <a className="brand" href="#" aria-label="سيرتي الرئيسية">
            <span>س</span>
            <strong>سيرتي</strong>
          </a>
          <nav>
            <a href="#top">الرئيسية</a>
            <a href="#templates">القوالب</a>
            <a href="#features">المميزات</a>
            <a href="#how">طريقة الاستخدام</a>
          </nav>
          <div className="site-header-actions">
            <ThemeToggle />
            <button
              className="text-button"
              onClick={() => onChoose(templates[1])}
            >
              أنشئ سيرتك
              <span aria-hidden="true">←</span>
            </button>
          </div>
          <button
            className={`menu-button ${menuOpen ? "open" : ""}`}
            aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <i />
            <i />
            <i />
          </button>
          <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
            <a href="#top" onClick={() => setMenuOpen(false)}>
              الرئيسية
            </a>
            <a href="#templates" onClick={() => setMenuOpen(false)}>
              القوالب
            </a>
            <a href="#features" onClick={() => setMenuOpen(false)}>
              المميزات
            </a>
            <a href="#how" onClick={() => setMenuOpen(false)}>
              طريقة الاستخدام
            </a>
            <button onClick={() => onChoose(templates[1])}>
              أنشئ سيرتك مجانًا
            </button>
          </div>
        </header>
      </div>

      <main>
        <section className="hero">
          <div className="hero-glow" aria-hidden="true" />
          <div className="hero-grid" aria-hidden="true" />
          <div className="eyebrow">
            <span />
            سيرتك الذاتية، بطريقتك
          </div>
          <h1>
            اصنع سيرة ذاتية
            <br />
            <em>تحكي قصتك.</em>
          </h1>
          <p>قوالب احترافية، تعديل فوري، ونتيجة تليق بخبرتك — بدون تعقيد.</p>
          <button
            className="primary-button"
            onClick={() => onChoose(templates[1])}
          >
            ابدأ مجانًا
            <span aria-hidden="true">←</span>
          </button>
          <small>لا تحتاج بطاقة ائتمانية · جاهزة خلال دقائق</small>
        </section>

        <section className="templates-section" id="templates">
          <div className="section-heading scroll-reveal">
            <div>
              <span className="section-kicker">اختر ما يشبهك</span>
              <h2>قوالب صُممت لتترك أثرًا</h2>
            </div>
            <p>كل قالب مُهيأ بعناية ليبرز خبراتك ويجعل قراءتها أسهل.</p>
          </div>

          <div className="template-grid">
            {templates.map((template, index) => (
              <button
                key={template.id}
                className={`template-card card-${index + 1} scroll-reveal`}
                onClick={() => onChoose(template)}
              >
                <div className="template-preview">
                  <MiniResume template={template} />
                  <span className="choose-pill">استخدم هذا القالب</span>
                </div>
                <div className="template-info">
                  <div>
                    <h3>{template.name}</h3>
                    <p>{template.description}</p>
                  </div>
                  <span>{template.tone}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="features-section" id="features">
          <div className="section-heading feature-heading scroll-reveal">
            <div>
              <span className="section-kicker">كل ما تحتاجه في مكان واحد</span>
              <h2>ركّز على قصتك، واترك التنسيق لنا</h2>
            </div>
            <p>
              أدوات بسيطة وذكية تساعدك على بناء سيرة احترافية بدون خبرة في
              التصميم.
            </p>
          </div>
          <div className="feature-grid">
            {[
              [
                "01",
                "تعديل ومعاينة مباشرة",
                "شاهد كل تغيير لحظة بلحظة، بدون حفظ أو تحديث الصفحة.",
              ],
              [
                "02",
                "متوافق مع أنظمة ATS",
                "تنسيق واضح يساعد أنظمة التوظيف على قراءة خبراتك بشكل صحيح.",
              ],
              [
                "03",
                "قوالب مرنة",
                "بدّل بين القوالب في أي وقت مع الاحتفاظ بجميع بياناتك.",
              ],
              [
                "04",
                "تصدير بجودة عالية",
                "حمّل سيرتك بصيغة PDF جاهزة للطباعة والمشاركة فورًا.",
              ],
            ].map(([number, title, text]) => (
              <article className="feature-card scroll-reveal" key={number}>
                <span>{number}</span>
                <div className="feature-icon" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="how-section scroll-reveal" id="how">
          <div className="how-copy">
            <span className="section-kicker">ثلاث خطوات فقط</span>
            <h2>من صفحة فارغة إلى سيرة جاهزة</h2>
            <p>
              صممنا التجربة لتكون سهلة وسريعة، حتى تصل للنتيجة التي تريدها في
              دقائق.
            </p>
            <button
              className="primary-button"
              onClick={() => onChoose(templates[1])}
            >
              أنشئ سيرتك الآن
              <span aria-hidden="true">←</span>
            </button>
          </div>
          <div className="steps-list">
            {[
              ["01", "اختر القالب", "اختر التصميم الأقرب لمجالك وشخصيتك."],
              [
                "02",
                "أضف بياناتك",
                "اكتب خبراتك ومهاراتك وشاهد النتيجة مباشرة.",
              ],
              ["03", "حمّل وشارك", "صدّر ملف PDF احترافي وابدأ التقديم."],
            ].map(([number, title, text]) => (
              <div className="step scroll-reveal" key={number}>
                <span>{number}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="final-cta scroll-reveal">
          <span>خطوتك القادمة تبدأ هنا</span>
          <h2>سيرتك تستحق أن تُقرأ.</h2>
          <p>أنشئ سيرة ذاتية تعبّر عنك وتمنح خبراتك المساحة التي تستحقها.</p>
          <button
            className="primary-button light-button"
            onClick={() => onChoose(templates[0])}
          >
            ابدأ مجانًا
            <span aria-hidden="true">←</span>
          </button>
        </section>
      </main>

      <footer className="landing-footer">
        <span>معاينة لحظية</span>
        <i />
        <span>تحميل بجودة عالية</span>
        <i />
        <span>متوافق مع أنظمة التوظيف</span>
      </footer>
    </div>
  )
}
