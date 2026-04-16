"use client";

import { Debater } from "@/lib/types";
import { formatNumber, getVotePercentage } from "@/lib/utils";

interface Props {
  debater: Debater;
  side: "for" | "against";
  totalSideVotes: number;
  rank: number;
  voted: boolean;
  onVote: () => void;
}

export default function DebaterCard({ debater, side, totalSideVotes, rank, voted, onVote }: Props) {
  const isFor = side === "for";
  const pct = getVotePercentage(debater.votes, totalSideVotes);

  return (
    <div className={`rounded-xl border bg-bg-card p-4 ${voted ? (isFor ? "border-accent-red/30" : "border-accent-blue/30") : "border-border-subtle"}`}>
      <div className="flex items-center gap-3">
        <span className="text-xs font-display text-text-muted">#{rank}</span>

        <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center text-sm font-bold ${isFor ? "bg-accent-red/15 text-accent-red" : "bg-accent-blue/15 text-accent-blue"}`}>
          {debater.avatar}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-text-primary">{debater.name}</p>
          <p className="truncate text-xs text-text-muted">{debater.title}</p>
        </div>

        <div className="text-right">
          <p className={`font-display text-lg ${isFor ? "text-accent-red" : "text-accent-blue"}`}>{formatNumber(debater.votes)}</p>
          <p className="text-[10px] text-text-muted">{pct}%</p>
        </div>
      </div>

      <div className="mt-3 h-1 rounded-full bg-bg-elevated overflow-hidden">
        <div className={`h-full transition-all duration-500 ${isFor ? "bg-accent-red" : "bg-accent-blue"}`} style={{ width: `${pct}%` }} />
      </div>

      <button
        onClick={onVote}
        disabled={voted}
        className={`mt-3 w-full rounded-lg py-2 text-sm font-semibold transition-colors ${
          voted
            ? isFor ? "bg-accent-red/10 text-accent-red cursor-default" : "bg-accent-blue/10 text-accent-blue cursor-default"
            : isFor ? "bg-accent-red text-white hover:opacity-90" : "bg-accent-blue text-white hover:opacity-90"
        }`}
      >
        {voted ? "Voted" : "Vote"}
      </button>
    </div>
  );
}
