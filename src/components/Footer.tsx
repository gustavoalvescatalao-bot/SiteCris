import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ArrowUp } from 'lucide-react'
import Instagram from './InstagramIcon'
import WhatsApp from './WhatsAppIcon'
import { BRAND, CATEGORIES, whatsappLink } from '../data/catalog'
import { useStore } from '../lib/store'
import { useI18n } from '../i18n'

export default function Footer() {
  const root = useRef<HTMLElement>(null)
  const { scrollTo, openCatalog } = useStore()
  const { t, l } = useI18n()

  useGSAP(
    () => {
      gsap.from('.ft-letter', {
        yPercent: 100,
        ease: 'expo.out',
        duration: 1.4,
        stagger: 0.06,
        scrollTrigger: { trigger: '.ft-word', start: 'top 92%' },
      })
    },
    { scope: root },
  )

  return (
    <footer ref={root} className="relative overflow-hidden border-t border-[var(--line)] px-5 pb-6 pt-16 md:px-10">
      <div className="grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="font-serif text-3xl font-light italic leading-snug md:text-4xl">“{l(BRAND.slogan)}”</p>
          <a
            href={BRAND.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-3 rounded-full border border-[var(--line)] px-5 py-3 text-[11px] uppercase tracking-[0.25em] transition-colors hover:bg-[var(--fg)] hover:text-[var(--bg)]"
          >
            <Instagram size={15} /> @{BRAND.instagram}
          </a>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noreferrer"
            aria-label={`${t.footer.talk} — WhatsApp ${BRAND.whatsappDisplay}`}
            className="ml-2 mt-3 inline-flex items-center gap-3 rounded-full border border-[var(--line)] px-5 py-3 text-[11px] uppercase tracking-[0.25em] transition-colors hover:bg-[var(--fg)] hover:text-[var(--bg)]"
          >
            <WhatsApp size={15} /> {BRAND.whatsappDisplay}
          </a>
        </div>
        <div className="grid grid-cols-2 gap-8 text-[11px] uppercase tracking-[0.22em] md:col-span-4">
          <div className="flex flex-col gap-3">
            <span className="opacity-50">{t.footer.collection}</span>
            {CATEGORIES.map((c) => (
              <button key={c.id} onClick={() => openCatalog(c.id)} className="text-left hover:opacity-60">
                {l(c.short)}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <span className="opacity-50">{t.footer.studio}</span>
            <button onClick={() => scrollTo('#manifesto')} className="text-left hover:opacity-60">{t.footer.manifesto}</button>
            <button onClick={() => scrollTo('#stories')} className="text-left hover:opacity-60">{t.footer.stories}</button>
            <button onClick={() => scrollTo('#inquire')} className="text-left hover:opacity-60">{t.footer.inquire}</button>
            <span className="opacity-50">{t.common.handmade}</span>
          </div>
        </div>
        <a
          href={BRAND.instagramUrl}
          target="_blank"
          rel="noreferrer"
          className="group flex items-start gap-4 md:col-span-3 md:justify-end"
          data-cursor={t.cursor.follow}
        >
          <img src={BRAND.qr} alt={t.footer.qrAlt} className="w-28 rounded-lg transition-transform duration-700 ease-luxe group-hover:rotate-[-4deg] group-hover:scale-105" />
          <span className="max-w-[12ch] text-[10px] uppercase tracking-[0.22em] opacity-70">{t.footer.scan}</span>
        </a>
      </div>

      <div className="ft-word relative mt-16 flex items-end justify-center overflow-hidden leading-[0.78]">
        <span className="absolute left-1/2 top-[6%] -translate-x-[48%] text-[clamp(.6rem,1.6vw,1.4rem)] uppercase tracking-[0.4em]">
          WC Knots&amp;Crafts
        </span>
        {'DECOR'.split('').map((l, i) => (
          <span key={i} className="ft-letter inline-block font-serif text-[27vw] font-light">
            {l}
          </span>
        ))}
        <span className="absolute right-[24%] top-[48%] font-serif text-[clamp(.9rem,2.6vw,2.4rem)] italic">2026</span>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-[var(--line)] pt-5 text-[10px] uppercase tracking-[0.22em] opacity-70">
        <span>© {BRAND.year} {BRAND.name}</span>
        <button onClick={() => scrollTo(0)} className="flex items-center gap-2 hover:opacity-60">
          {t.nav.top} <ArrowUp size={13} />
        </button>
      </div>
    </footer>
  )
}
