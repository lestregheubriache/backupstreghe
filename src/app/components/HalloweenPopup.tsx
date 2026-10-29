import { useEffect, useRef, useState } from 'react';
import posterImg from '../../imports/halloween-2026.webp';

/*
 * Popup "Halloween Party" — sabato 31 ottobre 2026.
 * Si mostra all'apertura della home, una volta per sessione,
 * e sparisce da solo dal 1° novembre 2026 (ora italiana).
 */

const END = new Date('2026-11-01T00:00:00+01:00');
const SEEN_KEY = 'su-halloween-2026';
const WA_LINK =
  'https://wa.me/39069421645?text=' +
  encodeURIComponent('Ciao! Vorrei prenotare per l\'Halloween Party di sabato 31 ottobre. Siamo in … persone.');

function alreadySeen() {
  try { return sessionStorage.getItem(SEEN_KEY) === '1'; } catch { return false; }
}
function markSeen() {
  try { sessionStorage.setItem(SEEN_KEY, '1'); } catch { /* ignore */ }
}

export default function HalloweenPopup() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (new Date() >= END || alreadySeen()) return;
    const t = setTimeout(() => {
      setOpen(true);
      markSeen();
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    }, 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  function close() {
    setVisible(false);
    setTimeout(() => setOpen(false), 350);
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="halloween-title"
      className="fixed inset-0 z-[10000] flex items-center justify-center p-[28px] sm:p-[40px]"
      style={{
        background: 'rgba(10,8,6,0.82)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 350ms ease',
      }}
      onClick={close}
    >
      <div
        className="relative w-full max-w-[740px] max-h-full overflow-y-auto overscroll-contain rounded-[6px] border border-[var(--rule-strong)] grid md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]"
        style={{
          background: 'var(--ink)',
          boxShadow: '0 30px 80px rgba(0,0,0,.6), 0 0 0 1px rgba(224,118,61,.08), 0 0 60px rgba(224,118,61,.12)',
          transform: visible ? 'none' : 'translateY(18px) scale(.97)',
          transition: 'transform 450ms cubic-bezier(.2,.8,.2,1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeRef}
          onClick={close}
          aria-label="Chiudi"
          className="absolute top-[10px] right-[10px] z-10 w-[40px] h-[40px] rounded-full flex items-center justify-center text-[22px] leading-none text-[var(--cream)] border border-[var(--rule-strong)] hover:border-[var(--ember)] hover:text-[var(--ember)] transition-colors"
          style={{ background: 'rgba(26,20,16,.75)' }}
        >
          ×
        </button>

        {/* Locandina */}
        <a
          href={posterImg}
          target="_blank"
          rel="noopener"
          className="block bg-[var(--ink-2)] md:bg-transparent md:self-center md:rounded-l-[6px] overflow-hidden"
          aria-label="Apri la locandina a tutto schermo"
        >
          <img
            src={posterImg}
            alt="Locandina Halloween Party alle Streghe Ubriache: sabato 31 ottobre ore 20.30, cena e musica dal vivo con i Greenbus"
            width={1000}
            height={1410}
            className="w-full h-auto max-h-[36svh] md:max-h-[70svh] object-contain mx-auto"
          />
        </a>

        {/* Info */}
        <div className="flex flex-col justify-center px-[22px] py-[20px] sm:px-[30px] sm:py-[30px]">
          <span className="font-[var(--mono)] text-[11px] tracking-[0.32em] uppercase text-[var(--ember)]">
            Evento speciale
          </span>
          <h2
            id="halloween-title"
            className="font-[var(--serif)] text-[clamp(26px,4vw,38px)] mt-[8px] md:mt-[12px] leading-[1.05]"
          >
            Halloween<br className="max-md:hidden" /> Party.
          </h2>

          <ul className="mt-[14px] md:mt-[22px] flex flex-col gap-[6px] md:gap-[10px] text-[15px] md:text-[16px] leading-[1.5] text-[var(--cream-mute)]">
            <li><strong className="text-[var(--cream)]">Sabato 31 ottobre</strong> · dalle 20.30</li>
            <li>Cena + musica dal vivo con i <strong className="text-[var(--cream)]">Greenbus</strong> · blues &amp; rock</li>
            <li className="max-md:hidden">Posti limitati, prenotazione consigliata</li>
          </ul>

          <div className="mt-[18px] md:mt-[28px] flex flex-col gap-[10px]">
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center justify-center rounded-full px-[22px] py-[14px] font-[var(--mono)] text-[12px] tracking-[0.2em] uppercase transition-transform hover:-translate-y-[1px]"
              style={{ background: 'var(--ember)', color: 'var(--ink)' }}
            >
              Prenota su WhatsApp →
            </a>
            <a
              href="tel:+39069421645"
              className="inline-flex items-center justify-center rounded-full px-[22px] py-[13px] font-[var(--mono)] text-[12px] tracking-[0.2em] uppercase border border-[var(--rule-strong)] text-[var(--cream)] hover:border-[var(--ember)] transition-colors"
            >
              Chiama 06 942 1645
            </a>
            <button
              onClick={close}
              className="mt-[4px] text-[13px] text-[var(--cream-mute)] underline underline-offset-4 hover:text-[var(--cream)] transition-colors"
            >
              Continua sul sito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
