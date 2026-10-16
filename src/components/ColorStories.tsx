import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { PALETTE, PRODUCTS } from '../data/catalog'
import { setTheme, useStore } from '../lib/store'
import { useI18n } from '../i18n'
import type { Strings } from '../i18n/strings'

const STORIES: { key: keyof Strings['stories']['items']; hex: string; fg: string; ids: string[] }[] = [
  {
    key: 'terracotta',
    hex: PALETTE.terracotta,
    fg: PALETTE.travertine,
    ids: ['terracotta-flow-obsidian', 'copper-tide-twin-selenite', 'copper-drift-onyx'],
  },
  {
    key: 'sage',
    hex: PALETTE.sage,
    fg: PALETTE.travertine,
    ids: ['sage-twin-teal-agate', 'moss-selenite-jasper', 'tassel-malachite'],
  },
  {
    key: 'indigo',
    hex: PALETTE.indigo,
    fg: PALETTE.travertine,
    ids: ['indigo-selenite-gold', 'tassel-sodalite-heart', 'box-sodalite-pyrite'],
  },
  {
    key: 'onyx',
    hex: PALETTE.onyx,
    fg: PALETTE.sand,
    ids: ['onyx-cascade-selenite', 'tassel-onyx-black', 'totem-black-stone'],
  },
  {
    key: 'sand',
    hex: PALETTE.sand,
    fg: PALETTE.onyx,
    ids: ['compact-golden-knot', 'dual-tone-knot'],
  },
]

export default function ColorStories() {
  const root = useRef<HTMLElement>(null)
  const { openProduct } = useStore()
  const { t, l, price } = useI18n()

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>('.story-card')
      cards.forEach((card, i) => {
        ScrollTrigger.create({
          trigger: card,
          start: 'top 50%',
          end: 'bottom 50%',
          onEnter: () => setTheme(card.dataset.bg!, card.dataset.fg!),
          onEnterBack: () => setTheme(card.dataset.bg!, card.dataset.fg!),
        })
        // previous card recedes as the next one slides over it
        const inner = card.querySelector('.story-inner')
        if (i < cards.length - 1)
          gsap.to(inner, {
            scale: 0.9,
            yPercent: -4,
            filter: 'brightness(.65)',
            ease: 'none',
            scrollTrigger: { trigger: cards[i + 1], start: 'top bottom', end: 'top top', scrub: true },
          })
        gsap.from(card.querySelectorAll('.story-reveal'), {
          yPercent: 110,
          duration: 1.2,
          ease: 'expo.out',
          stagger: 0.08,
          scrollTrigger: { trigger: card, start: 'top 60%' },
        })
      })
    },
    { scope: root },
  )

  return (
    <section id="stories" ref={root} className="relative">
      <div className="px-5 pb-10 pt-28 md:px-10 md:pt-36">
        <p className="text-[10px] uppercase spaced opacity-70">{t.stories.label}</p>
        <h2 className="mt-4 max-w-[14ch] font-serif text-[clamp(2.8rem,7vw,7rem)] font-light leading-[0.9]">
          {t.stories.titleA} <span className="italic">{t.stories.titleB}</span>
        </h2>
      </div>

      {STORIES.map((s, i) => {
        const pieces = s.ids.map((id) => PRODUCTS.find((p) => p.id === id)!).filter(Boolean)
        const copy = t.stories.items[s.key]
        return (
          <div key={s.key} className="story-card sticky top-0 h-[100svh] px-3 py-3 md:px-6 md:py-6" data-bg={s.hex} data-fg={s.fg}>
            <div
              className="story-inner relative h-full w-full origin-top overflow-hidden rounded-[1.6rem] shadow-[0_-30px_60px_-30px_rgba(0,0,0,.45)]"
              style={{ background: s.hex, color: s.fg }}
            >
              <img
                src={`/images/generated/story-${s.key}.jpg`}
                alt={t.stories.alt(copy.name, pieces.map((p) => l(p.name)).join(', '))}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover object-left md:object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-black/40" />
              <div className="relative flex h-full flex-col justify-end p-6 text-travertine md:items-end md:justify-center md:p-14 md:text-right">
                <p className="line-mask text-[10px] uppercase spaced">
                  <span className="story-reveal block">
                    0{i + 1} — {s.hex}
                  </span>
                </p>
                <h3 className="line-mask mt-3 font-serif text-[clamp(3rem,8vw,8rem)] font-light italic leading-[0.9]">
                  <span className="story-reveal block">{copy.name}</span>
                </h3>
                <p className="line-mask mt-3 max-w-sm text-sm md:text-base">
                  <span className="story-reveal block">{copy.line}</span>
                </p>
                <div className="mt-6 flex flex-wrap gap-2 md:justify-end">
                  {pieces.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => openProduct(p)}
                      className="rounded-full border border-white/40 bg-black/15 px-4 py-2 text-[10px] uppercase tracking-[0.18em] backdrop-blur-md transition-colors hover:bg-white hover:text-onyx"
                    >
                      {l(p.name)} · {price(p)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </section>
  )
}
