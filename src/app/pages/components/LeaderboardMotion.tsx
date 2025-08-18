// (Vite no necesita "use client"; puedes dejarlo o quitarlo)

import React from "react";

import MasterLogo from "/master-rank.png";
import EmeraldLogo from "/emerald-rank.png";
import DiamondLogo from "/diamond-rank.png";

interface LeaderboardEntry {
  readonly position: number;
  readonly name: string;
  readonly tier: string; // "Master I", "Diamond II", ...
  readonly lp: number;
  readonly wins: number;
  readonly losses: number;
  readonly winrate: number;
}

type TierBase = "Master" | "Diamond" | "Emerald";

const LEADERBOARD_DATA: readonly LeaderboardEntry[] = [
  { position: 1, name: "stressed out", tier: "Master I", lp: 577, wins: 271, losses: 244, winrate: 52.62 },
  { position: 2, name: "Hati", tier: "Diamond I", lp: 131, wins: 213, losses: 192, winrate: 52.59 },
  { position: 3, name: "DelusionaL TB", tier: "Diamond II", lp: 82, wins: 47, losses: 43, winrate: 52.22 },
  { position: 4, name: "elwhysker", tier: "Diamond IV", lp: 151, wins: 255, losses: 238, winrate: 51.72 },
  { position: 5, name: "BbXhadow", tier: "Emerald I", lp: 75, wins: 200, losses: 215, winrate: 48.19 },
] as const;

const TIER_ASSET: Record<TierBase, string> = {
  Master: MasterLogo,
  Diamond: DiamondLogo,
  Emerald: EmeraldLogo,
};

const getBaseTier = (tier: string): TierBase => {
  const base = tier.match(/^\w+/)?.[0];
  if (base === "Master" || base === "Diamond" || base === "Emerald") return base;
  return "Diamond";
};

const getTierColor = (tier: string) => {
  if (tier.includes("Master")) return "from-purple-500 to-purple-700";
  if (tier.includes("Diamond")) return "from-blue-500 to-blue-700";
  if (tier.includes("Emerald")) return "from-emerald-500 to-emerald-700";
  return "from-gray-500 to-gray-700";
};

const getWinrateColor = (winrate: number) => {
  if (winrate >= 52) return "text-emerald-400";
  if (winrate >= 50) return "text-yellow-400";
  return "text-red-400";
};

interface NewLeaderboardMotionProps {
  entries?: readonly LeaderboardEntry[];
  features?: readonly string[];
}

export default function NewLeaderboardMotion({
  entries = LEADERBOARD_DATA,
  features = ["Real-time LP tracking", "Tier system", "Win/Loss stats", "Winrate calculation"],
}: NewLeaderboardMotionProps): React.JSX.Element {
  return (
    <div className="relative">
      <div className="absolute -inset-4 bg-gradient-to-br from-emerald-500/20 via-blue-500/15 to-purple-500/10 blur-3xl rounded-3xl" />
      <div className="relative rounded-3xl bg-gradient-to-br from-[#0a0a0a]/90 via-[#0e0e0e]/95 to-[#1a1a1a]/90 border border-white/20 shadow-2xl backdrop-blur-xl p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6 sm:mb-8">
          <div className="relative">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
            <div className="absolute inset-0 w-3 h-3 bg-emerald-400 rounded-full animate-ping opacity-75" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
            Top 5 Leaderboard
          </h3>
        </div>

        <div className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
          {entries.map((entry, index) => {
            const baseTier = getBaseTier(entry.tier);
            const rankImg = TIER_ASSET[baseTier];

            return (
              <div
                key={`${entry.name}-${entry.position}`}
                className={`group relative flex items-center gap-3 sm:gap-4 p-2.5 sm:p-3 rounded-xl border transition-all duration-300 hover:scale-[1.015] hover:shadow-lg ${
                  index === 0
                    ? "bg-gradient-to-r from-purple-500/15 via-purple-400/8 to-purple-500/15 border-purple-500/40 hover:border-purple-400/60"
                    : "bg-gradient-to-r from-gray-800/30 via-gray-700/20 to-gray-800/30 border-gray-600/30 hover:bg-gray-700/40 hover:border-gray-500/40"
                }`}
              >
                <div
                  className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0
                      ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-900 shadow-lg shadow-yellow-500/30"
                      : index === 1
                      ? "bg-gradient-to-br from-gray-300 to-gray-500 text-gray-900 shadow-lg shadow-gray-400/30"
                      : index === 2
                      ? "bg-gradient-to-br from-amber-600 to-amber-800 text-amber-100 shadow-lg shadow-amber-600/30"
                      : "bg-gradient-to-br from-gray-600 to-gray-800 text-white shadow-lg"
                  }`}
                >
                  {entry.position}
                </div>

                <div className={`relative flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden border-2 bg-gradient-to-br ${getTierColor(entry.tier)} shadow-lg`}>
                  <img
                    src={rankImg}
                    alt={`${entry.tier} badge`}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-white font-bold truncate text-base">{entry.name}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-white/80 text-xs font-medium">{entry.tier}</span>
                      <span className="text-emerald-400 text-sm font-bold">{entry.lp} LP</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">
                      Wins: <span className="text-emerald-400 font-medium">{entry.wins}</span> | Losses:{" "}
                      <span className="text-red-400 font-medium">{entry.losses}</span>
                    </span>
                    <span className={`font-bold text-sm ${getWinrateColor(entry.winrate)}`}>Winrate: {entry.winrate}%</span>
                  </div>
                </div>

                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            );
          })}
        </div>

        {features?.length ? (
          <div className="border-t border-white/10 pt-6">
            <div className="grid grid-cols-2 gap-3 text-sm text-gray-300">
              {features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full flex-shrink-0" />
                  <span className="truncate">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
