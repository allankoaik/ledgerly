'use client'

import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import type { CSSProperties, MouseEvent, PointerEvent as ReactPointerEvent, ReactElement, ReactNode, SVGProps } from 'react'
import { AnimatePresence, LazyMotion, animate, domAnimation, m, useInView, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import type { MotionValue } from 'motion/react'
import {
  ArrowDownToLine,
  ArrowLeftRight,
  ArrowRight,
  BellRing,
  BookOpen,
  ChartColumnBig,
  ChartNoAxesColumnIncreasing,
  Clock,
  CircleCheck,
  CreditCard,
  FileText,
  Landmark,
  ListTree,
  Menu,
  MousePointer2,
  NotebookPen,
  Play,
  Receipt,
  RefreshCw,
  Scale,
  ShieldCheck,
  Tags,
  TrendingUp,
  TriangleAlert,
  Wallet,
  Workflow,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Brand colours. Everything in the brand colour (buttons, glow, page highlights, orbit beads,
// the cursor spotlight) is drawn from these four, so changing them re-colours the whole hero.

const PALETTE = {
  accent: '#62BD34',
  light: '#A3DA7E',
  pale: '#E4F4D8',
  deep: '#3D7D1F' // a darker shade, for lines and shadows
}

// The hero's stylesheet, inlined so the whole hero lives in one file.
const BLOCK_CSS = `
:root {
  --color-n3-page: #f8f7f3;
  --color-n3-ink: #171717;
  --color-n3-grey: #74716c;
  --color-n3-line: #d9d6d0;
  --color-n3-accent: ${PALETTE.accent};

  /* The darker green, for fills that carry white text (about 5:1 contrast, so it passes WCAG AA). */
  --color-n3-accent-deep: ${PALETTE.deep};

  /* Onest, loaded with next/font in app/layout.tsx (exposed as --font-onest). */
  --font-n3-sans: var(--font-onest), 'Onest', ui-sans-serif, system-ui, sans-serif;
}

/* Tokens are named for their role, so the markup survives a palette change. */

/* ---------- One alignment system: the nav and the hero share it ---------- */
.n3-root {
  --n3-gutter: 20px;
  --n3-nav-space: 76px; /* replaced by the measured height of the real nav */
}

@media (min-width: 640px) {
  .n3-root {
    --n3-gutter: 32px;
  }
}

@media (min-width: 1024px) {
  .n3-root {
    --n3-gutter: 56px;
  }
}

.n3-frame {
  padding-left: var(--n3-gutter);
  padding-right: var(--n3-gutter);
}

/* dvh, not vh: on mobile 100vh is the large viewport and would overflow under the URL bar. */
.n3-hero {
  min-height: calc(100dvh - var(--n3-nav-space));
}

@media (max-width: 1023px) {
  .n3-hero {
    min-height: 0;
  }
}

/* ---------- Type ---------- */
.n3-h1 {
  font-size: clamp(2.5rem, 1.1rem + 3.6vw, 4.35rem);
  line-height: 1.06;
  letter-spacing: -0.035em;
}

/* ---------- Background: warm paper, one soft light behind the visual ---------- */
.n3-bg {
  background:
    radial-gradient(ellipse 60% 70% at 74% 52%, rgb(255 255 255 / 0.95) 0%, rgb(255 255 255 / 0) 70%),
    radial-gradient(ellipse 40% 45% at 78% 58%, color-mix(in srgb, var(--color-n3-accent) 7%, transparent) 0%, color-mix(in srgb, var(--color-n3-accent) 0%, transparent) 70%),
    radial-gradient(ellipse 50% 40% at 100% 0%, rgb(233 230 223 / 0.7) 0%, rgb(233 230 223 / 0) 70%),
    var(--color-n3-page);
}

.n3-halo {
  border-radius: 9999px;
  background: radial-gradient(closest-side, rgb(255 255 255 / 0.9), rgb(255 255 255 / 0));
}

/* The floor grid runs under the whole hero: clearest beneath the visual and along the bottom,
   dissolving toward the top left so the headline sits on clean paper. */
.n3-floor,
.n3-floor-lit {
  --n3-floor-area: radial-gradient(ellipse 75% 80% at 72% 70%, #000 20%, transparent 100%);

  /* The lines also dissolve into the right edge and the bottom of the hero instead of stopping. */
  --n3-floor-edges:
    linear-gradient(to left, transparent 0%, #000 22%), linear-gradient(to top, transparent 0%, #000 28%);

  -webkit-mask-image: var(--n3-floor-area), var(--n3-floor-edges);
  mask-image: var(--n3-floor-area), var(--n3-floor-edges);
  -webkit-mask-composite: source-in;
  mask-composite: intersect;
}

.n3-floor {
  opacity: 0.35;
}

/* The spotlight: a soft round window onto an orange copy of the grid. Both move by transform
   only (see hero-floor.tsx), so following the cursor costs no repaints. */
.n3-floor-spot {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  transition: opacity 400ms ease;
  will-change: transform, opacity;
  -webkit-mask-image: radial-gradient(closest-side, #000 0%, transparent 100%);
  mask-image: radial-gradient(closest-side, #000 0%, transparent 100%);
}

.n3-floor-lit {
  position: absolute;
  top: 0;
  left: 0;
  will-change: transform;
}

[data-spot='on'] > .n3-floor-spot {
  opacity: 0.7;
}

@media (max-width: 1023px) {
  .n3-floor,
  .n3-floor-lit {
    --n3-floor-area: radial-gradient(ellipse 90% 60% at 50% 75%, #000 20%, transparent 100%);
  }
}

/* The orbits and construction lines dissolve toward the copy instead of running under it. */
.n3-fade-edge {
  -webkit-mask-image: linear-gradient(to right, transparent 0%, #000 14%);
  mask-image: linear-gradient(to right, transparent 0%, #000 14%);
}

@media (max-width: 1023px) {
  .n3-fade-edge {
    -webkit-mask-image: none;
    mask-image: none;
  }
}

/* ---------- Nav ---------- */
/* backdrop-filter doesn't transition, so the background and border fade and the blur switches. */
.n3-nav-bar {
  border-bottom: 1px solid transparent;
  transition:
    background-color 300ms ease,
    border-color 300ms ease;
}

.n3-nav-bar-scrolled {
  background-color: rgb(248 247 243 / 0.78);
  border-bottom-color: rgb(23 23 23 / 0.06);
  -webkit-backdrop-filter: blur(14px);
  backdrop-filter: blur(14px);
}

/* ---------- Label flip: every button's label turns over like a cube on hover ---------- */
/* Two identical faces of a cube --d deep: the label in front, its twin on the bottom face.
   The button never moves; only the cube rotates about its horizontal axis. */
.n3-flip {
  perspective: 600px;
}

.n3-flip-box {
  --d: 0.75em;
  display: inline-grid;
  transform-style: preserve-3d;
  transform: translateZ(calc(var(--d) * -1)) rotateX(0deg);
  transition: transform 550ms cubic-bezier(0.22, 1, 0.36, 1);
}

.n3-flip-face {
  grid-area: 1 / 1;
  display: inline-flex;
  height: 1.5em;
  white-space: nowrap;
  align-items: center;
  justify-content: center;
  line-height: 1.5em;
  backface-visibility: hidden;
  transform: translateZ(var(--d));
}

.n3-flip-back {
  transform: rotateX(-90deg) translateZ(var(--d));
}

.n3-flip:hover .n3-flip-box,
.n3-flip:focus-visible .n3-flip-box {
  transform: translateZ(calc(var(--d) * -1)) rotateX(90deg);
}

@media (prefers-reduced-motion: reduce) {
  .n3-flip-box {
    transition: none;
  }

  .n3-flip:hover .n3-flip-box,
  .n3-flip:focus-visible .n3-flip-box {
    transform: translateZ(calc(var(--d) * -1));
  }
}

/* ---------- Eyebrow dot ---------- */
.n3-dot {
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-n3-accent) 14%, transparent);
}

/* ---------- Intro ---------- */
/* CSS, not motion: the copy, nav and core play in from the first paint instead of waiting for
   hydration, so the largest text is painted (and LCP recorded) without the JavaScript. Each
   element sets its own animation-delay. Fill \`backwards\`, not \`both\`: a finished animation left
   filling would keep the header a backdrop root and stop the nav bar's blur reaching the page. */
.n3-rise {
  animation: n3-rise 700ms cubic-bezier(0.22, 1, 0.36, 1) backwards;
}

.n3-drop {
  animation: n3-drop 600ms cubic-bezier(0.22, 1, 0.36, 1) backwards;
}

.n3-enter {
  animation: n3-enter 1100ms cubic-bezier(0.22, 1, 0.36, 1) 250ms backwards;
}

@keyframes n3-rise {
  from {
    opacity: 0;
    translate: 0 18px;
  }
}

@keyframes n3-drop {
  from {
    opacity: 0;
    translate: 0 -12px;
  }
}

@keyframes n3-enter {
  from {
    opacity: 0;
    scale: 0.97;
  }
}

@media (prefers-reduced-motion: reduce) {
  .n3-rise,
  .n3-drop,
  .n3-enter {
    animation: none;
  }
}

/* ---------- Core motion: all of it slow, none of it on the same property as a script ---------- */
@keyframes n3-float {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(calc(var(--n3-float, 6) * -1px));
  }
}

.n3-float {
  animation: n3-float var(--n3-float-seconds, 6.5s) ease-in-out infinite alternate;
}

@keyframes n3-seam {
  from {
    opacity: 0.78;
  }
  to {
    opacity: 1;
  }
}

.n3-seam-pulse {
  animation: n3-seam 4.8s ease-in-out infinite alternate;
}

@media (prefers-reduced-motion: reduce) {
  .n3-float,
  .n3-seam-pulse {
    animation: none;
  }
}

/* ---------- Stage cards: light glass that hides the lines behind the type ---------- */
.n3-stage-card {
  border: 1px solid rgb(23 23 23 / 0.06);
  border-radius: 1.3em;
  background: rgb(255 255 255 / 0.82);
  box-shadow:
    0 1px 2px rgb(60 50 40 / 0.04),
    0 14px 34px -18px rgb(90 78 62 / 0.3),
    inset 0 1px 0 rgb(255 255 255 / 0.9);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  transition:
    border-color 300ms ease,
    box-shadow 300ms ease;
}

.n3-stage-card-lit {
  border-color: color-mix(in srgb, var(--color-n3-accent) 35%, transparent);
  box-shadow:
    0 1px 2px rgb(60 50 40 / 0.04),
    0 18px 38px -18px color-mix(in srgb, var(--color-n3-accent) 40%, transparent),
    inset 0 1px 0 rgb(255 255 255 / 0.9);
}

/* On small laptops the visual is too narrow for the app logos beside the text; the cards keep
   their number, icon, title and outputs. */
@container (max-width: 640px) {
  .n3-stage-apps {
    display: none;
  }
}
`

// â”€â”€â”€â”€â”€ Geometry â”€â”€â”€â”€â”€
/**
 * Shared isometric geometry. Every sheet in the stack is a rounded rectangle in a flat plane,
 * projected with the same 2:1 isometric matrix, so the edges, the glow and the print agree.
 */

const ISO_X = 0.866
const ISO_Y = 0.5

const CX = 500
const CY = 500

// Isometric ring flattening (true isometric circle height / width).
const RING_FLATTEN = 0.57

// Horizontal radii of the two orbits around the stack, inner and outer.
const RING_RX = [400, 530] as const

/**
 * One sheet of paper lying flat. halfX is half the page's width (it runs down-right on screen)
 * and halfY half its height (down-left), so the top edge of the page faces the upper right.
 */
type SheetType = {
  halfX: number
  halfY: number

  // corner radius
  radius: number

  // screen y of the page's centre
  top: number

  // paper thickness
  depth: number
}

type Point = [number, number]

// Server and browser can disagree in the last float digit, which React reports as a hydration mismatch.
const round = (n: number) => Math.round(n * 100) / 100

const project = (x: number, y: number, cx = CX, cy = CY): Point => {
  return [cx + (x - y) * ISO_X, cy + (x + y) * ISO_Y]
}

// Rounded rectangle in plane coordinates, walked once around.
const footprint = (halfX: number, halfY: number, radius: number, steps = 6): Point[] => {
  const r = Math.min(radius, halfX, halfY)
  const cx = halfX - r
  const cy = halfY - r

  const corners: [number, number, number][] = [
    [cx, cy, 0],
    [-cx, cy, 90],
    [-cx, -cy, 180],
    [cx, -cy, 270]
  ]

  const pts: Point[] = []

  for (const [ox, oy, start] of corners) {
    for (let i = 0; i <= steps; i++) {
      const a = ((start + (90 * i) / steps) * Math.PI) / 180

      pts.push([ox + r * Math.cos(a), oy + r * Math.sin(a)])
    }
  }

  return pts
}

const toPath = (pts: Point[]) => `M${pts.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join('L')}Z`

// The page's top face. A positive inset shrinks it, a negative one grows it; dy moves it down the screen.
const topPath = (sheet: SheetType, inset = 0, dy = 0) => {
  const outline = footprint(sheet.halfX - inset, sheet.halfY - inset, Math.max(sheet.radius - inset, 1))

  return toPath(outline.map(([x, y]) => project(x, y, CX, sheet.top + dy)))
}

// A vertically extruded convex shape is the convex hull of its top and bottom outlines.
const hull = (points: Point[]): Point[] => {
  const pts = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1])
  const cross = (o: Point, a: Point, b: Point) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])

  const build = (list: Point[]) => {
    const out: Point[] = []

    for (const p of list) {
      while (out.length >= 2 && cross(out[out.length - 2], out[out.length - 1], p) <= 0) out.pop()
      out.push(p)
    }

    out.pop()

    return out
  }

  return [...build(pts), ...build([...pts].reverse())]
}

