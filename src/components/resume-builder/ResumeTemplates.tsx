import Image from "next/image"

import type { ReactNode } from "react"

import type { ResumeData } from "@/features/resume-builder/model"

export type ResumeTemplateProps = Pick<ResumeData, "personal" | "summary" | "experiences" | "education" | "projects" | "certifications" | "skills"> & {
  primaryColor: string
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

function ResumeContact({ personal }: Pick<ResumeTemplateProps, "personal">) {
  const contacts = [
    personal.phone && { label: "Phone", value: personal.phone },
    personal.email && {
      label: "Email",
      value: personal.email,
      href: `mailto:${personal.email}`,
    },
    personal.location && { label: "Location", value: personal.location },
    personal.github && {
      label: "GitHub",
      value: personal.github,
      href: getExternalUrl(personal.github),
    },
    personal.linkedIn && {
      label: "LinkedIn",
      value: personal.linkedIn,
      href: getExternalUrl(personal.linkedIn),
    },
  ].filter((contact) => contact !== "")

  return (
    <div className="resume-contact-line" aria-label="Contact information">
      {contacts.map((contact, index) => {
        if (!contact) return null

        return (
          <span key={`${contact.label}-${index}`} dir="auto">
            {contact.label}:{" "}
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

function ResumeSection({
  title,

  accent,

  children,
}: {
  title: string

  accent: string

  children: ReactNode
}) {
  return (
    <section className="resume-section">
      <h2 style={{ borderColor: accent }}>{title}</h2>
      {children}
    </section>
  )
}

function ResumeHeader({
  personal,

  accent,

  showPhoto = true,
}: Pick<ResumeTemplateProps, "personal" | "primaryColor"> & {
  accent?: string

  showPhoto?: boolean
}) {
  return (
    <header style={accent ? { borderColor: accent } : undefined}>
      {showPhoto && personal.photoUrl ? (
        <Image
          className="resume-photo"
          src={personal.photoUrl}
          alt={`Photo of ${personal.name}`}
          width={512}
          height={512}
          unoptimized
        />
      ) : showPhoto ? (
        <div
          className="resume-monogram"
          style={{ background: accent ?? "#2f6b5f" }}
          aria-hidden="true"
        >
          {personal.name.charAt(0) || "?"}
        </div>
      ) : null}
      <div>
        <h1>{personal.name || "Your Name"}</h1>
        <p style={{ color: accent }}>{personal.role || "Job Title"}</p>
        {!showPhoto && <ResumeContact personal={personal} />}
      </div>
    </header>
  )
}

function ContactSection({
  accent,

  personal,

  primaryColor,
}: Pick<ResumeTemplateProps, "personal" | "primaryColor"> & {
  accent?: string
}) {
  const sectionAccent = accent ?? primaryColor

  return (
    <ResumeSection title="Contact" accent={sectionAccent}>
      {personal.email && <p>{personal.email}</p>}
      {personal.phone && <p>{personal.phone}</p>}
      {personal.location && <p>{personal.location}</p>}
      {personal.github && <p dir="auto">GitHub: {personal.github}</p>}
      {personal.linkedIn && <p dir="auto">LinkedIn: {personal.linkedIn}</p>}
    </ResumeSection>
  )
}

function SkillsSection({
  accent,

  skills,
}: Pick<ResumeTemplateProps, "primaryColor" | "skills"> & {
  accent?: string
}) {
  const sectionAccent = accent ?? "#2f6b5f"

  if (skills.length === 0) return null

  return (
    <ResumeSection title="Technical Skills" accent={sectionAccent}>
      <div className="skill-list">
        {skills.map((skill, index) => (
          <span key={`${skill}-${index}`}>{skill}</span>
        ))}
      </div>
    </ResumeSection>
  )
}

function ResumeMainSections({
  accent,

  summary,

  experiences,

  projects,
}: Pick<ResumeTemplateProps, "summary" | "experiences" | "projects" | "primaryColor"> & {
  accent?: string
}) {
  const sectionAccent = accent ?? "#2f6b5f"

  return (
    <>
      {summary && (
        <ResumeSection title="Professional Summary" accent={sectionAccent}>
          <p className="summary">{summary}</p>
        </ResumeSection>
      )}
      {experiences.length > 0 && (
        <ResumeSection title="Professional Experience" accent={sectionAccent}>
          {experiences.map((experience) => (
            <div className="resume-item" key={experience.id}>
              <div className="resume-item-copy">
                <h3>{experience.job}</h3>
                <b style={{ color: accent }}>{experience.company}</b>
                {experience.description && (
                  <ul className="resume-bullets">
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
              <span dir="auto">{experience.period}</span>
            </div>
          ))}
        </ResumeSection>
      )}
      {projects.length > 0 && (
        <ResumeSection title="Projects" accent={sectionAccent}>
          {projects.map((project) => (
            <div className="resume-item" key={project.id}>
              <div className="resume-item-copy">
                <h3>{project.name}</h3>
                {project.stack && (
                  <b className="resume-project-stack" dir="auto">
                    {project.stack}
                  </b>
                )}
                {project.description && (
                  <ul className="resume-bullets">
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
                {project.url && (
                  <p className="resume-project-url" dir="ltr">
                    {project.url}
                  </p>
                )}
              </div>
              <span dir="auto">{project.period}</span>
            </div>
          ))}
        </ResumeSection>
      )}
    </>
  )
}

function ResumeEducationSections({
  education,
  certifications,
  accent,
}: Pick<ResumeTemplateProps, "education" | "certifications"> & {
  accent: string
}) {
  return (
    <>
      {education.length > 0 && (
        <ResumeSection title="Education" accent={accent}>
          {education.map((item) => (
            <div className="resume-item" key={item.id}>
              <div className="resume-item-copy">
                <h3>{item.degree}</h3>
                <b>{item.school}</b>
              </div>
              <span dir="auto">{item.period}</span>
            </div>
          ))}
        </ResumeSection>
      )}
      {certifications.length > 0 && (
        <ResumeSection title="Certifications" accent={accent}>
          {certifications.map((certification) => (
            <div className="resume-item" key={certification.id}>
              <div className="resume-item-copy">
                <h3>{certification.name}</h3>
                <b>{certification.issuer}</b>
              </div>
              <span dir="auto">{certification.period}</span>
            </div>
          ))}
        </ResumeSection>
      )}
    </>
  )
}

export function ModernResumeTemplate(props: ResumeTemplateProps) {
  const { primaryColor, personal } = props

  return (
    <>
      <ResumeHeader
        personal={personal}
        primaryColor={primaryColor}
        accent={primaryColor}
      />
      <div className="resume-content">
        <aside style={{ background: `${primaryColor}0d` }}>
          <ContactSection {...props} accent={primaryColor} />
          <SkillsSection {...props} accent={primaryColor} />
        </aside>
        <main>
          <ResumeMainSections {...props} accent={primaryColor} />
          <ResumeEducationSections {...props} accent={primaryColor} />
        </main>
      </div>
    </>
  )
}

export function ClassicResumeTemplate(props: ResumeTemplateProps) {
  const { primaryColor, personal } = props

  return (
    <>
      <ResumeHeader
        personal={personal}
        primaryColor={primaryColor}
        accent={primaryColor}
      />
      <div className="resume-content">
        <aside>
          <ContactSection {...props} accent={primaryColor} />
          <SkillsSection {...props} accent={primaryColor} />
        </aside>
        <main>
          <ResumeMainSections {...props} accent={primaryColor} />
          <ResumeEducationSections {...props} accent={primaryColor} />
        </main>
      </div>
    </>
  )
}

export function MinimalistResumeTemplate(props: ResumeTemplateProps) {
  const { primaryColor, personal } = props

  return (
    <>
      <ResumeHeader
        personal={personal}
        primaryColor={primaryColor}
        accent={primaryColor}
      />
      <div className="resume-content">
        <main>
          <ContactSection {...props} accent={primaryColor} />
          <ResumeMainSections {...props} accent={primaryColor} />
          <SkillsSection {...props} accent={primaryColor} />
          <ResumeEducationSections {...props} accent={primaryColor} />
        </main>
      </div>
    </>
  )
}

export function AtsResumeTemplate(props: ResumeTemplateProps) {
  return (
    <>
      <ResumeHeader
        personal={props.personal}
        primaryColor="#263238"
        showPhoto={false}
      />
      <main className="resume-ats-content">
        <ResumeMainSections {...props} accent="#263238" />
        <SkillsSection {...props} accent="#263238" />
        <ResumeEducationSections {...props} accent="#263238" />
      </main>
    </>
  )
}
