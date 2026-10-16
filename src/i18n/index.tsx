import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { STRINGS, type Strings } from './strings'
import { MATERIALS_PT } from './materials'

export type Lang = 'en' | 'pt'
/** A piece of copy in both languages. */
export type L = { en: string; pt: string }

export const LANGS: Lang[] = ['pt', 'en']
const STORAGE_KEY = 'wc-lang'

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'en' || saved === 'pt') return saved
  } catch {
    /* storage blocked — fall back to the browser language */
  }
  return navigator.language?.toLowerCase().startsWith('pt') ? 'pt' : 'en'
}

interface I18n {
  lang: Lang
  setLang: (l: Lang) => void
  t: Strings
  /** Pick the current language from a bilingual value. */
  l: (v: L) => string
  /** Translate a material name (catalog keeps them in English). */
  mat: (m: string) => string
  /** "$329" or "From $99" / "A partir de $99". */
  price: (p: { price: number; startingFrom?: boolean }) => string
  /** "90 in" / "90 pol." */
  size: (inches: number) => string
}

const Ctx = createContext<I18n | null>(null)

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang)

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* not persisted — still switches for this visit */
    }
  }, [])

  useEffect(() => {
    const t = STRINGS[lang]
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en'
    document.title = t.meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description)
    // Copy length changes layout (pinned showcase width, line wraps) — re-measure triggers.
    const id = requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => cancelAnimationFrame(id)
  }, [lang])

  const value = useMemo<I18n>(() => {
    const t = STRINGS[lang]
    return {
      lang,
      setLang,
      t,
      l: (v) => v[lang],
      mat: (m) => (lang === 'pt' ? (MATERIALS_PT[m] ?? m) : m),
      price: (p) => (p.startingFrom ? `${t.common.from} $${p.price}` : `$${p.price}`),
      size: (n) => `${n} ${t.common.unit}`,
    }
  }, [lang, setLang])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useI18n() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useI18n must be used inside LangProvider')
  return v
}
