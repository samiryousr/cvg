"use client"

import { useCallback, useEffect, useRef, useState, type UIEvent } from "react"
import { useRouter } from "next/navigation"
import { MiniResume } from "@/components/landing/MiniResume"
import { Navbar } from "@/components/Navbar"
import { StartButton } from "@/components/StartButton"
import type { TemplateId } from "@/features/resume-builder/model"
import {
  templateRegistry,
  templateRegistryEntries,
} from "@/features/resume-builder/template-registry"

export function LandingPage() {
  const router = useRouter()
  const [headerFloating, setHeaderFloating] = useState(false)
  const templateCount = templateRegistryEntries.length
  const [activeSlideIndex, setActiveSlideIndex] = useState(templateCount * 2)
  const [carouselPaused, setCarouselPaused] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)
  const scrollEndTimer = useRef<number | undefined>(undefined)
  const activeTemplateIndex = activeSlideIndex % templateCount
  const openEditor = (templateId: TemplateId) => {
    router.push(`/editor?template=${encodeURIComponent(templateId)}`)
  }

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

  const scrollToTemplate = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const carousel = carouselRef.current
      const slide = carousel?.querySelector<HTMLElement>(
        `[data-template-index="${index}"]`,
      )
      if (!carousel || !slide) return

      carousel.scrollTo({
        left: slide.offsetLeft - (carousel.clientWidth - slide.clientWidth) / 2,
        behavior,
      })
    },
    [],
  )

  useEffect(() => {
    scrollToTemplate(templateCount * 2, "instant")
  }, [scrollToTemplate, templateCount])

  useEffect(() => () => window.clearTimeout(scrollEndTimer.current), [])

  const handleCarouselScroll = (event: UIEvent<HTMLDivElement>) => {
    const carousel = event.currentTarget
    const center = carousel.scrollLeft + carousel.clientWidth / 2
    const slides = carousel.querySelectorAll<HTMLElement>(
      "[data-template-index]",
    )
    let closestIndex = 0
    let closestDistance = Number.POSITIVE_INFINITY

    slides.forEach((slide) => {
      const slideCenter = slide.offsetLeft + slide.clientWidth / 2
      const distance = Math.abs(center - slideCenter)
      if (distance < closestDistance) {
        closestDistance = distance
        closestIndex = Number(slide.dataset.templateIndex)
      }
    })

    setActiveSlideIndex((currentIndex) =>
      currentIndex === closestIndex ? currentIndex : closestIndex,
    )

    window.clearTimeout(scrollEndTimer.current)
    scrollEndTimer.current = window.setTimeout(() => {
      if (closestIndex >= templateCount && closestIndex < templateCount * 4) {
        return
      }

      const equivalentIndex = templateCount * 2 + (closestIndex % templateCount)
      scrollToTemplate(equivalentIndex, "instant")
    }, 180)
  }

  useEffect(() => {
    if (carouselPaused || templateRegistryEntries.length < 2) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const timer = window.setInterval(() => {
      scrollToTemplate(activeSlideIndex + 1)
    }, 2500)

    return () => window.clearInterval(timer)
  }, [activeSlideIndex, carouselPaused, scrollToTemplate])

  return (
    <div className="landing" id="top" dir="rtl">
      <div className="site-header-slot">
        <Navbar floating={headerFloating} landing />
      </div>

      <main>
        <section className="hero">
          <div className="hero-glow" aria-hidden="true" />
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-copy">
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
            <StartButton className="primary-button">
              ابدأ مجانًا
              <span aria-hidden="true">←</span>
            </StartButton>
            <small>لا تحتاج بطاقة ائتمانية · جاهزة خلال دقائق</small>
          </div>
          <div className="hero-resume-visual" aria-hidden="true">
            <MiniResume template={templateRegistry.modern} />
          </div>
        </section>

        <section className="templates-section" id="templates">
          <div className="section-heading scroll-reveal">
            <div>
              <span className="section-kicker">اختر ما يشبهك</span>
              <h2>قوالب صُممت لتترك أثرًا</h2>
            </div>
            <p>كل قالب مُهيأ بعناية ليبرز خبراتك ويجعل قراءتها أسهل.</p>
          </div>

          <div
            className="template-carousel"
            role="region"
            aria-roledescription="carousel"
            aria-label="قوالب السيرة الذاتية"
            onFocusCapture={() => setCarouselPaused(true)}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setCarouselPaused(false)
              }
            }}
          >
            <div
              className="template-carousel-viewport"
              ref={carouselRef}
              onScroll={handleCarouselScroll}
              dir="ltr"
            >
              <div className="template-carousel-track">
                {Array.from({ length: 5 }, (_, copyIndex) =>
                  templateRegistryEntries.map((template, index) => {
                    const slideIndex = copyIndex * templateCount + index
                    const isAccessibleCopy = copyIndex === 2

                    return (
                      <article
                        key={`${copyIndex}-${template.id}`}
                        className={`template-slide${
                          activeSlideIndex === slideIndex ? " active" : ""
                        }`}
                        data-template-index={slideIndex}
                        aria-label={`${index + 1} من ${templateCount}: ${template.name}`}
                        aria-current={
                          activeSlideIndex === slideIndex ? "true" : undefined
                        }
                        aria-hidden={!isAccessibleCopy}
                      >
                        <div className="template-preview">
                          <MiniResume template={template} />
                          <button
                            className="choose-pill"
                            type="button"
                            tabIndex={isAccessibleCopy ? 0 : -1}
                            onClick={() => openEditor(template.id)}
                            aria-label={`استخدم قالب ${template.name}`}
                          >
                            استخدم هذا القالب
                          </button>
                        </div>
                        <div className="template-info">
                          <div>
                            <h3>{template.name}</h3>
                            <p>{template.description}</p>
                          </div>
                          <div className="template-info-tags">
                            <span>{template.tone}</span>
                            <small>{template.audience}</small>
                          </div>
                        </div>
                      </article>
                    )
                  }),
                )}
              </div>
            </div>
            <div className="template-carousel-controls" dir="ltr">
              <button
                type="button"
                className="template-carousel-arrow"
                aria-label="القالب السابق"
                onClick={() => scrollToTemplate(activeSlideIndex - 1)}
              >
                ‹
              </button>
              <div
                className="template-carousel-dots"
                role="group"
                aria-label="اختيار قالب"
              >
                {templateRegistryEntries.map((template, index) => (
                  <button
                    key={template.id}
                    type="button"
                    className={activeTemplateIndex === index ? "active" : ""}
                    aria-label={`عرض ${template.name}`}
                    aria-current={
                      activeTemplateIndex === index ? "true" : undefined
                    }
                    onClick={() => scrollToTemplate(templateCount * 2 + index)}
                  />
                ))}
              </div>
              <button
                type="button"
                className="template-carousel-arrow"
                aria-label="القالب التالي"
                onClick={() => scrollToTemplate(activeSlideIndex + 1)}
              >
                ›
              </button>
            </div>
            <button
              className="all-templates-link"
              type="button"
              onClick={() => router.push("/templates")}
            >
              عرض كل القوالب
              <span aria-hidden="true">←</span>
            </button>
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
              onClick={() => openEditor("ats")}
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
          <StartButton className="primary-button light-button">
            ابدأ مجانًا
            <span aria-hidden="true">←</span>
          </StartButton>
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
