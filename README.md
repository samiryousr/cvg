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
- Optional Supabase email/password authentication and explicit cloud resume saving, with local autosave retained.

## Getting Started

Requirements: Node.js and pnpm.

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Supabase authentication setup

1. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from the Supabase project API settings. These are public client values; never put a `service_role` key in a `NEXT_PUBLIC_` variable.
2. In Supabase, enable the Email provider and configure the project Site URL and allowed redirect URLs for your local and production app.
3. Restart the Next.js server after changing environment variables.
4. Open `/auth` to create an account, sign in, or sign out. Supabase persists the session in the browser; the root app shell initializes the Zustand auth slice and listens for auth changes.

The shared navigation shows a sign-in link when signed out and the user's account menu when signed in. Authenticated users can visit `/resumes` to continue their latest created resume or start a new one. Resume content continues to autosave to local storage. Signed-in users can use **Save to account** in the editor to save a cloud copy; subsequent saves update that record. The store's `saveCurrentResume` and `loadUserResume` actions call the services in `src/services/resumeService.ts`. The cloud table must use the following columns and policies:

```sql
create table public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null default 'My resume',
  resume_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.resumes enable row level security;

create policy "Users can read their resumes"
  on public.resumes for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can create their resumes"
  on public.resumes for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update their resumes"
  on public.resumes for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete their resumes"
  on public.resumes for delete to authenticated
  using ((select auth.uid()) = user_id);
```

Other commands:

```bash
pnpm build
pnpm start
pnpm format
pnpm test
```

## Project Architecture

```text
src/
├── app/
│   ├── auth/
│   │   └── page.tsx                 Email/password sign-in and sign-up
│   ├── editor/
│   │   └── page.tsx                 Editor route and template query handling
│   ├── templates/
│   │   └── page.tsx                 Full-page template gallery
│   ├── layout.tsx                   Root document, metadata, and application shell
│   ├── page.tsx                     Landing page route
│   └── globals.css                  Global, landing, editor, template, and print styles
├── components/
│   ├── Auth.tsx                     Authentication form and account actions
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
├── store/
│   └── useAuthStore.ts              Supabase session state and auth actions
└── features/
    └── resume-builder/
        ├── model.ts                 Resume data types and default values
        ├── store.ts                 Zustand state, actions, and persistence
        └── template-registry.ts     Template metadata and renderer registry
```

### Data and rendering flow

Resume types and the first-time sample resume are defined in `model.ts`, alongside blank defaults used when normalizing malformed or legacy persisted data. The Zustand store in `store.ts` is the source of truth for resume content and configuration, and persists the data locally. Editor fields and section controls update that store; `LiveResumePreview.tsx` reads from the same store and selects a renderer from `template-registry.ts`. Individual renderers share section, header, and ordering logic from `templates/shared-sections.tsx`.

Store updates sanitize control characters and enforce text limits. Personal information validation reports missing names and malformed email addresses, and persisted profile photos are restricted to supported base64 image data URLs. Persistence migration, normalization, CRUD actions, and validation are covered by Vitest.

## Local Data and PDF Export

Saved resumes are available only in the same browser profile and device. Clearing browser storage removes the saved data. For ATS templates, PDF export uses the browser's print dialog; choose **Save as PDF** to retain selectable text. Other templates are generated with `html2pdf.js`. Output and pagination can vary by browser, fonts, and print settings.

Authentication and explicit cloud resume saving are handled by Supabase, while local autosave remains enabled. Cloud saving requires the configured `resumes` table and owner-scoped RLS policies described above.
