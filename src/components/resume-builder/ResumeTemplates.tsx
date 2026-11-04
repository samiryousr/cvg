import Image from "next/image"

import type { ReactNode } from "react"

import { defaultResumeSectionOrder } from "@/features/resume-builder/model"

import type {
  Certification,
  Education,
  Experience,
  PersonalInfo,
  Project,
  Award,
  CustomResumeSection,
  Publication,
  Reference,
  ResumeLanguage,
  ResumeDocumentLanguage,
  TemplateId,
  ResumeSectionId,
  ResumeData,
  VolunteerExperience,
} from "@/features/resume-builder/model"

export type ResumeTemplateProps = Pick<ResumeData, "personal" | "summary" | "experiences" | "education" | "projects" | "certifications" | "skills" | "languages" | "awards" | "volunteerExperiences" | "publications" | "references" | "customSections" | "sectionLayout"> & {
  primaryColor: string

  documentLanguage: ResumeDocumentLanguage
}

type ResumeLabels = {
  contact: string

  phone: string

  email: string

  location: string

  github: string

  linkedIn: string

  portfolio: string

  summary: string

  experience: string

  education: string

  skills: string

  projects: string

  certifications: string

  languages: string

  awards: string

  volunteer: string

  publications: string

  references: string

  customSection: string
}

function getLabels(language: ResumeDocumentLanguage): ResumeLabels {
  if (language === "ar") {
    return {
      contact: "معلومات التواصل",

      phone: "الهاتف",

      email: "البريد الإلكتروني",

      location: "الموقع",

      github: "GitHub",

      linkedIn: "LinkedIn",

      portfolio: "الموقع الشخصي",

      summary: "الملخص المهني",

      experience: "الخبرة المهنية",

      education: "التعليم",

      skills: "المهارات",

      projects: "المشاريع",

      certifications: "الشهادات",

      languages: "اللغات",

      awards: "الجوائز والإنجازات",

      volunteer: "العمل التطوعي",

      publications: "المنشورات",

      references: "المراجع",

      customSection: "قسم إضافي",
    }
  }

  return {
    contact: "Contact",

    phone: "Phone",

    email: "Email",

    location: "Location",

    github: "GitHub",

    linkedIn: "LinkedIn",

    portfolio: "Portfolio",

    summary: "Professional Summary",

    experience: "Professional Experience",

    education: "Education",

    skills: "Skills",

    projects: "Projects",

    certifications: "Certifications",

    languages: "Languages",

    awards: "Awards & Achievements",

    volunteer: "Volunteer Experience",

    publications: "Publications",

    references: "References",

    customSection: "Additional section",
  }
}

function getExternalUrl(value: string) {
  const candidate = /^https?:\/\//i.test(value) ? value : `https://${value}`

  try {
    const url = new URL(candidate)

    return url.protocol === "http:" || url.protocol === "https:"
      ? url.toString()
      : undefined
  } catch {
    return undefined
  }
}

function hasValue(value: string | null | undefined) {
  return typeof value === "string" && value.trim().length > 0
}

