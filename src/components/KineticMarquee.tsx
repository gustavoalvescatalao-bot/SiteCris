import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

/**
 * "A t o d o  g a s" — infinite marquee whose letter-spacing breathes open as it
 * crosses the viewport and whose speed follows scroll velocity.
 */
export default function KineticMarquee({ words, reverse = false }: { words: string[]; reverse?: boolean }) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const rows = gsap.utils.toArray<HTMLElement>('.mq-track')
      const loops = rows.map((row, i) => {
        const dir = (i % 2 === 0) !== reverse ? -1 : 1
        gsap.set(row, { xPercent: dir === -1 ? 0 : -50 })
        return gsap.to(row, { xPercent: dir === -1 ? -50 : 0, ease: 'none', duration: 38 + i * 8, repeat: -1 })
      })

      gsap.fromTo(
        '.mq-text',
        { letterSpacing: '0.02em' },
        {
          letterSpacing: '0.55em',
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      )

      ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const v = Math.min(Math.abs(self.getVelocity()) / 400, 6)
          loops.forEach((l) =>
            gsap.to(l, {
              timeScale: 1 + v,
              duration: 0.2,
              overwrite: true,
              onComplete: () => void gsap.to(l, { timeScale: 1, duration: 1.2 }),
            }),
          )
        },
      })
    },
    { scope: root, dependencies: [words.join('|')], revertOnUpdate: true },
  )

  const sequence = (outline: boolean) =>
    Array.from({ length: 4 }).flatMap((_, k) =>
      words.map((w, j) => (
        <span key={`${k}-${j}`} className="flex items-center">
          <span className={`mq-text whitespace-nowrap ${outline ? 'text-outline-fg font-serif italic' : 'font-sans font-light'}`}>
            {w}
          </span>
          <span className="mx-[0.6em] inline-block h-[0.18em] w-[0.18em] rotate-45 bg-[var(--fg)] opacity-60" />
        </span>
      )),
    )

  return (
    <div ref={root} className="relative select-none overflow-hidden border-y border-[var(--line)] py-6 md:py-10" aria-hidden>
      <div className="mq-track flex w-max text-[clamp(2.2rem,7vw,6.5rem)] leading-none">{sequence(false)}</div>
      <div className="mq-track mt-3 flex w-max text-[clamp(2.2rem,7vw,6.5rem)] leading-none md:mt-5">{sequence(true)}</div>
    </div>
  )
}
