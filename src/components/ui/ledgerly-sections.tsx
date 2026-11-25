'use client'

import { useState } from 'react'
import type { FormEvent, ReactNode, SyntheticEvent } from 'react'
import { LazyMotion, MotionConfig, domAnimation, m } from 'motion/react'
import {
  ArrowRight,
  Briefcase,
  Building2,
  ChartColumnBig,
  Check,
  CircleCheck,
  FileText,
  Landmark,
  Plug,
  Rocket,
  ScanLine,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  TrendingUp
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { LedgerlyMark } from '@/components/ui/ledgerly-hero'

/**
 * Everything below the hero: Product, How it works, Solutions, Pricing, Resources (FAQ), the
 * "Book a free call" form and the footer. It renders inside the hero's root, so it shares its
 * colours (--color-n3-*), font, gutters (.n3-frame) and sticky nav.
 */

// â”€â”€â”€â”€â”€ Content â”€â”€â”€â”€â”€
const FEATURES: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: ScanLine,
    title: 'Receipt capture',
    body: 'Snap, forward or upload receipts. Ledgerly reads the vendor, amount and tax, and files them for you.'
  },
  {
    icon: Landmark,
    title: 'Daily reconciliation',
    body: 'Every bank and card transaction is matched to its receipt or invoice, every day, not at month-end.'
  },
  {
    icon: FileText,
    title: 'Invoices and bills',
    body: 'Send invoices, track who owes you, and line up bills for approval before they are due.'
  },
  {
    icon: ChartColumnBig,
    title: 'Live reports',
    body: 'Profit and loss, balance sheet and cash flow, always up to date and ready to share.'
  },
  {
    icon: TrendingUp,
    title: 'Cash-flow forecasts',
    body: 'See the next 13 weeks of cash, with scenarios for hiring, spending and late payers.'
  },
  {
    icon: ShieldCheck,
    title: 'Human-reviewed',
    body: 'A qualified accountant checks what the AI flags, and every change keeps a full audit trail.'
  }
]

const STEPS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Plug,
    title: 'Connect your accounts',
    body: 'Link your banks, cards and payroll in about ten minutes. Access is read-only.'
  },
  {
    icon: Sparkles,
    title: 'Ledgerly keeps the books',
    body: 'The AI categorizes, matches and flags each transaction. Your accountant reviews the exceptions.'
  },
  {
    icon: CircleCheck,
    title: 'You get the answers',
    body: 'Books closed in five days, live reports, and a forecast you can plan around.'
  }
]

const SOLUTIONS: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: Rocket, title: 'Startups', body: 'Investor-ready books, burn and runway tracking, and a clean audit trail for fundraising.' },
  { icon: ShoppingBag, title: 'E-commerce', body: 'Payouts from every store and payment app reconciled to orders, fees and refunds.' },
  { icon: Briefcase, title: 'Agencies and services', body: 'Project profitability, retainers and contractor payments, all in one ledger.' },
  { icon: Building2, title: 'Accounting firms', body: 'Run more clients per accountant, with the AI doing the first pass on every file.' }
]

const PLANS: { name: string; price: string; period?: string; blurb: string; features: string[]; featured?: boolean; cta: string }[] = [
  {
    name: 'Starter',
    price: '$299',
    period: '/month',
    blurb: 'For small teams that want their books off their plate.',
    features: ['Up to 200 transactions a month', 'Daily reconciliation', 'Monthly P&L and balance sheet', 'Email support'],
    cta: 'Start with Starter'
  },
  {
    name: 'Growth',
    price: '$699',
    period: '/month',
    blurb: 'For growing companies that need answers, not just books.',
    features: [
      'Up to 1,000 transactions a month',
      'Everything in Starter',
      '13-week cash-flow forecast',
      'Bill pay and approvals',
      'A dedicated accountant'
    ],
    featured: true,
    cta: 'Choose Growth'
  },
  {
    name: 'Scale',
    price: 'Custom',
    blurb: 'For multi-entity companies and accounting firms.',
    features: ['Unlimited transactions', 'Multi-entity and multi-currency', 'Custom reports and integrations', 'Priority support'],
    cta: 'Talk to us'
  }
]

