import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useI18n } from '../i18n'

interface Props {
  images: string[]
  alt: string
  rotate?: number
  className?: string
  onClick?: () => void
  cursor?: string
  children?: ReactNode
  intensity?: number
}

/** 3D tilt card that follows the pointer; hovering cycles to the next angle of the piece. */
export default function TiltCard({ images, alt, rotate = 0, className = '', onClick, cursor, children, intensity = 12 }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const { t } = useI18n()
  const [idx, setIdx] = useState(0)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [intensity, -intensity]), { stiffness: 150, damping: 18 })
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-intensity, intensity]), { stiffness: 150, damping: 18 })
  const gx = useTransform(mx, [-0.5, 0.5], ['0%', '100%'])
  const gy = useTransform(my, [-0.5, 0.5], ['0%', '100%'])
  const sheen = useTransform([gx, gy], ([x, y]) => `radial-gradient(circle at ${x} ${y}, rgba(255,255,255,.55), transparent 55%)`)

  const onMove = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const timer = useRef<number>(0)
  const onEnter = () => {
    if (images.length < 2) return
    setIdx(1)
    timer.current = window.setInterval(() => setIdx((i) => (i + 1) % images.length), 1200)
  }
  const onLeave = () => {
    window.clearInterval(timer.current)
    mx.set(0)
    my.set(0)
    setIdx(0)
  }
  useEffect(() => () => window.clearInterval(timer.current), [])

  return (
    <div className={`[perspective:1200px] ${className}`} style={{ rotate: `${rotate}deg` }}>
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerEnter={onEnter}
        onPointerLeave={onLeave}
        onClick={onClick}
        data-cursor={cursor ?? t.cursor.view}
        style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
        className="group relative h-full w-full cursor-pointer overflow-hidden rounded-[4px] bg-black/10 shadow-[0_40px_80px_-30px_rgba(0,0,0,.55)]"
      >
        {images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={i === 0 ? alt : `${alt} — ${t.modal.altView(i + 1)}`}
            loading="lazy"
            draggable={false}
            className="absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-luxe group-hover:scale-[1.04]"
            style={{ opacity: i === idx ? 1 : 0 }}
          />
        ))}
        {/* specular sheen that tracks the pointer */}
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 mix-blend-soft-light transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: sheen,
          }}
        />
        {images.length > 1 && (
          <div className="absolute bottom-3 left-3 flex gap-1">
            {images.map((_, i) => (
              <span key={i} className={`h-1 rounded-full bg-white transition-all duration-500 ${i === idx ? 'w-5 opacity-100' : 'w-1.5 opacity-50'}`} />
            ))}
          </div>
        )}
        {children}
      </motion.div>
    </div>
  )
}
