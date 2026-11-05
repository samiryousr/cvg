# Sirti Resume Builder

Sirti is a local-first resume builder for creating, editing, and printing professional CVs in Arabic or English. It is built with the Next.js App Router, React, TypeScript, Zustand, and Tailwind CSS v4.

## Project Overview

The application has two routes:

- `/` — landing page and template gallery.
- `/templates` — full-page gallery of all available templates.
- `/editor` — resume editor. An optional `template` query parameter selects a template, for example `/editor?template=modern`.

Resume content and preferences are stored in the browser's `localStorage`. The application does not send resume data to a backend. Zustand persistence includes normalization for missing or malformed saved data to support safer hydration and backward compatibility.

## Key Features

- Nine resume templates: ATS Classic, Tech / Developer, Modern Minimal, Creative / Designer, Student / Graduate, Professional Corporate, Executive, Modern, and Classic.
- Live preview that updates as resume content changes.
- A realistic, editable frontend developer starter resume for first-time users.
- Arabic and English resume documents, with RTL/LTR direction handled independently from the editor interface language.
- Editable sections, including experience, education, skills, projects, certifications, languages, awards, volunteer experience, publications, references, and custom sections.
- Local autosave using Zustand `persist`, with defensive normalization of stored resume data.
- ATS template export uses the browser print dialog to retain selectable text in the PDF; other templates export with `html2pdf.js`. Both use A4 sizing.
- Light and dark application themes.

## Getting Started

Requirements: Node.js and pnpm.

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Other commands:

```bash
pnpm build
pnpm start
pnpm format
```

## Project Architecture

```text
src/
├── app/
│   ├── editor/
│   │   └── page.tsx                 Editor route and template query handling
│   ├── templates/
│   │   └── page.tsx                 Full-page template gallery
│   ├── layout.tsx                   Root document, metadata, and application shell
│   ├── page.tsx                     Landing page route
│   └── globals.css                  Global, landing, editor, template, and print styles
├── components/
│   ├── landing/
│   │   ├── LandingPage.tsx          Landing page and template selection
│   │   ├── MiniResume.tsx           Compact template previews
│   │   └── TemplatesGallery.tsx     Full gallery and template selection
│   ├── resume-builder/
│   │   ├── templates/
│   │   │   ├── *Template.tsx        Individual resume template components
│   │   │   └── shared-sections.tsx  Shared resume sections and rendering helpers
│   │   ├── LiveResumePreview.tsx    Store-connected live preview
│   │   ├── ResumeEditor.tsx         Editor layout, controls, and print action
│   │   ├── ResumeEditorFields.tsx   Personal and resume entry fields
│   │   ├── ResumeEditorRoute.tsx    Applies a selected template after hydration
│   │   ├── ResumeSectionManager.tsx Section editing, visibility, and ordering
│   │   └── ResumeTemplates.tsx      Compatibility exports for template components
│   ├── AppShell.tsx                 Store hydration and persisted theme wrapper
│   ├── LoadingScreen.tsx            Loading state
│   └── ThemeToggle.tsx              Light/dark theme control
└── features/
    └── resume-builder/
        ├── model.ts                 Resume data types and default values
        ├── store.ts                 Zustand state, actions, and persistence
        └── template-registry.ts     Template metadata and renderer registry
```

### Data and rendering flow

Resume types and the first-time sample resume are defined in `model.ts`, alongside blank defaults used when normalizing malformed or legacy persisted data. The Zustand store in `store.ts` is the source of truth for resume content and configuration, and persists the data locally. Editor fields and section controls update that store; `LiveResumePreview.tsx` reads from the same store and selects a renderer from `template-registry.ts`. Individual renderers share section, header, and ordering logic from `templates/shared-sections.tsx`.

## Local Data and PDF Export

Saved resumes are available only in the same browser profile and device. Clearing browser storage removes the saved data. For ATS templates, PDF export uses the browser's print dialog; choose **Save as PDF** to retain selectable text. Other templates are generated with `html2pdf.js`. Output and pagination can vary by browser, fonts, and print settings.
