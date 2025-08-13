"use client";

// src/app/pages/components/LeaderboardMotion.tsx
import { motion, useReducedMotion } from "framer-motion";

type Entry = { name: string; lp: number; wl: string; pts: number };

export default function LeaderboardMotion({
  entries,
  features,
}: {
  entries: readonly Entry[];
  features: readonly string[];
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 12, scale: 0.98 }}
      whileInView={reduced ? {} : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={reduced ? undefined : { duration: 0.35, ease: "easeOut" }}
      className="relative lg:ml-6"
      style={{ contain: "layout paint" }}
    >
      <div className="absolute inset-0 blur-2xl rounded-3xl bg-emerald-500/10 -z-10" />
      <div className="rounded-3xl bg-[#0E0E0E] border border-white/10 shadow-2xl p-4">
        <div className="flex items-center gap-2 pb-3 border-b border-white/10">
          <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
          <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
          <span className="ml-2 text-white/80 text-sm font-semibold">
            Ladder — Week 3
          </span>
        </div>

        <ul className="pt-4 space-y-3">
          {entries.map((r, i) => (
            <li
              key={r.name}
              className="grid grid-cols-12 items-center gap-2 rounded-xl bg-[#121212] border border-white/10 p-3"
            >
              <div className="col-span-6 text-white font-semibold">
                {i + 1}. {r.name}
              </div>
              <div className="col-span-2 text-emerald-300/90 font-mono">
                LP {r.lp}
              </div>
              <div className="col-span-2 text-white/80 font-mono">{r.wl}</div>
              <div className="col-span-2 flex justify-end">
                <span className="inline-flex items-center rounded-full bg-white/5 border border-white/10 px-3 py-1 font-mono text-emerald-400">
                  +{r.pts}
                </span>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {features.map((x) => (
            <div
              key={x}
              className="rounded-lg bg-[#121212] border border-white/10 text-white/80 text-xs px-3 py-2"
            >
              {x}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