// The whole sheet, top face and edges, as one outline.
const bodyPath = (sheet: SheetType) => {
  const outline = footprint(sheet.halfX, sheet.halfY, sheet.radius)
  const upper = outline.map(([x, y]) => project(x, y, CX, sheet.top))
  const lower = outline.map(([x, y]) => project(x, y, CX, sheet.top + sheet.depth))

  return toPath(hull([...upper, ...lower]))
}

// Lays a flat drawing onto a page: local x runs across the page, local y down it, (0, 0) is its centre.
const onPage = (sheet: SheetType) => `translate(${CX} ${sheet.top}) matrix(${ISO_X} ${ISO_Y} ${-ISO_X} ${ISO_Y} 0 0)`

const ringPoint = (rx: number, angleDeg: number): Point => {
  const a = (angleDeg * Math.PI) / 180

  return [round(CX + rx * Math.cos(a)), round(CY + rx * RING_FLATTEN * Math.sin(a))]
}

const ringPath = (rx: number) => {
  const ry = rx * RING_FLATTEN

  return `M${CX + rx} ${CY}A${rx} ${ry} 0 1 1 ${CX - rx} ${CY}A${rx} ${ry} 0 1 1 ${CX + rx} ${CY}Z`
}

// â”€â”€â”€â”€â”€ Brand mark: stacked ledger pages â”€â”€â”€â”€â”€
/**
 * Three rounded sheets stepping up and to the right, like the document stack in the hero. Drawn
 * in a 54 Ã— 54 box centred on 0,0. The back sheets are fainter, and the front one carries two
 * ruled lines, so it reads as a ledger page.
 */
const MARK_SHEET = { width: 32, height: 38, radius: 6, step: 6 }

// Back to front: how far each sheet sits from the front one, and how strong it is.
const MARK_LAYERS = [
  { shift: 2, opacity: 0.4 },
  { shift: 1, opacity: 0.68 },
  { shift: 0, opacity: 1 }
]

type LedgerPagesProps = { fill: string; fades?: boolean }

// The pages on their own, for drawing the mark inside another SVG (the nav, the report page).
const LedgerPages = ({ fill, fades = false }: LedgerPagesProps) => {
  const { width, height, radius, step } = MARK_SHEET

  // The front sheet's top-left corner; the whole stack is centred in the box.
  const x0 = -width / 2 - step
  const y0 = -height / 2 + step

  return (
    <>
      {MARK_LAYERS.map(({ shift, opacity }) => (
        <rect
          key={shift}
          x={x0 + shift * step}
          y={y0 - shift * step}
          width={width}
          height={height}
          rx={radius}
          fill={fill}
          opacity={fades ? opacity : shift === 0 ? 1 : 0.55}
        />
      ))}
      {/* The ruled lines on the front page. */}
      <rect x={x0 + 7} y={y0 + 11} width={18} height={4} rx={2} fill='#fff' />
      <rect x={x0 + 7} y={y0 + 20} width={12} height={4} rx={2} fill='#fff' opacity='0.85' />
    </>
  )
}

// â”€â”€â”€â”€â”€ The document stack: sheets and their print â”€â”€â”€â”€â”€
/**
 * Five documents, bottom to top, one per stage: data comes in as a bank statement at the bottom
 * and leaves as a report at the top. At rest they lie in one neat pile; on hover they lift apart.
 */
const PAGE = { halfX: 132, halfY: 176, radius: 8, depth: 6 }

// At rest each sheet sits this far above the one below: its own thickness plus a hair of air.
const STACK_STEP = 9

// Screen y of the top page's centre at rest.
const REST_TOP = 462

const SHEETS: SheetType[] = Array.from({ length: 5 }, (_, i) => ({ ...PAGE, top: REST_TOP + (4 - i) * STACK_STEP }))

// The AI page sits in the middle of the pile, with the brand colour glowing out from under it.
const AI_SHEET = 2

type DocKind = 'statement' | 'ledger' | 'ai' | 'invoice' | 'report'

const DOC_KINDS: DocKind[] = ['statement', 'ledger', 'ai', 'invoice', 'report']

// Print colours: body text is a soft grey, headings a little darker, rules barely there.
const INK = { line: '#E3DFD7', text: '#D2CDC3', head: '#B9B3A8', rule: '#EEEBE5', box: '#F4F2ED' }

type LineProps = { x: number; y: number; w: number; h?: number; fill?: string; opacity?: number }

// One line of "text": a rounded bar, the way a page reads when it is too small to read.
const Line = ({ x, y, w, h = 5, fill = INK.line, opacity }: LineProps) => {
  return <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={fill} opacity={opacity} />
}

// Page 01: a bank statement, rows of transactions with their amounts on the right.
const StatementPrint = () => {
  return (
    <>
      <Line x={-96} y={-136} w={70} h={9} fill={INK.head} />
      <Line x={-96} y={-120} w={110} />
      <circle cx={86} cy={-131} r={8} fill={PALETTE.accent} opacity={0.85} />
      <rect x={-96} y={-100} width={192} height={1.2} fill={INK.rule} />
      {Array.from({ length: 8 }, (_, k) => {
        const y = -84 + k * 26

        return (
          <g key={k}>
            <Line x={-96} y={y} w={56 + ((k * 23) % 50)} />
            <Line x={60} y={y} w={36} fill={k === 2 || k === 5 ? PALETTE.light : INK.text} />
            <rect x={-96} y={y + 15} width={192} height={1} fill={INK.rule} />
          </g>
        )
      })}
      <Line x={-96} y={128} w={50} fill={INK.head} />
      <Line x={42} y={126} w={54} h={8} fill={PALETTE.accent} />
    </>
  )
}

// Page 02: a ledger, three columns of accounts, references and balances.
const LedgerPrint = () => {
  return (
    <>
      <Line x={-96} y={-136} w={84} h={9} fill={INK.head} />
      <rect x={-96} y={-112} width={192} height={22} rx={4} fill={INK.box} />
      <rect x={-96} y={-112} width={192} height={232} rx={4} fill='none' stroke={INK.text} strokeWidth={1} />
      <rect x={-36} y={-112} width={1} height={232} fill={INK.text} />
      <rect x={34} y={-112} width={1} height={232} fill={INK.text} />
      <Line x={-88} y={-104} w={30} fill={INK.head} />
      <Line x={-28} y={-104} w={34} fill={INK.head} />
      <Line x={42} y={-104} w={30} fill={INK.head} />
      {Array.from({ length: 8 }, (_, r) => {
        const y = -90 + r * 26

        return (
          <g key={r}>
            {r > 0 && <rect x={-96} y={y} width={192} height={1} fill={INK.rule} />}
            <Line x={-88} y={y + 10} w={30 + ((r * 17) % 22)} />
            <Line x={-28} y={y + 10} w={40 - ((r * 11) % 18)} />
            <Line x={42} y={y + 10} w={44} fill={r === 7 ? PALETTE.accent : INK.text} />
          </g>
        )
      })}
    </>
  )
}

// A four-point sparkle, the usual sign for "AI did this".
const SPARKLE = 'M0 -10C1 -2 2 -1 10 0C2 1 1 2 0 10C-1 2 -2 1 -10 0C-2 -1 -1 -2 0 -10Z'

// Page 03: a document the AI has read, with the lines it picked out highlighted.
const AiPrint = () => {
  const highlighted = [2, 3, 6, 9]

  return (
    <>
      <Line x={-96} y={-136} w={76} h={9} fill={INK.head} />
      <path d={SPARKLE} transform='translate(84 -131) scale(1.1)' fill={PALETTE.accent} />
      {Array.from({ length: 11 }, (_, k) => {
        const y = -106 + k * 22
        const w = 192 - ((k * 37) % 70)
        const lit = highlighted.includes(k)

        return (
          <g key={k}>
            {lit && <rect x={-100} y={y - 5} width={w + 8} height={15} rx={4} fill={PALETTE.pale} />}
            <Line x={-96} y={y} w={w} fill={lit ? PALETTE.accent : INK.line} opacity={lit ? 0.85 : 1} />
          </g>
        )
      })}
    </>
  )
}

