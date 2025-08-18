import { Trans, useTranslation } from "react-i18next";
import React, { useId, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logoUrl from "/ranky-logo.png";
import zennithLogo from "/zennith.svg";
import logoDiscord from "/discord-logo.svg";
import { Github, Twitter, Globe, X, Users, Code, Palette, Bug } from "lucide-react";

/* ───────────────────────── Constantes ───────────────────────── */

const YEAR = new Date().getFullYear();

const LINKS = {
  discord:
    "https://discord.com/oauth2/authorize?client_id=1005188427634966629&permissions=268528656&scope=bot+applications.commands",
  github: "https://github.com/MKGF/Ranky",
  twitter: "https://x.com/BotRanky",
  website: "https://www.Zennith.cl",
  riot: "https://www.riotgames.com/en/legal",
} as const;

type Credit = {
  name: string;
  role: string;
  description: string;
  avatar: string;
  github?: string;
  website?: string;
  discord?: string;
  color: string; // tailwind gradient from-to
  icon: React.ReactNode;
};

const CREDITS: readonly Credit[] = [
  {
    name: "MKGF",
    role: "Desarrollador Principal",
    description: "BackEnd, sistema de rankings y API de Riot Games",
    avatar: "https://github.com/MKGF.png",
    github: "https://github.com/MKGF",
    color: "from-emerald-500 to-green-500",
    icon: <Code className="w-5 h-5" />,
  },
  {
    name: "Ignacio Csaszar - Zennith",
    role: "FrontEnd",
    description: "FrontEnd, Diseño y desarrollo de la página web y experiencia de usuario",
    avatar: zennithLogo,
    website: LINKS.website,
    color: "from-blue-500 to-purple-500",
    icon: <Palette className="w-5 h-5" />,
  },
  {
    name: "Comunidad Discord",
    role: "Testing & Feedback",
    description: "Pruebas beta, reportes de bugs y sugerencias de mejoras",
    avatar: logoDiscord,
    discord: LINKS.discord,
    color: "from-indigo-500 to-blue-500",
    icon: <Bug className="w-5 h-5" />,
  },
] as const;

/* ───────────────────────── UI helpers ───────────────────────── */

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      aria-label={label}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-lg bg-white/5 border border-white/10 p-2 hover:bg-white/10 transition-all hover:scale-105"
    >
      {children}
    </a>
  );
}

function CreditCard({ person, index }: { person: Credit; index: number }) {
  return (
    <motion.div
      className="relative p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 hover:border-emerald-400/30 transition-all duration-300 group"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ scale: 1.02, y: -2 }}
    >
      {/* brillo */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

      <div className="relative flex items-start gap-4">
        {/* Avatar */}
        <div className="relative">
          <div
            className={`absolute inset-0 bg-gradient-to-r ${person.color} rounded-full blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-300`}
          />
          <img
            src={person.avatar}
            alt={person.name}
            width={64}
            height={64}
            loading="lazy"
            decoding="async"
            className="relative w-16 h-16 rounded-full border-2 border-white/20 group-hover:border-emerald-400/50 transition-colors duration-300 object-cover"
          />
          <div
            className={`absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r ${person.color} rounded-full flex items-center justify-center border-2 border-gray-900`}
          >
            {person.icon}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-white group-hover:text-emerald-100 transition-colors duration-300">
              {person.name}
            </h3>
            <div className="flex gap-2">
              {person.github && (
                <SocialLink href={person.github} label="GitHub">
                  <Github className="w-4 h-4 text-white" />
                </SocialLink>
              )}
              {person.website && (
                <SocialLink href={person.website} label="Website">
                  <Globe className="w-4 h-4 text-white" />
                </SocialLink>
              )}
              {person.discord && (
                <SocialLink href={person.discord} label="Discord">
                  <img src={logoDiscord} alt="" className="w-4 h-4" />
                </SocialLink>
              )}
            </div>
          </div>

          <p className={`text-sm font-semibold bg-gradient-to-r ${person.color} bg-clip-text text-transparent mb-2`}>
            {person.role}
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">{person.description}</p>
        </div>
      </div>
    </motion.div>
  );
}