const FAQS: { q: string; a: string }[] = [
  {
    q: 'Is the AI doing my accounting on its own?',
    a: 'No. The AI does the first pass: it categorizes, matches and flags. A qualified accountant reviews anything unusual and signs off your monthly close.'
  },
  {
    q: 'Which banks and tools do you connect to?',
    a: 'Most banks and card providers, plus the common payroll, payment and e-commerce platforms. If yours is missing, we can import statements instead.'
  },
  {
    q: 'Is my financial data safe?',
    a: 'Connections are read-only and encrypted, access is limited to your team and your accountant, and every change is logged.'
  },
  {
    q: 'How long does it take to get started?',
    a: 'Connecting accounts takes about ten minutes. We then catch up your books, usually within two weeks, depending on how far back you need.'
  },
  {
    q: 'Can I switch plans or cancel?',
    a: 'Yes. You can move between plans each month, and there is no long-term contract.'
  }
]

const FOOTER_LINKS = [
  { label: 'Product', href: '#product' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Resources', href: '#resources' },
  { label: 'Book a call', href: '#start' }
]

// â”€â”€â”€â”€â”€ Shared pieces â”€â”€â”€â”€â”€
// Sections land below the sticky nav when you jump to them from a link.
const SECTION = 'scroll-mt-(--n3-nav-space) py-20 sm:py-24 lg:py-32'
const FRAME = 'n3-frame mx-auto max-w-360'

// Fades and lifts into view the first time it scrolls on screen (skipped for reduced motion).
const Reveal = ({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) => (
  <m.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </m.div>
)

type SectionHeadProps = { id: string; eyebrow: string; title: ReactNode; body?: string; invert?: boolean; center?: boolean }

const SectionHead = ({ id, eyebrow, title, body, invert, center }: SectionHeadProps) => (
  <Reveal className={cn('max-w-2xl', center && 'mx-auto text-center')}>
    <p
      className={cn(
        'inline-flex items-center gap-2.5 text-[13px] font-medium tracking-[0.16em] uppercase',
        invert ? 'text-white/60' : 'text-(color:--color-n3-grey)'
      )}
    >
      <span aria-hidden className='bg-(color:--color-n3-accent) size-2 rounded-full' />
      {eyebrow}
    </p>
    <h2 id={id} className='lf-h2 mt-5'>
      {title}
    </h2>
    {body && (
      <p className={cn('mt-5 text-[17px] leading-relaxed', invert ? 'text-white/70' : 'text-(color:--color-n3-grey)')}>
        {body}
      </p>
    )}
  </Reveal>
)

const IconTile = ({ icon: Icon, invert }: { icon: LucideIcon; invert?: boolean }) => (
  <span
    className={cn(
      'grid size-11 place-items-center rounded-xl',
      invert ? 'bg-white/10 text-(color:--color-n3-accent)' : 'bg-(color:--color-n3-accent)/12 text-(color:--color-n3-accent-deep)'
    )}
  >
    <Icon className='size-5' strokeWidth={1.7} aria-hidden />
  </span>
)

const Accent = ({ children }: { children: ReactNode }) => <span className='text-(color:--color-n3-accent)'>{children}</span>

// â”€â”€â”€â”€â”€ Sections â”€â”€â”€â”€â”€
const Product = () => (
  <section aria-labelledby='product-title' id='product' className={SECTION}>
    <div className={FRAME}>
      <SectionHead
        id='product-title'
        eyebrow='Product'
        title={
          <>
            Everything your books need, <Accent>done daily.</Accent>
          </>
        }
        body='Ledgerly replaces the month-end scramble with books that are right every morning: captured, matched, reviewed and reported.'
      />
      <ul className='mt-14 grid gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-5'>
        {FEATURES.map((f, i) => (
          <li key={f.title}>
            <Reveal delay={(i % 3) * 0.08} className='lf-card h-full p-7'>
              <IconTile icon={f.icon} />
              <h3 className='mt-6 text-[19px] font-semibold tracking-[-0.01em]'>{f.title}</h3>
              <p className='text-(color:--color-n3-grey) mt-2.5 text-[15.5px] leading-relaxed'>{f.body}</p>
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  </section>
)

const HowItWorks = () => (
  <section
    aria-labelledby='how-title'
    id='how-it-works'
    className={cn(SECTION, 'bg-(color:--color-n3-ink) text-white')}
  >
    <div className={FRAME}>
      <SectionHead
        id='how-title'
        eyebrow='How it works'
        invert
        title={
          <>
            Three steps to books <Accent>you can trust.</Accent>
          </>
        }
        body='No new software to learn and no spreadsheets to send. Connect once, and Ledgerly keeps going.'
      />
      <ol className='mt-14 grid gap-4 lg:mt-20 lg:grid-cols-3 lg:gap-5'>
        {STEPS.map((s, i) => (
          <li key={s.title}>
            <Reveal delay={i * 0.1} className='h-full rounded-[1.3rem] border border-white/10 bg-white/[0.04] p-7'>
              <div className='flex items-center justify-between'>
                <IconTile icon={s.icon} invert />
                <span className='text-[13px] font-medium tracking-[0.16em] text-white/40'>
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className='mt-6 text-[19px] font-semibold tracking-[-0.01em]'>{s.title}</h3>
              <p className='mt-2.5 text-[15.5px] leading-relaxed text-white/65'>{s.body}</p>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  </section>
)

const Solutions = () => (
  <section aria-labelledby='solutions-title' id='solutions' className={SECTION}>
    <div className={cn(FRAME, 'grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20')}>
      <SectionHead
        id='solutions-title'
        eyebrow='Solutions'
        title={
          <>
            Built for teams that <Accent>move fast.</Accent>
          </>
        }
        body='Whatever your business runs on, Ledgerly learns how you work and keeps your numbers in shape for the decisions ahead.'
      />
      <ul className='grid gap-4 sm:grid-cols-2'>
        {SOLUTIONS.map((s, i) => (
          <li key={s.title}>
            <Reveal delay={(i % 2) * 0.08} className='lf-card h-full p-7'>
              <IconTile icon={s.icon} />
              <h3 className='mt-6 text-[19px] font-semibold tracking-[-0.01em]'>{s.title}</h3>
              <p className='text-(color:--color-n3-grey) mt-2.5 text-[15.5px] leading-relaxed'>{s.body}</p>
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  </section>
)

const Pricing = () => (
  <section aria-labelledby='pricing-title' id='pricing' className={cn(SECTION, 'lf-band')}>
    <div className={FRAME}>
      <SectionHead
        id='pricing-title'
        eyebrow='Pricing'
        center
        title={
          <>
            Simple plans. <Accent>No surprises.</Accent>
          </>
        }
        body='Every plan includes the AI bookkeeper and a human review. Pay monthly, change plans any time.'
      />
      <ul className='mx-auto mt-14 grid max-w-6xl gap-5 lg:mt-20 lg:grid-cols-3 lg:items-stretch'>
        {PLANS.map((p, i) => (
          <li key={p.name}>
            <Reveal
              delay={i * 0.08}
              className={cn(
                'flex h-full flex-col rounded-[1.6rem] p-8',
                p.featured ? 'bg-(color:--color-n3-ink) text-white shadow-2xl shadow-black/20' : 'lf-card'
              )}
            >
              <div className='flex items-center justify-between gap-3'>
                <h3 className='text-[20px] font-semibold'>{p.name}</h3>
                {p.featured && (
                  <span className='bg-(color:--color-n3-accent) text-(color:--color-n3-ink) rounded-full px-3 py-1 text-[12.5px] font-semibold'>
                    Most popular
                  </span>
                )}
              </div>
              <p className={cn('mt-3 text-[15px] leading-relaxed', p.featured ? 'text-white/65' : 'text-(color:--color-n3-grey)')}>
                {p.blurb}
              </p>
              <p className='mt-7 flex items-baseline gap-1'>
                <span className='text-[44px] font-medium tracking-[-0.03em]'>{p.price}</span>
                {p.period && (
                  <span className={cn('text-[15px]', p.featured ? 'text-white/60' : 'text-(color:--color-n3-grey)')}>
                    {p.period}
                  </span>
                )}
              </p>
              <ul className='mt-7 mb-9 flex flex-col gap-3'>
                {p.features.map(f => (
                  <li key={f} className='flex items-start gap-3 text-[15px]'>
                    <Check
                      className={cn('mt-0.5 size-4.5 shrink-0', p.featured ? 'text-(color:--color-n3-accent)' : 'text-(color:--color-n3-accent-deep)')}
                      strokeWidth={2.2}
                      aria-hidden
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href='#start'
                className={cn(
                  'mt-auto inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[15.5px] font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2',
                  p.featured
                    ? 'bg-(color:--color-n3-accent) text-(color:--color-n3-ink) hover:bg-white focus-visible:outline-white'
                    : 'bg-(color:--color-n3-ink) hover:bg-(color:--color-n3-accent-deep) focus-visible:outline-(color:--color-n3-accent) text-white'
                )}
              >
                {p.cta}
                <ArrowRight className='size-4' strokeWidth={1.8} aria-hidden />
              </a>
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  </section>
)

const Resources = () => (
  <section aria-labelledby='resources-title' id='resources' className={SECTION}>
    <div className={cn(FRAME, 'grid gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20')}>
      <SectionHead
        id='resources-title'
        eyebrow='Resources'
        title={
          <>
            Questions, <Accent>answered.</Accent>
          </>
        }
        body='The things teams ask us most before they switch. Anything else? Book a call and ask us directly.'
      />
      {/* Native details/summary: keyboard and screen-reader support built in, and the answers stay findable with Ctrl+F. */}
      <Reveal className='lf-faq flex flex-col gap-3'>
        {FAQS.map(f => (
          <details key={f.q} className='lf-card group px-6'>
            <summary className='py-5 text-[17px] font-medium'>{f.q}</summary>
            <p className='text-(color:--color-n3-grey) pb-6 pl-[calc(1em+0.75rem)] text-[15.5px] leading-relaxed'>{f.a}</p>
          </details>
        ))}
      </Reveal>
    </div>
  </section>
)

// â”€â”€â”€â”€â”€ Book a call â”€â”€â”€â”€â”€
/**
 * Native validation (required, type=email) shows errors with :user-invalid, so nothing turns red
 * before you have typed. This keeps aria-invalid and the error link in step with what is shown.
 */
const syncField = (el: EventTarget) => {
  if (!(el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)) return

  const invalid = el.matches(':user-invalid')
  const errorId = el.dataset.error

  el.setAttribute('aria-invalid', String(invalid))
  if (errorId) {
    if (invalid) el.setAttribute('aria-describedby', errorId)
    else el.removeAttribute('aria-describedby')
  }
}

type FieldProps = {
  name: string
  label: string
  type?: string
  autoComplete: string
  required?: boolean
  error?: string
  multiline?: boolean
}

const Field = ({ name, label, type = 'text', autoComplete, required, error, multiline }: FieldProps) => {
  const id = `lf-${name}`
  const errorId = `${id}-error`
  const shared = {
    id,
    name,
    autoComplete,
    required,
    'aria-invalid': false as const,
    'data-error': error ? errorId : undefined,
    className: 'lf-input'
  }

  return (
    <div className='flex flex-col gap-2'>
      <label htmlFor={id} className='text-[14.5px] font-medium text-white/85'>
        {label}
        {!required && <span className='font-normal text-white/45'> (optional)</span>}
      </label>
      {multiline ? <textarea rows={4} {...shared} /> : <input type={type} {...shared} />}
      {error && (
        <p id={errorId} className='lf-error text-[13.5px]'>
          {error}
        </p>
      )}
    </div>
  )
}

const BookCall = () => {
  // States
  const [sentTo, setSentTo] = useState<string | null>(null)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    // The browser has already checked the fields; this demo has no server, so it just says thanks.
    e.preventDefault()
    const name = new FormData(e.currentTarget).get('name')

    setSentTo(typeof name === 'string' ? name.trim().split(' ')[0] : '')
  }

  const handleSync = (e: SyntheticEvent) => syncField(e.target)

  return (
    <section aria-labelledby='start-title' id='start' className={cn(SECTION, 'bg-(color:--color-n3-ink) text-white')}>
      <div className={cn(FRAME, 'grid gap-14 lg:grid-cols-2 lg:gap-20')}>
        <div>
          <SectionHead
            id='start-title'
            eyebrow='Book a free call'
            invert
            title={
              <>
                See your books, <Accent>handled.</Accent>
              </>
            }
            body="Tell us a little about your business. In a 30-minute call we'll look at how you do your books today and show you what Ledgerly would change."
          />
          <Reveal delay={0.1}>
            <ul className='mt-10 flex flex-col gap-4'>
              {['No commitment, no sales pressure', 'A clear quote by the end of the call', 'Up and running in under two weeks'].map(t => (
                <li key={t} className='flex items-center gap-3 text-[16px] text-white/80'>
                  <CircleCheck className='text-(color:--color-n3-accent) size-5 shrink-0' strokeWidth={1.8} aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.12} className='rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-7 sm:p-9'>
          {sentTo !== null ? (
            <div role='status' className='flex h-full min-h-80 flex-col items-start justify-center'>
              <IconTile icon={CircleCheck} invert />
              <p className='mt-6 text-[26px] font-medium tracking-[-0.02em]'>Thanks{sentTo ? `, ${sentTo}` : ''}!</p>
              <p className='mt-3 text-[16px] leading-relaxed text-white/70'>
                We&apos;ll email you within one business day to find a time that suits you.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              onBlur={handleSync}
              onInput={handleSync}
              onInvalid={handleSync}
              className='flex flex-col gap-5'
            >
              <div className='grid gap-5 sm:grid-cols-2'>
                <Field name='name' label='Full name' autoComplete='name' required error='Please enter your name.' />
                <Field
                  name='email'
                  label='Work email'
                  type='email'
                  autoComplete='email'
                  required
                  error='Please enter a valid email, like name@company.com.'
                />
              </div>
              <Field name='company' label='Company' autoComplete='organization' />
              <Field name='message' label='What would you like help with?' autoComplete='off' multiline />
              <button
                type='submit'
                className='bg-(color:--color-n3-accent) text-(color:--color-n3-ink) mt-2 inline-flex h-13 items-center justify-center gap-2 rounded-full px-7 text-[16px] font-medium transition-colors duration-200 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'
              >
                Book my free call
                <ArrowRight className='size-4' strokeWidth={1.8} aria-hidden />
              </button>
              <p className='text-[13px] text-white/45'>Demo site: this form isn&apos;t connected, so nothing is sent.</p>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  )
}

const Footer = () => (
  <footer className='border-(color:--color-n3-line) border-t'>
    <div className={cn(FRAME, 'flex flex-col gap-10 py-14 lg:flex-row lg:items-start lg:justify-between')}>
      <div className='max-w-sm'>
        <a href='#top' aria-label='Ledgerly home' className='flex items-center gap-2.5'>
          <LedgerlyMark className='size-8' />
          <span className='text-[22px] font-medium tracking-[-0.04em]'>Ledgerly</span>
        </a>
        <p className='text-(color:--color-n3-grey) mt-4 text-[15px] leading-relaxed'>
          Your AI-powered accounting firm: daily bookkeeping, reconciliation and forecasting, reviewed by people.
        </p>
      </div>
      <nav aria-label='Footer'>
        <ul className='grid grid-cols-2 gap-x-12 gap-y-3 sm:grid-cols-3'>
          {FOOTER_LINKS.map(l => (
            <li key={l.href}>
              <a href={l.href} className='hover:text-(color:--color-n3-accent-deep) text-[15px] transition-colors duration-200'>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
    <div className={cn(FRAME, 'text-(color:--color-n3-grey) border-(color:--color-n3-line) flex flex-col gap-2 border-t py-6 text-[13.5px] sm:flex-row sm:justify-between')}>
      <p>Â© 2026 Ledgerly. All rights reserved.</p>
      <p>Ledgerly is a fictional company, designed and built as a portfolio project.</p>
    </div>
  </footer>
)

// Styles that Tailwind classes can't express: the FAQ marker and animation, and the form's error states.
const SECTIONS_CSS = `
.lf-h2 {
  font-size: clamp(2rem, 1.2rem + 2.4vw, 3.25rem);
  line-height: 1.08;
  letter-spacing: -0.03em;
  font-weight: 400;
  text-wrap: balance;
}

.lf-card {
  border: 1px solid rgb(23 23 23 / 0.07);
  border-radius: 1.3rem;
  background: rgb(255 255 255 / 0.72);
  box-shadow: 0 1px 2px rgb(60 50 40 / 0.04), 0 14px 34px -22px rgb(90 78 62 / 0.28);
}

.lf-band {
  background: linear-gradient(180deg, transparent, color-mix(in srgb, var(--color-n3-accent) 7%, transparent) 30%, transparent);
}

/* FAQ: our own chevron next to the question, rotated rather than swapped so it can animate. */
.lf-faq summary {
  list-style: none;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}
.lf-faq summary::-webkit-details-marker { display: none; }
.lf-faq summary::before {
  content: '';
  inline-size: 1em;
  block-size: 1em;
  flex-shrink: 0;
  background-color: var(--color-n3-accent-deep);
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E") no-repeat center / contain;
  rotate: -90deg;
}
.lf-faq details[open] > summary::before { rotate: 0deg; }
.lf-faq summary:focus-visible { outline: 2px solid var(--color-n3-accent-deep); outline-offset: 4px; border-radius: 6px; }

/* Slide open and shut where the browser supports it; elsewhere they simply open. */
.lf-faq details::details-content {
  interpolate-size: allow-keywords;
  overflow: clip;
  contain: layout;
}
.lf-faq details:not([open])::details-content { block-size: 0; }

@media (prefers-reduced-motion: no-preference) {
  .lf-faq summary::before { transition: rotate 0.2s; }
  .lf-faq details::details-content {
    transition: block-size, content-visibility;
    transition-duration: 0.3s;
    transition-timing-function: ease-in-out;
    transition-behavior: allow-discrete;
  }
}

/* Form fields on the dark band. Errors appear only after you've interacted (:user-invalid). */
.lf-input {
  width: 100%;
  border: 1px solid rgb(255 255 255 / 0.14);
  border-radius: 0.85rem;
  background: rgb(255 255 255 / 0.06);
  padding: 0.8rem 1rem;
  font-size: 16px;
  color: #fff;
  transition: border-color 0.2s, background-color 0.2s;
}
.lf-input:focus-visible {
  outline: none;
  border-color: var(--color-n3-accent);
  background: rgb(255 255 255 / 0.09);
}
.lf-input:user-invalid { border-color: #f59e8b; }
.lf-error { display: none; color: #f8b4a6; }
.lf-input:user-invalid ~ .lf-error { display: block; }
.lf-input:user-valid { border-color: color-mix(in srgb, var(--color-n3-accent) 70%, transparent); }
`

const LedgerlySections = () => (
  <>
    <style>{SECTIONS_CSS}</style>
    {/* reducedMotion='user': the reveal animations are skipped for people who ask for less motion. */}
    <MotionConfig reducedMotion='user'>
      <LazyMotion features={domAnimation}>
        <Product />
        <HowItWorks />
        <Solutions />
        <Pricing />
        <Resources />
        <BookCall />
        <Footer />
      </LazyMotion>
    </MotionConfig>
  </>
)

export default LedgerlySections