function ResumeContact({
  personal,

  labels,
}: {
  personal: PersonalInfo

  labels: ResumeLabels
}) {
  const contacts = [
    personal.phone && {
      label: labels.phone,

      value: personal.phone,

      dir: "auto",
    },

    personal.email && {
      label: labels.email,

      value: personal.email,

      href: `mailto:${personal.email}`,

      dir: "ltr",
    },

    personal.location && {
      label: labels.location,

      value: personal.location,

      dir: "auto",
    },

    personal.github && {
      label: labels.github,

      value: personal.github,

      href: getExternalUrl(personal.github),

      dir: "ltr",
    },

    personal.linkedIn && {
      label: labels.linkedIn,

      value: personal.linkedIn,

      href: getExternalUrl(personal.linkedIn),

      dir: "ltr",
    },

    personal.portfolio && {
      label: labels.portfolio,

      value: personal.portfolio,

      href: getExternalUrl(personal.portfolio),

      dir: "ltr",
    },
  ].filter((contact) => contact && hasValue(contact.value))

  if (contacts.length === 0) return null

  return (
    <div className="resume-contact-line" aria-label={labels.contact}>
      {contacts.map((contact, index) => {
        if (!contact) return null

        const label = contact.label

        return (
          <span key={`${label}-${index}`} dir={contact.dir}>
            {label}:{" "}
            {contact.href ? (
              <a
                href={contact.href}
                target={contact.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  contact.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
              >
                {contact.value}
              </a>
            ) : (
              contact.value
            )}
          </span>
        )
      })}
    </div>
  )
}

function ResumePhoto({ personal }: { personal: PersonalInfo }) {
  if (!personal.photoUrl) return null

  return (
    <Image
      className="resume-photo"
      src={personal.photoUrl}
      alt={personal.name ? `Photo of ${personal.name}` : "Profile photo"}
      width={512}
      height={512}
      loading="eager"
      unoptimized
    />
  )
}

function ResumeHeader({
  props,

  labels,

  variant,

  showPhoto = true,
}: {
  props: ResumeTemplateProps

  labels: ResumeLabels

  variant?: "dark" | "centered" | "technical" | "creative" | "executive" | "ats"

  showPhoto?: boolean
}) {
  const { personal, primaryColor } = props

  return (
    <header
      className={`resume-heading${variant ? ` resume-heading-${variant}` : ""}`}
    >
      {showPhoto && <ResumePhoto personal={personal} />}
      <div className="resume-heading-copy">
        {hasValue(personal.name) && <h1 dir="auto">{personal.name.trim()}</h1>}
        {hasValue(personal.role) && (
          <p className="resume-role" dir="auto" style={{ color: primaryColor }}>
            {personal.role.trim()}
          </p>
        )}
        <ResumeContact personal={personal} labels={labels} />
      </div>
    </header>
  )
}

function ResumeSection({
  title,

  accent,

  children,

  className = "",
}: {
  title: string

  accent: string

  children: ReactNode

  className?: string
}) {
  return (
    <section className={`resume-section ${className}`.trim()}>
      <h2 style={{ borderColor: accent }}>{title}</h2>
      {children}
    </section>
  )
}

function SummarySection({
  summary,

  labels,

  accent,

  className,
}: Pick<ResumeTemplateProps, "summary" | "primaryColor"> & {
  labels: ResumeLabels

  accent?: string

  className?: string
}) {
  if (!hasValue(summary)) return null

  return (
    <ResumeSection
      title={labels.summary}
      accent={accent ?? "#2f6b5f"}
      className={className}
    >
      <p className="summary" dir="auto">
        {summary.trim()}
      </p>
    </ResumeSection>
  )
}

function ExperienceSection({
  experiences,

  labels,

  accent,
}: {
  experiences: Experience[]

  labels: ResumeLabels

  accent: string
}) {
  const entries = experiences.filter((item) =>
    [item.job, item.company, item.period, item.description].some(hasValue),
  )

  if (entries.length === 0) return null

  return (
    <ResumeSection title={labels.experience} accent={accent}>
      {entries.map((experience) => (
        <article className="resume-item" key={experience.id}>
          <div className="resume-item-copy">
            {hasValue(experience.job) && (
              <h3 dir="auto">{experience.job.trim()}</h3>
            )}
            {hasValue(experience.company) && (
              <b dir="auto">{experience.company.trim()}</b>
            )}
            {hasValue(experience.description) && (
              <ul className="resume-bullets" dir="auto">
                {experience.description

                  .split(/\r?\n/)

                  .map((item) => item.trim())

                  .filter(Boolean)

                  .map((item, index) => (
                    <li key={`${experience.id}-achievement-${index}`}>
                      {item.replace(/^[-•]\s*/, "")}
                    </li>
                  ))}
              </ul>
            )}
          </div>
          {hasValue(experience.period) && (
            <span className="resume-period" dir="auto">
              {experience.period.trim()}
            </span>
          )}
        </article>
      ))}
    </ResumeSection>
  )
}

function ProjectSection({
  projects,

  labels,

  accent,
}: {
  projects: Project[]

  labels: ResumeLabels

  accent: string
}) {
  const entries = projects.filter((item) =>
    [item.name, item.stack, item.period, item.description, item.url].some(
      hasValue,
    ),
  )

  if (entries.length === 0) return null

  return (
    <ResumeSection title={labels.projects} accent={accent}>
      <div className="resume-project-list">
        {entries.map((project) => (
          <article className="resume-item resume-project" key={project.id}>
            <div className="resume-item-copy">
              {hasValue(project.name) && (
                <h3 dir="auto">{project.name.trim()}</h3>
              )}
              {hasValue(project.stack) && (
                <b className="resume-project-stack" dir="auto">
                  {project.stack.trim()}
                </b>
              )}
              {hasValue(project.description) && (
                <ul className="resume-bullets" dir="auto">
                  {project.description

                    .split(/\r?\n/)

                    .map((item) => item.trim())

                    .filter(Boolean)

                    .map((item, index) => (
                      <li key={`${project.id}-detail-${index}`}>
                        {item.replace(/^[-•]\s*/, "")}
                      </li>
                    ))}
                </ul>
              )}
              {hasValue(project.url) && (
                <p className="resume-project-url" dir="ltr">
                  <a
                    href={getExternalUrl(project.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {project.url.trim()}
                  </a>
                </p>
              )}
            </div>
            {hasValue(project.period) && (
              <span className="resume-period" dir="auto">
                {project.period.trim()}
              </span>
            )}
          </article>
        ))}
      </div>
    </ResumeSection>
  )
}

function EducationSection({
  education,

  labels,

  accent,
}: {
  education: Education[]

  labels: ResumeLabels

  accent: string
}) {
  const entries = education.filter((item) =>
    [item.degree, item.school, item.period].some(hasValue),
  )

  if (entries.length === 0) return null

  return (
    <ResumeSection title={labels.education} accent={accent}>
      {entries.map((item) => (
        <article className="resume-item" key={item.id}>
          <div className="resume-item-copy">
            {hasValue(item.degree) && <h3 dir="auto">{item.degree.trim()}</h3>}
            {hasValue(item.school) && <b dir="auto">{item.school.trim()}</b>}
          </div>
          {hasValue(item.period) && (
            <span className="resume-period" dir="auto">
              {item.period.trim()}
            </span>
          )}
        </article>
      ))}
    </ResumeSection>
  )
}

function CertificationSection({
  certifications,

  labels,

  accent,
}: {
  certifications: Certification[]

  labels: ResumeLabels

  accent: string
}) {
  const entries = certifications.filter((item) =>
    [item.name, item.issuer, item.period].some(hasValue),
  )

  if (entries.length === 0) return null

  return (
    <ResumeSection title={labels.certifications} accent={accent}>
      {entries.map((item) => (
        <article className="resume-item" key={item.id}>
          <div className="resume-item-copy">
            {hasValue(item.name) && <h3 dir="auto">{item.name.trim()}</h3>}
            {hasValue(item.issuer) && <b dir="auto">{item.issuer.trim()}</b>}
          </div>
          {hasValue(item.period) && (
            <span className="resume-period" dir="auto">
              {item.period.trim()}
            </span>
          )}
        </article>
      ))}
    </ResumeSection>
  )
}

function SkillsSection({
  skills,

  labels,

  accent,

  variant = "tags",
}: {
  skills: string[]

  labels: ResumeLabels

  accent: string

  variant?: "tags" | "plain" | "technical"
}) {
  const entries = skills.map((skill) => skill.trim()).filter(Boolean)

  if (entries.length === 0) return null

  return (
    <ResumeSection title={labels.skills} accent={accent}>
      <ul className={`resume-skills resume-skills-${variant}`}>
        {entries.map((skill, index) => (
          <li key={`${skill}-${index}`} dir="auto">
            {skill}
          </li>
        ))}
      </ul>
    </ResumeSection>
  )
}

function LanguagesSection({
  items,

  labels,

  accent,
}: {
  items: ResumeLanguage[]

  labels: ResumeLabels

  accent: string
}) {
  const entries = items.filter((item) =>
    [item.name, item.proficiency].some(hasValue),
  )

  if (entries.length === 0) return null

  return (
    <ResumeSection title={labels.languages} accent={accent}>
      <ul className="resume-detail-list">
        {entries.map((item) => (
          <li key={item.id} dir="auto">
            {hasValue(item.name) && <strong>{item.name.trim()}</strong>}
            {hasValue(item.name) && hasValue(item.proficiency) && " — "}
            {hasValue(item.proficiency) && item.proficiency.trim()}
          </li>
        ))}
      </ul>
    </ResumeSection>
  )
}

function AwardsSection({
  items,

  labels,

  accent,
}: {
  items: Award[]

  labels: ResumeLabels

  accent: string
}) {
  const entries = items.filter((item) =>
    [item.title, item.issuer, item.date, item.description].some(hasValue),
  )

  if (entries.length === 0) return null

  return (
    <ResumeSection title={labels.awards} accent={accent}>
      {entries.map((item) => (
        <article className="resume-item" key={item.id}>
          <div className="resume-item-copy">
            {hasValue(item.title) && <h3 dir="auto">{item.title.trim()}</h3>}
            {hasValue(item.issuer) && <b dir="auto">{item.issuer.trim()}</b>}
            {hasValue(item.description) && (
              <p className="resume-detail-description" dir="auto">
                {item.description.trim()}
              </p>
            )}
          </div>
          {hasValue(item.date) && (
            <span className="resume-period" dir="auto">
              {item.date.trim()}
            </span>
          )}
        </article>
      ))}
    </ResumeSection>
  )
}

function VolunteerSection({
  items,

  labels,

  accent,
}: {
  items: VolunteerExperience[]

  labels: ResumeLabels

  accent: string
}) {
  const entries = items.filter((item) =>
    [
      item.organization,

      item.role,

      item.startDate,

      item.endDate,

      item.description,
    ].some(hasValue),
  )

  if (entries.length === 0) return null

  return (
    <ResumeSection title={labels.volunteer} accent={accent}>
      {entries.map((item) => (
        <article className="resume-item" key={item.id}>
          <div className="resume-item-copy">
            {hasValue(item.role) && <h3 dir="auto">{item.role.trim()}</h3>}
            {hasValue(item.organization) && (
              <b dir="auto">{item.organization.trim()}</b>
            )}
            {hasValue(item.description) && (
              <p className="resume-detail-description" dir="auto">
                {item.description.trim()}
              </p>
            )}
          </div>
          {[item.startDate, item.endDate].some(hasValue) && (
            <span className="resume-period" dir="auto">
              {[item.startDate, item.endDate]

                .filter(hasValue)

                .map((date) => date.trim())

                .join(" — ")}
            </span>
          )}
        </article>
      ))}
    </ResumeSection>
  )
}

function PublicationsSection({
  items,

  labels,

  accent,
}: {
  items: Publication[]

  labels: ResumeLabels

  accent: string
}) {
  const entries = items.filter((item) =>
    [item.title, item.publisher, item.date, item.url, item.description].some(
      hasValue,
    ),
  )

  if (entries.length === 0) return null

  return (
    <ResumeSection title={labels.publications} accent={accent}>
      {entries.map((item) => {
        const url = hasValue(item.url) ? getExternalUrl(item.url) : undefined

        return (
          <article className="resume-item" key={item.id}>
            <div className="resume-item-copy">
              {hasValue(item.title) && <h3 dir="auto">{item.title.trim()}</h3>}
              {hasValue(item.publisher) && (
                <b dir="auto">{item.publisher.trim()}</b>
              )}
              {hasValue(item.description) && (
                <p className="resume-detail-description" dir="auto">
                  {item.description.trim()}
                </p>
              )}
              {url && (
                <p className="resume-project-url" dir="ltr">
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    {item.url.trim()}
                  </a>
                </p>
              )}
            </div>
            {hasValue(item.date) && (
              <span className="resume-period" dir="auto">
                {item.date.trim()}
              </span>
            )}
          </article>
        )
      })}
    </ResumeSection>
  )
}

function ReferencesSection({
  items,

  labels,

  accent,
}: {
  items: Reference[]

  labels: ResumeLabels

  accent: string
}) {
  const entries = items.filter((item) =>
    [item.name, item.position, item.organization, item.email, item.phone].some(
      hasValue,
    ),
  )

  if (entries.length === 0) return null

  return (
    <ResumeSection title={labels.references} accent={accent}>
      {entries.map((item) => (
        <article className="resume-item" key={item.id}>
          <div className="resume-item-copy">
            {hasValue(item.name) && <h3 dir="auto">{item.name.trim()}</h3>}
            {[item.position, item.organization].some(hasValue) && (
              <b dir="auto">
                {[item.position, item.organization]

                  .filter(hasValue)

                  .map((value) => value.trim())

                  .join(" · ")}
              </b>
            )}
            <div className="resume-reference-contact">
              {hasValue(item.email) && (
                <span dir="ltr">
                  <a href={`mailto:${item.email.trim()}`}>
                    {item.email.trim()}
                  </a>
                </span>
              )}
              {hasValue(item.phone) && (
                <span dir="ltr">{item.phone.trim()}</span>
              )}
            </div>
          </div>
        </article>
      ))}
    </ResumeSection>
  )
}

function CustomResumeSection({
  section,

  labels,

  accent,
}: {
  section: CustomResumeSection

  labels: ResumeLabels

  accent: string
}) {
  const entries = section.entries.filter((entry) =>
    [
      entry.title,

      entry.subtitle,

      entry.date,

      entry.description,

      ...entry.fields.flatMap((field) => [field.label, field.value]),
    ].some(hasValue),
  )

  if (!hasValue(section.title) || entries.length === 0) return null

  return (
    <ResumeSection
      title={section.title.trim() || labels.customSection}
      accent={accent}
    >
      {entries.map((entry) => (
        <article className="resume-item" key={entry.id}>
          <div className="resume-item-copy">
            {hasValue(entry.title) && <h3 dir="auto">{entry.title.trim()}</h3>}
            {hasValue(entry.subtitle) && (
              <b dir="auto">{entry.subtitle.trim()}</b>
            )}
            {hasValue(entry.description) && (
              <p className="resume-detail-description" dir="auto">
                {entry.description.trim()}
              </p>
            )}
            {entry.fields.some((field) =>
              [field.label, field.value].some(hasValue),
            ) && (
              <dl className="resume-custom-fields">
                {entry.fields

                  .filter((field) => [field.label, field.value].some(hasValue))

                  .map((field) => (
                    <div key={field.id}>
                      {hasValue(field.label) && (
                        <dt dir="auto">{field.label.trim()}</dt>
                      )}
                      {hasValue(field.value) && (
                        <dd dir="auto">{field.value.trim()}</dd>
                      )}
                    </div>
                  ))}
              </dl>
            )}
          </div>
          {hasValue(entry.date) && (
            <span className="resume-period" dir="auto">
              {entry.date.trim()}
            </span>
          )}
        </article>
      ))}
    </ResumeSection>
  )
}

function OrderedResumeSections({
  props,

  labels,

  accent,

  templateId,
}: {
  props: ResumeTemplateProps

  labels: ResumeLabels

  accent: string

  templateId: TemplateId
}) {
  const hidden = new Set(props.sectionLayout.hidden)

  const customSections = new Map(
    props.customSections.map((section) => [section.id, section]),
  )

  const sectionOrder = [
    ...new Set([
      ...props.sectionLayout.order,

      ...defaultResumeSectionOrder,

      ...props.customSections.map((section) => `custom:${section.id}` as const),
    ]),
  ]

  const skillsVariant =
    templateId === "developer"
      ? "technical"
      : templateId === "creative" ||
          templateId === "student" ||
          templateId === "modern"
        ? "tags"
        : "plain"

  return (
    <>
      {sectionOrder.map((sectionId) => {
        if (hidden.has(sectionId)) return null

        let content: ReactNode = null

        switch (sectionId) {
          case "summary":
            content = (
              <SummarySection
                {...props}
                labels={labels}
                accent={accent}
                className={
                  templateId === "executive"
                    ? "resume-executive-summary"
                    : undefined
                }
              />
            )

            break

          case "experience":
            content = (
              <ExperienceSection
                experiences={props.experiences}
                labels={labels}
                accent={accent}
              />
            )

            break

          case "education":
            content = (
              <EducationSection
                education={props.education}
                labels={labels}
                accent={accent}
              />
            )

            break

          case "skills":
            content = (
              <SkillsSection
                skills={props.skills}
                labels={labels}
                accent={accent}
                variant={skillsVariant}
              />
            )

            break

          case "projects":
            content = (
              <ProjectSection
                projects={props.projects}
                labels={labels}
                accent={accent}
              />
            )

            break

          case "certifications":
            content = (
              <CertificationSection
                certifications={props.certifications}
                labels={labels}
                accent={accent}
              />
            )

            break

          case "languages":
            content = (
              <LanguagesSection
                items={props.languages}
                labels={labels}
                accent={accent}
              />
            )

            break

          case "awards":
            content = (
              <AwardsSection
                items={props.awards}
                labels={labels}
                accent={accent}
              />
            )

            break

          case "volunteer":
            content = (
              <VolunteerSection
                items={props.volunteerExperiences}
                labels={labels}
                accent={accent}
              />
            )

            break

          case "publications":
            content = (
              <PublicationsSection
                items={props.publications}
                labels={labels}
                accent={accent}
              />
            )

            break

          case "references":
            content = (
              <ReferencesSection
                items={props.references}
                labels={labels}
                accent={accent}
              />
            )

            break

          default: {
            const section = sectionId.startsWith("custom:")
              ? customSections.get(sectionId.slice("custom:".length))
              : undefined

            if (section) {
              content = (
                <CustomResumeSection
                  section={section}
                  labels={labels}
                  accent={accent}
                />
              )
            }
          }
        }

        if (!content) return null

        return (
          <div
            className="resume-section-shell"
            data-resume-section={sectionId}
            key={sectionId}
          >
            {content}
          </div>
        )
      })}
    </>
  )
}

function getTemplateAccent(props: ResumeTemplateProps, fallback: string) {
  return props.primaryColor || fallback
}

export function AtsResumeTemplate(props: ResumeTemplateProps) {
  const labels = getLabels(props.documentLanguage)

  const accent = "#263238"

  return (
    <div className="resume-layout resume-layout-ats">
      <ResumeHeader
        props={props}
        labels={labels}
        variant="ats"
        showPhoto={false}
      />
      <main className="resume-main">
        <OrderedResumeSections
          props={props}
          labels={labels}
          accent={accent}
          templateId="ats"
        />
      </main>
    </div>
  )
}

export function DeveloperResumeTemplate(props: ResumeTemplateProps) {
  const labels = getLabels(props.documentLanguage)

  const accent = getTemplateAccent(props, "#17657a")

  return (
    <div className="resume-layout resume-layout-developer">
      <ResumeHeader
        props={props}
        labels={labels}
        variant="technical"
        showPhoto={false}
      />
      <main className="resume-main">
        <OrderedResumeSections
          props={props}
          labels={labels}
          accent={accent}
          templateId="developer"
        />
      </main>
    </div>
  )
}

export function MinimalistResumeTemplate(props: ResumeTemplateProps) {
  const labels = getLabels(props.documentLanguage)

  const accent = getTemplateAccent(props, "#6b6258")

  return (
    <div className="resume-layout resume-layout-minimalist">
      <ResumeHeader props={props} labels={labels} variant="centered" />
      <main className="resume-main">
        <OrderedResumeSections
          props={props}
          labels={labels}
          accent={accent}
          templateId="minimalist"
        />
      </main>
    </div>
  )
}

export function CreativeResumeTemplate(props: ResumeTemplateProps) {
  const labels = getLabels(props.documentLanguage)

  const accent = getTemplateAccent(props, "#a64f38")

  return (
    <div className="resume-layout resume-layout-creative">
      <ResumeHeader props={props} labels={labels} variant="creative" />
      <main className="resume-main">
        <OrderedResumeSections
          props={props}
          labels={labels}
          accent={accent}
          templateId="creative"
        />
      </main>
    </div>
  )
}

export function StudentResumeTemplate(props: ResumeTemplateProps) {
  const labels = getLabels(props.documentLanguage)

  const accent = getTemplateAccent(props, "#49658a")

  return (
    <div className="resume-layout resume-layout-student">
      <ResumeHeader
        props={props}
        labels={labels}
        variant="technical"
        showPhoto={false}
      />
      <main className="resume-main">
        <OrderedResumeSections
          props={props}
          labels={labels}
          accent={accent}
          templateId="student"
        />
      </main>
    </div>
  )
}

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

export function ExecutiveResumeTemplate(props: ResumeTemplateProps) {
  const labels = getLabels(props.documentLanguage)

  const accent = getTemplateAccent(props, "#3d3430")

  return (
    <div className="resume-layout resume-layout-executive">
      <ResumeHeader props={props} labels={labels} variant="executive" />
      <main className="resume-main">
        <OrderedResumeSections
          props={props}
          labels={labels}
          accent={accent}
          templateId="executive"
        />
      </main>
    </div>
  )
}

export function ModernResumeTemplate(props: ResumeTemplateProps) {
  const labels = getLabels(props.documentLanguage)

  const accent = getTemplateAccent(props, "#2f6b5f")

  return (
    <div className="resume-layout resume-layout-modern">
      <ResumeHeader props={props} labels={labels} variant="dark" />
      <main className="resume-main">
        <OrderedResumeSections
          props={props}
          labels={labels}
          accent={accent}
          templateId="modern"
        />
      </main>
    </div>
  )
}

export function ClassicResumeTemplate(props: ResumeTemplateProps) {
  const labels = getLabels(props.documentLanguage)

  const accent = getTemplateAccent(props, "#343b45")

  return (
    <div className="resume-layout resume-layout-classic">
      <ResumeHeader
        props={props}
        labels={labels}
        variant="centered"
        showPhoto={false}
      />
      <main className="resume-main">
        <OrderedResumeSections
          props={props}
          labels={labels}
          accent={accent}
          templateId="classic"
        />
      </main>
    </div>
  )
}
