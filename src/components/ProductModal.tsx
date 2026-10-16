import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Check, Plus, X } from 'lucide-react'
import { CATEGORIES, PRODUCTS, whatsappLink, type Product } from '../data/catalog'
import WhatsApp from './WhatsAppIcon'
import { useStore } from '../lib/store'
import { useI18n } from '../i18n'

export default function ProductModal({ product: p }: { product: Product }) {
  const { closeProduct, openProduct, wishlist, toggleWish, closeCatalog, scrollTo } = useStore()
  const { t, l, mat, price, size } = useI18n()
  const m = t.modal
  const [[idx, dir], setIdx] = useState<[number, number]>([0, 0])
  const n = p.images.length
  const cat = CATEGORIES.find((c) => c.id === p.category)!
  const inList = wishlist.includes(p.id)

  const go = (d: number) => setIdx(([i]) => [(i + d + n) % n, d])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeProduct()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const related = PRODUCTS.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4)

  return (
    <motion.div className="fixed inset-0 z-[70] flex items-end justify-center md:items-center" initial="hidden" animate="show" exit="hidden">
      <motion.div className="absolute inset-0 bg-onyx/70 backdrop-blur-md" variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} onClick={closeProduct} />
      <motion.div
        role="dialog"
        aria-label={l(p.name)}
        data-lenis-prevent
        className="relative grid max-h-[94svh] w-full overflow-y-auto rounded-t-[1.6rem] text-travertine md:max-h-[90vh] md:w-[min(94vw,1240px)] md:grid-cols-[1.15fr_1fr] md:overflow-hidden md:rounded-[1.6rem]"
        style={{ background: p.tone }}
        variants={{ hidden: { y: 80, opacity: 0, scale: 0.97 }, show: { y: 0, opacity: 1, scale: 1 } }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Gallery */}
        <div className="relative aspect-[4/5] overflow-hidden bg-black/20 md:aspect-auto md:h-[90vh]">
          <AnimatePresence initial={false} custom={dir}>
            <motion.img
              key={p.images[idx]}
              src={p.images[idx]}
              alt={`${l(p.name)} — ${m.view(idx + 1, n)}`}
              custom={dir}
              variants={{
                enter: (d: number) => ({ x: d >= 0 ? '100%' : '-100%', scale: 1.1 }),
                center: { x: 0, scale: 1 },
                exit: (d: number) => ({ x: d >= 0 ? '-30%' : '30%', opacity: 0.4 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
              drag={n > 1 ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) go(1)
                else if (info.offset.x > 60) go(-1)
              }}
              className="absolute inset-0 h-full w-full cursor-grab object-cover active:cursor-grabbing"
              draggable={false}
            />
          </AnimatePresence>

          {n > 1 && (
            <>
              <button onClick={() => go(-1)} aria-label={m.prev} className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-travertine/85 text-onyx backdrop-blur transition-transform hover:scale-110">
                <ChevronLeft size={18} />
              </button>
              <button onClick={() => go(1)} aria-label={m.next} className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-travertine/85 text-onyx backdrop-blur transition-transform hover:scale-110">
                <ChevronRight size={18} />
              </button>
              <div className="absolute inset-x-0 bottom-3 flex justify-center gap-2 px-3">
                {p.images.map((src, i) => (
                  <button
                    key={src}
                    onClick={() => setIdx([i, i > idx ? 1 : -1])}
                    aria-label={m.viewN(i + 1)}
                    className={`h-14 w-11 overflow-hidden rounded-md border-2 transition-all ${i === idx ? 'border-travertine' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col p-6 md:overflow-y-auto md:p-10">
          <div className="flex items-start justify-between gap-4">
            <p className="text-[10px] uppercase spaced opacity-70">
              {cat.index} · {l(cat.title)}
            </p>
            <button onClick={closeProduct} aria-label={t.common.close} className="-mr-2 -mt-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/25 transition-transform hover:rotate-90">
              <X size={16} />
            </button>
          </div>
          <h2 className="mt-4 font-serif text-[clamp(2.2rem,4vw,3.6rem)] font-light leading-[0.95]">{l(p.name)}</h2>
          <div className="mt-5 flex items-baseline gap-4 border-b border-white/15 pb-5">
            <span className="font-serif text-5xl">{price(p)}</span>
            {p.size && <span className="text-[11px] uppercase tracking-[0.25em] opacity-75">{m.size} {size(p.size)}</span>}
          </div>
          <p className="mt-5 text-sm leading-relaxed opacity-85 md:text-base">{l(p.description)}</p>

          <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-[10px] uppercase tracking-[0.2em] opacity-60">{m.materials}</dt>
              <dd className="mt-1.5 leading-relaxed">{p.materials.map(mat).join(', ')}</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.2em] opacity-60">{m.origin}</dt>
              <dd className="mt-1.5">{t.common.handmade}</dd>
              <dt className="mt-3 text-[10px] uppercase tracking-[0.2em] opacity-60">{m.catalog}</dt>
              <dd className="mt-1.5">{t.common.page} {p.pages.join(', ')}</dd>
            </div>
          </dl>
          <p className="mt-5 text-[11px] leading-relaxed opacity-60">
            {m.note}
          </p>

          <div className="mt-7 flex flex-wrap gap-2">
            <button
              onClick={() => toggleWish(p.id)}
              className="flex items-center gap-2 rounded-full bg-travertine px-6 py-3 text-[10px] uppercase tracking-[0.22em] text-onyx transition-transform hover:scale-[1.03]"
            >
              {inList ? <Check size={14} /> : <Plus size={14} />} {inList ? m.inList : m.add}
            </button>
            <button
              onClick={() => {
                if (!inList) toggleWish(p.id)
                closeProduct()
                closeCatalog()
                setTimeout(() => scrollTo('#inquire'), 400)
              }}
              className="rounded-full border border-white/30 px-6 py-3 text-[10px] uppercase tracking-[0.22em] hover:bg-white/10"
            >
              {m.inquireNow}
            </button>
            <a
              href={whatsappLink(m.waMsg(l(p.name), price(p), p.pages.join(', ')))}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-full border border-white/30 px-6 py-3 text-[10px] uppercase tracking-[0.22em] hover:bg-white/10"
            >
              <WhatsApp size={14} /> {m.askWa}
            </a>
          </div>

          {related.length > 0 && (
            <div className="mt-auto pt-10">
              <p className="text-[10px] uppercase tracking-[0.2em] opacity-60">{m.family}</p>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {related.map((r) => (
                  <button key={r.id} onClick={() => openProduct(r)} className="group text-left">
                    <div className="aspect-[3/4] overflow-hidden rounded">
                      <img src={r.images[0]} alt={l(r.name)} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    </div>
                    <p className="mt-1 truncate text-[10px] opacity-75">{price(r)}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
