"use client";

import { useParams } from "next/navigation";
import { useSyncExternalStore, useState, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import CountdownTimer from "@/components/CountdownTimer";
import DebaterCard from "@/components/DebaterCard";
import { getTopic, subscribe, vote } from "@/lib/store";
import { formatNumber } from "@/lib/utils";

export default function TopicPage() {
  const { id } = useParams<{ id: string }>();
  const [votedIds, setVotedIds] = useState<string[]>([]);

  const topic = useSyncExternalStore(
    subscribe,
    () => getTopic(id),
    () => getTopic(id),
  );

  const handleVote = useCallback(
    (debaterId: string) => {
      if (votedIds.includes(debaterId)) return;
      vote(id, debaterId);
      setVotedIds((prev) => [...prev, debaterId]);
    },
    [id, votedIds],
  );

  if (!topic) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <Navbar />
        <div className="flex h-[60vh] items-center justify-center">
          <p className="font-display text-2xl text-text-muted">TOPIC NOT FOUND</p>
        </div>
      </div>
    );
  }

  const forTotal = topic.forSide.debaters.reduce((s, d) => s + d.votes, 0);
  const againstTotal = topic.againstSide.debaters.reduce((s, d) => s + d.votes, 0);

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-3 flex items-center justify-center gap-3">
            <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
              topic.status === "voting"
                ? "bg-accent-gold/10 text-accent-gold"
                : topic.status === "live"
                  ? "bg-accent-red/10 text-accent-red"
                  : "bg-accent-blue/10 text-accent-blue"
            }`}>
              {topic.status}
            </span>
            <span className="text-xs text-text-muted">{formatNumber(topic.totalVotes)} votes</span>
          </div>

          <h1 className="font-display text-3xl tracking-wider sm:text-5xl">
            {topic.title}
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-text-secondary">
            {topic.description}
          </p>

          {topic.status === "voting" && (
            <div className="mt-4">
              <span className="text-xs text-text-muted mr-2">Ends in</span>
              <CountdownTimer targetDate={topic.votingEndsAt} size="lg" />
            </div>
          )}

          {topic.status === "scheduled" && topic.debateAt && (
            <p className="mt-4 text-sm text-accent-blue">
              Debate: {new Date(topic.debateAt).toLocaleString()}
            </p>
          )}
        </div>

        {/* Results link */}
        <div className="mb-6 text-center">
          <Link
            href={`/results/${topic.id}`}
            className="text-xs text-text-muted underline underline-offset-2 hover:text-text-secondary"
          >
            View full results
          </Link>
        </div>

        {/* VS Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_60px_1fr]">
          {/* FOR Side */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl tracking-wider text-accent-red">
                {topic.forSide.label}
              </h2>
              <span className="text-sm text-text-muted">{formatNumber(forTotal)} votes</span>
            </div>
            <div className="space-y-3">
              {[...topic.forSide.debaters]
                .sort((a, b) => b.votes - a.votes)
                .map((d, i) => (
                  <DebaterCard
                    key={d.id}
                    debater={d}
                    side="for"
                    totalSideVotes={forTotal}
                    rank={i + 1}
                    voted={votedIds.includes(d.id)}
                    onVote={() => handleVote(d.id)}
                  />
                ))}
            </div>
          </div>

          {/* VS */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-gold/10">
              <span className="font-display text-xl text-accent-gold">VS</span>
            </div>
          </div>

          {/* AGAINST Side */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl tracking-wider text-accent-blue">
                {topic.againstSide.label}
              </h2>
              <span className="text-sm text-text-muted">{formatNumber(againstTotal)} votes</span>
            </div>
            <div className="space-y-3">
              {[...topic.againstSide.debaters]
                .sort((a, b) => b.votes - a.votes)
                .map((d, i) => (
                  <DebaterCard
                    key={d.id}
                    debater={d}
                    side="against"
                    totalSideVotes={againstTotal}
                    rank={i + 1}
                    voted={votedIds.includes(d.id)}
                    onVote={() => handleVote(d.id)}
                  />
                ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
