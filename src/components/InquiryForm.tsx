import { useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Copy, X } from 'lucide-react'
import Instagram from './InstagramIcon'
import WhatsApp from './WhatsAppIcon'
import { BRAND, PALETTE, PRODUCTS, whatsappLink } from '../data/catalog'
import { useSectionTheme, useStore } from '../lib/store'
import { useI18n } from '../i18n'

function Spaced({ text }: { text: string }) {
  return (
    <h3 aria-label={text} className="font-serif text-[clamp(1.6rem,4.4vw,4.2rem)] font-light leading-tight">
      {text.split(' ').map((word, wi) => (
        <span key={wi} className="mr-[0.9em] inline-block whitespace-nowrap">
          {word.split('').map((ch, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ opacity: 0, y: '0.6em', letterSpacing: '0em' }}
              animate={{ opacity: 1, y: 0, letterSpacing: '0.32em' }}
              transition={{ delay: 0.02 * (wi * 6 + i), duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              {ch}
            </motion.span>
          ))}
        </span>
      ))}
    </h3>
  )
}

export default function InquiryForm() {
  const root = useRef<HTMLElement>(null)
  useSectionTheme(root, PALETTE.onyx, PALETTE.sand)
  const { wishlist, toggleWish, openCatalog } = useStore()
  const { t, l, price, size } = useI18n()
  const f = t.form

  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [reason, setReason] = useState<number | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [copied, setCopied] = useState(false)
  const [sentVia, setSentVia] = useState<'ig' | 'wa' | null>(null)
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const go = (n: number) => {
    setDir(n > step ? 1 : -1)
    setStep(n)
  }

  const pieces = wishlist.map((id) => PRODUCTS.find((p) => p.id === id)!).filter(Boolean)
  const summary = useMemo(
    () =>
      [
        f.msg.hello(name),
        reason !== null ? f.msg.about(f.reasons[reason]) : '',
        pieces.length ? f.msg.pieces(pieces.map((p) => `${l(p.name)} (${price(p)}${p.size ? `, ${size(p.size)}` : ''})`).join('; ')) : '',
        message ? f.msg.space(message) : '',
        f.msg.reach(email),
      ]
        .filter(Boolean)
        .join('\n'),
    [f, l, price, size, name, reason, pieces, message, email],
  )

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(summary)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      /* clipboard unavailable — the summary stays visible for manual copy */
    }
  }

  const sendInstagram = async () => {
    await copy()
    window.open(BRAND.instagramDm, '_blank', 'noopener')
    setSentVia('ig')
    go(4)
  }

  const sendWhatsapp = () => {
    window.open(whatsappLink(summary), '_blank', 'noopener')
    setSentVia('wa')
    go(4)
  }

  const variants = {
    enter: (d: number) => ({ x: d * 80, opacity: 0, filter: 'blur(8px)' }),
    center: { x: 0, opacity: 1, filter: 'blur(0px)' },
    exit: (d: number) => ({ x: d * -80, opacity: 0, filter: 'blur(8px)' }),
  }

  const inputCls =
    'w-full border-0 border-b border-[var(--line)] bg-transparent pb-3 font-serif text-[clamp(1.8rem,4vw,3.4rem)] font-light outline-none transition-colors placeholder:text-[var(--muted)] placeholder:opacity-50 focus:border-[var(--fg)]'

  return (
    <section id="inquire" ref={root} className="relative flex min-h-[100svh] flex-col px-5 pb-16 pt-28 md:px-10 md:pt-36">
      <div className="flex items-end justify-between">
        <p className="text-[10px] uppercase spaced opacity-70">{f.label}</p>
        {step < 4 && (
          <p className="text-[10px] uppercase spaced opacity-70 tabular-nums">
            {f.step(step + 1, 4)}
          </p>
        )}
      </div>
      <div className="mt-4 h-px w-full bg-[var(--line)]">
        <motion.div className="h-full origin-left bg-[var(--fg)]" animate={{ scaleX: Math.min(1, (step + 1) / 4) }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} />
      </div>

      <div className="relative flex flex-1 items-center py-12">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
          >
            {step < 4 && <Spaced key={f.titles[step]} text={f.titles[step]} />}

            {step === 0 && (
              <div className="mt-10 grid gap-3 md:grid-cols-3">
                {f.reasons.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setReason(i)
                      go(1)
                    }}
                    data-cursor={t.cursor.select}
                    className={`group flex min-h-[150px] flex-col justify-between rounded-2xl border p-6 text-left transition-all duration-500 hover:-translate-y-1 hover:bg-[var(--fg)] hover:text-[var(--bg)] md:min-h-[220px] ${
                      reason === i ? 'border-[var(--fg)]' : 'border-[var(--line)]'
                    }`}
                  >
                    <span className="text-[10px] uppercase spaced opacity-60">0{i + 1}</span>
                    <span className="font-serif text-3xl font-light leading-tight md:text-4xl">{r}</span>
                  </button>
                ))}
              </div>
            )}

            {step === 1 && (
              <form
                className="mt-10 max-w-3xl"
                onSubmit={(e) => {
                  e.preventDefault()
                  if (name.trim()) go(2)
                }}
              >
                <input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder={f.namePh} className={inputCls} autoComplete="name" />
                <Nav onBack={() => go(0)} disabled={!name.trim()} back={f.back} next={f.next} />
              </form>
            )}

            {step === 2 && (
              <form
                className="mt-10 max-w-3xl"
                onSubmit={(e) => {
                  e.preventDefault()
                  if (emailOk) go(3)
                }}
              >
                <input
                  autoFocus
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={f.emailPh}
                  className={inputCls}
                  autoComplete="email"
                />
                <Nav onBack={() => go(1)} disabled={!emailOk} back={f.back} next={f.next} />
              </form>
            )}

            {step === 3 && (
              <div className="mt-10 grid gap-10 lg:grid-cols-2">
                <div>
                  <textarea
                    autoFocus
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={f.messagePh}
                    className="w-full resize-none border-0 border-b border-[var(--line)] bg-transparent pb-3 font-serif text-2xl font-light outline-none placeholder:text-[var(--muted)] placeholder:opacity-50 focus:border-[var(--fg)] md:text-3xl"
                  />
                  <div className="mt-6">
                    <p className="text-[10px] uppercase spaced opacity-70">{f.pieces}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {pieces.map((p) => (
                        <span key={p.id} className="flex items-center gap-2 rounded-full border border-[var(--line)] py-1 pl-1 pr-3 text-xs">
                          <img src={p.images[0]} alt="" className="h-7 w-7 rounded-full object-cover" />
                          {l(p.name)}
                          <button onClick={() => toggleWish(p.id)} aria-label={f.remove(l(p.name))} className="opacity-60 hover:opacity-100">
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                      <button
                        onClick={() => openCatalog('all')}
                        className="rounded-full border border-dashed border-[var(--line)] px-4 py-2 text-[10px] uppercase tracking-[0.2em] hover:border-[var(--fg)]"
                      >
                        {f.choose}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-[var(--line)] p-6">
                  <p className="text-[10px] uppercase spaced opacity-70">{f.yourMessage}</p>
                  <pre className="mt-4 whitespace-pre-wrap font-sans text-sm leading-relaxed opacity-90">{summary}</pre>
                  <div className="mt-6 flex flex-wrap gap-2">
                    <button
                      onClick={sendWhatsapp}
                      className="flex items-center gap-2 rounded-full bg-[var(--fg)] px-5 py-3 text-[10px] uppercase tracking-[0.22em] text-[var(--bg)] transition-transform hover:scale-[1.03]"
                    >
                      <WhatsApp size={15} /> {f.sendWa}
                    </button>
                    <button
                      onClick={sendInstagram}
                      className="flex items-center gap-2 rounded-full bg-[var(--fg)] px-5 py-3 text-[10px] uppercase tracking-[0.22em] text-[var(--bg)] transition-transform hover:scale-[1.03]"
                    >
                      <Instagram size={14} /> {f.sendIg}
                    </button>
                    <button
                      onClick={copy}
                      className="flex items-center gap-2 rounded-full border border-[var(--line)] px-5 py-3 text-[10px] uppercase tracking-[0.22em] hover:border-[var(--fg)]"
                    >
                      <Copy size={14} /> {copied ? f.copied : f.copy}
                    </button>
                  </div>
                  <p className="mt-4 text-[11px] opacity-60">
                    {f.sendNote(BRAND.instagram)}
                  </p>
                </div>
                <button onClick={() => go(2)} className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] opacity-70 hover:opacity-100">
                  <ArrowLeft size={14} /> {f.back}
                </button>
              </div>
            )}

            {step === 4 && (
              <div className="text-center">
                <p className="text-[10px] uppercase spaced opacity-70">{f.thanksKicker}</p>
                <h3 className="mt-6 font-serif text-[clamp(2.6rem,7vw,7rem)] font-light italic leading-[0.95]">
                  {f.thanksTitle(name.trim().split(' ')[0])}
                </h3>
                <p className="mx-auto mt-6 max-w-md text-sm opacity-80">
                  {sentVia === 'wa' ? f.thanksWa : sentVia === 'ig' ? f.thanksIg : f.thanksPlain}
                </p>
                <button onClick={() => { setSentVia(null); go(0) }} className="mt-10 text-[10px] uppercase tracking-[0.25em] underline underline-offset-8 opacity-70 hover:opacity-100">
                  {f.restart}
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

function Nav({ onBack, disabled, back, next }: { onBack: () => void; disabled: boolean; back: string; next: string }) {
  return (
    <div className="mt-10 flex items-center justify-between">
      <button type="button" onClick={onBack} className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] opacity-70 hover:opacity-100">
        <ArrowLeft size={14} /> {back}
      </button>
      <button
        type="submit"
        disabled={disabled}
        className="flex items-center gap-3 rounded-full bg-[var(--fg)] px-6 py-3 text-[10px] uppercase tracking-[0.25em] text-[var(--bg)] transition-all disabled:opacity-25"
      >
        {next} <ArrowRight size={14} />
      </button>
    </div>
  )
}
