# Next.js App Router

This project uses Next.js App Router, React, TypeScript, and Tailwind CSS v4.

## Project structure

- `src/app/layout.tsx` defines the Arabic document shell and page metadata.
- `src/app/page.tsx` selects between the landing page, loading state, and resume editor.
- `src/components/landing/` contains the landing page and template preview.
- `src/components/resume-builder/ResumeEditor.tsx` owns the editor layout and controls.
- `src/components/resume-builder/ResumeEditorFields.tsx` contains memoized, store-connected form fields and image upload.
- `src/components/resume-builder/LiveResumePreview.tsx` renders the CV from narrow Zustand selectors.
- `src/features/resume-builder/model.ts` defines template types, template choices, and starter resume data.
- `src/features/resume-builder/store.ts` defines the Zustand store and localStorage persistence.
- `src/app/globals.css` contains Tailwind and the app's global styles.
- `postcss.config.mjs` configures Tailwind CSS v4 through `@tailwindcss/postcss`.

The editor uses focused Zustand selectors for controlled inputs and the live preview. Resume data is persisted to this browser's localStorage; it is not synced to a server. PDF export uses the browser print dialog with A4 print styles.

## Development

- `npm run dev` starts the Next.js development server.
- `npm run build` creates a production build.
- `npm run start` serves a production build.

Use Tailwind utility classes directly in JSX. Keep CSS imports at the top of `src/app/globals.css`, and put global element styles inside `@layer base` so utility classes can override them.
