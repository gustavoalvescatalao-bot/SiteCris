import { useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowUpRight, Plus, Check } from 'lucide-react'
import { CATEGORIES, PALETTE, PRODUCTS, productsBy, type Category, type CategoryId, type Product } from '../data/catalog'
import { setTheme, useStore } from '../lib/store'
import TiltCard from './TiltCard'
import { useI18n } from '../i18n'

const PER_CATEGORY = 4
const ROTATIONS = [-3, 2.5, -1.5, 3.5]

function pick(c: CategoryId): Product[] {
  const all = productsBy(c)
  const featured = all.filter((p) => p.featured)
  return [...featured, ...all.filter((p) => !p.featured)].slice(0, PER_CATEGORY)
}

function ChapterPanel({ cat }: { cat: Category }) {
  const { openCatalog } = useStore()
  const { t, l } = useI18n()
  const count = productsBy(cat.id).length
  return (
    <section
      data-panel
      data-cat={cat.id}
      data-bg={cat.bg}
      data-fg={cat.fg}
      className="relative flex h-full w-screen shrink-0 items-center overflow-hidden px-5 md:px-14"
    >
      <h3
        data-parallax
        aria-hidden
        className="pointer-events-none absolute left-[8%] top-1/2 -translate-y-1/2 whitespace-nowrap font-serif text-[34vh] font-light italic leading-none opacity-[0.13]"
      >
        {l(cat.short)}
      </h3>

      <div className="relative z-10 grid w-full items-center gap-8 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="text-[10px] uppercase spaced opacity-70">
            {t.showcase.chapter(cat.index)} — {l(cat.kicker)}
          </p>
          <h2 className="mt-5 font-serif text-[clamp(2.6rem,6vw,6.2rem)] font-light leading-[0.9]">{l(cat.title)}</h2>
          <p className="mt-6 max-w-md text-sm leading-relaxed opacity-80 md:text-base">{l(cat.description)}</p>
          <button
            onClick={() => openCatalog(cat.id)}
            className="group mt-8 inline-flex items-center gap-3 rounded-full border border-current/30 px-6 py-3 text-[11px] uppercase tracking-[0.25em] transition-colors hover:bg-[var(--fg)] hover:text-[var(--bg)]"
          >
            {t.showcase.viewAll(count)}
            <ArrowUpRight size={14} className="transition-transform duration-500 group-hover:rotate-45" />
          </button>
        </div>
        <div className="relative hidden h-[64vh] md:col-span-6 md:col-start-7 md:block">
          <TiltCard
            images={[cat.cover]}
            alt={`${l(cat.title)} — ${t.showcase.collage}`}
            rotate={-4}
            cursor={t.cursor.explore}
            onClick={() => openCatalog(cat.id)}
            className="absolute right-[6%] top-0 h-full w-[68%]"
          />
        </div>
        <div className="relative h-[42vh] md:hidden">
          <TiltCard
            images={[cat.cover]}
            alt={`${l(cat.title)} — ${t.showcase.collage}`}
            rotate={-3}
            cursor={t.cursor.explore}
            onClick={() => openCatalog(cat.id)}
            className="mx-auto h-full w-[78%]"
          />
        </div>
      </div>
    </section>
  )
}

