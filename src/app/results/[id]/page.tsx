"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Crown, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import { getTopic, subscribe } from "@/lib/store";
import type { Topic } from "@/lib/types";

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const [topic, setTopic] = useState<Topic | undefined>(getTopic(id));

  useEffect(() => {
    return subscribe(() => setTopic(getTopic(id)));
  }, [id]);

  const { forChampion, againstChampion, overallWinner, allDebaters } = useMemo(() => {
    if (!topic) return { forChampion: null, againstChampion: null, overallWinner: null, allDebaters: [] };
    const fs = [...topic.forSide.debaters].sort((a, b) => b.votes - a.votes);
    const as2 = [...topic.againstSide.debaters].sort((a, b) => b.votes - a.votes);
    const fc = fs[0] ?? null;
    const ac = as2[0] ?? null;
    const ow = fc && ac ? (fc.votes >= ac.votes ? fc : ac) : fc ?? ac;
    const all = [
      ...fs.map((d) => ({ ...d, side: "for" as const })),
      ...as2.map((d) => ({ ...d, side: "against" as const })),
    ].sort((a, b) => b.votes - a.votes);
    return { forChampion: fc, againstChampion: ac, overallWinner: ow, allDebaters: all };
  }, [topic]);

  if (!topic) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <Navbar />
        <div className="flex h-[60vh] items-center justify-center text-text-muted">Topic not found.</div>
      </div>
    );
  }

  const forTotal = topic.forSide.debaters.reduce((s, d) => s + d.votes, 0);
  const againstTotal = topic.againstSide.debaters.reduce((s, d) => s + d.votes, 0);
  const grand = forTotal + againstTotal;
  const forPct = grand > 0 ? Math.round((forTotal / grand) * 100) : 50;

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <Link href={`/topic/${topic.id}`} className="mb-6 inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-secondary">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <h1 className="font-display text-3xl tracking-wider text-center sm:text-4xl mb-2">{topic.title}</h1>
        <p className="text-center text-sm text-text-muted mb-8">Results</p>

        {/* Vote bar */}
        <div className="mx-auto max-w-xl mb-10">
          <div className="flex justify-between text-sm font-medium mb-2">
            <span className="text-accent-red">{topic.forSide.label} — {forPct}%</span>
            <span className="text-accent-blue">{100 - forPct}% — {topic.againstSide.label}</span>
          </div>
          <div className="h-2 rounded-full bg-bg-elevated overflow-hidden flex">
            <div className="bg-accent-red" style={{ width: `${forPct}%` }} />
            <div className="bg-accent-blue flex-1" />
          </div>
        </div>

        {/* Champions */}
        {forChampion && againstChampion && (
          <div className="grid grid-cols-[1fr_50px_1fr] items-center gap-4 mb-12">
            <div className={`rounded-xl border bg-bg-card p-5 text-center ${overallWinner?.id === forChampion.id ? "border-accent-gold/30" : "border-border-subtle"}`}>
              {overallWinner?.id === forChampion.id && (
                <div className="flex justify-center mb-2">
                  <span className="flex items-center gap-1 rounded-full bg-accent-gold/15 px-3 py-1 text-xs font-bold text-accent-gold">
                    <Crown className="h-3 w-3" /> Winner
                  </span>
                </div>
              )}
              <div className="mx-auto mb-2 h-14 w-14 rounded-full flex items-center justify-center text-lg font-bold bg-accent-red/15 text-accent-red ring-2 ring-accent-red/30">
                {forChampion.avatar}
              </div>
              <p className="font-display text-xl text-text-primary">{forChampion.name}</p>
              <p className="text-xs text-accent-red">{topic.forSide.label}</p>
              <p className="mt-2 font-display text-2xl text-text-primary">{forChampion.votes.toLocaleString()}</p>
              <p className="text-[10px] text-text-muted">votes</p>
            </div>

            <div className="flex justify-center">
              <span className="font-display text-xl text-accent-gold">VS</span>
            </div>

            <div className={`rounded-xl border bg-bg-card p-5 text-center ${overallWinner?.id === againstChampion.id ? "border-accent-gold/30" : "border-border-subtle"}`}>
              {overallWinner?.id === againstChampion.id && (
                <div className="flex justify-center mb-2">
                  <span className="flex items-center gap-1 rounded-full bg-accent-gold/15 px-3 py-1 text-xs font-bold text-accent-gold">
                    <Crown className="h-3 w-3" /> Winner
                  </span>
                </div>
              )}
              <div className="mx-auto mb-2 h-14 w-14 rounded-full flex items-center justify-center text-lg font-bold bg-accent-blue/15 text-accent-blue ring-2 ring-accent-blue/30">
                {againstChampion.avatar}
              </div>
              <p className="font-display text-xl text-text-primary">{againstChampion.name}</p>
              <p className="text-xs text-accent-blue">{topic.againstSide.label}</p>
              <p className="mt-2 font-display text-2xl text-text-primary">{againstChampion.votes.toLocaleString()}</p>
              <p className="text-[10px] text-text-muted">votes</p>
            </div>
          </div>
        )}

        {/* Full standings */}
        <h2 className="font-display text-xl tracking-wider text-center mb-4">ALL STANDINGS</h2>
        <div className="rounded-xl border border-border-subtle bg-bg-card overflow-hidden">
          {allDebaters.map((d, i) => (
            <div key={d.id} className={`flex items-center gap-4 px-5 py-3 border-b border-border-subtle/50 ${i === 0 ? "bg-accent-gold/5" : ""}`}>
              <span className={`font-display text-lg w-6 ${i === 0 ? "text-accent-gold" : "text-text-muted"}`}>{i + 1}</span>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${d.side === "for" ? "bg-accent-red/15 text-accent-red" : "bg-accent-blue/15 text-accent-blue"}`}>
                {d.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate flex items-center gap-1.5">
                  {d.name}
                  {i === 0 && <Crown className="h-3.5 w-3.5 text-accent-gold" />}
                </p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${d.side === "for" ? "bg-accent-red/10 text-accent-red" : "bg-accent-blue/10 text-accent-blue"}`}>
                {d.side === "for" ? topic.forSide.label : topic.againstSide.label}
              </span>
              <span className="font-display text-text-primary">{d.votes.toLocaleString()}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-text-muted">{grand.toLocaleString()} total votes</p>
      </main>
    </div>
  );
}