// Page 04: an invoice, its line items ticked off one by one as the workflow runs.
const InvoicePrint = () => {
  return (
    <>
      <Line x={-96} y={-138} w={58} h={12} fill={PALETTE.accent} />
      <Line x={40} y={-136} w={56} fill={INK.text} />
      <Line x={56} y={-124} w={40} />
      <Line x={-96} y={-104} w={80} />
      <Line x={-96} y={-92} w={60} />
      <rect x={-96} y={-72} width={192} height={1.2} fill={INK.rule} />
      {Array.from({ length: 5 }, (_, k) => {
        const y = -56 + k * 28
        const done = k < 3

        return (
          <g key={k}>
            <rect
              x={-96}
              y={y - 3}
              width={11}
              height={11}
              rx={3}
              fill={done ? PALETTE.accent : 'none'}
              stroke={done ? 'none' : INK.text}
              strokeWidth={1}
            />
            {done && (
              <path d={`M${-93.5} ${y + 2.5}l2.5 2.5l4 -5`} fill='none' stroke='#fff' strokeWidth={1.6} strokeLinecap='round' />
            )}
            <Line x={-78} y={y} w={70 + ((k * 29) % 40)} />
            <Line x={64} y={y} w={32} fill={INK.text} />
          </g>
        )
      })}
      <rect x={6} y={92} width={90} height={36} rx={6} fill={PALETTE.pale} />
      <Line x={16} y={100} w={30} fill={INK.head} />
      <Line x={16} y={113} w={64} h={8} fill={PALETTE.accent} />
    </>
  )
}

// Page 05, on top of the pile: the report the whole stack produces, with the brand mark.
const ReportPrint = () => {
  const bars = [38, 56, 48, 78, 92, 116]

  return (
    <>
      <g transform='translate(-84 -127) scale(0.42)'>
        <LedgerPages fill={PALETTE.accent} fades />
      </g>
      <Line x={-66} y={-133} w={70} h={9} fill={INK.head} />
      <Line x={-66} y={-119} w={46} />

      {[-96, 6].map((x, i) => (
        <g key={x}>
          <rect x={x} y={-100} width={90} height={40} rx={6} fill={INK.box} />
          <Line x={x + 9} y={-92} w={40} fill={INK.text} />
          <Line x={x + 9} y={-78} w={i === 0 ? 54 : 44} h={9} fill={i === 0 ? PALETTE.accent : INK.head} />
        </g>
      ))}

      {bars.map((h, k) => (
        <rect
          key={k}
          x={-90 + k * 31}
          y={70 - h}
          width={18}
          height={h}
          rx={4}
          fill={k === bars.length - 1 ? PALETTE.accent : PALETTE.light}
          opacity={k === bars.length - 1 ? 1 : 0.55}
        />
      ))}
      <rect x={-96} y={70} width={192} height={1.2} fill={INK.text} />
      <polyline
        points={bars.map((h, k) => `${-81 + k * 31},${60 - h}`).join(' ')}
        fill='none'
        stroke={PALETTE.deep}
        strokeWidth={2}
        strokeLinejoin='round'
        strokeLinecap='round'
      />
      {bars.map((h, k) => (
        <circle key={k} cx={-81 + k * 31} cy={60 - h} r={2.8} fill='#fff' stroke={PALETTE.deep} strokeWidth={1.5} />
      ))}

      <Line x={-96} y={88} w={150} />
      <Line x={-96} y={102} w={120} />
      <Line x={-96} y={116} w={88} />
    </>
  )
}

const PRINTS: Record<DocKind, () => ReactElement> = {
  statement: StatementPrint,
  ledger: LedgerPrint,
  ai: AiPrint,
  invoice: InvoicePrint,
  report: ReportPrint
}

type SheetProps = { sheet: SheetType; kind: DocKind; index: number; focused: boolean }

// One sheet: its paper edge, its face, and the page printed on it with its stage number.
const Sheet = ({ sheet, kind, index, focused }: SheetProps) => {
  // Vars
  const Print = PRINTS[kind]

  return (
    <g>
      <path d={bodyPath(sheet)} fill='url(#n3-edge)' />
      <path d={bodyPath(sheet)} fill='none' stroke='#D3CEC4' strokeWidth='0.8' />
      <path d={topPath(sheet)} fill='url(#n3-paper)' stroke='#E4E0D8' strokeWidth='0.8' />
      {/* The print is drawn for a 236 x 316 page; scale() fits it to the real page size. */}
      <g transform={`${onPage(sheet)} scale(${(sheet.halfX / 118).toFixed(3)})`}>
        <Print />
        <text
          x={96}
          y={148}
          textAnchor='end'
          fontSize={13}
          fontWeight={600}
          letterSpacing={1.5}
          style={{ fill: focused ? PALETTE.accent : INK.head, transition: 'fill 300ms ease' }}
        >
          {String(index + 1).padStart(2, '0')}
        </text>
      </g>
    </g>
  )
}

const PaperDefs = () => {
  return (
    <defs>
      <linearGradient id='n3-paper' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0' stopColor='#FFFFFF' />
        <stop offset='1' stopColor='#F5F3EE' />
      </linearGradient>
      <linearGradient id='n3-edge' x1='0' y1='0' x2='1' y2='0'>
        <stop offset='0' stopColor='#F1EEE8' />
        <stop offset='0.5' stopColor='#E0DCD3' />
        <stop offset='1' stopColor='#E9E5DD' />
      </linearGradient>
      <linearGradient id='n3-seam' x1='0' y1='0' x2='1' y2='0'>
        <stop offset='0' stopColor={PALETTE.light} />
        <stop offset='0.5' stopColor={PALETTE.accent} />
        <stop offset='1' stopColor={PALETTE.light} />
      </linearGradient>
      <filter id='n3-blur-sm' x='-40%' y='-40%' width='180%' height='180%'>
        <feGaussianBlur stdDeviation='3.5' />
      </filter>
      <filter id='n3-blur-glow' x='-40%' y='-40%' width='180%' height='180%'>
        <feGaussianBlur stdDeviation='9' />
      </filter>
      <filter id='n3-blur-spill' x='-40%' y='-40%' width='180%' height='180%'>
        <feGaussianBlur stdDeviation='18' />
      </filter>
    </defs>
  )
}

// â”€â”€â”€â”€â”€ The stack's shadow â”€â”€â”€â”€â”€
// The soft contact shadow under the pile, laid on the floor plane below the bottom sheet.
const LedgerlyCoreShadow = (props: SVGProps<SVGSVGElement>) => {
  // Vars
  const bottom = SHEETS[0]
  const floor = { ...bottom, top: bottom.top + bottom.depth + 24 }

  return (
    <svg viewBox='0 0 1000 1000' aria-hidden {...props}>
      <defs>
        <filter id='n3-blur-lg' x='-30%' y='-30%' width='160%' height='160%'>
          <feGaussianBlur stdDeviation='26' />
        </filter>
        <filter id='n3-blur-md' x='-30%' y='-30%' width='160%' height='160%'>
          <feGaussianBlur stdDeviation='9' />
        </filter>
      </defs>
      <path d={topPath(floor, -14)} fill='#8A8377' opacity='0.2' filter='url(#n3-blur-lg)' />
      <path d={topPath(floor, 6)} fill='#5D574D' opacity='0.22' filter='url(#n3-blur-md)' />
    </svg>
  )
}

// â”€â”€â”€â”€â”€ Depth backdrop â”€â”€â”€â”€â”€
/**
 * Layers of quiet depth behind the stack: two panes of glass
 * standing behind, and a few loose nodes. All of it very low contrast.
 */
const NODES: [number, number][] = [
  [118, 132],
  [318, 82],
  [690, 96],
  [884, 188],
  [936, 470],
  [70, 512],
  [150, 858],
  [850, 846]
]

const LedgerlyDepthBackdrop = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox='0 0 1000 1000' aria-hidden {...props}>
      <defs>
        <linearGradient id='n3-glass' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0' stopColor='#fff' stopOpacity='0.7' />
          <stop offset='1' stopColor='#fff' stopOpacity='0.12' />
        </linearGradient>
      </defs>

      <g fill='url(#n3-glass)' stroke='#E3E0D9' strokeWidth='1' opacity='0.35'>
        <rect width='290' height='250' rx='22' transform='matrix(0.866 -0.5 0 1 232 300)' />
        <rect width='290' height='250' rx='22' transform='matrix(0.866 0.5 0 1 520 150)' />
      </g>

      <g fill='#fff' stroke='#CFCBC1' strokeWidth='1'>
        {NODES.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 4 : 3} opacity='0.85' />
        ))}
      </g>
    </svg>
  )
}

// â”€â”€â”€â”€â”€ Config â”€â”€â”€â”€â”€
// The dials: everything a designer is likely to tune lives here, in plain units.

const EASE = [0.22, 1, 0.36, 1] as const

const COPY = {
  eyebrow: 'Accounting and finance teams use Ledgerly to',
  headline: ['streamline, automate, reconcile, and forecast with'],
  accentWord: 'AI.',
  body: 'Ledgerly reads your receipts, invoices and bank feeds, keeps your books reconciled every day, and turns the numbers into reports your team can act on.',
  primaryCta: 'Book a Free Call',
  secondaryCta: 'See how it works'
}

const NAV_LINKS = [{ label: 'Product' }, { label: 'Solutions' }, { label: 'Resources' }, { label: 'Pricing' }]

// What every client gets: service promises rather than made-up customer numbers.
const METRICS = [
  { value: 'Daily', label: 'Reconciliation', icon: 'refresh' },
  { value: '5 days', label: 'Month-end', icon: 'clock' },
  { value: '100%', label: 'Human-reviewed', icon: 'shield' }
] as const

const MOTION = {
  // Vertical drift of the core, in px of the 1000-unit artboard. Larger = more bob.
  floatDistance: 10,

  // Seconds for one float cycle. Larger = calmer.
  floatSeconds: 6.5,

  // Maximum tilt of the core toward the cursor, in degrees. Keep under ~4.
  tiltDegrees: 3.5,

  // How far the rings and dots slide against the core, in px. 0 = no depth.
  ringParallax: 12,
  backdropParallax: 5,

  // Seconds for one lap of the inner (clockwise) and outer (counter-clockwise) orbit. Larger = stiller.
  orbitSeconds: [70, 95],

  // How visible the orbits and their beads stay while the stack is open. 0 = gone, 1 = unchanged.
  orbitOpenOpacity: 0.15
}

const ARTBOARD = 1000

/**
 * The opened stack, bottom to top: money data comes in on the bank statement and leaves as reports
 * at the top. Each stage lists what it covers (items), an icon for each (tools, same order) and
 * the icon beside its number.
 */
