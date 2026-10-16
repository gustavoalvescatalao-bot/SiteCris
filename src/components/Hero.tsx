import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { BRAND, PALETTE } from '../data/catalog'
import { setTheme, useSectionTheme } from '../lib/store'
import { useI18n } from '../i18n'

/**
 * Giant "W" monogram (from page 2 of the catalog) punched out of a travertine sheet.
 * Scrolling zooms through the letter and reveals the signature fiber family behind it.
 */
export default function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null)
  const { t } = useI18n()
  const [vp, setVp] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }))
  useSectionTheme(root, PALETTE.sand, PALETTE.onyx)

  useEffect(() => {
    // Ignore height-only changes (mobile URL bar) to avoid rebuilding the pin mid-scroll.
    const fit = () =>
      setVp((v) => (v.w === window.innerWidth && v.h > 0 ? v : { w: window.innerWidth, h: window.innerHeight }))
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  const fontSize = Math.min(vp.w * 0.78, vp.h * 0.92)
  const cx = vp.w / 2
  const cy = vp.h / 2 + fontSize * 0.3

  // Intro (after preloader)
  useGSAP(
    () => {
      if (!ready) return
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.from('.hero-w', { opacity: 0, y: 60, duration: 1.6 })
        .from('.hero-line > span', { yPercent: 110, duration: 1.3, stagger: 0.09 }, '-=1.2')
        .from('.hero-meta', { opacity: 0, y: 14, duration: 1, stagger: 0.08 }, '-=1')
        .from('.hero-scroll', { opacity: 0, duration: 1 }, '-=.6')
    },
    { scope: root, dependencies: [ready] },
  )

  // Scroll: zoom through the W, then settle on the image.
  useGSAP(
    () => {
      setTheme(PALETTE.sand, PALETTE.onyx, 0)
      if (!fontSize) return // zero-size viewport (hidden tab) — the resize handler rebuilds this
      // Zoom the letter around a point inside its thick stroke; written as an explicit SVG
      // matrix so it never fights the intro tween on the parent <g>.
      const w = root.current!.querySelector<SVGTextElement>('.hero-mask-w')!
      const ox = cx - fontSize * 0.225 // centre of the thick left stroke (measured on Cormorant 500)
      const oy = cy - fontSize * 0.3
      const zoom = { s: 1 }
      // enough scale for the ~0.084em stroke to swallow the whole viewport
      const maxScale = (Math.max(vp.w, vp.h) / (fontSize * 0.084)) * 1.3
      const applyZoom = () => w.setAttribute('transform', `translate(${ox} ${oy}) scale(${zoom.s}) translate(${-ox} ${-oy})`)
      applyZoom()
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: '+=220%',
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          refreshPriority: 10,
        },
      })
      tl.to('.hero-copy', { yPercent: -40, opacity: 0, ease: 'power2.in', duration: 0.35 }, 0)
        .to('.hero-elcome', { opacity: 0, duration: 0.15 }, 0)
        .to(zoom, { s: maxScale, ease: 'power3.in', duration: 1, onUpdate: applyZoom }, 0)
        .to('.hero-sheet', { opacity: 0, ease: 'power1.in', duration: 0.3 }, 0.75)
        .fromTo('.hero-img', { scale: 1.35 }, { scale: 1, ease: 'power2.out', duration: 1.2 }, 0)
        .fromTo('.hero-veil', { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.9)
        .fromTo('.hero-caption > *', { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, duration: 0.3 }, 0.95)
    },
    { scope: root, dependencies: [cx, cy, fontSize], revertOnUpdate: true },
  )

  // When the hero pin is rebuilt (resize), later triggers must be re-measured after it.
  useEffect(() => {
    ScrollTrigger.sort()
    ScrollTrigger.refresh()
  }, [vp.w])

  return (
    <section id="top" ref={root} className="relative h-[100svh] w-full overflow-hidden">
      {/* Revealed image: the signature fiber family (generated montage) */}
      <picture>
        <source media="(max-aspect-ratio: 3/4)" srcSet="/images/generated/hero-family-mobile.jpg" />
        <img
          src="/images/generated/hero-family.jpg"
          alt={t.hero.alt}
          className="hero-img absolute inset-0 h-full w-full object-cover will-change-transform"
        />
      </picture>

      {/* Travertine sheet with the W punched out */}
      <svg
        className="hero-sheet pointer-events-none absolute inset-0 h-full w-full"
        viewBox={`0 0 ${vp.w} ${vp.h}`}
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <mask id="w-mask" maskUnits="userSpaceOnUse" x="0" y="0" width={vp.w} height={vp.h}>
            <rect width={vp.w} height={vp.h} fill="white" />
            <g className="hero-w">
            <text
              className="hero-mask-w"
              x={cx}
              y={cy}
              textAnchor="middle"
              fontFamily="Cormorant Garamond, Georgia, serif"
              fontWeight={500}
              fontSize={fontSize}
              fill="black"
            >
              W
            </text>
            </g>
          </mask>
        </defs>
        <rect width={vp.w} height={vp.h} fill="var(--bg)" mask="url(#w-mask)" />
        <text
          className="hero-elcome"
          x={cx + fontSize * 0.2}
          y={cy - fontSize * 0.02}
          fontFamily="Plus Jakarta Sans, sans-serif"
          fontSize={Math.max(10, fontSize * 0.028)}
          letterSpacing="0.3em"
          fill="var(--fg)"
        >
          ELCOME
        </text>
      </svg>

      {/* Copy */}
      <div className="hero-copy pointer-events-none absolute inset-0 flex flex-col justify-between px-5 pb-8 pt-24 md:px-10 md:pb-10">
        <div className="flex justify-between text-[10px] uppercase spaced">
          <span className="hero-meta">WC Knots &amp; Crafts</span>
          <span className="hero-meta hidden sm:inline">Decor — {BRAND.year}</span>
          <span className="hero-meta">{t.common.handmade}</span>
        </div>

        <div className="flex items-end justify-between gap-6">
          <h1 className="max-w-[16ch] font-serif text-[clamp(2rem,4.6vw,4.4rem)] font-light leading-[0.98]">
            <span className="hero-line line-mask">
              <span className="block">{t.hero.line1}</span>
            </span>
            <span className="hero-line line-mask">
              <span className="block italic">{t.hero.line2}</span>
            </span>
          </h1>
          <div className="hero-scroll hidden flex-col items-center gap-3 sm:flex">
            <span className="text-[10px] uppercase spaced [writing-mode:vertical-rl]">{t.hero.scroll}</span>
            <span className="relative h-16 w-px overflow-hidden bg-[var(--line)]">
              <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2s_ease-in-out_infinite] bg-[var(--fg)]" />
            </span>
          </div>
        </div>
      </div>

      {/* Soft veil under the caption so it reads over the darker pieces */}
      <div className="hero-veil pointer-events-none opacity-0 absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-[#EFE7DB] via-[#EFE7DB]/60 to-transparent" />

      {/* Caption that lands once the image is revealed */}
      <div className="hero-caption pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between px-5 pb-8 text-onyx md:px-10 md:pb-10">
        <p className="font-serif text-[clamp(2.4rem,7vw,7rem)] font-light leading-[0.85]">
          {t.hero.captionA} <span className="italic">2026</span>
          {t.hero.captionB && (
            <>
              <br />
              {t.hero.captionB}
            </>
          )}
        </p>
        <p className="max-w-[26ch] text-right text-[11px] uppercase leading-relaxed tracking-[0.22em]">
          {t.hero.captionText}
        </p>
      </div>

      <style>{`@keyframes scrollcue{0%{transform:translateY(-100%)}100%{transform:translateY(200%)}}`}</style>
    </section>
  )
}