/* ───────────────────────── Footer ───────────────────────── */

export default function Footer() {
  const { t } = useTranslation("common", { keyPrefix: "footer" });
  const [open, setOpen] = useState(false);
  const dialogId = useId();

  // memo para evitar recrear nodos de créditos en cada render
  const cards = useMemo(
    () => CREDITS.map((p, i) => <CreditCard key={p.name} person={p} index={i} />),
    []
  );

  return (
    <>
      <footer className="relative mt-0 text-white overflow-hidden">
        {/* línea neón superior */}
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400/80 to-transparent shadow-[0_0_16px_#10B981] z-10" />

        {/* Fondo base */}
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-black via-[#0B0B0B] to-black" />

        {/* Overlay dinámico (usa clase global animate-bg-pan) */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-60 bg-[length:200%_100%] animate-bg-pan"
          style={{
            background:
              "linear-gradient(115deg, rgba(16,185,129,0) 0%, rgba(16,185,129,0.12) 35%, rgba(88,101,242,0.08) 55%, rgba(16,185,129,0.12) 70%, rgba(16,185,129,0) 100%)",
            animationDuration: "28s",
          }}
        />

        {/* Grid suave + glows */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-20 [mask-image:radial-gradient(70%_70%_at_60%_40%,black,transparent)] bg-[size:28px_28px,28px_28px] [background-position:0_60px,0_60px] animate-bg-pan"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            animationDuration: "120s",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -z-10 left-[-15%] bottom-[-25%] w-[55vw] h-[55vh] bg-[radial-gradient(50%_50%_at_0%_100%,rgba(16,185,129,0.18),rgba(0,0,0,0))]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -z-10 right-[-10%] top-[-30%] w-[45vw] h-[45vh] bg-[radial-gradient(50%_50%_at_100%_0%,rgba(88,101,242,0.12),rgba(0,0,0,0))]"
        />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-10">
            {/* Brand + CTA */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-3">
                <span className="relative">
                  <span className="absolute inset-0 rounded-full bg-emerald-500/20 blur-md -z-10" />
                  <img
                    src={logoUrl}
                    alt={t("brandAlt")}
                    width={40}
                    height={40}
                    decoding="async"
                    className="h-10 w-10 rounded-full border border-white/10 p-1 shadow-[0_0_30px_rgba(16,185,129,0.25)] backdrop-blur object-contain"
                  />
                </span>
                <h3 className="text-xl font-extrabold tracking-wide">RANKY</h3>
              </div>

              <p className="mt-3 text-white/70 text-sm max-w-xs">{t("tagline")}</p>

              <div className="mt-5">
                <a
                  href={LINKS.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={t("ctaPrimary")}
                  className="group relative inline-flex items-center gap-2 rounded-2xl bg-[#5865F2] hover:bg-[#4752C4] text-white px-4 py-2 text-sm font-semibold shadow-[0_8px_22px_rgba(88,101,242,0.35)] ring-1 ring-white/10 hover:ring-emerald-300/30 transition-colors"
                >
                  <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
                    <span className="absolute -left-1/2 top-0 h-full w-1/2 translate-x-[-120%] group-hover:translate-x-[320%] transition-transform duration-700 ease-out -skew-x-12 bg-white/20 blur-lg" />
                  </span>
                  <img src={logoDiscord} alt="" className="w-5 h-5" />
                  <span>{t("ctaPrimary")}</span>
                </a>
              </div>
            </div>

            {/* Enlaces */}
            <nav className="grid grid-cols-2 md:grid-cols-3 md:col-span-3 gap-8">
              <div>
                <h4 className="text-white font-semibold">{t("product.title")}</h4>
                <ul className="mt-3 space-y-2 text-sm text-white/80">
                  <li><a href="#how" className="hover:text-white transition-colors">{t("product.how")}</a></li>
                  <li><a href="#usage" className="hover:text-white transition-colors">{t("product.usage")}</a></li>
                  <li><a href="#faq" className="hover:text-white transition-colors">{t("product.faq")}</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-semibold">{t("community.title")}</h4>
                <ul className="mt-3 space-y-2 text-sm text-white/80">
                  <li><a href={LINKS.discord} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Discord</a></li>
                  <li><a href={LINKS.github} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a></li>
                  <li>
                    <button onClick={() => setOpen(true)} className="hover:text-white transition-colors text-left">
                      {t("community.credits")}
                    </button>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-semibold">{t("legal.title")}</h4>
                <ul className="mt-3 space-y-2 text-sm text-white/80">
                  <li><a href="#privacy" className="hover:text-white transition-colors">{t("legal.privacy")}</a></li>
                  <li><a href="#terms" className="hover:text-white transition-colors">{t("legal.terms")}</a></li>
                  <li><a href="#contact" className="hover:text-white transition-colors">{t("legal.contact")}</a></li>
                </ul>
              </div>
            </nav>
          </div>

          {/* Social + rights */}
          <div className="mt-10 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <SocialLink href={LINKS.discord} label="Discord">
                <img src={logoDiscord} alt="" className="w-5 h-5" />
              </SocialLink>
              <SocialLink href={LINKS.github} label="GitHub">
                <Github className="w-5 h-5" />
              </SocialLink>
              <SocialLink href={LINKS.twitter} label="Twitter/X">
                <Twitter className="w-5 h-5" />
              </SocialLink>
              <SocialLink href={LINKS.website} label="Website">
                <Globe className="w-5 h-5" />
              </SocialLink>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-1">
              <p className="text-xs text-white/60">© {YEAR} Ranky. {t("rights")}</p>
              <p className="text-xs text-white/60">
                <Trans
                  t={t}
                  i18nKey="madeBy"
                  components={{
                    heart: <span aria-hidden="true">❤️</span>,
                    a: (
                      <a
                        href={LINKS.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline decoration-white/30 hover:decoration-emerald-400 hover:text-white transition-colors"
                      />
                    ),
                  }}
                />
              </p>
            </div>
          </div>

          {/* Riot disclaimer */}
          <div className="mt-3 text-[11px] leading-relaxed text-white/50 max-w-4xl">
            <Trans
              t={t}
              i18nKey="riotNotice"
              components={{
                a: (
                  <a
                    href={LINKS.riot}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-white/30 hover:decoration-emerald-400 hover:text-white transition-colors"
                  />
                ),
              }}
            />
          </div>
        </div>
      </footer>

      {/* Modal Créditos */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={`credits-title-${dialogId}`}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="relative bg-gray-900/95 backdrop-blur-xl border border-emerald-400/30 rounded-3xl shadow-2xl shadow-emerald-500/20 max-w-2xl w-full max-h-[90vh] overflow-hidden"
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              transition={{ type: "spring", duration: 0.45 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Fondos suaves */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-blue-500/10" />
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl" />

              {/* Header */}
              <div className="relative border-b border-white/10 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 id={`credits-title-${dialogId}`} className="text-2xl font-black text-white">
                        Créditos
                      </h2>
                      <p className="text-gray-400 text-sm">Conoce a nuestro increíble equipo</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-emerald-400/50 rounded-full flex items-center justify-center transition-all hover:scale-105"
                    aria-label="Cerrar"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Contenido */}
              <div className="relative p-6 overflow-y-auto max-h-[60vh]">
                <div className="space-y-6">{cards}</div>

                <motion.div
                  className="mt-8 p-6 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-400/20 rounded-2xl text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  <h4 className="text-lg font-bold text-white mb-2">¡Gracias por hacer posible Ranky! 🎉</h4>
                  <p className="text-gray-400 text-sm">
                    Este proyecto no sería posible sin el increíble trabajo de nuestro equipo y el apoyo de la comunidad.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