const STAGES = [
  {
    title: 'Financial Data',
    items: ['Bank feeds', 'Receipts', 'Invoices'],
    tools: [Landmark, Receipt, FileText],
    icon: 'sources',
    side: 'right'
  },
  {
    title: 'General Ledger',
    items: ['Accounts', 'Journals', 'Balances'],
    tools: [ListTree, NotebookPen, Scale],
    icon: 'context',
    side: 'left'
  },
  {
    title: 'AI Bookkeeper',
    items: ['Categorize', 'Match', 'Flag issues'],
    tools: [Tags, ArrowLeftRight, TriangleAlert],
    side: 'right',
    main: true
  },
  {
    title: 'Automated Workflows',
    items: ['Approvals', 'Payments', 'Reminders'],
    tools: [CircleCheck, CreditCard, BellRing],
    icon: 'automation',
    side: 'left'
  },
  {
    title: 'Financial Reports',
    items: ['Profit & loss', 'Cash flow', 'Forecasts'],
    tools: [ChartColumnBig, Wallet, TrendingUp],
    icon: 'outcomes',
    side: 'right'
  }
] as const

type Stage = (typeof STAGES)[number]

// The AI layer is the main one: its card carries a "Main layer" tag and its icons on a row of their own.
const isMain = (stage: Stage) => 'main' in stage && stage.main

const EXPLODE = {
  // Spring that drives the whole reveal. Lower stiffness = slower, softer; higher damping = less settle.
  spring: { stiffness: 105, damping: 25, mass: 1 },

  // Distance between neighbouring plates once apart, in artboard units. Larger = a taller stack.
  gap: 104,

  // How far the page in focus rises above its place, in artboard units. The focus is the page under
  // the pointer, or the AI page when the pointer is on none of them.
  focusLift: 12,

  // Spring that carries the highlight from page to page. Higher stiffness = snappier.
  focusSpring: { stiffness: 600, damping: 40, mass: 0.5 },

  // Height of the top plate's face when apart. Raise to move the whole stack down.
  topPlateY: 222,

  // Later plates start a beat behind the AI plate. 0 = all move together; ~0.1 = a clear ripple.
  stagger: 0.05,

  /**
   * Size of each sheet when apart, bottom to top, as a fraction of its stacked size. Small enough
   * that every page's corner clears the stage cards beside it.
   */
  scales: [0.65, 0.65, 0.65, 0.65, 0.65]
}

/**
 * The stage cards, positioned in percentages of the visual's width per side. The inner edge
 * (edge + width) must clear the opened plates' corners (see EXPLODE.scales); a negative edge
 * overhangs the visual, which only the left side has room for, so it holds the longest title.
 */
const STAGE_CARDS = {
  left: { edge: -2, width: 31 },
  right: { edge: 0, width: 29 },

  /**
   * Cards only show while the stack is open. They start this many px toward the core and ease
   * out to this many px past their spot.
   */
  restInset: 10,
  outward: 2,

  // How much bigger a card grows while the pointer is on its page or on the card. 1.15 = 15% bigger.
  hoverScale: 1.15,

  // Seconds for a bead to run from a card to its plate while the stack is open.
  beadSeconds: 1.6
}

// â”€â”€â”€â”€â”€ Explode layout: where each sheet goes when the stack opens â”€â”€â”€â”€â”€
const TARGET_TOPS = SHEETS.map(
  (_, i) => EXPLODE.topPlateY + (SHEETS.length - 1 - i) * EXPLODE.gap
)

const TRAVEL = SHEETS.map((sheet, i) => TARGET_TOPS[i] - sheet.top)

const clamp = (v: number) => Math.min(1, Math.max(0, v))

// Progress of one sheet, 0 stacked to 1 apart. The AI sheet leads; the rest follow at a stagger.
const plateProgress = (i: number, p: number) => {
  const delay = Math.abs(i - AI_SHEET) * EXPLODE.stagger

  return clamp((p - delay) / (1 - delay))
}

const plateY = (i: number, p: number) => TRAVEL[i] * plateProgress(i, p)
const plateScale = (i: number, p: number) => 1 + (EXPLODE.scales[i] - 1) * plateProgress(i, p)

// Screen x distance from the centre to a sheet's left/right corner once apart (rounded corners pull the tip in).
const tipOffset = (i: number) => {
  const { halfX, halfY, radius } = SHEETS[i]

  return ISO_X * (halfX + halfY - 0.586 * radius) * EXPLODE.scales[i]
}

const tipX = (i: number, side: 'left' | 'right') => CX + (side === 'right' ? 1 : -1) * tipOffset(i)

/**
 * Screen y of the corner a stage's card points at, once apart. A page is taller than it is wide,
 * so its left corner sits a little below its centre and its right corner a little above.
 */
const cornerY = (i: number) => {
  const { halfX, halfY, depth } = SHEETS[i]
  const lean = ((halfY - halfX) / 2) * EXPLODE.scales[i]

  return TARGET_TOPS[i] + depth / 2 + (STAGES[i].side === 'left' ? lean : -lean)
}

// â”€â”€â”€â”€â”€ Focus: which page carries the highlight â”€â”€â”€â”€â”€
/**
 * How much one page is in focus, 0 to 1. It springs rather than switching, so when the focus moves
 * the highlight fades off one page while it fades onto the next.
 */
const useFocusAmount = (index: number, focus: number) => {
  // Hooks
  const target = useMotionValue(index === focus ? 1 : 0)

  useEffect(() => {
    target.set(index === focus ? 1 : 0)
  }, [focus, index, target])

  return useSpring(target, EXPLODE.focusSpring)
}

// How far a page has risen for focus, in artboard units. Only while the stack is open: the pile stays flat.
const useFocusLift = (index: number, amount: MotionValue<number>, progress: MotionValue<number>) => {
  return useTransform([amount, progress], ([a, p]: number[]) => a * plateProgress(index, p) * EXPLODE.focusLift)
}

// â”€â”€â”€â”€â”€ The document stack, resting and opened â”€â”€â”€â”€â”€
type PlateProps = {
  index: number
  progress: MotionValue<number>

  // index of the page in focus
  focus: number

  // pages only listen for the pointer while the stack is open
  open: boolean
  onFocusPage: (index: number | null) => void
}

/**
 * One page's layer. It lifts and shrinks with `progress`, casts a soft shadow on the page below,
 * and carries the highlight (lift, glow, rings) as much as it is in focus.
 */
const Plate = ({ index, progress, focus, open, onFocusPage }: PlateProps) => {
  // Hooks
  const amount = useFocusAmount(index, focus)
  const lift = useFocusLift(index, amount, progress)
  const y = useTransform([progress, lift], ([p, l]: number[]) => plateY(index, p) - l)
  const scale = useTransform(progress, v => plateScale(index, v))
  const shadow = useTransform(progress, v => plateProgress(index, v) * 0.16)

  // Vars
  const sheet = SHEETS[index]

  return (
    <m.g style={{ y, scale }}>
      {index > 0 && (
        <m.path
          d={topPath(sheet, -6, sheet.depth + 34)}
          fill='#6E6556'
          filter='url(#n3-blur-spill)'
          style={{ opacity: shadow }}
        />
      )}
      <FocusGlow index={index} amount={amount} progress={progress} />
      <Sheet sheet={sheet} kind={DOC_KINDS[index]} index={index} focused={index === focus} />
      <FocusRings index={index} amount={amount} progress={progress} />

      {/**
       * The page's hit area, for the pointer. It stays where the page sits before its focus lift
       * (the inner y undoes the lift), so a page rising under the pointer can't slip out from under
       * it and flicker. Later pages are drawn on top, so the page you see is the page you hover.
       */}
      <m.g style={{ y: lift }}>
        <path
          d={bodyPath(sheet)}
          fill='transparent'
          style={{ pointerEvents: open ? 'auto' : 'none' }}
          onPointerEnter={() => onFocusPage(index)}
          onPointerLeave={() => onFocusPage(null)}
        />
      </m.g>
    </m.g>
  )
}

type FocusEffectProps = { index: number; amount: MotionValue<number>; progress: MotionValue<number> }

// The light under the page in focus: a thin glowing seam that spills onto the page below and grows as the stack opens.
const FocusGlow = ({ index, amount, progress }: FocusEffectProps) => {
  // Hooks
  const strong = useTransform([progress, amount], ([p, a]: number[]) => clamp((p - 0.4) / 0.5) * 0.95 * a)

  // Vars
  const sheet = SHEETS[index]

  const seam: SheetType = {
    ...sheet,
    halfX: sheet.halfX - 1.5,
    halfY: sheet.halfY - 1.5,
    top: sheet.top + sheet.depth - 1,
    depth: STACK_STEP - sheet.depth + 2
  }

  return (
    <>
      <m.g style={{ opacity: amount }}>
        <g className='n3-seam-pulse'>
          <path d={topPath(sheet, 4, STACK_STEP * 1.5)} fill={PALETTE.accent} opacity='0.38' filter='url(#n3-blur-spill)' />
          <path d={bodyPath(seam)} fill={PALETTE.accent} opacity='0.85' filter='url(#n3-blur-glow)' />
        </g>
        <path d={bodyPath(seam)} fill='url(#n3-seam)' />
      </m.g>
      <m.path d={bodyPath(seam)} fill={PALETTE.accent} filter='url(#n3-blur-glow)' style={{ opacity: strong }} />
    </>
  )
}

// Scan rings that light up on the page in focus once the stack is open.
const FocusRings = ({ index, amount, progress }: FocusEffectProps) => {
  // Hooks
  const on = useTransform([progress, amount], ([p, a]: number[]) => clamp((p - 0.5) / 0.4) * a)
  const rim = useTransform(on, v => v * 0.95)
  const halo = useTransform(on, v => v * 0.7)
  const spill = useTransform(halo, v => v * 0.5)

  return (
    <g transform={onPage(SHEETS[index])}>
      <m.circle r='86' fill={PALETTE.accent} filter='url(#n3-blur-spill)' style={{ opacity: spill }} />
      <m.circle r='62' fill='none' stroke={PALETTE.accent} strokeWidth='2' style={{ opacity: rim }} />
      <m.circle r='44' fill='none' stroke={PALETTE.accent} strokeWidth='1.4' strokeDasharray='3 6' style={{ opacity: halo }} />
    </g>
  )
}

type LedgerlyDocumentStackProps = SVGProps<SVGSVGElement> & {
  progress: MotionValue<number>
  focus: number
  open: boolean
  onFocusPage: (index: number | null) => void
}

/**
 * The five documents, driven by `progress`: 0 is a neat pile, 1 has them lifted apart, one per
 * stage. The page in `focus` carries the highlight; hovering a page moves the focus to it.
 */
const LedgerlyDocumentStack = ({ progress, focus, open, onFocusPage, ...props }: LedgerlyDocumentStackProps) => {
  return (
    <svg viewBox='0 0 1000 1000' role='img' aria-label='A stack of accounting documents' {...props}>
      <PaperDefs />
      {SHEETS.map((_, i) => (
        <Plate key={i} index={i} progress={progress} focus={focus} open={open} onFocusPage={onFocusPage} />
      ))}
    </svg>
  )
}

