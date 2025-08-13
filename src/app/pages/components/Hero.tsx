"use client";

import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  lazy,
  Suspense,
} from "react";
import { Trans, useTranslation } from "react-i18next";
import logoDiscord from "/discord-logo.svg";

const LeaderboardMotion = lazy(() => import("./LeaderboardMotion"));

interface LeaderboardEntry {
  readonly name: string;
  readonly lp: number;
  readonly wl: string;
  readonly pts: number;
}

const LEADERBOARD_DATA: readonly LeaderboardEntry[] = [
  { name: "NamiMains", lp: 820, wl: "42/28", pts: 120 },
  { name: "BaronSoul", lp: 780, wl: "39/25", pts: 112 },
  { name: "SplitPush", lp: 740, wl: "37/24", pts: 108 },
  { name: "JungleDiff", lp: 710, wl: "35/26", pts: 101 },
] as const;

const FEATURE_BADGES = [
  "Auto LP sync",
  "Point rules",
  "Tiers & promos",
  "Weekly resets",
] as const;

const DISCORD_INVITE_URL =
  "https://discord.com/oauth2/authorize?client_id=1005188427634966629&permissions=268528656&scope=bot+applications.commands" as const;

// Tipo para evitar `any` en navigator y acceder a campos no estandarizados
type BraveNavigator = Navigator & {
  brave?: {
    isBrave?: () => Promise<boolean>;
  };
  deviceMemory?: number;
};

const useBraveDetection = (): boolean => {
  const [isBrave, setIsBrave] = useState(false);

  useEffect(() => {
    const detectSync = () => {
      const nav = navigator as BraveNavigator;
      const userAgent = /brave/i.test(navigator.userAgent);
      const hasChrome = /chrome/i.test(navigator.userAgent);
      const hasGecko = /gecko/i.test(navigator.userAgent);

      if (userAgent || (hasChrome && !hasGecko && nav.brave)) {
        setIsBrave(true);
        return;
      }
    };

    detectSync();

    const detectAsync = async () => {
      try {
        const nav = navigator as BraveNavigator;
        if (nav?.brave?.isBrave) {
          const result = await nav.brave.isBrave();
          setIsBrave(result);
        }
      } catch {
        // Ignoramos el error si Brave no expone la API
      }
    };

    setTimeout(detectAsync, 100);
  }, []);

  return isBrave;
};

