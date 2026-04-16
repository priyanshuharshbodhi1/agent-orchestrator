"use client";

import { useEffect, useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import TopicCard from "@/components/TopicCard";
import { getTopics, subscribe } from "@/lib/store";
import { Topic } from "@/lib/types";

type Filter = "all" | "voting" | "scheduled" | "live";

export default function HomePage() {
  const [topics, setTopics] = useState<Topic[]>(getTopics);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    return subscribe(() => setTopics([...getTopics()]));
  }, []);

  const filtered = useMemo(() => {
    if (filter === "all") return topics;
    return topics.filter((t) => t.status === filter);
  }, [topics, filter]);

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "voting", label: "Voting" },
    { key: "scheduled", label: "Scheduled" },
    { key: "live", label: "Live" },
  ];

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="font-display text-5xl tracking-widest sm:text-7xl">
            <span className="text-accent-red">DEB</span>
            <span className="text-accent-blue">ATOR</span>
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Vote for your champions. Watch them clash.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                filter === f.key
                  ? "bg-white text-black"
                  : "bg-bg-card text-text-secondary hover:text-text-primary"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Topics */}
        {filtered.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-text-muted">
            <p className="font-display text-2xl tracking-wider">No debates found</p>
          </div>
        )}
      </main>
    </div>
  );
}