function ProductPanel({ p, n, total }: { p: Product; n: number; total: number }) {
  const { openProduct, wishlist, toggleWish } = useStore()
  const { t, l, mat, price, size } = useI18n()
  const inList = wishlist.includes(p.id)
  return (
    <article
      data-panel
      data-cat={p.category}
      data-bg={p.tone}
      data-fg={PALETTE.travertine}
      className="relative flex h-full w-screen shrink-0 flex-col justify-center gap-5 px-6 pb-16 pt-24 md:pb-0 md:pt-0 md:w-[58vw] md:flex-row md:items-center md:gap-10 md:px-10 lg:w-[48vw]"
    >
      <TiltCard
        images={p.images}
        alt={l(p.name)}
        cursor={t.cursor.view}
        rotate={ROTATIONS[n % ROTATIONS.length]}
        onClick={() => openProduct(p)}
        className="mx-auto h-[40svh] w-[68%] shrink-0 md:mx-0 md:h-[66vh] md:w-[56%]"
      />
      <div className="md:w-[44%]">
        <p className="font-sans text-[10px] uppercase spaced opacity-60 tabular-nums">
          {String(n + 1).padStart(2, '0')} / {String(total).padStart(2, '0')} · {t.common.page} {p.pages.join(', ')}
        </p>
        <h4 className="mt-3 font-serif text-[clamp(1.8rem,3vw,3rem)] font-light leading-[0.98]">{l(p.name)}</h4>
        <ul className="mt-4 hidden flex-wrap gap-1.5 sm:flex">
          {p.materials.slice(0, 4).map((m) => (
            <li key={m} className="rounded-full border border-current/25 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] opacity-80">
              {mat(m)}
            </li>
          ))}
        </ul>
        <div className="mt-5 flex items-baseline gap-4">
          <span className="font-serif text-4xl">{price(p)}</span>
          {p.size && <span className="text-[11px] uppercase tracking-[0.25em] opacity-70">{size(p.size)}</span>}
        </div>
        <div className="mt-6 flex gap-2">
          <button
            onClick={() => openProduct(p)}
            className="rounded-full bg-[var(--fg)] px-5 py-2.5 text-[10px] uppercase tracking-[0.25em] text-[var(--bg)] transition-transform hover:scale-[1.03]"
          >
            {t.showcase.viewPiece}
          </button>
          <button
            onClick={() => toggleWish(p.id)}
            aria-label={inList ? t.showcase.removeInquiry : t.showcase.addInquiry}
            className="flex items-center gap-2 rounded-full border border-current/30 px-4 py-2.5 text-[10px] uppercase tracking-[0.2em] transition-colors hover:bg-white/10"
          >
            {inList ? <Check size={13} /> : <Plus size={13} />} {inList ? t.showcase.added : t.showcase.inquiry}
          </button>
        </div>
      </div>
    </article>
  )
}

