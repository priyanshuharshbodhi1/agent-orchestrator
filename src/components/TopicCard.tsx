"use client";

import Link from "next/link";
import { Users } from "lucide-react";
import { Topic } from "@/lib/types";
import { formatNumber, getVotePercentage } from "@/lib/utils";
import CountdownTimer from "./CountdownTimer";

export default function TopicCard({ topic }: { topic: Topic }) {
  const forVotes = topic.forSide.debaters.reduce((s, d) => s + d.votes, 0);
  const againstVotes = topic.againstSide.debaters.reduce((s, d) => s + d.votes, 0);
  const total = forVotes + againstVotes;
  const forPct = getVotePercentage(forVotes, total);

  const topFor = [...topic.forSide.debaters].sort((a, b) => b.votes - a.votes)[0];
  const topAgainst = [...topic.againstSide.debaters].sort((a, b) => b.votes - a.votes)[0];

  return (
    <Link href={`/topic/${topic.id}`} className="block group">
      <div className="rounded-xl border border-border-subtle bg-bg-card p-5 transition-all hover:border-white/10 hover:bg-bg-elevated/60">
        {/* Category + Status */}
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[11px] font-medium uppercase tracking-widest text-text-muted">
            {topic.category}
          </span>
          <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${
            topic.status === "voting"
              ? "bg-accent-gold/10 text-accent-gold"
              : topic.status === "live"
                ? "bg-accent-red/10 text-accent-red"
                : "bg-accent-blue/10 text-accent-blue"
          }`}>
            {topic.status}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display text-xl tracking-wide text-text-primary mb-2 group-hover:text-white">
          {topic.title}
        </h3>
        <p className="mb-4 line-clamp-2 text-sm text-text-secondary leading-relaxed">
          {topic.description}
        </p>

        {/* Top debaters preview */}
        <div className="mb-4 flex items-center gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="h-7 w-7 shrink-0 rounded-full bg-accent-red/15 flex items-center justify-center text-[10px] font-bold text-accent-red">
              {topFor.avatar}
            </div>
            <span className="truncate text-xs text-text-secondary">{topFor.name}</span>
          </div>

          <span className="shrink-0 font-display text-xs text-accent-gold">VS</span>

          <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
            <span className="truncate text-xs text-text-secondary">{topAgainst.name}</span>
            <div className="h-7 w-7 shrink-0 rounded-full bg-accent-blue/15 flex items-center justify-center text-[10px] font-bold text-accent-blue">
              {topAgainst.avatar}
            </div>
          </div>
        </div>

        {/* Vote bar */}
        <div className="mb-3 flex h-1.5 overflow-hidden rounded-full bg-bg-elevated">
          <div className="bg-accent-red transition-all duration-500" style={{ width: `${forPct}%` }} />
          <div className="bg-accent-blue flex-1" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-text-muted">
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{formatNumber(topic.totalVotes)} votes</span>
          </div>
          {topic.status === "voting" && <CountdownTimer targetDate={topic.votingEndsAt} />}
        </div>
      </div>
    </Link>
  );
}
