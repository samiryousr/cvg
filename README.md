# cvg

**cvg** is a bilingual Arabic/English ATS-friendly resume builder with live preview, cloud save, and PDF export.

**Live Demo:** (https://cvg-six.vercel.app/)

## Screenshot Placeholder

![cvg Editor](./public/screenshots/editor.png)

## Key Features

- Real-time live preview with multiple ATS-focused and professional templates.
- Built-in ATS resume checker to improve content readiness.
- Independent Arabic/English document support with RTL/LTR layouts.
- Browser localStorage autosave plus Supabase cloud persistence for signed-in users.
- PDF export through the print dialog or `html2pdf.js`, with A4 formatting.
- Editable resume sections for experience, education, skills, projects, and more.

## Tech Stack

- Next.js 16, React 19, and TypeScript
- Tailwind CSS 4
- Zustand
- Supabase
- `html2pdf.js`
- Vitest

## Run Locally

```bash
git clone <repository-url>
cd cvg
npm install
```

Create `.env.local` with the required Supabase public keys:

```env
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

```bash
npm run dev
```