// â”€â”€â”€â”€â”€ Orbital system â”€â”€â”€â”€â”€
// Two orbits around the core. Their nodes ride them in opposite directions (see LedgerlyParticles).
const LedgerlyOrbitalSystem = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox='0 0 1000 1000' aria-hidden {...props}>
      <g fill='none' stroke='#D9D6D0' strokeWidth='1'>
        <ellipse cx={CX} cy={CY} rx={RING_RX[0]} ry={RING_RX[0] * RING_FLATTEN} opacity='0.8' />
        <ellipse cx={CX} cy={CY} rx={RING_RX[1]} ry={RING_RX[1] * RING_FLATTEN} opacity='0.65' />
      </g>
    </svg>
  )
}

// â”€â”€â”€â”€â”€ Particles â”€â”€â”€â”€â”€
type NodeType = { ring: 0 | 1; angle: number; size: number }

/**
 * Small crystal beads spaced evenly around each orbit: four on the inner, five on the outer. Every
 * bead on an orbit shares its lap time, so they keep their spacing; the inner orbit runs
 * clockwise and the outer one against it.
 */
const NODES2: NodeType[] = [
  { ring: 0, angle: 20, size: 7 },
  { ring: 0, angle: 110, size: 5.5 },
  { ring: 0, angle: 200, size: 8 },
  { ring: 0, angle: 290, size: 6 },
  { ring: 1, angle: 60, size: 6 },
  { ring: 1, angle: 132, size: 8 },
  { ring: 1, angle: 204, size: 5.5 },
  { ring: 1, angle: 276, size: 7 },
  { ring: 1, angle: 348, size: 6.5 }
]

/**
 * A small sphere of amber glass: light at the upper left deepening to orange at the lower right,
 * a rim that is bright on top and darker below, a crisp specular highlight, and light gathered
 * at the bottom where it passes through the glass.
 */
const Crystal = ({ size }: { size: number }) => {
  return (
    <g filter='url(#n3-crystal-shadow)'>
      <circle r={size * 1.55} fill='url(#n3-crystal-halo)' />
      <circle r={size} fill='url(#n3-crystal-body)' />
      <circle r={size} fill='url(#n3-crystal-refract)' />
      <circle r={size - 0.5} fill='none' stroke='url(#n3-crystal-rim)' strokeWidth='1' />
      <ellipse
        cx={-size * 0.32}
        cy={-size * 0.4}
        rx={size * 0.36}
        ry={size * 0.2}
        transform={`rotate(-30 ${-size * 0.32} ${-size * 0.4})`}
        fill='#FFFFFF'
        opacity='0.95'
      />
      <circle cx={size * 0.34} cy={-size * 0.5} r={Math.max(0.7, size * 0.07)} fill='#FFFFFF' opacity='0.85' />
    </g>
  )
}

/**
 * The nodes are drawn twice, once behind the core and once in front, each clipped to its half of
 * the artboard, so a node passing the back of an orbit slips behind the object instead of over it.
 * `paused` freezes the beads where they are; they carry on from there when it clears.
 */
type LedgerlyParticlesProps = SVGProps<SVGSVGElement> & { half: 'back' | 'front'; animate: boolean; paused?: boolean }

