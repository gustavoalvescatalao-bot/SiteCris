import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { PALETTE } from '../data/catalog'
import { useSectionTheme } from '../lib/store'
import { useI18n } from '../i18n'

const COLS = [
  { speed: -18, imgs: [1, 4, 7] },
  { speed: 14, imgs: [2, 5, 8] },
  { speed: -30, imgs: [3, 6, 1] },
]

export default function Details() {
  const root = useRef<HTMLElement>(null)
  const { t } = useI18n()
  useSectionTheme(root, PALETTE.sand, PALETTE.onyx)

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>('.dt-col').forEach((col) => {
        gsap.fromTo(
          col,
          { yPercent: -Number(col.dataset.speed) / 2 },
          {
            yPercent: Number(col.dataset.speed),
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      })
      gsap.utils.toArray<HTMLElement>('.dt-img').forEach((img) => {
        gsap.fromTo(
          img,
          { clipPath: 'inset(18% 10% 18% 10% round 999px)' },
          {
            clipPath: 'inset(0% 0% 0% 0% round 6px)',
            ease: 'power2.out',
            scrollTrigger: { trigger: img, start: 'top 95%', end: 'top 45%', scrub: true },
          },
        )
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} className="relative overflow-hidden px-5 py-28 md:px-10 md:py-40">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:sticky md:top-32 md:col-span-4 md:self-start">
          <p className="text-[10px] uppercase spaced opacity-70">{t.details.label}</p>
          <h2 className="mt-4 font-serif text-[clamp(2.6rem,5.5vw,5.6rem)] font-light leading-[0.92]">
            {t.details.titleA} <span className="italic">{t.details.titleB}</span>
          </h2>
          <p className="mt-6 max-w-sm text-sm leading-relaxed opacity-80">
            {t.details.text}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 md:col-span-8 md:grid-cols-3 md:gap-5">
          {COLS.map((c, ci) => (
            <div key={ci} className={`dt-col flex flex-col gap-3 md:gap-5 ${ci === 2 ? 'hidden md:flex' : ''}`} data-speed={c.speed}>
              {c.imgs.map((n, k) => (
                <figure key={k} className="group">
                  <img
                    src={`/images/generated/detail-${n}.jpg`}
                    alt={t.details.captions[n]}
                    loading="lazy"
                    className="dt-img aspect-[9/11] w-full object-cover transition-transform duration-[1.2s] ease-luxe group-hover:scale-[1.03]"
                  />
                  <figcaption className="mt-2 text-[10px] uppercase tracking-[0.22em] opacity-60">{t.details.captions[n]}</figcaption>
                </figure>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
