import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const PRELOAD = [
  '/images/generated/hero-family.jpg',
  '/images/generated/hero-family-mobile.jpg',
  '/images/generated/cover-fiber.jpg',
]

export default function Preloader({ onDone }: { onDone: () => void }) {
  const [count, setCount] = useState(0)

  const done = useRef(onDone)
  done.current = onDone

  useEffect(() => {
    let loaded = 0
    let finished = false
    const start = performance.now()
    PRELOAD.forEach((src) => {
      const i = new Image()
      i.onload = i.onerror = () => loaded++
      i.src = src
    })
    // Progress blends real image loading with a minimum show time; hard cap at 4s.
    const id = window.setInterval(() => {
      const t = performance.now() - start
      const real = (loaded / PRELOAD.length) * 100
      const timed = Math.min(100, (t / 1600) * 100)
      const pct = t > 4000 ? 100 : Math.min(real, timed)
      setCount((c) => Math.max(c, Math.round(c + (pct - c) * 0.25)))
      if (pct >= 100 && !finished) {
        finished = true
        setCount(100)
        window.setTimeout(() => done.current(), 350)
        window.clearInterval(id)
      }
    }, 30)
    return () => window.clearInterval(id)
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-onyx text-sand"
      exit={{ clipPath: 'inset(0 0 100% 0)' }}
      initial={{ clipPath: 'inset(0 0 0% 0)' }}
      transition={{ duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative font-serif text-[28vw] leading-none md:text-[14vw]"
      >
        <span className="text-outline">W</span>
        <span
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(${100 - count}% 0 0 0)`, transition: 'clip-path .2s linear' }}
        >
          W
        </span>
      </motion.div>
      <div className="mt-6 flex w-[min(80vw,420px)] items-end justify-between font-sans text-[10px] uppercase spaced opacity-70">
        <span>WC Knots &amp; Crafts</span>
        <span className="tabular-nums">{String(count).padStart(3, '0')}</span>
      </div>
      <div className="mt-3 h-px w-[min(80vw,420px)] bg-sand/20">
        <div className="h-full bg-sand" style={{ width: `${count}%` }} />
      </div>
    </motion.div>
  )
}
