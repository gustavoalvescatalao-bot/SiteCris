import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Instagram from './InstagramIcon'
import WhatsApp from './WhatsAppIcon'
import { useStore } from '../lib/store'
import { BRAND, whatsappLink } from '../data/catalog'
import { LANGS, useI18n } from '../i18n'

const LINKS = [
  { key: 'manifesto', href: '#manifesto' },
  { key: 'collection', href: '#collection' },
  { key: 'stories', href: '#stories' },
  { key: 'inquire', href: '#inquire' },
] as const

/** PT | EN pill with a sliding highlight. */
function LangSwitch({ id, className = '' }: { id: string; className?: string }) {
  const { lang, setLang, t } = useI18n()
  return (
    <div role="group" aria-label={t.nav.language} className={`flex items-center rounded-full border border-[var(--line)] p-0.5 backdrop-blur-md ${className}`}>
      {LANGS.map((code) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          aria-pressed={lang === code}
          lang={code === 'pt' ? 'pt-BR' : 'en'}
          className="relative h-8 w-9 text-[10px] font-medium uppercase tracking-[0.15em]"
        >
          {lang === code && (
            <motion.span
              layoutId={`lang-pill-${id}`}
              className="absolute inset-0 rounded-full bg-[var(--fg)]"
              transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            />
          )}
          <span className={`relative transition-colors duration-300 ${lang === code ? 'text-[var(--bg)]' : ''}`}>{code}</span>
        </button>
      ))}
    </div>
  )
}

export default function Nav() {
  const { scrollTo, openCatalog, wishlist } = useStore()
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [solid, setSolid] = useState(false)

  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setHidden(y > 200 && y > last)
      setSolid(y > 60)
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const go = (href: string) => {
    setOpen(false)
    scrollTo(href)
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-transform duration-700 ease-luxe ${hidden && !open ? '-translate-y-full' : ''}`}
      >
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-b from-[var(--bg)] to-transparent transition-opacity duration-700 ${solid ? 'opacity-95' : 'opacity-0'}`}
        />
        <div className="relative flex items-center justify-between px-5 py-5 text-[var(--fg)] md:px-10">
          <button onClick={() => go('#top')} className="group flex items-baseline gap-3" aria-label={t.nav.top}>
            <span className="font-serif text-3xl leading-none">W</span>
            <span className="hidden text-[10px] uppercase spaced sm:inline">Knots &amp; Crafts</span>
          </button>

          <nav className="hidden items-center gap-8 lg:flex">
            {LINKS.map((l) => (
              <button
                key={l.href}
                onClick={() => go(l.href)}
                className="group relative text-[11px] uppercase tracking-[0.28em]"
              >
                {t.nav[l.key]}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-500 ease-luxe group-hover:origin-left group-hover:scale-x-100" />
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <LangSwitch id="header" className="hidden sm:flex" />
            <button
              onClick={() => openCatalog('all')}
              className="rounded-full border border-[var(--line)] px-4 py-2 text-[10px] uppercase tracking-[0.25em] backdrop-blur-md transition-colors hover:bg-[var(--fg)] hover:text-[var(--bg)]"
            >
              {t.nav.catalog}
              {wishlist.length > 0 && <span className="ml-1.5 tabular-nums">({wishlist.length})</span>}
            </button>
            <a
              href={BRAND.instagramUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="hidden h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] transition-colors hover:bg-[var(--fg)] hover:text-[var(--bg)] md:flex"
            >
              <Instagram size={15} strokeWidth={1.5} />
            </a>
            <button
              onClick={() => setOpen((o) => !o)}
              aria-label={t.nav.menu}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--line)] lg:hidden"
            >
              {open ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-center bg-onyx px-8 text-sand [--bg:#1C1B1A] [--fg:#DFD3C3] [--line:rgba(223,211,195,.22)] lg:hidden"
            initial={{ clipPath: 'circle(0% at 100% 0%)' }}
            animate={{ clipPath: 'circle(150% at 100% 0%)' }}
            exit={{ clipPath: 'circle(0% at 100% 0%)' }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            {LINKS.map((l, i) => (
              <motion.button
                key={l.href}
                onClick={() => go(l.href)}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25 + i * 0.07, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="border-b border-sand/15 py-4 text-left font-serif text-5xl"
              >
                {t.nav[l.key]}
              </motion.button>
            ))}
            <div className="mt-10 flex items-end justify-between gap-4">
              <div className="flex flex-col gap-3 text-[11px] uppercase tracking-[0.2em]">
                <a href={BRAND.instagramUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2">
                  <Instagram size={14} /> @{BRAND.instagram}
                </a>
                <a href={whatsappLink()} target="_blank" rel="noreferrer" className="flex items-center gap-2">
                  <WhatsApp size={14} /> {BRAND.whatsappDisplay}
                </a>
              </div>
              <LangSwitch id="menu" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
