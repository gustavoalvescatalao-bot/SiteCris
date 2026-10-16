import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { AnimatePresence } from 'framer-motion'
import { useStore } from './lib/store'
import { useI18n } from './i18n'
import Preloader from './components/Preloader'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Manifesto from './components/Manifesto'
import KineticMarquee from './components/KineticMarquee'
import Showcase from './components/Showcase'
import ColorStories from './components/ColorStories'
import Details from './components/Details'
import InquiryForm from './components/InquiryForm'
import Footer from './components/Footer'
import CatalogDrawer from './components/CatalogDrawer'
import ProductModal from './components/ProductModal'
import Cursor from './components/Cursor'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function App() {
  const { lenis, setLenis, catalogOpen, product } = useStore()
  const { t } = useI18n()
  const [loaded, setLoaded] = useState(false)

  // Lenis smooth scroll, driven by GSAP's ticker so ScrollTrigger stays in sync.
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lenis = new Lenis({ lerp: reduce ? 1 : 0.085, wheelMultiplier: 0.9, smoothWheel: !reduce })
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (t: number) => lenis.raf(t * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    lenis.stop()
    setLenis(lenis)
    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      setLenis(null)
    }
  }, [setLenis])

  // Lock page scroll while overlays are open or the preloader is running.
  useEffect(() => {
    if (!lenis) return
    if (!loaded || catalogOpen || product) lenis.stop()
    else lenis.start()
  }, [lenis, loaded, catalogOpen, product])

  useEffect(() => {
    if (loaded) requestAnimationFrame(() => ScrollTrigger.refresh())
  }, [loaded])

  return (
    <>
      <div className="grain" aria-hidden />
      <Cursor />
      <AnimatePresence>{!loaded && <Preloader onDone={() => setLoaded(true)} />}</AnimatePresence>
      <Nav />
      <main>
        <Hero ready={loaded} />
        <KineticMarquee words={t.marquee.a} />
        <Manifesto />
        <Showcase />
        <KineticMarquee words={t.marquee.b} reverse />
        <ColorStories />
        <Details />
        <InquiryForm />
      </main>
      <Footer />
      <AnimatePresence>{catalogOpen && <CatalogDrawer key="catalog" />}</AnimatePresence>
      <AnimatePresence>{product && <ProductModal key={product.id} product={product} />}</AnimatePresence>
    </>
  )
}
