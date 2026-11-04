import type { ComponentType } from "react"

import {
  AtsResumeTemplate,
  ClassicResumeTemplate,
  CorporateResumeTemplate,
  CreativeResumeTemplate,
  DeveloperResumeTemplate,
  ExecutiveResumeTemplate,
  MinimalistResumeTemplate,
  ModernResumeTemplate,
  StudentResumeTemplate,
  type ResumeTemplateProps,
} from "@/components/resume-builder/ResumeTemplates"

import type { Template, TemplateId } from "@/features/resume-builder/model"

export type TemplateRenderer = ComponentType<ResumeTemplateProps>

export type TemplateDefinition = Template & {
  component: TemplateRenderer

  defaultDocumentLanguage: "ar" | "en"
}

export const templateRegistry: Record<TemplateId, TemplateDefinition> = {
  ats: {
    id: "ats",

    name: "ATS Classic",

    tone: "تقليدي ومتوافق مع أنظمة التوظيف",

    description: "سيرة أحادية العمود بترتيب واضح ونصوص سهلة القراءة الآلية.",

    audience: "للتقديم الوظيفي التقليدي",

    accent: "#263238",

    atsOptimized: true,

    status: "active",

    supportsPhoto: false,

    supportsColor: false,

    supportsProfessionalLinks: true,

    defaultDocumentLanguage: "en",

    component: AtsResumeTemplate,
  },

  developer: {
    id: "developer",

    name: "Tech / Developer",

    tone: "تقني ومنظم",

    description: "يبرز المهارات التقنية والمشاريع والروابط المهنية.",

    audience: "للمهندسين والمطورين ومتخصصي التقنية",

    accent: "#17657a",

    status: "active",

    supportsPhoto: false,

    supportsColor: true,

    supportsProfessionalLinks: true,

    defaultDocumentLanguage: "en",

    component: DeveloperResumeTemplate,
  },

  minimalist: {
    id: "minimalist",

    name: "Modern Minimal",

    tone: "هادئ وأنيق",

    description: "مساحات مدروسة وتسلسل طباعي واضح مع فواصل بسيطة.",

    audience: "للمهنيين الباحثين عن تصميم معاصر",

    accent: "#6b6258",

    status: "active",

    supportsPhoto: true,

    supportsColor: true,

    defaultDocumentLanguage: "en",

    component: MinimalistResumeTemplate,
  },

  creative: {
    id: "creative",

    name: "Creative / Designer",

    tone: "تعبيري ومتوازن",

    description:
      "يمنح المشاريع والملف الإبداعي حضورًا بصريًا دون التضحية بالوضوح.",

    audience: "للمصممين والمبدعين والفنانين",

    accent: "#a64f38",

    status: "active",

    supportsPhoto: true,

    supportsColor: true,

    defaultDocumentLanguage: "en",

    component: CreativeResumeTemplate,
  },

  student: {
    id: "student",

    name: "Student / Graduate",

    tone: "يركز على الإمكانات",

    description:
      "يقدم التعليم والمشاريع والتدريب والمهارات قبل الخبرة الطويلة.",

    audience: "للطلاب والخريجين والمتدربين",

    accent: "#49658a",

    status: "active",

    supportsPhoto: false,

    supportsColor: true,

    defaultDocumentLanguage: "en",

    component: StudentResumeTemplate,
  },

  corporate: {
    id: "corporate",

    name: "Professional Corporate",

    tone: "رسمي ومتزن",

    description: "تخطيط مؤسسي واضح يبرز التدرج المهني والخبرة.",

    audience: "للأعمال والمالية والإدارة والمبيعات",

    accent: "#2b4d60",

    status: "active",

    supportsPhoto: true,

    supportsColor: true,

    defaultDocumentLanguage: "en",

    component: CorporateResumeTemplate,
  },

  executive: {
    id: "executive",

    name: "Executive",

    tone: "قيادي ورفيع",

    description: "نبذة قيادية بارزة ومساحة منظمة للأثر والإنجازات المهنية.",

    audience: "للمديرين والقادة والخبرات العليا",

    accent: "#3d3430",

    status: "active",

    supportsPhoto: true,

    supportsColor: true,

    defaultDocumentLanguage: "en",

    component: ExecutiveResumeTemplate,
  },

  modern: {
    id: "modern",

    name: "Modern",

    tone: "عصري وبارز",

    description: "رأس بلون داكن وتنسيق مميز للخبرات والإنجازات.",

    audience: "للمهنيين في مختلف المجالات",

    accent: "#2f6b5f",

    status: "active",

    supportsPhoto: true,

    supportsColor: true,

    defaultDocumentLanguage: "en",

    component: ModernResumeTemplate,
  },

  classic: {
    id: "classic",

    name: "Classic",

    tone: "تقليدي ومرتب",

    description: "تنسيق كلاسيكي هادئ بعناوين واضحة وتفاصيل سهلة القراءة.",

    audience: "للمهنيين في البيئات المحافظة",

    accent: "#343b45",

    status: "active",

    supportsPhoto: false,

    supportsColor: true,

    defaultDocumentLanguage: "en",

    component: ClassicResumeTemplate,
  },
}

export const templateRegistryEntries = Object.values(templateRegistry).filter(
  (template) => template.status === "active",
)

export const activeTemplateIds = templateRegistryEntries.map(
  (template) => template.id,
)

export const plannedTemplateIds: TemplateId[] = Object.values(templateRegistry)

  .filter((template) => template.status === "planned")

  .map((template) => template.id)

export function isAvailableTemplateId(
  id: TemplateId | string | null | undefined,
): id is TemplateId {
  return (
    typeof id === "string" &&
    id in templateRegistry &&
    templateRegistry[(id as TemplateId)].status === "active"
  )
}

export function normalizeTemplateId(
  id: TemplateId | string | null | undefined,

  fallback: TemplateId = "ats",
): TemplateId {
  if (isAvailableTemplateId(id)) return id

  if (isAvailableTemplateId(fallback)) return fallback

  return "ats"
}

export function getTemplateDefinition(
  id: TemplateId | string | undefined,
): TemplateDefinition {
  return templateRegistry[normalizeTemplateId(id)]
}
