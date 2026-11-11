import { useEffect, useRef, useState } from 'react';
import posterImg from '../../imports/cena-castelli-locandina.webp';
import menuImg from '../../imports/cena-castelli-menu.webp';

/*
 * Popup "Cena ai Castelli… a suon di stornelli" — giovedì 19 novembre 2026.
 * Si mostra all'apertura della home e della pagina menu, una volta per sessione.
 * Mostra la locandina; il menù della serata si apre solo col pulsante "Scopri il menù".
 * Sparisce da solo dal 20 novembre 2026 (ora italiana).
 */

const END = new Date('2026-11-20T00:00:00+01:00');
const SEEN_KEY = 'su-cena-castelli-2026';
const WA_LINK =
  'https://wa.me/39069421645?text=' +
  encodeURIComponent('Ciao! Vorrei prenotare per la Cena ai Castelli… a suon di stornelli di giovedì 19 novembre. Siamo in … persone.');

function alreadySeen() {
  try { return sessionStorage.getItem(SEEN_KEY) === '1'; } catch { return false; }
}
function markSeen() {
  try { sessionStorage.setItem(SEEN_KEY, '1'); } catch { /* ignore */ }
}

export default function CenaCastelliPopup() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

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
    setTimeout(() => { setOpen(false); setShowMenu(false); }, 350);
  }

  function toggleMenu() {
    setShowMenu((v) => !v);
    boxRef.current?.scrollTo({ top: 0 });
  }

  if (!open) return null;

  const img = showMenu ? menuImg : posterImg;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cena-castelli-title"
      className="fixed inset-0 z-[10000] flex items-center justify-center p-[20px] sm:p-[40px]"
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
        ref={boxRef}
        className="relative w-full max-w-[760px] max-h-full overflow-y-auto overscroll-contain rounded-[6px] border border-[var(--rule-strong)] grid md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]"
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

        {/* Locandina / Menù della serata */}
        <a
          href={img}
          target="_blank"
          rel="noopener"
          className="block bg-[#f1ece4] md:self-center md:rounded-l-[6px] overflow-hidden"
          aria-label={showMenu ? 'Apri il menù a tutto schermo' : 'Apri la locandina a tutto schermo'}
        >
          <img
            key={showMenu ? 'menu' : 'poster'}
            src={img}
            alt={
              showMenu
                ? 'Menù della Cena ai Castelli, 35 euro bevande incluse: porchetta e pecorini, bruschetta con puntarelle e crema di pecorino, trippa alla romana, fagioli con le cotiche; gnocchi alla amatriciana o paccheri al sugo di coda alla vaccinara; polpette in bocca o involtini alla romana; ciambelline al vino bianco; acqua e vino'
                : 'Locandina Cena ai Castelli… a suon di stornelli: giovedì 19 novembre ore 20.30, musica dal vivo con i Girodidò e menù romano a 35 euro bevande incluse'
            }
            width={1000}
            height={1414}
            className={
              'w-full h-auto object-contain mx-auto ' +
              (showMenu ? 'max-h-[62svh] md:max-h-[74svh]' : 'max-h-[38svh] md:max-h-[70svh]')
            }
            style={{ animation: 'cenaFade 300ms ease' }}
          />
        </a>

        {/* Info */}
        <div className="flex flex-col justify-center px-[22px] py-[20px] sm:px-[30px] sm:py-[30px]">
          <span className="font-[var(--mono)] text-[11px] tracking-[0.32em] uppercase text-[var(--ember)]">
            Evento speciale · con i Girodidò
          </span>
          <h2
            id="cena-castelli-title"
            className="font-[var(--serif)] text-[clamp(24px,3.6vw,34px)] mt-[8px] md:mt-[12px] leading-[1.08]"
          >
            Cena ai Castelli… a suon di stornelli.
          </h2>

          <ul className={'mt-[12px] md:mt-[20px] flex flex-col gap-[6px] md:gap-[10px] text-[15px] md:text-[16px] leading-[1.5] text-[var(--cream-mute)]' + (showMenu ? ' max-md:hidden' : '')}>
            <li><strong className="text-[var(--cream)]">Giovedì 19 novembre</strong> · ore 20.30</li>
            <li>Musica dal vivo e menù romano · <strong className="text-[var(--cream)]">€ 35 bevande incluse</strong></li>
            <li className="max-md:hidden">Gradita la prenotazione</li>
          </ul>

          <div className="mt-[16px] md:mt-[26px] flex flex-col gap-[10px]">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center rounded-full px-[22px] py-[13px] font-[var(--mono)] text-[12px] tracking-[0.2em] uppercase border border-[var(--ember)] text-[var(--ember)] hover:bg-[var(--ember)] hover:text-[var(--ink)] transition-colors"
            >
              {showMenu ? '← Torna alla locandina' : 'Scopri il menù'}
            </button>
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
      <style>{'@keyframes cenaFade{from{opacity:0}to{opacity:1}}'}</style>
    </div>
  );
}
