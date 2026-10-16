import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Plus, Search, X } from 'lucide-react'
import { CATEGORIES, PRICE_MAX, PRICE_MIN, PRODUCTS, SIZES, type CategoryId } from '../data/catalog'
import { useStore } from '../lib/store'
import { useI18n } from '../i18n'

type Sort = 'catalog' | 'price-asc' | 'price-desc'

export default function CatalogDrawer() {
  const { closeCatalog, catalogCategory, openProduct, wishlist, toggleWish, scrollTo } = useStore()
  const { t, l, mat, price, size: fmtSize } = useI18n()
  const c = t.catalog
  const [cat, setCat] = useState<CategoryId | 'all'>(catalogCategory)
  const [sizes, setSizes] = useState<number[]>([])
  const [min, setMin] = useState(PRICE_MIN)
  const [max, setMax] = useState(PRICE_MAX)
  const [q, setQ] = useState('')
  const [sort, setSort] = useState<Sort>('catalog')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeCatalog()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeCatalog])

  const results = useMemo(() => {
    const term = q.trim().toLowerCase()
    const list = PRODUCTS.filter(
      (p) =>
        (cat === 'all' || p.category === cat) &&
        (sizes.length === 0 || (p.size !== undefined && sizes.includes(p.size))) &&
        p.price >= min &&
        p.price <= max &&
        (!term ||
          [p.name.en, p.name.pt, p.description.en, p.description.pt, ...p.materials, ...p.materials.map(mat)]
            .join(' ')
            .toLowerCase()
            .includes(term)),
    )
    if (sort === 'price-asc') return [...list].sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') return [...list].sort((a, b) => b.price - a.price)
    return list
  }, [cat, sizes, min, max, q, sort, mat])

  const reset = () => {
    setCat('all')
    setSizes([])
    setMin(PRICE_MIN)
    setMax(PRICE_MAX)
    setQ('')
  }

  const pct = (v: number) => ((v - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100
  const chip = (on: boolean) =>
    `shrink-0 rounded-full border px-3.5 py-1.5 text-[10px] uppercase tracking-[0.18em] transition-colors ${
      on ? 'border-onyx bg-onyx text-sand' : 'border-onyx/20 hover:border-onyx'
    }`

  return (
    <motion.div className="fixed inset-0 z-[60]" initial="hidden" animate="show" exit="hidden">
      <motion.div
        className="absolute inset-0 bg-onyx/50 backdrop-blur-sm"
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
        onClick={closeCatalog}
      />
      <motion.aside
        role="dialog"
        aria-label={c.dialog}
        data-lenis-prevent
        className="absolute inset-y-0 right-0 flex w-full flex-col bg-travertine text-onyx md:w-[min(92vw,1200px)] md:rounded-l-[1.6rem]"
        variants={{ hidden: { x: '100%' }, show: { x: 0 } }}
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      >
        <header className="border-b border-onyx/10 px-5 pb-4 pt-5 md:px-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase spaced opacity-60">{c.kicker}</p>
              <h2 className="font-serif text-4xl font-light md:text-5xl">
                {c.title} <span className="text-2xl italic opacity-60 tabular-nums">({results.length})</span>
              </h2>
            </div>
            <button onClick={closeCatalog} aria-label={c.close} className="flex h-11 w-11 items-center justify-center rounded-full border border-onyx/20 transition-transform hover:rotate-90">
              <X size={18} />
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center">
            <label className="flex flex-1 items-center gap-2 rounded-full border border-onyx/15 bg-white/40 px-4 py-2.5">
              <Search size={15} className="opacity-50" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={c.search}
                className="w-full bg-transparent text-sm outline-none placeholder:opacity-50"
              />
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="rounded-full border border-onyx/15 bg-white/40 px-4 py-2.5 text-[11px] uppercase tracking-[0.15em] outline-none"
            >
              <option value="catalog">{c.sortCatalog}</option>
              <option value="price-asc">{c.sortAsc}</option>
              <option value="price-desc">{c.sortDesc}</option>
            </select>
          </div>

          <div className="hide-scrollbar mt-3 flex gap-2 overflow-x-auto">
            <button className={chip(cat === 'all')} onClick={() => setCat('all')}>{c.all}</button>
            {CATEGORIES.map((k) => (
              <button key={k.id} className={chip(cat === k.id)} onClick={() => setCat(k.id)}>
                {l(k.short)}
              </button>
            ))}
          </div>

          <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center md:gap-8">
            <div className="hide-scrollbar flex items-center gap-2 overflow-x-auto">
              <span className="shrink-0 text-[10px] uppercase tracking-[0.2em] opacity-50">{c.size}</span>
              {SIZES.map((s) => (
                <button
                  key={s}
                  className={chip(sizes.includes(s))}
                  onClick={() => setSizes((x) => (x.includes(s) ? x.filter((y) => y !== s) : [...x, s]))}
                >
                  {fmtSize(s)}
                </button>
              ))}
            </div>
            <div className="flex flex-1 items-center gap-3">
              <span className="shrink-0 text-[10px] uppercase tracking-[0.2em] opacity-50">{c.price}</span>
              <span className="w-10 text-right text-xs tabular-nums">${min}</span>
              <div className="relative h-6 flex-1">
                <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-onyx/20" />
                <div className="absolute top-1/2 h-0.5 -translate-y-1/2 bg-onyx" style={{ left: `${pct(min)}%`, right: `${100 - pct(max)}%` }} />
                <input
                  aria-label={c.minPrice}
                  type="range"
                  min={PRICE_MIN}
                  max={PRICE_MAX}
                  step={10}
                  value={min}
                  onChange={(e) => setMin(Math.min(Number(e.target.value), max - 10))}
                  className="range absolute inset-0 w-full"
                />
                <input
                  aria-label={c.maxPrice}
                  type="range"
                  min={PRICE_MIN}
                  max={PRICE_MAX}
                  step={10}
                  value={max}
                  onChange={(e) => setMax(Math.max(Number(e.target.value), min + 10))}
                  className="range absolute inset-0 w-full"
                />
              </div>
              <span className="w-10 text-xs tabular-nums">${max}</span>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-6 md:px-8">
          {results.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <p className="font-serif text-3xl italic">{c.empty}</p>
              <button onClick={reset} className="text-[10px] uppercase tracking-[0.25em] underline underline-offset-8">
                {c.reset}
              </button>
            </div>
          ) : (
            <motion.ul layout className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 xl:grid-cols-4">
              <AnimatePresence mode="popLayout">
                {results.map((p, i) => {
                  const on = wishlist.includes(p.id)
                  return (
                    <motion.li
                      layout
                      key={p.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0, transition: { delay: Math.min(i, 12) * 0.03, duration: 0.5 } }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="group"
                    >
                      <button onClick={() => openProduct(p)} className="relative block aspect-[3/4] w-full overflow-hidden rounded-md bg-sand" data-cursor={t.cursor.view}>
                        <img
                          src={p.images[0]}
                          alt={l(p.name)}
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-luxe group-hover:scale-105"
                        />
                        {p.images[1] && (
                          <img
                            src={p.images[1]}
                            alt=""
                            loading="lazy"
                            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                          />
                        )}
                        {p.images.length > 1 && (
                          <span className="absolute left-2 top-2 rounded-full bg-travertine/85 px-2 py-0.5 text-[9px] uppercase tracking-[0.15em]">
                            {c.views(p.images.length)}
                          </span>
                        )}
                      </button>
                      <div className="mt-3 flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-serif text-lg leading-tight md:text-xl">{l(p.name)}</h3>
                          <p className="mt-1 text-[10px] uppercase tracking-[0.16em] opacity-60">
                            {p.size ? `${fmtSize(p.size)} · ` : ''}{c.pageShort} {p.pages.join(', ')}
                          </p>
                        </div>
                        <span className="shrink-0 font-serif text-lg">{price(p)}</span>
                      </div>
                      <button
                        onClick={() => toggleWish(p.id)}
                        className={`mt-2 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] ${on ? 'opacity-100' : 'opacity-50 hover:opacity-100'}`}
                      >
                        {on ? <Check size={12} /> : <Plus size={12} />} {on ? c.inList : c.add}
                      </button>
                    </motion.li>
                  )
                })}
              </AnimatePresence>
            </motion.ul>
          )}
        </div>

        {wishlist.length > 0 && (
          <footer className="flex items-center justify-between gap-4 border-t border-onyx/10 bg-sand/60 px-5 py-4 md:px-8">
            <p className="text-xs">
              <span className="font-serif text-xl tabular-nums">{wishlist.length}</span> {c.countLabel(wishlist.length)}
            </p>
            <button
              onClick={() => {
                closeCatalog()
                setTimeout(() => scrollTo('#inquire'), 350)
              }}
              className="rounded-full bg-onyx px-5 py-3 text-[10px] uppercase tracking-[0.22em] text-sand"
            >
              {c.continue}
            </button>
          </footer>
        )}
      </motion.aside>
    </motion.div>
  )
}
