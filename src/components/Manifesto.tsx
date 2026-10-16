import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { motion } from 'framer-motion'
import { BRAND, PALETTE, PILLARS } from '../data/catalog'
import { useSectionTheme } from '../lib/store'
import { useI18n } from '../i18n'

const TAG_STYLES = [
  { bg: PALETTE.terracotta, fg: PALETTE.travertine, rot: -8 },
  { bg: PALETTE.onyx, fg: PALETTE.sand, rot: 5 },
  { bg: PALETTE.travertine, fg: PALETTE.onyx, rot: -3 },
  { bg: PALETTE.sage, fg: PALETTE.travertine, rot: 9 },
  { bg: PALETTE.indigo, fg: PALETTE.travertine, rot: -6 },
  { bg: PALETTE.honey, fg: PALETTE.onyx, rot: 4 },
  { bg: PALETTE.sand, fg: PALETTE.onyx, rot: -10 },
]

export default function Manifesto() {
  const root = useRef<HTMLElement>(null)
  const tagZone = useRef<HTMLDivElement>(null)
  const { t, l, lang } = useI18n()

  useSectionTheme(root, PALETTE.travertine, PALETTE.onyx)

  // Word-by-word ink-in on the manifesto paragraph (rebuilt when the language changes)
  useGSAP(
    () => {
      gsap.fromTo(
        '.mf-word',
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.05,
          ease: 'none',
          scrollTrigger: { trigger: '.mf-text', start: 'top 80%', end: 'bottom 45%', scrub: true },
        },
      )
    },
    { scope: root, dependencies: [lang], revertOnUpdate: true },
  )

  useGSAP(
    () => {
      gsap.from('.mf-title .line-mask > span', {
        yPercent: 110,
        duration: 1.3,
        ease: 'expo.out',
        stagger: 0.1,
        scrollTrigger: { trigger: '.mf-title', start: 'top 80%' },
      })

      gsap.utils.toArray<HTMLElement>('.mf-parallax').forEach((el) => {
        gsap.to(el, {
          yPercent: Number(el.dataset.speed ?? -20),
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
        })
      })

      gsap.from('.mf-tag', {
        y: -260,
        opacity: 0,
        rotate: () => gsap.utils.random(-40, 40),
        duration: 1.4,
        ease: 'bounce.out',
        stagger: 0.08,
        scrollTrigger: { trigger: tagZone.current, start: 'top 75%' },
      })
    },
    { scope: root },
  )

  const words = BRAND.manifesto.map(l).join(' ').split(' ')

  return (
    <section
      id="manifesto"
      ref={root}
      className="relative overflow-hidden px-5 pb-24 pt-28 md:px-10 md:pb-36 md:pt-40"
    >
      <div className="grid gap-14 md:grid-cols-12">
        <div className="md:col-span-4">
          <p className="mb-6 text-[10px] uppercase spaced text-[var(--muted)]">{t.manifesto.label}</p>
          <h2 className="mf-title font-serif text-[clamp(3rem,7vw,7rem)] font-light leading-[0.88]">
            <span className="line-mask"><span className="block">{t.manifesto.title[0]}</span></span>
            <span className="line-mask"><span className="block italic">{t.manifesto.title[1]}</span></span>
            <span className="line-mask"><span className="block">{t.manifesto.title[2]}</span></span>
          </h2>

          <div className="relative mt-14 hidden md:block">
            <img
              src="/images/cutouts/p01-1.webp"
              alt={t.manifesto.handAlt}
              className="mf-parallax relative z-10 w-[62%] drop-shadow-[0_30px_40px_rgba(28,27,26,.25)]"
              data-speed="-25"
              loading="lazy"
            />
            <img
              src="/images/generated/detail-2.jpg"
              alt={t.manifesto.detailAlt}
              className="mf-parallax absolute -right-2 top-24 w-[46%] rounded-sm object-cover shadow-2xl"
              data-speed="-60"
              loading="lazy"
            />
          </div>
        </div>

        <div className="md:col-span-7 md:col-start-6">
          <p className="mf-text font-serif text-[clamp(1.6rem,3.1vw,3rem)] font-light leading-[1.18]">
            {words.map((w, i) => (
              <span key={`${lang}-${i}`} className="mf-word">
                {w}{' '}
              </span>
            ))}
          </p>
          <div className="mt-12 flex items-center gap-6">
            <span className="h-px flex-1 bg-[var(--line)]" />
            <span className="font-serif text-2xl italic">{l(BRAND.signoff)}</span>
          </div>

          {/* Pillars — tumbling, draggable tags */}
          <div ref={tagZone} className="relative mt-16 h-[340px] rounded-[2rem] border border-dashed border-[var(--line)] md:h-[300px]">
            <span className="absolute left-6 top-5 text-[10px] uppercase spaced text-[var(--muted)]">{t.manifesto.tagsHint}</span>
            {PILLARS.map((p, i) => {
              const s = TAG_STYLES[i % TAG_STYLES.length]
              const left = [6, 38, 64, 14, 48, 70, 28][i]
              const top = [30, 22, 48, 62, 66, 18, 42][i]
              return (
                <motion.div
                  key={p.en}
                  drag
                  dragConstraints={tagZone}
                  dragElastic={0.25}
                  whileDrag={{ scale: 1.08, zIndex: 20, cursor: 'grabbing' }}
                  whileHover={{ scale: 1.04 }}
                  className="mf-tag absolute cursor-grab touch-none select-none"
                  style={{ left: `${left}%`, top: `${top}%` }}
                  data-cursor={t.cursor.drag}
                >
                  <span
                    className="block whitespace-nowrap rounded-full px-5 py-3 font-serif text-lg italic shadow-[0_14px_30px_-12px_rgba(0,0,0,.35)] md:text-2xl"
                    style={{ background: s.bg, color: s.fg, transform: `rotate(${s.rot}deg)` }}
                  >
                    {l(p)}
                  </span>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
