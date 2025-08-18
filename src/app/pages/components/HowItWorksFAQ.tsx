import React, { useMemo, useRef, useState, useEffect, useId } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import type { Variants, Transition } from "framer-motion"; // ⬅️ type-only import
import DiscordIcon from "/discord-logo.svg";


/* ═══════════════════════════════ Constantes globales ═══════════════════════════════ */

const SECTION_ID = "como-funciona" as const;

const DUR = {
  base: 0.8,
  slow: 1.5,
  long: 20,
} as const;

const EASE_OUT: Transition["ease"] = "easeOut";

/** Variants fuera del render para no recrearlos */
const STEP_ENTER: Variants = {
  hidden: { opacity: 0, y: 100, rotateX: -15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: DUR.base, ease: EASE_OUT, delay: i * 0.2 },
  }),
};

const FAQ_ITEM_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },

  
};


const DISCORD_INVITE_URL =
  "https://discord.com/oauth2/authorize?client_id=1005188427634966629&permissions=268528656&scope=bot+applications.commands" as const;

/* ═══════════════════════════════ Utils / Hooks ═══════════════════════════════ */

/** PRNG determinístico (no Math.random en render) */
function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Animaciones sólo si el dispositivo lo soporta */
function useShouldAnimate() {
  const [animated, setAnimated] = useState(false);
  useEffect(() => {
    const prefersReduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    const mem = ((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8) as number;
    const cores = navigator.hardwareConcurrency ?? 4;
    setAnimated(!prefersReduced && mem >= 4 && cores > 2);
  }, []);
  return animated;
}

/** Encapsula parallax */
/** Encapsula parallax (match con useScroll) */
function useParallax(ref: React.RefObject<HTMLElement | null>) {
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const yContent = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);
  return { yBg, yContent };
}


/* ═════════════════════════════════ Tipos ═════════════════════════════════ */

interface HowItWorksFAQProps {
  discordInviteUrl?: string;
  className?: string;
}
interface FaqItemShape {
  q: string;
  a: string;
}

/* ═════════════════════════════════ Componente ═════════════════════════════════ */

