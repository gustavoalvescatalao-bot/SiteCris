import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/** A soft follower cursor that grows over [data-cursor] elements and shows their label. */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const el = ref.current!
    const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3' })
    const move = (e: PointerEvent) => {
      xTo(e.clientX)
      yTo(e.clientY)
      const t = (e.target as HTMLElement).closest<HTMLElement>('[data-cursor]')
      const text = t?.dataset.cursor ?? ''
      if (label.current && label.current.textContent !== text) label.current.textContent = text
      gsap.to(el, { scale: t ? 1 : 0.18, duration: 0.4, ease: 'power3', overwrite: 'auto' })
    }
    gsap.set(el, { scale: 0.18, opacity: 1 })
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[95] -ml-11 -mt-11 hidden h-22 w-22 items-center justify-center rounded-full bg-travertine/90 text-center text-[9px] font-medium uppercase tracking-[0.25em] text-onyx opacity-0 mix-blend-normal backdrop-blur-sm md:flex"
    >
      <span ref={label} />
    </div>
  )
}
