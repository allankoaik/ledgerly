# Ledgerly — AI accounting firm landing page

A one-page marketing site for **Ledgerly**, a fictional AI-powered accounting firm, built as a portfolio project.

The hero started from a 21st.dev component and was rebuilt around the brand: an isometric stack of five accounting documents (bank statement, ledger, AI bookkeeper, invoice, report) that opens into a five-stage workflow when you hover it.

## Highlights

- **Interactive document stack:** hover the core and the pages lift apart, each linked to a stage card. The page under your pointer takes the green glow, scan rings and lift, and its card grows to match. Everything runs on springs, so it eases instead of snapping.
- **Full landing page:** Product, How it works, Solutions, Pricing, an FAQ and a "Book a free call" form, with sections that fade up as you scroll.
- **Accessible by default:** native `details`/`summary` for the FAQ, form errors shown only after you interact (`:user-invalid`) and mirrored to `aria-invalid`, WCAG AA contrast on buttons, and reduced-motion support throughout.
- **Responsive:** checked from 375px phones to wide desktops.

## Built with

- [Next.js 16](https://nextjs.org) (App Router) and React 19
- TypeScript
- Tailwind CSS v4
- [Motion](https://motion.dev) for the springs and scroll reveals
- [Lucide](https://lucide.dev) icons and the Onest font

## Run it locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Project structure

- `src/components/ui/ledgerly-hero.tsx`: nav, hero copy and the animated document stack
- `src/components/ui/ledgerly-sections.tsx`: every section below the hero, plus the footer
- `src/app/`: page, layout, global styles and the favicon

---

Ledgerly is a fictional company. The pricing, features and copy are for demonstration only, and the contact form is not connected to a server.