const LedgerlyParticles = ({ half, animate, paused = false, ...props }: LedgerlyParticlesProps) => {
  // Refs
  const ref = useRef<SVGSVGElement>(null)

  // Vars
  const clipId = `n3-clip-${half}`

  // The beads run on this SVG's own animation clock, so pausing the clock stops them all at once.
  useEffect(() => {
    const svg = ref.current

    if (!svg) return

    if (paused) svg.pauseAnimations()
    else svg.unpauseAnimations()
  }, [paused])

  return (
    <svg ref={ref} viewBox='0 0 1000 1000' aria-hidden {...props}>
      <defs>
        <clipPath id={clipId}>
          {half === 'back' ? (
            <rect x='-200' y='-200' width='1400' height={CY + 200} />
          ) : (
            <rect x='-200' y={CY} width='1400' height='700' />
          )}
        </clipPath>
        <linearGradient id='n3-crystal-body' x1='0.15' y1='0.1' x2='0.85' y2='0.95'>
          <stop offset='0' stopColor={PALETTE.pale} stopOpacity='0.9' />
          <stop offset='0.5' stopColor={PALETTE.light} stopOpacity='0.88' />
          <stop offset='1' stopColor={PALETTE.accent} stopOpacity='0.95' />
        </linearGradient>
        <radialGradient id='n3-crystal-refract' cx='0.6' cy='0.78' r='0.45'>
          <stop offset='0' stopColor='#FFF4EC' stopOpacity='0.85' />
          <stop offset='1' stopColor='#FFF4EC' stopOpacity='0' />
        </radialGradient>
        <linearGradient id='n3-crystal-rim' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0' stopColor='#FFFFFF' stopOpacity='0.95' />
          <stop offset='1' stopColor={PALETTE.deep} stopOpacity='0.55' />
        </linearGradient>
        <radialGradient id='n3-crystal-halo' cx='0.5' cy='0.5' r='0.5'>
          <stop offset='0.5' stopColor={PALETTE.accent} stopOpacity='0.12' />
          <stop offset='1' stopColor={PALETTE.accent} stopOpacity='0' />
        </radialGradient>
        <filter id='n3-crystal-shadow' x='-80%' y='-80%' width='260%' height='260%'>
          <feDropShadow dx='0' dy='2.5' stdDeviation='2.5' floodColor={PALETTE.deep} floodOpacity='0.25' />
        </filter>
      </defs>

      <g clipPath={`url(#${clipId})`}>
        {NODES2.map((node, i) => {
          const rx = RING_RX[node.ring]
          const [x, y] = ringPoint(rx, node.angle)
          const dur = MOTION.orbitSeconds[node.ring]
          const reverse = node.ring === 1

          // The ring path starts at angle 0 and runs clockwise; a reversed lap starts from the far end.
          const start = node.angle / 360
          const begin = -dur * (reverse ? 1 - start : start)

          return (
            <g key={i} transform={animate ? undefined : `translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
              <Crystal size={node.size} />
              {animate && (
                <animateMotion
                  dur={`${dur}s`}
                  begin={`${begin}s`}
                  repeatCount='indefinite'
                  path={ringPath(rx)}
                  {...(reverse && { keyPoints: '1;0', keyTimes: '0;1', calcMode: 'linear' })}
                />
              )}
            </g>
          )
        })}
      </g>
    </svg>
  )
}

// â”€â”€â”€â”€â”€ Technical backdrop â”€â”€â”€â”€â”€
/**
 * Construction geometry behind the core: quiet enough that the eye only finds it on a second look.
 * Deterministic scatter, so server and client render the same dots.
 */
const DOTS = Array.from({ length: 26 }, (_, i) => {
  const a = (i * 137.5 * Math.PI) / 180
  const r = 160 + ((i * 53) % 340)

  return [
    round(CX + r * Math.cos(a) * 1.02),
    round(CY + r * Math.sin(a) * RING_FLATTEN * 1.6),
    0.8 + (i % 3) * 0.5
  ] as const
})

const LedgerlyTechnicalBackdrop = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox='0 0 1000 1000' aria-hidden {...props}>
      <defs>
        <linearGradient id='n3-axis-v' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0' stopColor='#C9C5BC' stopOpacity='0' />
          <stop offset='0.5' stopColor='#C9C5BC' stopOpacity='0.45' />
          <stop offset='1' stopColor='#C9C5BC' stopOpacity='0' />
        </linearGradient>
        <linearGradient id='n3-axis-h' x1='0' y1='0' x2='1' y2='0'>
          <stop offset='0' stopColor='#C9C5BC' stopOpacity='0' />
          <stop offset='0.5' stopColor='#C9C5BC' stopOpacity='0.7' />
          <stop offset='1' stopColor='#C9C5BC' stopOpacity='0' />
        </linearGradient>
      </defs>

      <rect x={CX - 0.5} y='110' width='1' height='780' fill='url(#n3-axis-v)' />
      <rect x='70' y={CY - 0.5} width='860' height='1' fill='url(#n3-axis-h)' />

      <g fill='#C9C5BC'>
        {DOTS.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} opacity={0.35 + (i % 4) * 0.12} />
        ))}
      </g>

      <g stroke='#C9C5BC' strokeWidth='1' opacity='0.5'>
        {(
          [
            [212, 292],
            [790, 690],
            [860, 430],
            [150, 560]
          ] as const
        ).map(([x, y]) => (
          <path key={`${x}-${y}`} d={`M${x - 5} ${y}h10M${x} ${y - 5}v10`} />
        ))}
      </g>
    </svg>
  )
}

// â”€â”€â”€â”€â”€ Stage card body â”€â”€â”€â”€â”€
// The small brand-coloured mark under each stage number.
const STAGE_ICONS = {
  sources: ArrowDownToLine,
  context: BookOpen,
  automation: Workflow,
  outcomes: ChartNoAxesColumnIncreasing
}

type AppLogosProps = { stage: Stage; tiles: boolean; className?: string }

// An icon for each thing a stage covers. The AI layer sets them in small tiles, in the brand colour.
const AppLogos = ({ stage, tiles, className }: AppLogosProps) => {
  return (
    <div className={cn('n3-stage-apps flex shrink-0 items-center', tiles ? 'gap-[0.45em]' : 'gap-[0.3em]', className)}>
      {stage.tools.map((Tool, i) => {
        return tiles ? (
          <span
            key={stage.items[i]}
            className='border-(color:--color-n3-line) grid size-[2.15em] place-items-center rounded-[0.6em] border bg-white shadow-[0_1px_2px_rgb(60_50_40/0.06)]'
          >
            <Tool className='text-(color:--color-n3-accent) size-[1.15em]' strokeWidth={1.8} aria-hidden />
          </span>
        ) : (
          <Tool key={stage.items[i]} className='text-(color:--color-n3-grey) size-[1.3em]' strokeWidth={1.6} aria-hidden />
        )
      })}
    </div>
  )
}

/**
 * A two-row grid: number and stage icon each centred in a box one line tall, so they line up
 * with their text, and the apps on the right. The AI layer swaps its icon for a "Main layer" tag
 * and puts its apps on their own row. Sized in em, so the card scales with its font size.
 */
const StageCardBody = ({ index }: { index: number }) => {
  // Vars
  const stage = STAGES[index]
  const main = isMain(stage)
  const Icon = 'icon' in stage ? STAGE_ICONS[stage.icon] : null

  return (
    <div className='grid grid-cols-[1.35em_minmax(0,1fr)_auto] items-start gap-x-[0.5em]'>
      {/* One title line tall (1.05em type at 1.25 leading), in this span's own 0.8em units. */}
      <span className='text-(color:--color-n3-grey) col-start-1 row-start-1 flex h-[1.64em] items-center text-[0.8em] font-medium tabular-nums'>
        {String(index + 1).padStart(2, '0')}
      </span>
      <div
        className={cn(
          'col-start-2 row-start-1 flex flex-wrap items-baseline justify-between gap-x-[0.6em]',
          main && 'col-span-2'
        )}
      >
        <p className='text-(color:--color-n3-ink) text-[1.05em] leading-[1.25] font-semibold tracking-[-0.015em] md:whitespace-nowrap'>
          {stage.title}
        </p>
        {main && (
          <span className='text-(color:--color-n3-accent) shrink-0 text-[0.72em] font-semibold tracking-[0.12em] uppercase'>
            Main layer
          </span>
        )}
      </div>

      {/* Outputs' first line: 0.88em type at 1.45 leading. */}
      {Icon && (
        <span className='col-start-1 row-start-2 mt-[0.4em] flex h-[1.276em] items-center'>
          <Icon className='text-(color:--color-n3-accent) size-[1.25em]' strokeWidth={1.7} aria-hidden />
        </span>
      )}
      <div className={cn('col-start-2 row-start-2 mt-[0.4em]', main && 'col-span-2')}>
        <p className='text-(color:--color-n3-grey) text-[0.88em] leading-[1.45]'>{stage.items.join(' Â· ')}</p>
        {main && <AppLogos stage={stage} tiles className='mt-[0.75em] justify-end' />}
      </div>

      {!main && <AppLogos stage={stage} tiles={false} className='col-start-3 row-span-2 row-start-1 self-center' />}
    </div>
  )
}

// â”€â”€â”€â”€â”€ Stage cards â”€â”€â”€â”€â”€
const pct = (n: number) => `${(n / ARTBOARD) * 100}%`

// Cards ease away from the core: left cards to the left, right cards to the right.
const cardDirection = (index: number) => (STAGES[index].side === 'left' ? -1 : 1)

type StageCardProps = {
  index: number
  progress: MotionValue<number>
  focus: number
  open: boolean
  lit: boolean
  onHover: (index: number | null) => void
}

// One stage card beside its plate. Hidden at rest; it fades in and eases outward as the stack opens.
const StageCard = ({ index, progress, focus, open, lit, onHover }: StageCardProps) => {
  // Hooks
  const opacity = useTransform(progress, [0.35, 0.9], [0, 1])

  // The card rises with its page when that page is in focus, so the connector stays level.
  const lift = useFocusLift(index, useFocusAmount(index, focus), progress)
  const top = useTransform(lift, l => pct(cornerY(index) - l))

  // The card under the pointer (or whose page is) grows, so it draws the eye. Only on hover, not for the resting AI page.
  const grow = useFocusAmount(index, lit ? index : -1)
  const scale = useTransform(grow, g => 1 + g * (STAGE_CARDS.hoverScale - 1))

  const x = useTransform(
    progress,
    [0, 1],
    [-cardDirection(index) * STAGE_CARDS.restInset, cardDirection(index) * STAGE_CARDS.outward]
  )

  // Vars
  const stage = STAGES[index]
  const { edge, width } = STAGE_CARDS[stage.side]
  const left = stage.side === 'left' ? edge : 100 - edge - width

  const handlePointerEnter = (e: ReactPointerEvent) => {
    if (e.pointerType === 'mouse') onHover(index)
  }

  const handlePointerLeave = () => {
    onHover(null)
  }

  return (
    <m.li style={{ top, left: `${left}%`, width: `${width}%` }} className={cn('absolute -translate-y-1/2', lit && 'z-10')}>
      <m.div
        style={{ opacity, x, scale }}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        className={cn(
          'n3-stage-card px-[0.9em] py-[0.85em]',
          // Grow from the edge facing the stack, so the card stays joined to its connector.
          stage.side === 'left' ? 'origin-right' : 'origin-left',
          open && 'pointer-events-auto',
          lit && 'n3-stage-card-lit'
        )}
      >
        <StageCardBody index={index} />
      </m.div>
    </m.li>
  )
}

type StageCardsProps = {
  progress: MotionValue<number>
  focus: number
  open: boolean
  hovered: number | null
  onHover: (index: number | null) => void
}

/**
 * The five stages as floating cards beside their plates, from tablet up. Font size follows the
 * visual's width (cqw), so the cards keep their place against the plates at every size.
 */
const StageCards = ({ progress, focus, open, hovered, onHover }: StageCardsProps) => {
  return (
    <ul
      aria-label='How Ledgerly works'
      aria-hidden={!open}
      className='pointer-events-none absolute inset-0 m-0 hidden list-none p-0 text-[clamp(10px,1.7cqw,15px)] md:block'
    >
      {STAGES.map((stage, i) => (
        <StageCard
          key={stage.title}
          index={i}
          progress={progress}
          focus={focus}
          open={open}
          lit={hovered === i}
          onHover={onHover}
        />
      ))}
    </ul>
  )
}

// â”€â”€â”€â”€â”€ Stage connector â”€â”€â”€â”€â”€
const ORANGE4 = PALETTE.accent

/**
 * plate: x of the plate's corner tip; card: x of the card's inner edge; y: the line's height.
 * All in artboard units.
 */
type LedgerlyStageConnectorProps = {
  className?: string
  plate: number
  card: number
  y: number
  side: 'left' | 'right'
  index: number
  main: boolean
  lit: boolean
  active: boolean
  progress: MotionValue<number>
  focus: number
}

// Where the line meets the plate's corner and the card's node, in artboard units.
const lineEnds = (plate: number, card: number, side: 'left' | 'right') => {
  const dir = side === 'right' ? 1 : -1

  return { plateX: plate + dir * 7, nodeX: card - dir * 10 }
}

// Card â†’ orange node â†’ hairline â†’ the corner of its plate. A bead runs the line while the stack is open.
const LedgerlyStageConnector = ({
  plate,
  card,
  y,
  side,
  index,
  main,
  lit,
  active,
  progress,
  focus,
  className
}: LedgerlyStageConnectorProps) => {
  // Hooks
  const show = useTransform(progress, [0.55, 0.9], [0, 1])
  const lift = useFocusLift(index, useFocusAmount(index, focus), progress)
  const rise = useTransform(lift, l => -l)
  const t = useMotionValue(0)

  const beadX = useTransform(t, k => {
    const ends = lineEnds(plate, card, side)

    return ends.nodeX + (ends.plateX - ends.nodeX) * k
  })

  const beadOpacity = useTransform([t, show], ([k, s]: number[]) => s * Math.sin(Math.PI * k))

  // Vars
  const { plateX, nodeX } = lineEnds(plate, card, side)

  useEffect(() => {
    if (!active) return

    const controls = animate(t, [0, 1], {
      duration: STAGE_CARDS.beadSeconds,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatDelay: 1.4,
      delay: 0.5 + index * 0.25
    })

    return () => {
      controls.stop()
      t.set(0)
    }
  }, [active, index, t])

  return (
    <m.svg aria-hidden viewBox={`0 0 ${ARTBOARD} ${ARTBOARD}`} style={{ opacity: show }} className={className}>
      <m.g style={{ y: rise }}>
        <line x1={plateX} x2={nodeX} y1={y} y2={y} stroke='#CFCAC1' strokeWidth='1' />
        <m.line
          x1={plateX}
          x2={nodeX}
          y1={y}
          y2={y}
          stroke={ORANGE4}
          strokeWidth='1.2'
          initial={false}
          animate={{ opacity: lit ? 0.9 : 0 }}
          transition={{ duration: 0.25 }}
        />
        <circle cx={plateX} cy={y} r='2.6' fill='#A8A399' />
        <m.circle
          cx={nodeX}
          cy={y}
          r={main ? 10 : 8}
          fill={ORANGE4}
          initial={false}
          animate={{ opacity: lit || main ? 0.22 : 0.12 }}
          transition={{ duration: 0.25 }}
        />
        <circle cx={nodeX} cy={y} r='3.6' fill={ORANGE4} />
        <m.circle cx={beadX} cy={y} r='2.6' fill={ORANGE4} style={{ opacity: beadOpacity }} />
      </m.g>
    </m.svg>
  )
}

// â”€â”€â”€â”€â”€ Stage connectors â”€â”€â”€â”€â”€
type StageConnectorsProps = {
  progress: MotionValue<number>
  active: boolean
  hovered: number | null
  focus: number
}

// Hairlines from each card to its plate, from tablet up. They tilt and float with the stack.
const StageConnectors = ({ progress, active, hovered, focus }: StageConnectorsProps) => {
  return (
    <div className='pointer-events-none absolute inset-0 hidden md:block'>
      {STAGES.map((stage, i) => {
        const { edge, width } = STAGE_CARDS[stage.side]
        const cardEdge = stage.side === 'left' ? (edge + width) * 10 : (100 - edge - width) * 10

        return (
          <LedgerlyStageConnector
            key={stage.title}
            plate={tipX(i, stage.side)}
            card={cardEdge}
            y={cornerY(i)}
            side={stage.side}
            index={i}
            main={isMain(stage)}
            lit={hovered === i}
            active={active}
            progress={progress}
            focus={focus}
            className='pointer-events-none absolute inset-0 size-full overflow-visible'
          />
        )
      })}
    </div>
  )
}

// â”€â”€â”€â”€â”€ Stage list â”€â”€â”€â”€â”€
// On a phone the visual is too narrow for cards beside it, so they sit below it as a grid.
const StageList = ({ reduce }: { reduce: boolean }) => {
  return (
    <m.ul
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
      aria-label='How Ledgerly works'
      className='m-0 grid list-none grid-cols-1 gap-2.5 p-0 text-[13px] sm:grid-cols-2 md:hidden'
    >
      {STAGES.map((stage, i) => (
        <li key={stage.title} className='n3-stage-card px-[1.05em] py-[0.95em]'>
          <StageCardBody index={i} />
        </li>
      ))}
    </m.ul>
  )
}

// â”€â”€â”€â”€â”€ Core visual â”€â”€â”€â”€â”€
// Follows the tab being shown or hidden, for useSyncExternalStore
const subscribeToVisibility = (onChange: () => void) => {
  document.addEventListener('visibilitychange', onChange)

  return () => document.removeEventListener('visibilitychange', onChange)
}

const isPageVisible = () => !document.hidden

// The server has no tab to hide, so it renders as shown
const isPageVisibleOnServer = () => true

type ParallaxLayerProps = {
  x: MotionValue<number>
  y: MotionValue<number>
  reach: number
  children: ReactNode
}

// Each layer slides against the pointer by a different amount, which is what reads as depth.
const ParallaxLayer = ({ x, y, reach, children }: ParallaxLayerProps) => {
  // Hooks
  const tx = useTransform(x, v => v * reach)
  const ty = useTransform(y, v => v * reach)

  return (
    <m.div style={{ x: tx, y: ty }} className='pointer-events-none absolute inset-0'>
      {children}
    </m.div>
  )
}

type TiltedProps = {
  rotateX: MotionValue<number>
  rotateY: MotionValue<number>
  children: ReactNode
}

// The tilt toward the cursor and the slow float, shared by every layer that moves with the stack.
const Tilted = ({ rotateX, rotateY, children }: TiltedProps) => {
  return (
    <div className='pointer-events-none absolute inset-0 [perspective:1400px]'>
      <m.div style={{ rotateX, rotateY }} className='absolute inset-0'>
        <div className='n3-float absolute inset-0'>{children}</div>
      </m.div>
    </div>
  )
}

const CoreVisual = () => {
  // States
  const [open, setOpen] = useState(false)
  const [hovered, setHovered] = useState<number | null>(null)

  // Refs
  const pointerType = useRef('mouse')
  const visualRef = useRef<HTMLDivElement>(null)

  // Hooks
  const reduce = useReducedMotion() ?? false

  // The margin covers the outer orbit and its beads running a little past the visual's box
  const onScreen = useInView(visualRef, { initial: true, margin: '40px' })
  const pageVisible = useSyncExternalStore(subscribeToVisibility, isPageVisible, isPageVisibleOnServer)

  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const x = useSpring(px, { stiffness: 55, damping: 18, mass: 0.9 })
  const y = useSpring(py, { stiffness: 55, damping: 18, mass: 0.9 })
  const rotateY = useTransform(x, v => v * MOTION.tiltDegrees)

  // 0 = stacked, 1 = apart. One spring drives the plates, connectors, cards and shadow together.
  const target = useMotionValue(0)
  const progress = useSpring(target, reduce ? { duration: 0.01 } : EXPLODE.spring)

  // While it is open the stack also leans back a little more, which is where the extra depth comes from.
  const rotateX = useTransform([y, progress], ([v, p]: number[]) => v * -MOTION.tiltDegrees + p * 4)
  const shadowOpacity = useTransform(progress, [0, 1], [1, 0.55])

  // The orbits step back while the stack is open, so the plates and cards have the stage.
  const orbitOpacity = useTransform(progress, [0, 0.6], [1, MOTION.orbitOpenOpacity])

  // The hint under the core bows out as soon as the stack starts to open.
  const hintOpacity = useTransform(progress, [0, 0.25], [1, 0])

  // Vars

  // The page carrying the highlight: the one under the pointer, else the AI page.
  const focus = hovered ?? AI_SHEET

  // The beads hold still while the stack is open, off screen or in a hidden tab; both halves share it, so they stay in step
  const beadsPaused = open || !onScreen || !pageVisible

  useEffect(() => {
    target.set(open ? 1 : 0)
  }, [open, target])

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== 'mouse') return

    const box = e.currentTarget.getBoundingClientRect()

    px.set(((e.clientX - box.left) / box.width - 0.5) * 2)
    py.set(((e.clientY - box.top) / box.height - 0.5) * 2)
  }

  const handlePointerLeave = () => {
    px.set(0)
    py.set(0)
    setOpen(false)
    setHovered(null)
  }

  // Hovering a card or a page focuses that stage: its page takes the highlight, its card and connector light up.
  const handleCardHover = (index: number | null) => {
    setHovered(index)
    if (index !== null && !reduce) setOpen(true)
  }

  const handleCorePointerDown = (e: ReactPointerEvent<HTMLButtonElement>) => {
    pointerType.current = e.pointerType
  }

  const handleCorePointerEnter = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (e.pointerType === 'mouse' && !reduce) setOpen(true)
  }

  // A mouse opens it by hovering the core. Touch and keyboard have no hover, so they toggle instead.
  const handleCoreClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (e.detail === 0 || pointerType.current !== 'mouse') setOpen(v => !v)
  }

  const handleCoreBlur = () => {
    setOpen(false)
  }

  return (
    <LazyMotion features={domAnimation}>
      <>
        {/* Fades and scales in with CSS (n3-enter), from the first paint rather than after hydration. */}
        <div
          ref={visualRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          className='n3-enter @container relative -my-[6%] -ml-[12.5%] aspect-square w-[125%] max-w-none md:mx-auto md:my-0 md:w-full md:max-w-[840px] lg:mx-0 lg:w-[104%] lg:max-w-none'
        >
          <div className='absolute inset-0'>
            <div aria-hidden className='n3-halo pointer-events-none absolute inset-[6%]' />

            <div className='n3-fade-edge absolute inset-0'>
              <ParallaxLayer x={x} y={y} reach={-MOTION.backdropParallax}>
                <LedgerlyDepthBackdrop className='absolute inset-0 size-full overflow-visible' />
                <LedgerlyTechnicalBackdrop className='absolute inset-0 size-full overflow-visible' />
              </ParallaxLayer>
            </div>

            {/**
             * The orbits sit outside the faded layer: the outer ring runs past the visual's box, and a
             * mask would cut it off there.
             */}
            <ParallaxLayer x={x} y={y} reach={MOTION.ringParallax}>
              <m.div style={{ opacity: orbitOpacity }} className='absolute inset-0'>
                <LedgerlyOrbitalSystem className='absolute inset-0 size-full overflow-visible' />
                <LedgerlyParticles
                  half='back'
                  animate={!reduce}
                  paused={beadsPaused}
                  className='absolute inset-0 size-full overflow-visible'
                />
              </m.div>
            </ParallaxLayer>

            <m.div style={{ opacity: shadowOpacity }} className='absolute inset-0'>
              <LedgerlyCoreShadow className='pointer-events-none absolute inset-0 size-full overflow-visible' />
            </m.div>

            <Tilted rotateX={rotateX} rotateY={rotateY}>
              <LedgerlyDocumentStack
                progress={progress}
                focus={focus}
                open={open}
                onFocusPage={handleCardHover}
                className='absolute inset-0 size-full overflow-visible'
              />
              <StageConnectors progress={progress} active={open && !reduce} hovered={hovered} focus={focus} />
            </Tilted>

            <ParallaxLayer x={x} y={y} reach={MOTION.ringParallax}>
              <m.div style={{ opacity: orbitOpacity }} className='absolute inset-0'>
                <LedgerlyParticles
                  half='front'
                  animate={!reduce}
                  paused={beadsPaused}
                  className='absolute inset-0 size-full overflow-visible'
                />
              </m.div>
            </ParallaxLayer>

            {/* The cards ride the same tilt and float in a layer of their own, above the front orbit. */}
            <Tilted rotateX={rotateX} rotateY={rotateY}>
              <StageCards progress={progress} focus={focus} open={open} hovered={hovered} onHover={handleCardHover} />
            </Tilted>
          </div>

          {/* A quiet invitation under the core. Touch screens have no hover, so they are told to tap. */}
          <m.p
            aria-hidden
            style={{ opacity: hintOpacity }}
            className='text-(color:--color-n3-grey) pointer-events-none absolute top-[84%] left-1/2 m-0 flex -translate-x-1/2 items-center gap-1.5 text-[12.5px] whitespace-nowrap'
          >
            <MousePointer2 className='text-(color:--color-n3-accent) size-3.5' strokeWidth={1.8} />
            <span className='[@media(hover:none)]:hidden'>Hover to see how it works</span>
            <span className='hidden [@media(hover:none)]:inline'>Tap to see how it works</span>
          </m.p>

          <button
            type='button'
            aria-expanded={open}
            aria-label='Open the document stack to see how Ledgerly works'
            onPointerDown={handleCorePointerDown}
            onPointerEnter={handleCorePointerEnter}
            onClick={handleCoreClick}
            onBlur={handleCoreBlur}
            className={cn(
              'focus-visible:outline-(color:--color-n3-accent) absolute top-[30%] left-[22%] h-[44%] w-[56%] cursor-default rounded-[3rem] focus-visible:outline-2 focus-visible:outline-offset-4',
              // Once open, it steps aside for the pointer so the pages underneath can be hovered.
              open && 'pointer-events-none'
            )}
          />
        </div>
        <StageList reduce={reduce} />
      </>
    </LazyMotion>
  )
}

// â”€â”€â”€â”€â”€ Flip label â”€â”€â”€â”€â”€
/**
 * A button label drawn as two identical faces of a small cube. Put `n3-flip` on the button and
 * hovering it turns the cube over; the twin face is hidden from screen readers.
 */
const FlipLabel = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <span className='n3-flip-box'>
      <span className={cn('n3-flip-face', className)}>{children}</span>
      <span aria-hidden className={cn('n3-flip-face n3-flip-back', className)}>
        {children}
      </span>
    </span>
  )
}

// â”€â”€â”€â”€â”€ Hero copy â”€â”€â”€â”€â”€
const ICONS = { refresh: RefreshCw, clock: Clock, shield: ShieldCheck }

/**
 * The rise is a CSS animation (n3-rise in index.css), so the copy plays in from the first paint
 * rather than after hydration.
 */
const rise = (delay: number) => ({ style: { animationDelay: `${delay}s` } })

const HeroCopy = () => {
  return (
    <div className='flex flex-col justify-center'>
      <p
        {...rise(0.1)}
        className='n3-rise text-(color:--color-n3-grey) flex items-center gap-3 text-[12px] font-medium tracking-[0.22em] uppercase'
      >
        <span aria-hidden className='n3-dot bg-(color:--color-n3-accent) size-2 rounded-full' />
        {COPY.eyebrow}
      </p>

      <h1 id='n3-title' {...rise(0.18)} className='n3-rise n3-h1 text-(color:--color-n3-ink) mt-7 font-normal'>
        {COPY.headline.map((line, i) => {
          if (i < COPY.headline.length - 1) {
            return (
              <span key={line} className='block'>
                {line}
              </span>
            )
          }

          // The last word and the accent word never part, so "AI." can't wrap onto a line alone.
          const cut = line.lastIndexOf(' ')

          return (
            <span key={line} className='block'>
              {line.slice(0, cut + 1)}
              <span className='whitespace-nowrap'>
                {line.slice(cut + 1)} <span className='text-(color:--color-n3-accent)'>{COPY.accentWord}</span>
              </span>
            </span>
          )
        })}
      </h1>

      <p {...rise(0.3)} className='n3-rise text-(color:--color-n3-grey) mt-7 max-w-[30rem] text-[17px] leading-[1.6] lg:text-[19px]'>
        {COPY.body}
      </p>

      <div {...rise(0.4)} className='n3-rise mt-9 flex flex-wrap items-center gap-3'>
        <a
          href='#start'
          className='n3-flip bg-(color:--color-n3-accent-deep) focus-visible:outline-(color:--color-n3-ink) inline-flex h-13 items-center rounded-full px-7 text-[16px] font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-2 sm:h-14'
        >
          <FlipLabel className='gap-2.5'>
            {COPY.primaryCta}
            <ArrowRight className='size-4' strokeWidth={1.8} aria-hidden />
          </FlipLabel>
        </a>
        <a
          href='#how-it-works'
          className='n3-flip border-(color:--color-n3-line) text-(color:--color-n3-ink) focus-visible:outline-(color:--color-n3-accent) inline-flex h-13 items-center rounded-full border bg-white/50 px-6 text-[16px] focus-visible:outline-2 focus-visible:outline-offset-2 sm:h-14'
        >
          <FlipLabel className='gap-3'>
            <span className='border-(color:--color-n3-ink) grid size-5 place-items-center rounded-full border'>
              <Play className='size-2.5 fill-current' strokeWidth={0} aria-hidden />
            </span>
            {COPY.secondaryCta}
          </FlipLabel>
        </a>
      </div>

      <dl {...rise(0.58)} className='n3-rise mt-12 grid grid-cols-3 sm:flex sm:items-stretch lg:mt-20 lg:grid xl:flex'>
        {METRICS.map(({ value, label, icon }, i) => {
          const Icon = ICONS[icon]

          return (
            <div
              key={label}
              className={cn(
                'flex flex-col items-start gap-2 pr-3 sm:flex-row sm:items-center sm:gap-3 sm:pr-6 sm:whitespace-nowrap lg:flex-col lg:items-start lg:gap-2 lg:whitespace-normal xl:flex-row xl:items-center xl:gap-3 xl:whitespace-nowrap last:pr-0',
                i > 0 && 'border-(color:--color-n3-line) border-l pl-4 sm:pl-6'
              )}
            >
              {/* 32px, centred on the two 20px lines beside it. */}
              <Icon className='text-(color:--color-n3-ink) size-8 shrink-0' strokeWidth={1.25} aria-hidden />
              <div>
                <dd className='text-(color:--color-n3-ink) text-[14px] leading-5 font-medium'>{value}</dd>
                <dt className='text-(color:--color-n3-grey) text-[13px] leading-5'>{label}</dt>
              </div>
            </div>
          )
        })}
      </dl>
    </div>
  )
}

// â”€â”€â”€â”€â”€ Floor grid â”€â”€â”€â”€â”€
// One diamond of the isometric floor: the same 30Â° axes the core is drawn on, 48px along each edge.
const CELL = { w: 84, h: 48 }

/**
 * The floor grid behind the whole hero, as a repeating pattern. Where it shows is decided by the
 * CSS masks in index.css; see hero-floor.tsx for the two copies (quiet grey, and the orange spotlight).
 */
type LedgerlyFloorGridProps = SVGProps<SVGSVGElement> & { id: string; stroke?: string; strokeWidth?: number }

const LedgerlyFloorGrid = ({ id, stroke = '#D3CFC6', strokeWidth = 0.8, ...props }: LedgerlyFloorGridProps) => {
  return (
    <svg aria-hidden width='100%' height='100%' {...props}>
      <defs>
        <pattern id={id} width={CELL.w} height={CELL.h} patternUnits='userSpaceOnUse'>
          <path
            d={`M0 ${CELL.h / 2}L${CELL.w / 2} 0L${CELL.w} ${CELL.h / 2}M0 ${CELL.h / 2}L${CELL.w / 2} ${CELL.h}L${CELL.w} ${CELL.h / 2}`}
            fill='none'
            stroke={stroke}
            strokeWidth={strokeWidth}
          />
        </pattern>
      </defs>
      <rect width='100%' height='100%' fill={`url(#${id})`} />
    </svg>
  )
}

// â”€â”€â”€â”€â”€ Hero floor â”€â”€â”€â”€â”€
// Diameter of the cursor spotlight, in px.
const SPOT = 340

/**
 * The floor grid, plus an orange copy seen through a round window that follows the cursor. Window
 * and grid move only by opposite transforms, so nothing repaints and the orbits stay smooth; it
 * listens on the hero section, since the grid sits behind the content and never gets the pointer.
 */
const HeroFloor = () => {
  // Refs
  const ref = useRef<HTMLDivElement>(null)
  const spotRef = useRef<HTMLDivElement>(null)
  const litRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    const spot = spotRef.current
    const lit = litRef.current
    const section = el?.parentElement

    if (!el || !spot || !lit || !section) return

    // The orange grid matches the section's size, so its pattern lines up with the grey one.
    const resize = new ResizeObserver(([entry]) => {
      lit.style.width = `${entry.contentRect.width}px`
      lit.style.height = `${entry.contentRect.height}px`
    })

    resize.observe(section)

    let frame = 0

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return

      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const box = section.getBoundingClientRect()
        const x = e.clientX - box.left - SPOT / 2
        const y = e.clientY - box.top - SPOT / 2

        spot.style.transform = `translate3d(${x}px, ${y}px, 0)`
        lit.style.transform = `translate3d(${-x}px, ${-y}px, 0)`
        el.dataset.spot = 'on'
      })
    }

    const handlePointerLeave = () => {
      cancelAnimationFrame(frame)
      el.dataset.spot = 'off'
    }

    section.addEventListener('pointermove', handlePointerMove)
    section.addEventListener('pointerleave', handlePointerLeave)

    return () => {
      cancelAnimationFrame(frame)
      resize.disconnect()
      section.removeEventListener('pointermove', handlePointerMove)
      section.removeEventListener('pointerleave', handlePointerLeave)
    }
  }, [])

  return (
    <div ref={ref} aria-hidden data-spot='off' className='pointer-events-none absolute inset-0 -z-10 overflow-hidden'>
      <LedgerlyFloorGrid id='n3-floor-cell' className='n3-floor absolute inset-0' />
      <div ref={spotRef} style={{ width: SPOT, height: SPOT }} className='n3-floor-spot'>
        <div ref={litRef} className='n3-floor-lit'>
          <LedgerlyFloorGrid id='n3-floor-cell-lit' stroke={PALETTE.accent} strokeWidth={1} className='block size-full' />
        </div>
      </div>
    </div>
  )
}

// â”€â”€â”€â”€â”€ Hero â”€â”€â”€â”€â”€
const Hero = () => {
  return (
    <section id='top' aria-labelledby='n3-title' className='n3-hero relative isolate overflow-x-clip'>
      <HeroFloor />
      <div className='n3-frame mx-auto grid max-w-360 items-center gap-6 pt-6 pb-12 lg:min-h-[inherit] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12 lg:py-10 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] xl:gap-20'>
        <HeroCopy />
        <CoreVisual />
      </div>
    </section>
  )
}

// â”€â”€â”€â”€â”€ Mark â”€â”€â”€â”€â”€
/**
 * The Ledgerly mark: three stacked ledger pages, echoing the document stack in the hero. Used in
 * the nav; the report page in the stack prints the same pages.
 */
const LedgerlyMark = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg viewBox='-27 -27 54 54' aria-hidden {...props}>
      <defs>
        <linearGradient id='n3-mark' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0' stopColor={PALETTE.light} />
          <stop offset='1' stopColor={PALETTE.accent} />
        </linearGradient>
      </defs>
      <LedgerPages fill='url(#n3-mark)' fades />
    </svg>
  )
}

