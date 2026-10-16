import { createContext, useCallback, useContext, useMemo, useState, type ReactNode, type RefObject } from 'react'
import type Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import type { CategoryId, Product } from '../data/catalog'

interface Store {
  lenis: Lenis | null
  setLenis: (l: Lenis | null) => void
  scrollTo: (target: string | number | HTMLElement, offset?: number) => void

  catalogOpen: boolean
  catalogCategory: CategoryId | 'all'
  openCatalog: (category?: CategoryId | 'all') => void
  closeCatalog: () => void

  product: Product | null
  openProduct: (p: Product) => void
  closeProduct: () => void

  wishlist: string[]
  toggleWish: (id: string) => void
}

const Ctx = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)
  const [catalogOpen, setCatalogOpen] = useState(false)
  const [catalogCategory, setCatalogCategory] = useState<CategoryId | 'all'>('all')
  const [product, setProduct] = useState<Product | null>(null)
  const [wishlist, setWishlist] = useState<string[]>([])

  const scrollTo = useCallback(
    (target: string | number | HTMLElement, offset = 0) => {
      if (lenis) lenis.scrollTo(target, { offset, duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) })
      else if (typeof target === 'number') window.scrollTo({ top: target, behavior: 'smooth' })
      else {
        const el = typeof target === 'string' ? document.querySelector(target) : target
        el?.scrollIntoView({ behavior: 'smooth' })
      }
    },
    [lenis],
  )

  const value = useMemo<Store>(
    () => ({
      lenis,
      setLenis,
      scrollTo,
      catalogOpen,
      catalogCategory,
      openCatalog: (c = 'all') => {
        setCatalogCategory(c)
        setCatalogOpen(true)
      },
      closeCatalog: () => setCatalogOpen(false),
      product,
      openProduct: setProduct,
      closeProduct: () => setProduct(null),
      wishlist,
      toggleWish: (id) => setWishlist((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id])),
    }),
    [lenis, scrollTo, catalogOpen, catalogCategory, product, wishlist],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore() {
  const s = useContext(Ctx)
  if (!s) throw new Error('useStore must be used inside StoreProvider')
  return s
}

/** Tween the page colours (body background + text) — the scroll-driven palette. */
export function setTheme(bg: string, fg: string, duration = 1) {
  gsap.to(document.documentElement, {
    '--bg': bg,
    '--fg': fg,
    duration,
    ease: 'power2.out',
    overwrite: 'auto',
  })
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', bg)
}

/** Switch the page palette while `ref` occupies the middle of the viewport. */
export function useSectionTheme(ref: RefObject<HTMLElement | null>, bg: string, fg: string) {
  useGSAP(() => {
    ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 55%',
      end: 'bottom 45%',
      onEnter: () => setTheme(bg, fg),
      onEnterBack: () => setTheme(bg, fg),
    })
  }, [bg, fg])
}