export default function Showcase() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState<CategoryId>('fiber')
  const { lenis, openCatalog } = useStore()
  const { t, l } = useI18n()
  const stRef = useRef<ScrollTrigger | null>(null)

  const panels = CATEGORIES.flatMap((c) => [
    { kind: 'chapter' as const, cat: c },
    ...pick(c.id).map((p) => ({ kind: 'product' as const, p })),
  ])
  const productTotal = panels.filter((x) => x.kind === 'product').length

  useGSAP(
    () => {
      const el = track.current!
      const distance = () => el.scrollWidth - window.innerWidth

      const tween = gsap.to(el, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => gsap.set('.sc-progress', { scaleX: self.progress }),
        },
      })
      stRef.current = tween.scrollTrigger ?? null

      // Palette follows the panel in the centre of the screen — but only while the
      // showcase owns the viewport (panel triggers also evaluate before the pin starts).
      const first = el.querySelector<HTMLElement>('[data-panel]')!
      const current = { bg: first.dataset.bg!, fg: first.dataset.fg! }
      let inside = false
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top 55%',
        end: () => `+=${distance() + window.innerHeight * 0.9}`,
        invalidateOnRefresh: true,
        onToggle: (self) => {
          inside = self.isActive
          if (inside) setTheme(current.bg, current.fg, 0.9)
        },
      })

      gsap.utils.toArray<HTMLElement>('[data-panel]').forEach((panel) => {
        ScrollTrigger.create({
          trigger: panel,
          containerAnimation: tween,
          start: 'left 55%',
          end: 'right 45%',
          onToggle: (self) => {
            if (!self.isActive) return
            current.bg = panel.dataset.bg!
            current.fg = panel.dataset.fg!
            if (inside) setTheme(current.bg, current.fg, 0.9)
            setActive(panel.dataset.cat as CategoryId)
          },
        })
      })

      // Giant chapter titles drift behind the content
      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((t) => {
        gsap.fromTo(
          t,
          { xPercent: 25 },
          {
            xPercent: -45,
            ease: 'none',
            scrollTrigger: { trigger: t.parentElement, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
          },
        )
      })

      // Cards float in from a deeper angle as they enter
      gsap.utils.toArray<HTMLElement>('article[data-panel] > div:first-child').forEach((card) => {
        gsap.fromTo(
          card,
          { y: 90, rotation: 8, scale: 0.9, opacity: 0.3 },
          {
            y: 0,
            rotation: 0,
            scale: 1,
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left 95%', end: 'left 45%', scrub: true },
          },
        )
      })
    },
    { scope: root },
  )

  const jumpTo = (cat: CategoryId) => {
    const st = stRef.current
    const panel = track.current?.querySelector<HTMLElement>(`[data-panel][data-cat="${cat}"]`)
    if (!st || !panel || !track.current) return
    const max = track.current.scrollWidth - window.innerWidth
    const y = st.start + (panel.offsetLeft / max) * (st.end - st.start) + 2
    if (lenis) lenis.scrollTo(y, { duration: 1.8 })
    else window.scrollTo({ top: y, behavior: 'smooth' })
  }

  return (
    <section id="collection" ref={root} className="relative h-[100svh] overflow-hidden">
      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 pt-20 md:px-10 md:pt-24">
        <p className="text-[10px] uppercase spaced opacity-70">{t.showcase.label}</p>
        <p className="hidden text-[10px] uppercase spaced opacity-70 md:block">{t.showcase.count(PRODUCTS.length)}</p>
      </div>

      <div ref={track} className="flex h-full w-max will-change-transform">
        {panels.map((x, i) =>
          x.kind === 'chapter' ? (
            <ChapterPanel key={`c-${x.cat.id}`} cat={x.cat} />
          ) : (
            <ProductPanel
              key={x.p.id}
              p={x.p}
              n={panels.slice(0, i).filter((y) => y.kind === 'product').length}
              total={productTotal}
            />
          ),
        )}
        <div data-panel data-cat="acrylic" data-bg={PALETTE.onyx} data-fg={PALETTE.sand} className="flex h-full w-screen shrink-0 flex-col items-center justify-center gap-8 px-6 text-center md:w-[60vw]">
          <p className="text-[10px] uppercase spaced opacity-70">{t.showcase.more}</p>
          <h3 className="font-serif text-[clamp(2.6rem,6vw,6rem)] font-light italic leading-[0.9]">{t.showcase.fullTitle}</h3>
          <button
            onClick={() => openCatalog('all')}
            data-cursor={t.cursor.open}
            className="rounded-full bg-sand px-8 py-4 text-[11px] uppercase tracking-[0.3em] text-onyx transition-transform hover:scale-105"
          >
            {t.showcase.seeAll(PRODUCTS.length)}
          </button>
        </div>
      </div>

      {/* Category pills + progress */}
      <div className="absolute inset-x-0 bottom-0 z-20 px-5 pb-5 md:px-10 md:pb-8">
        <div className="hide-scrollbar flex items-center gap-2 overflow-x-auto">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => jumpTo(c.id)}
              className={`shrink-0 rounded-full border px-4 py-2 text-[10px] uppercase tracking-[0.22em] backdrop-blur-md transition-all duration-500 ${
                active === c.id ? 'border-transparent bg-[var(--fg)] text-[var(--bg)]' : 'border-current/30 hover:border-current'
              }`}
            >
              <span className="mr-1.5 opacity-60">{c.index}</span>
              {l(c.short)}
            </button>
          ))}
          <button
            onClick={() => openCatalog('all')}
            className="ml-auto shrink-0 rounded-full border border-current/30 px-4 py-2 text-[10px] uppercase tracking-[0.22em] transition-colors hover:bg-[var(--fg)] hover:text-[var(--bg)]"
          >
            {t.showcase.fullPill}
          </button>
        </div>
        <div className="mt-4 h-px w-full bg-current/20">
          <div className="sc-progress h-full origin-left scale-x-0 bg-current" />
        </div>
      </div>
    </section>
  )
}