// â”€â”€â”€â”€â”€ Navbar â”€â”€â”€â”€â”€
const Navbar = () => {
  // States
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  // Refs
  const wrapRef = useRef<HTMLDivElement>(null)

  // Hooks
  const reduce = useReducedMotion()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12)

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  /**
   * The hero fills what the nav leaves, so the nav's real height (wrapper included) is measured,
   * and re-measured whenever it wraps, resizes or the web font lands.
   */
  useEffect(() => {
    const el = wrapRef.current
    const root = el?.closest<HTMLElement>('.n3-root')

    if (!el || !root) return

    const measure = () => root.style.setProperty('--n3-nav-space', `${el.getBoundingClientRect().height}px`)
    const observer = new ResizeObserver(measure)

    measure()
    observer.observe(el)
    document.fonts?.ready.then(measure)

    return () => observer.disconnect()
  }, [])

  const handleMenuToggle = () => {
    setOpen(v => !v)
  }

  const handleMenuClose = () => {
    setOpen(false)
  }

  return (
    <LazyMotion features={domAnimation}>
      <header ref={wrapRef} className='n3-drop sticky top-0 z-50'>
        <div className={cn('n3-nav-bar', (scrolled || open) && 'n3-nav-bar-scrolled')}>
          <nav
            aria-label='Primary'
            className='n3-frame mx-auto flex h-18 max-w-360 items-center justify-between lg:h-24'
          >
            <a href='#top' aria-label='Ledgerly home' className='text-(color:--color-n3-ink) flex items-center gap-2.5'>
              <LedgerlyMark className='size-8 sm:size-9' />
              <span className='text-[22px] sm:text-[26px] font-medium tracking-[-0.04em]'>Ledgerly</span>
            </a>

            <ul className='hidden items-center gap-10 lg:flex'>
              {NAV_LINKS.map(({ label }) => (
                <li key={label}>
                  <a
                    href={`#${label.toLowerCase()}`}
                    className='text-(color:--color-n3-ink) hover:text-(color:--color-n3-accent) focus-visible:text-(color:--color-n3-accent) inline-flex items-center py-2 text-[16px] transition-colors duration-200 focus-visible:outline-none'
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>

            <div className='flex items-center gap-2 sm:gap-4'>
              <a
                href='#log-in'
                className='text-(color:--color-n3-ink) hover:text-(color:--color-n3-accent) hidden px-3 py-2 text-[16px] transition-colors duration-200 sm:block'
              >
                Log in
              </a>
              <a
                href='#pricing'
                className='n3-flip bg-(color:--color-n3-ink) focus-visible:outline-(color:--color-n3-accent) inline-flex h-11 items-center rounded-full px-5 text-[15px] font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-2 sm:h-13 sm:px-6 sm:text-[16px]'
              >
                <FlipLabel className='gap-2'>
                  Get Started
                  <ArrowRight className='size-4' strokeWidth={1.8} aria-hidden />
                </FlipLabel>
              </a>
              <button
                type='button'
                aria-label={open ? 'Close menu' : 'Open menu'}
                aria-expanded={open}
                aria-controls='n3-mobile-menu'
                onClick={handleMenuToggle}
                className='text-(color:--color-n3-ink) grid size-11 place-items-center rounded-full lg:hidden'
              >
                {open ? <X className='size-5' strokeWidth={1.6} /> : <Menu className='size-5' strokeWidth={1.6} />}
              </button>
            </div>
          </nav>

          <AnimatePresence initial={false}>
            {open && (
              <m.div
                id='n3-mobile-menu'
                initial={reduce ? false : { opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: EASE }}
                className='n3-frame pb-5 lg:hidden'
              >
                <ul className='border-(color:--color-n3-ink)/8 flex flex-col border-t pt-2'>
                  {[...NAV_LINKS.map(l => l.label), 'Log in'].map(label => (
                    <li key={label}>
                      <a
                        href={`#${label.toLowerCase().replace(' ', '-')}`}
                        onClick={handleMenuClose}
                        className='text-(color:--color-n3-ink) flex h-12 items-center text-[16px]'
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </header>
    </LazyMotion>
  )
}

// â”€â”€â”€â”€â”€ The page root â”€â”€â”€â”€â”€
const motionVars = {
  '--n3-float': MOTION.floatDistance,
  '--n3-float-seconds': `${MOTION.floatSeconds}s`
} as CSSProperties

// `children` render below the hero, inside the same root, so the sticky nav stays with them.
const LedgerlyHeroBase = ({ children }: { children?: ReactNode }) => {
  return (
    <div style={motionVars} className='n3-root n3-bg font-(family-name:--font-n3-sans) text-(color:--color-n3-ink) w-full antialiased'>
      <Navbar />
      <Hero />
      {children}
    </div>
  )
}

const LedgerlyHero = ({ children }: { children?: ReactNode }) => (
  <>
    <style>{BLOCK_CSS}</style>
    <LedgerlyHeroBase>{children}</LedgerlyHeroBase>
  </>
)

export { LedgerlyMark }
export default LedgerlyHero
