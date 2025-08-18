import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

import logoUrl from "/ranky-logo.png";
import logoDiscord from "/discord-logo.svg";
import flagSpain from "/flag-spain.svg";
import flagUSA from "/flag-usa.svg";

/* ───────────────────── Constantes ───────────────────── */

const LINKS = {
  discord:
    "https://discord.com/oauth2/authorize?client_id=1005188427634966629&permissions=268528656&scope=bot+applications.commands",
} as const;

type Lang = "es" | "en";

const LANGS: readonly { code: Lang; label: string; flag: string }[] = [
  { code: "es", label: "Español", flag: flagSpain },
  { code: "en", label: "English", flag: flagUSA },
] as const;

/* ───────────────────── Navbar ───────────────────── */

export default function Navbar() {
  const { t, i18n } = useTranslation("common", { keyPrefix: "navbar" });

  const currentLang = (i18n.language?.split("-")[0] as Lang) || "es";

  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const btnRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const firstItemRef = useRef<HTMLButtonElement | null>(null);

  const reduced = useReducedMotion();
  const navigate = useNavigate();
  const location = useLocation();
  const menuId = useId();

  /* ── helpers ── */

  const toggleOpen = useCallback(() => setOpen((v) => !v), []);
  const closeMenu = useCallback(() => setOpen(false), []);

  const changeTo = useCallback(
    (next: Lang) => {
      const parts = location.pathname.split("/").filter(Boolean);
      const idx = parts.findIndex((p) => p === "es" || p === "en");
      const rest = idx >= 0 ? parts.slice(idx + 1).join("/") : parts.join("/");
      navigate(`/${next}${rest ? `/${rest}` : ""}`, { replace: true });
      i18n.changeLanguage(next);
      closeMenu();
    },
    [i18n, location.pathname, navigate, closeMenu]
  );

  const langData = useMemo(
    () => LANGS.find((l) => l.code === currentLang) ?? LANGS[0],
    [currentLang]
  );

  /* ── outside click & Escape ── */
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (!menuRef.current || !btnRef.current) return;
      if (menuRef.current.contains(target) || btnRef.current.contains(target)) return;
      setOpen(false);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  /* ── focus al abrir ── */
  useEffect(() => {
    if (open) {
      // da tiempo a montar
      requestAnimationFrame(() => {
        firstItemRef.current?.focus();
      });
    }
  }, [open]);

  /* ── sombra al hacer scroll (raf) ── */
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrolled(window.scrollY > 4));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  /* ── UI ── */

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 isolate w-full h-16 sm:h-20 transition-all duration-300 z-50 ${
          scrolled
            ? "bg-black/90 backdrop-blur-2xl shadow-[0_8px_40px_rgba(16,185,129,0.15)] border-b border-emerald-500/20"
            : "bg-black/50 backdrop-blur-xl border-b border-white/5"
        }`}
      >
        {/* fondo */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-gray-900/90 to-black/95" />
          <div className="absolute inset-0">
            <div
              className={`absolute top-0 left-1/4 w-96 h-32 bg-emerald-400/10 blur-3xl transition-opacity duration-700 ${
                scrolled ? "opacity-60" : "opacity-30"
              }`}
            />
            <div
              className={`absolute top-0 right-1/4 w-80 h-32 bg-blue-400/10 blur-3xl transition-opacity duration-700 ${
                scrolled ? "opacity-50" : "opacity-20"
              }`}
            />
          </div>
          <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(rgba(16,185,129,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
        </div>

        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between relative z-20">
          {/* marca */}
          <a href={`/${currentLang}`} className="flex items-center gap-3 group">
            <motion.div
              className="relative"
              initial={reduced ? false : { scale: 0.95 }}
              whileHover={reduced ? {} : { scale: 1.05, rotate: 1 }}
              whileTap={reduced ? {} : { scale: 0.98, rotate: -1 }}
              transition={reduced ? undefined : { type: "spring", stiffness: 400, damping: 20 }}
            >
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-lg scale-150 opacity-0 group-hover:opacity-100 transition-all duration-300" />
              <img
                src={logoUrl}
                alt={t("brandAlt")}
                width={48}
                height={48}
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-2 border-emerald-400/30 group-hover:border-emerald-400/60 p-0.5 shadow-[0_0_20px_rgba(16,185,129,0.3)] group-hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] backdrop-blur transition-all duration-300"
                decoding="async"
              />
            </motion.div>

            <motion.span
              className="text-2xl sm:text-3xl font-black tracking-wide bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent group-hover:from-emerald-300 group-hover:to-white transition-all duration-300"
              initial={reduced ? false : { opacity: 0, y: 4 }}
              animate={reduced ? {} : { opacity: 1, y: 0 }}
              transition={reduced ? undefined : { duration: 0.25 }}
            >
              RANKY
            </motion.span>
          </a>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* selector idioma */}
            <div className="relative">
              <button
                ref={btnRef}
                type="button"
                onClick={toggleOpen}
                aria-haspopup="menu"
                aria-expanded={open}
                aria-controls={menuId}
                aria-label={t("toggleLabel")}
                title={t("toggleLabel")}
                className={` cursor-pointer flex items-center gap-2 rounded-xl border px-3 py-2 text-white font-medium transition-all duration-200 backdrop-blur-sm relative overflow-hidden group ${
                  open
                    ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-100 shadow-lg shadow-emerald-500/20"
                    : "border-white/20 bg-white/5 hover:bg-white/10 hover:border-emerald-400/30 hover:text-emerald-100 hover:shadow-md hover:shadow-emerald-500/10"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <img
                  src={langData.flag}
                  alt={langData.label}
                  className="w-5 h-5 rounded-sm shadow-sm"
                  loading="lazy"
                  decoding="async"
                />
                <span className="text-sm font-bold uppercase tracking-wider">{currentLang.toUpperCase()}</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
                </svg>
              </button>

              <AnimatePresence>
                {open && (
                  <motion.div
                    ref={menuRef}
                    id={menuId}
                    role="menu"
                    tabIndex={-1}
                    initial={reduced ? false : { opacity: 0, y: -8, scale: 0.96 }}
                    animate={reduced ? {} : { opacity: 1, y: 0, scale: 1 }}
                    exit={reduced ? {} : { opacity: 0, y: -8, scale: 0.96 }}
                    transition={reduced ? undefined : { duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 top-full mt-2 w-48 rounded-2xl border border-emerald-400/30 bg-black/95 backdrop-blur-2xl shadow-2xl ring-1 ring-white/10 p-2 z-[60]"
                  >
                    <div className="relative">
                      {LANGS.map((l, idx) => {
                        const active = l.code === currentLang;
                        return (
                          <button
                            key={l.code}
                            ref={idx === 0 ? firstItemRef : undefined}
                            role="menuitemradio"
                            aria-checked={active}
                            onClick={() => changeTo(l.code)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                              active
                                ? "bg-emerald-400/20 text-emerald-100 border border-emerald-400/30"
                                : "text-white/90 hover:bg-white/10 hover:text-white"
                            }`}
                          >
                            <img src={l.flag} alt={l.label} className="w-6 h-6 rounded-sm shadow-sm" />
                            <span>{l.label}</span>
                            {active && <span className="ml-auto w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CTA Discord */}
            <motion.a
              href={LINKS.discord}
              target="_blank"
              rel="noopener noreferrer"
              title={t("ctaPrimary")}
              className="group relative inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#5865F2] to-[#4752C4] hover:from-[#4752C4] hover:to-[#3c4396] text-white px-4 py-2.5 text-sm font-bold shadow-[0_8px_30px_rgba(88,101,242,0.4)] ring-2 ring-[#5865F2]/20 hover:ring-emerald-400/30 hover:shadow-[0_12px_40px_rgba(88,101,242,0.6)] transition-all duration-300 overflow-hidden"
              whileHover={reduced ? {} : { scale: 1.02, y: -1 }}
              whileTap={reduced ? {} : { scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -skew-x-12" />
              <img
                src={logoDiscord}
                alt=""
                className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                loading="lazy"
                decoding="async"
              />
              <span className="hidden sm:inline font-bold tracking-wide">{t("ctaPrimary")}</span>
            </motion.a>
          </div>
        </div>

        {/* borde inferior */}
        <div
          className={`absolute bottom-0 left-0 w-full h-px transition-all duration-300 ${
            scrolled
              ? "bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent shadow-[0_0_8px_rgba(16,185,129,0.3)]"
              : "bg-gradient-to-r from-transparent via-white/20 to-transparent"
          }`}
        />
      </nav>

      {/* spacer */}
      <div className="h-16 sm:h-20" />
    </>
  );
}