// Fondo dramático y potente para Brave
const PowerfulStaticBackground = React.memo(() => (
  <div aria-hidden className="absolute inset-0 z-0 pointer-events-none">
    {/* Grid más visible y con personalidad */}
    <div
      className="absolute inset-0 opacity-40"
      style={{
        backgroundImage: `
          linear-gradient(rgba(16,185,129,0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(16,185,129,0.3) 1px, transparent 1px),
          linear-gradient(rgba(59,130,246,0.15) 1px, transparent 1px),
          linear-gradient(90deg, rgba(59,130,246,0.15) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px, 40px 40px, 120px 120px, 120px 120px",
        backgroundPosition: "0 0, 0 0, 20px 20px, 20px 20px",
      }}
    />

    {/* Orbes de luz más dramáticos */}
    <div className="absolute inset-0">
      <div className="absolute top-1/4 left-1/6 w-[600px] h-[400px] bg-gradient-to-r from-emerald-500/20 via-emerald-400/30 to-cyan-500/15 rounded-full blur-3xl opacity-80" />
      <div className="absolute bottom-1/4 right-1/6 w-[500px] h-[350px] bg-gradient-to-l from-blue-500/25 via-emerald-500/20 to-purple-500/15 rounded-full blur-2xl opacity-70" />
      <div className="absolute top-1/2 right-1/3 w-[300px] h-[300px] bg-gradient-to-br from-cyan-400/25 to-emerald-500/20 rounded-full blur-xl opacity-60" />
    </div>

    {/* Patrón de puntos más visible */}
    <div
      className="absolute inset-0 opacity-25"
      style={{
        backgroundImage: `
          radial-gradient(rgba(16,185,129,0.4) 2px, transparent 2px),
          radial-gradient(rgba(59,130,246,0.3) 1.5px, transparent 1.5px),
          radial-gradient(rgba(168,85,247,0.2) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px, 40px 40px, 80px 80px",
        backgroundPosition: "0 0, 20px 20px, 40px 10px",
      }}
    />

    {/* Overlay de profundidad más dramático */}
    <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/40" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
  </div>
));

PowerfulStaticBackground.displayName = "PowerfulStaticBackground";

// Fondo épico con animaciones para otros navegadores
const EpicAnimatedBackground = React.memo(() => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return <PowerfulStaticBackground />;

  return (
    <div aria-hidden className="absolute inset-0 z-0 pointer-events-none">
      {/* Grid animado con pulso */}
      <div
        className="absolute inset-0 opacity-50 animate-grid-pulse"
        style={{
          backgroundImage: `
            linear-gradient(rgba(16,185,129,0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16,185,129,0.4) 1px, transparent 1px),
            linear-gradient(rgba(59,130,246,0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.2) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px, 40px 40px, 120px 120px, 120px 120px",
          backgroundPosition: "0 0, 0 0, 20px 20px, 20px 20px",
        }}
      />

      {/* Orbes con movimiento épico */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/6 w-[600px] h-[400px] bg-gradient-to-r from-emerald-500/25 via-emerald-400/35 to-cyan-500/20 rounded-full blur-3xl opacity-90 animate-epic-float" />
        <div className="absolute bottom-1/4 right-1/6 w-[500px] h-[350px] bg-gradient-to-l from-blue-500/30 via-emerald-500/25 to-purple-500/20 rounded-full blur-2xl opacity-80 animate-epic-float-reverse" />
        <div className="absolute top-1/2 right-1/3 w-[300px] h-[300px] bg-gradient-to-br from-cyan-400/30 to-emerald-500/25 rounded-full blur-xl opacity-70 animate-epic-orbit" />
      </div>

      {/* Estrellas animadas */}
      <div
        className="absolute inset-0 opacity-30 animate-twinkle-epic"
        style={{
          backgroundImage: `
            radial-gradient(rgba(16,185,129,0.5) 2px, transparent 2px),
            radial-gradient(rgba(59,130,246,0.4) 1.5px, transparent 1.5px),
            radial-gradient(rgba(168,85,247,0.3) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px, 40px 40px, 80px 80px",
          backgroundPosition: "0 0, 20px 20px, 40px 10px",
        }}
      />

      {/* Ondas de energía */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-500/10 via-transparent to-blue-500/10 animate-energy-wave" />
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
    </div>
  );
});

EpicAnimatedBackground.displayName = "EpicAnimatedBackground";

export default function Hero(): React.JSX.Element {
  const { t } = useTranslation("common", { keyPrefix: "hero" });
  const isBrave = useBraveDetection();

  const shouldUseStatic = useMemo(() => {
    if (typeof window === "undefined") return true;

    const prefersReduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    const lowMemory =
      ((navigator as BraveNavigator).deviceMemory ?? 8) < 4; // valor por defecto seguro
    const slowCPU = navigator.hardwareConcurrency <= 2;

    return isBrave || prefersReduced || lowMemory || slowCPU;
  }, [isBrave]);

  const badges = useMemo(() => [t("badge1"), t("badge2"), t("badge3")], [t]);

  const handleCTAClick = useCallback(() => {
    // analytics opcional
  }, []);

  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#020202] via-[#050505] to-[#0a0a0f] min-h-screen">
      {/* Luz de ambiente principal más intensa */}
      <div
        aria-hidden
        className="pointer-events-none absolute z-0 left-[-15%] top-[-20%] w-[70vw] h-[60vh]"
      >
        <div className="w-full h-full bg-gradient-radial from-emerald-500/30 via-emerald-500/15 to-transparent blur-3xl" />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute z-0 right-[-20%] bottom-[-25%] w-[75vw] h-[65vh]"
      >
        <div className="w-full h-full bg-gradient-radial from-blue-500/25 via-emerald-400/12 to-transparent blur-3xl" />
      </div>

      {/* Background principal */}
      {shouldUseStatic ? (
        <PowerfulStaticBackground />
      ) : (
        <EpicAnimatedBackground />
      )}

      {/* Vignette más dramático */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-[5]">
        <div className="absolute inset-0 bg-gradient-radial from-transparent 20% via-transparent 50% to-black/50" />
      </div>

      {/* CONTENIDO */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-20 sm:pt-28 pb-24 sm:pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-left space-y-8">
            {/* Badge más llamativo */}
            <div className="inline-flex items-center gap-3 rounded-full border-2 border-emerald-400/30 bg-gradient-to-r from-emerald-500/20 via-emerald-400/15 to-cyan-500/10 backdrop-blur-md text-emerald-100 px-5 py-2.5 text-sm font-medium shadow-2xl shadow-emerald-500/25">
              <div className="relative">
                <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
                <div className="absolute inset-0 w-3 h-3 bg-emerald-400 rounded-full animate-ping opacity-75" />
              </div>
              <span className="text-white/90 font-semibold">
                LoL • SoloQ / DuoQ • Rankings
              </span>
            </div>

            {/* Título con más impacto */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight">
              <span className="bg-gradient-to-r from-white via-emerald-100 to-emerald-200 bg-clip-text text-transparent drop-shadow-2xl">
                <Trans
                  t={t}
                  i18nKey="title"
                  components={[<br key="br" className="hidden sm:block" />]}
                />
              </span>
            </h1>

            {/* Botón más épico */}
            <div>
              <a
                href={DISCORD_INVITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                title={t("ctaPrimary")}
                onClick={handleCTAClick}
                className={`group relative inline-flex items-center gap-4 rounded-2xl bg-gradient-to-r from-[#5865F2] via-[#4752C4] to-[#3b4de8] text-white px-8 py-4 text-base sm:text-lg font-bold shadow-[0_20px_60px_rgba(88,101,242,0.6)] ring-2 ring-blue-400/50 backdrop-blur-sm transition-all duration-300 ${
                  shouldUseStatic
                    ? "hover:shadow-[0_25px_80px_rgba(88,101,242,0.8)] hover:scale-110 hover:ring-emerald-400/60"
                    : "hover:shadow-[0_25px_80px_rgba(88,101,242,0.8)] hover:ring-emerald-400/60 hover:scale-110 hover:-translate-y-2"
                }`}
                aria-label={t("ctaPrimary")}
              >
                {/* Glow effect interno */}
                <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 via-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Shine effect mejorado */}
                {!shouldUseStatic && (
                  <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
                    <span className="absolute -left-full top-0 h-full w-full translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-out rotate-12 bg-gradient-to-r from-transparent via-white/40 to-transparent blur-sm" />
                  </span>
                )}

                <img
                  src={logoDiscord}
                  alt=""
                  width={28}
                  height={28}
                  className="w-6 h-6 sm:w-7 sm:h-7 drop-shadow-lg relative z-10"
                  decoding="async"
                  loading="lazy"
                />
                <span className="relative z-10 text-shadow-lg">
                  {t("ctaPrimary")}
                </span>

                {/* Arrow indicator */}
                <svg
                  className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>

            {/* Badges rediseñados */}
            <div className="flex flex-wrap items-center gap-3">
              {badges.map((badge, i) => (
                <span
                  key={`badge-${i}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-gradient-to-r from-white/10 via-white/5 to-white/10 backdrop-blur-md text-white/95 px-4 py-2 text-sm font-medium shadow-lg hover:bg-white/15 hover:border-emerald-400/30 hover:shadow-emerald-500/20 transition-all duration-300"
                >
                  <div className="w-2 h-2 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full shadow-lg shadow-emerald-400/50" />
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Leaderboard con más presencia */}
          <Suspense
            fallback={
              <div aria-hidden className="relative lg:ml-6">
                {/* Glow más dramático */}
                <div className="absolute -inset-4 bg-gradient-to-br from-emerald-500/20 via-blue-500/15 to-purple-500/10 blur-3xl rounded-3xl" />
                <div
                  className={`relative rounded-3xl bg-gradient-to-br from-[#0a0a0a]/90 via-[#0e0e0e]/95 to-[#1a1a1a]/90 border border-white/20 shadow-2xl backdrop-blur-xl p-8 min-h-[380px] ${
                    shouldUseStatic ? "opacity-95" : "animate-pulse-gentle"
                  }`}
                >
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-emerald-400 rounded-full" />
                      <div className="h-6 bg-gradient-to-r from-white/20 to-transparent rounded-full w-1/2" />
                    </div>
                    <div className="space-y-4">
                      {[...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/10"
                        >
                          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400/30 to-cyan-400/30 rounded-full" />
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-white/20 rounded w-3/4" />
                            <div className="h-3 bg-white/10 rounded w-1/2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            }
          >
            <LeaderboardMotion
              entries={LEADERBOARD_DATA}
              features={FEATURE_BADGES as readonly string[]}
            />
          </Suspense>
        </div>
      </div>

      {/* CSS épico */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
        
        .text-shadow-lg {
          text-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }
        
        ${
          !shouldUseStatic
            ? `
          @keyframes grid-pulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.6; }
          }
          
          @keyframes epic-float {
            0%, 100% { transform: translate(0, 0px) rotate(0deg) scale(1); }
            25% { transform: translate(-20px, -30px) rotate(1deg) scale(1.05); }
            50% { transform: translate(-10px, -40px) rotate(0deg) scale(1.1); }
            75% { transform: translate(-30px, -20px) rotate(-1deg) scale(1.05); }
          }
          
          @keyframes epic-float-reverse {
            0%, 100% { transform: translate(0, 0px) rotate(0deg) scale(1); }
            25% { transform: translate(30px, -15px) rotate(-1deg) scale(0.95); }
            50% { transform: translate(20px, -25px) rotate(0deg) scale(0.9); }
            75% { transform: translate(40px, -10px) rotate(1deg) scale(0.95); }
          }
          
          @keyframes epic-orbit {
            0% { transform: translate(0, 0px) rotate(0deg); }
            25% { transform: translate(-15px, 20px) rotate(90deg); }
            50% { transform: translate(0px, 40px) rotate(180deg); }
            75% { transform: translate(15px, 20px) rotate(270deg); }
            100% { transform: translate(0, 0px) rotate(360deg); }
          }
          
          @keyframes twinkle-epic {
            0%, 100% { opacity: 0.2; }
            25% { opacity: 0.4; }
            50% { opacity: 0.6; }
            75% { opacity: 0.3; }
          }
          
          @keyframes energy-wave {
            0%, 100% { transform: translateX(-100%) skewX(-15deg); }
            50% { transform: translateX(100%) skewX(-15deg); }
          }
          
          @keyframes pulse-gentle {
            0%, 100% { opacity: 0.9; transform: scale(1); }
            50% { opacity: 0.95; transform: scale(1.01); }
          }
          
          .animate-grid-pulse { animation: grid-pulse 4s ease-in-out infinite; }
          .animate-epic-float { animation: epic-float 25s ease-in-out infinite; }
          .animate-epic-float-reverse { animation: epic-float-reverse 30s ease-in-out infinite; }
          .animate-epic-orbit { animation: epic-orbit 20s linear infinite; }
          .animate-twinkle-epic { animation: twinkle-epic 6s ease-in-out infinite; }
          .animate-energy-wave { animation: energy-wave 8s linear infinite; }
          .animate-pulse-gentle { animation: pulse-gentle 5s ease-in-out infinite; }
        `
            : ""
        }
        
        ${
          isBrave
            ? `
          .group:hover {
            transform: scale(1.05) translateY(-2px) !important;
            transition: all 0.3s ease !important;
          }
        `
            : ""
        }
        
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-delay: -1ms !important;
            animation-duration: 1ms !important;
            animation-iteration-count: 1 !important;
            background-attachment: initial !important;
            scroll-behavior: auto !important;
            transition-duration: 0.2s !important;
            transition-delay: 0s !important;
          }
        }
      `,
        }}
      />
    </section>
  );
}