function HowItWorksFAQ({ discordInviteUrl = "#", className = "" }: HowItWorksFAQProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
   discordInviteUrl = DISCORD_INVITE_URL

  // ✅ incluye null en el genérico
const containerRef = useRef<HTMLElement | null>(null);

  const { yBg, yContent } = useParallax(containerRef);

  

  // Traducciones memoizadas
  const faqItems = useMemo(
    () => (t("howItWorks.faq.items", { returnObjects: true }) as FaqItemShape[]) ?? [],
    [t, lang]
  );
  const step2Features = useMemo(
    () => (t("howItWorks.steps.step2.features", { returnObjects: true }) as string[]) ?? [],
    [t, lang]
  );
  const step3Features = useMemo(
    () => (t("howItWorks.steps.step3.features", { returnObjects: true }) as string[]) ?? [],
    [t, lang]
  );

  // Activar/desactivar loops
  const animated = useShouldAnimate();

  // Partículas determinísticas (posiciones y tiempos fijos, via CSS vars)
  const particles = useMemo(() => {
    const rng = mulberry32(20250814);
    const N = 16;
    return Array.from({ length: N }, (_, i) => ({
      key: `p-${i}`,
      left: `${Math.round(rng() * 100)}%`,
      top: `${Math.round(rng() * 100)}%`,
      dur: 3 + Math.round(rng() * 4), // 3..7
      delay: +(rng() * 2).toFixed(2), // 0..2
    }));
  }, []);

  
  return (
    <section
      ref={containerRef}
      id={SECTION_ID}
      className={`relative min-h-screen bg-black overflow-hidden ${className}`}
    >
      {/* ───── Fondo / Parallax ───── */}
      <motion.div className="absolute inset-0 pointer-events-none select-none" style={{ y: yBg }}>
        {/* Capa base */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-950/30 to-black" />

        {/* Overlay con pan del background (CSS) */}
        {animated && (
          <div
            className="absolute inset-0 animate-bg-pan"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, rgba(16,185,129,0.14) 0%, transparent 55%)",
            }}
            aria-hidden
          />
        )}

        {/* Partículas (CSS vars para perf) */}
        {particles.map((p) => (
          <div
            key={p.key}
            className="absolute w-1 h-1 bg-emerald-400/30 rounded-full animate-twinkle-sway transform-gpu will-change-transform"
            style={
              {
                left: p.left,
                top: p.top,
                "--twink-dur": `${p.dur}s`,
                animationDelay: `${p.delay}s`,
              } as React.CSSProperties
            }
            aria-hidden
          />
        ))}

        {/* Orbes */}
        <div
          className={`absolute top-1/4 left-1/6 w-[56vw] max-w-[600px] h-[38vw] max-h-[400px] rounded-full blur-3xl opacity-90 
                      bg-gradient-to-r from-emerald-500/25 via-emerald-400/35 to-cyan-500/20 
                      ${animated ? "animate-float" : ""}`}
          style={{ animationDelay: "0.4s" }}
          aria-hidden
        />
        <div
          className={`absolute bottom-1/4 right-1/6 w-[48vw] max-w-[500px] h-[34vw] max-h-[350px] rounded-full blur-2xl opacity-80 
                      bg-gradient-to-l from-blue-500/30 via-emerald-500/25 to-purple-500/20 
                      ${animated ? "animate-float-reverse" : ""}`}
          style={{ animationDelay: "1s" }}
          aria-hidden
        />
        <div
          className={`absolute top-1/2 right-1/3 w-[30vw] max-w-[300px] h-[30vw] max-h-[300px] rounded-full blur-xl opacity-70 
                      bg-gradient-to-br from-cyan-400/30 to-emerald-500/25 
                      ${animated ? "animate-orbit" : ""}`}
          style={{ animationDuration: "28s", animationDelay: "0.7s" }}
          aria-hidden
        />

        {/* Línea animada (sólo si animamos) */}
        {animated && (
          <svg className="absolute inset-0 w-full h-full" aria-hidden>
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(16,185,129,0)" />
                <stop offset="50%" stopColor="rgba(16,185,129,0.4)" />
                <stop offset="100%" stopColor="rgba(16,185,129,0)" />
              </linearGradient>
            </defs>
            <motion.path
              d="M 0,300 Q 400,100 800,300 T 1600,300"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
            />
          </svg>
        )}

        {/* Borde superior (pulso CSS barato) */}
        <div
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent shadow-lg shadow-emerald-400/20"
          aria-hidden
          style={{ animation: animated ? "pulse-gentle 5s ease-in-out infinite" : undefined }}
        />
      </motion.div>

      {/* ───── Contenido / Parallax ───── */}
      <motion.div className="relative z-10 container mx-auto max-w-7xl px-6 py-20" style={{ y: yContent }}>
        {/* Header */}
        <motion.div
          className="text-center mb-24"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: DUR.base, ease: EASE_OUT }}
        >
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-200 to-blue-200 mb-6 leading-tight animate-bg-pan"
            style={{ backgroundSize: "200% 200%", animationDuration: "5s", animationDelay: ".2s" }}
          >
            {t("howItWorks.title.part1")}
          </h1>

          <motion.div
            className="w-28 md:w-32 h-1 bg-gradient-to-r from-emerald-400 to-blue-400 mx-auto rounded-full shadow-lg shadow-emerald-400/50"
            initial={{ width: 0 }}
            whileInView={{ width: 128 }}
            viewport={{ once: true }}
            transition={{ duration: DUR.slow, delay: 0.5, ease: EASE_OUT }}
          />
        </motion.div>

        {/* Steps */}
        <motion.div
          className="grid lg:grid-cols-3 gap-8 mb-24"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.3, delayChildren: 0.15 } } }}
        >
          <StepCard
            number="01"
            title={t("howItWorks.steps.step1.title")}
            description={t("howItWorks.steps.step1.description")}
            icon={
              <img
                src={DiscordIcon}
                alt="Discord"
                className="w-6 h-6 drop-shadow-lg"
                loading="lazy"
                decoding="async"
                width={24}
                height={24}
              />
            }
            ctaLabel={t("howItWorks.steps.step1.cta")}
            href={discordInviteUrl}
            highlight
            index={0}
            animated={animated}
          />

          <StepCard
            number="02"
            title={t("howItWorks.steps.step2.title")}
            description={t("howItWorks.steps.step2.description")}
            icon={<SlidersIcon />}
            features={step2Features}
            index={1}
            animated={animated}
          />

          <StepCard
            number="03"
            title={t("howItWorks.steps.step3.title")}
            description={t("howItWorks.steps.step3.description")}
            icon={<TrophyIcon />}
            features={step3Features}
            index={2}
            animated={animated}
          />
        </motion.div>

        {/* FAQ */}
        <motion.div
          className="max-w-4xl mx-auto mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: DUR.base }}
        >
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: DUR.base, delay: 0.2 }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-emerald-200 to-blue-200 mb-4">
              {t("howItWorks.faq.title")}
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {t("howItWorks.faq.subtitle", "Respuestas a las preguntas más comunes")}
            </p>
          </motion.div>

          <motion.div
            className="grid gap-4"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {faqItems.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </motion.div>
        </motion.div>

        {/* CTA final */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: DUR.base, ease: EASE_OUT }}
        >
          <motion.div className="relative inline-block" whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
            {animated && (
              <>
                <div
                  className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-blue-600/20 blur-xl rounded-3xl animate-orbit"
                  style={{ animationDuration: `${DUR.long}s` }}
                  aria-hidden
                />
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400/50 to-blue-400/50 rounded-3xl opacity-0 transition-opacity duration-300" />
              </>
            )}

            <div className="relative bg-gray-900/50 border border-emerald-400/30 rounded-2xl p-10 backdrop-blur-md overflow-hidden">
              {animated &&
                Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-emerald-400/20 rounded-full animate-twinkle-sway transform-gpu will-change-transform"
                    style={{ left: `${20 + i * 15}%`, top: `${20 + (i % 2) * 60}%`, "--twink-dur": `${2 + i * 0.5}s` } as React.CSSProperties}
                    aria-hidden
                  />
                ))}

              <div className="relative">
                <h3
                  className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400 mb-4 animate-bg-pan"
                  style={{ backgroundSize: "200% 200%", animationDuration: "3s", animationDelay: ".2s" }}
                >
                  {t("howItWorks.finalCta.title")}
                </h3>
                <p className="text-gray-300 mb-8 max-w-lg text-lg leading-relaxed">
                  {t("howItWorks.finalCta.subtitle")}
                </p>
                <motion.a
                  href={discordInviteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-400 hover:to-blue-400 text-white font-bold px-8 py-4 rounded-xl transition-all duration-300 text-lg shadow-lg shadow-emerald-500/25 relative overflow-hidden"
                  whileHover={{ scale: 1.05, boxShadow: "0 25px 50px rgba(16,185,129,0.4)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  {animated && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-bg-pan" style={{ animationDuration: "0.6s" }} aria-hidden />
                  )}
                  <img src={DiscordIcon} alt="Discord" className="w-6 h-6" loading="lazy" decoding="async" />
                  <span>{t("howItWorks.finalCta.buttonText")}</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default React.memo(HowItWorksFAQ);

/* ═══════════════════════════════ StepCard ═══════════════════════════════ */

const StepCard = React.memo(function StepCard({
  number,
  title,
  description,
  icon,
  features,
  ctaLabel,
  href,
  highlight = false,
  index = 0,
  animated,
}: {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  features?: string[];
  ctaLabel?: string;
  href?: string;
  highlight?: boolean;
  index?: number;
  animated: boolean;
}) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={cardRef}
      className="relative group cursor-pointer will-change-transform"
      variants={STEP_ENTER}
      custom={index}
      whileHover={{ y: -10, rotateY: 5, transition: { type: "spring", stiffness: 300 } }}
    >
      {animated && (
        <div
          className="absolute -inset-1 bg-gradient-to-r from-emerald-400/20 to-blue-400/20 rounded-3xl opacity-0 group-hover:opacity-100 blur-lg animate-orbit"
          style={{ animationDuration: `${DUR.long}s` }}
          aria-hidden
        />
      )}

      <div
        className={`relative p-8 rounded-2xl border backdrop-blur-md transition-all duration-500 h-full overflow-hidden
        ${highlight
            ? "bg-gradient-to-br from-emerald-500/20 via-emerald-500/10 to-transparent border-emerald-400/50 shadow-2xl shadow-emerald-500/25"
            : "bg-gradient-to-br from-gray-800/40 via-gray-800/20 to-transparent border-gray-700/50 group-hover:border-emerald-400/50 group-hover:shadow-xl group-hover:shadow-emerald-500/10"
          }`}
      >
        {animated &&
          [0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-emerald-400/30 rounded-full animate-twinkle-sway transform-gpu will-change-transform"
              style={{ left: `${20 + i * 30}%`, top: `${10 + i * 25}%`, "--twink-dur": `${2 + i * 0.5}s` } as React.CSSProperties}
              aria-hidden
            />
          ))}

        <motion.div className="absolute top-6 right-6" whileHover={{ rotate: 360, scale: 1.1 }} transition={{ type: "spring", stiffness: 300 }}>
          <span
            className={`text-lg font-black px-4 py-2 rounded-xl transition-all duration-300 relative overflow-hidden
            ${highlight ? "bg-emerald-400 text-black shadow-lg shadow-emerald-400/50" : "bg-gray-700/80 text-gray-200 group-hover:bg-emerald-400/20 group-hover:text-emerald-300"}`}
          >
            {animated && <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-bg-pan" style={{ animationDuration: "1s" }} aria-hidden />}
            <span className="relative z-10">{number}</span>
          </span>
        </motion.div>

        <motion.div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-all duration-300 relative
          ${highlight ? "bg-emerald-400/30 text-emerald-300 shadow-lg shadow-emerald-400/30" : "bg-gray-700/60 text-gray-400 group-hover:bg-emerald-400/20 group-hover:text-emerald-400"}`}
          whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
          transition={{ duration: 0.5 }}
        >
          {animated && <div className="absolute inset-0 bg-emerald-400/20 rounded-2xl opacity-0 group-hover:opacity-100 animate-bg-pan" style={{ animationDuration: "2s" }} aria-hidden />}
          <div className="relative z-10">{icon}</div>
        </motion.div>

        <div className="relative">
          <motion.h3
            className="text-2xl font-bold text-white mb-4 group-hover:text-emerald-100 transition-colors duration-200"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: DUR.base, delay: index * 0.2 + 0.3 }}
          >
            {title}
          </motion.h3>

          <motion.p
            className="text-gray-400 mb-8 leading-relaxed group-hover:text-gray-300 transition-colors duration-200"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: DUR.base, delay: index * 0.2 + 0.4 }}
          >
            {description}
          </motion.p>

          {features?.length ? (
            <motion.div
              className="flex flex-wrap gap-3 mb-8"
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: index * 0.2 + 0.5 } } }}
            >
              {features.map((feature) => (
                <motion.span
                  key={feature}
                  className="text-sm px-4 py-2 rounded-full bg-gray-700/60 text-gray-300 border border-gray-600/50 hover:border-emerald-400/50 hover:bg-emerald-400/10 hover:text-emerald-300 transition-all duration-200 cursor-pointer"
                  variants={{ hidden: { opacity: 0, scale: 0 }, visible: { opacity: 1, scale: 1 } }}
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  {feature}
                </motion.span>
              ))}
            </motion.div>
          ) : null}

          {ctaLabel && href && (
            <motion.a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-400 hover:to-blue-400 text-white font-bold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/25 relative overflow-hidden group/cta"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: DUR.base, delay: index * 0.2 + 0.6 }}
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(16,185,129,0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              {animated && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-bg-pan" style={{ animationDuration: "0.6s" }} aria-hidden />
              )}
              <span className="relative z-10">{ctaLabel}</span>
              <ArrowRight className="w-5 h-5 relative z-10" />
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
});

/* ═══════════════════════════════ FAQ Item ═══════════════════════════════ */

const FaqItem = React.memo(function FaqItem({ q, a }: { q: string; a: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const id = useId();
  const panelId = `faq-panel-${id}`;
  const btnId = `faq-btn-${id}`;

  return (
    <motion.div
      className="border border-gray-700/60 rounded-2xl bg-gray-800/40 backdrop-blur-md overflow-hidden hover:border-emerald-400/40 transition-all duration-300 group cursor-pointer"
      variants={FAQ_ITEM_VARIANTS}
      whileHover={{ scale: 1.02, boxShadow: "0 10px 30px rgba(16,185,129,0.1)" }}
    >
      <motion.button
        id={btnId}
        aria-controls={panelId}
        aria-expanded={isOpen}
        className="w-full p-6 text-left flex items-center justify-between hover:bg-emerald-400/5 transition-colors duration-200 focus:outline-none focus:bg-emerald-400/5 cursor-pointer"
        onClick={() => setIsOpen((s) => !s)}
        whileTap={{ scale: 0.98 }}
      >
        <span className="text-white font-semibold text-lg hover:text-emerald-100 transition-colors duration-200 pr-4">
          {q}
        </span>
        <motion.div
          className={`w-8 h-8 rounded-full bg-emerald-400/20 flex items-center justify-center transition-all duration-300 group-hover:bg-emerald-400/30 relative overflow-hidden ${
            isOpen ? "bg-emerald-400/30" : ""
          }`}
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ type: "spring", stiffness: 300 }}
          whileHover={{ scale: 1.1 }}
        >
          <div className="absolute inset-0 bg-emerald-400/30 rounded-full animate-bg-pan" style={{ animationDuration: "2s" }} aria-hidden />
          <PlusIcon className="w-4 h-4 text-emerald-400 relative z-10" />
        </motion.div>
      </motion.button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={btnId}
            className="overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 pb-6">
              <motion.div
                className="w-full h-px bg-gradient-to-r from-emerald-400/40 to-blue-400/20 mb-4"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, ease: EASE_OUT }}
                style={{ transformOrigin: "left" }}
              />
              <motion.p
                className="text-gray-400 leading-relaxed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                {a}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

/* ═══════════════════════════════ Iconos ═══════════════════════════════ */

const SlidersIcon = React.memo(function SlidersIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <motion.svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <motion.path
        d="M4 7h9a2 2 0 104 0h3a1 1 0 110 2h-3a2 2 0 10-4 0H4a1 1 0 110-2zm0 10h5a2 2 0 104 0h7a1 1 0 110 2h-7a2 2 0 10-4 0H4a1 1 0 110-2zM4 12h1a2 2 0 104 0h11a1 1 0 110 2H9a2 2 0 10-4 0H4a1 1 0 110-2z"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
    </motion.svg>
  );
});

const TrophyIcon = React.memo(function TrophyIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <motion.svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <motion.path
        d="M6 3a1 1 0 00-1 1v1H3a1 1 0 000 2h2a6 6 0 005 5.917V15H8a1 1 0 000 2h8a1 1 0 100-2h-2v-2.083A6 6 0 0019 7h2a1 1 0 100-2h-2V4a1 1 0 00-1-1H6zm11 4a4 4 0 01-3.2 3.9 1 1 0 00-.8.98V15h-2V11.88a1 1 0 00-.8-.98A4 4 0 017 7V5h10v2zM8 19a1 1 0 000 2h8a1 1 0 100-2H8z"
        initial={{ pathLength: 0, fill: "rgba(156,163,175,.4)" }}
        animate={{ pathLength: 1, fill: "currentColor" }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />
      <motion.circle
        cx="12"
        cy="10"
        r="2"
        fill="rgba(16,185,129,.3)"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.5, 0], opacity: [0, 0.6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
    </motion.svg>
  );
});

const ArrowRight = React.memo(function ArrowRight({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <motion.svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <motion.path
        d="M10.293 3.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 11-1.414-1.414L13.586 11H4a1 1 0 110-2h9.586l-3.293-3.293a1 1 0 010-1.414z"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </motion.svg>
  );
});

const PlusIcon = React.memo(function PlusIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <motion.svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <motion.path
        fillRule="evenodd"
        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
        clipRule="evenodd"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
    </motion.svg>
  );
});
