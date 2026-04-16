"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { addTopic } from "@/lib/store";

const CATEGORIES = ["History", "Technology", "Science", "Politics", "Philosophy", "Culture"];
const DURATIONS = [
  { label: "1 Hour", ms: 3600000 },
  { label: "6 Hours", ms: 6 * 3600000 },
  { label: "12 Hours", ms: 12 * 3600000 },
  { label: "1 Day", ms: 24 * 3600000 },
];

interface DebaterInput { name: string; title: string; }

const empty = (): DebaterInput[] => Array.from({ length: 5 }, () => ({ name: "", title: "" }));

export default function CreatePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [duration, setDuration] = useState(DURATIONS[0].ms);
  const [forLabel, setForLabel] = useState("");
  const [againstLabel, setAgainstLabel] = useState("");
  const [forDebaters, setForDebaters] = useState<DebaterInput[]>(empty());
  const [againstDebaters, setAgainstDebaters] = useState<DebaterInput[]>(empty());

  const update = (side: "for" | "against", i: number, field: "name" | "title", val: string) => {
    const setter = side === "for" ? setForDebaters : setAgainstDebaters;
    setter((prev) => prev.map((d, idx) => (idx === i ? { ...d, [field]: val } : d)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ff = forDebaters.filter((d) => d.name.trim());
    const fa = againstDebaters.filter((d) => d.name.trim());
    if (!title.trim() || ff.length === 0 || fa.length === 0) return;

    const t = addTopic({
      title: title.trim(),
      description: description.trim(),
      category,
      status: "voting",
      votingEndsAt: new Date(Date.now() + duration).toISOString(),
      debateAt: null,
      forSide: {
        label: forLabel.trim() || "For",
        debaters: ff.map((d, i) => ({
          id: `nf-${i}`, name: d.name.trim(), title: d.title.trim(),
          avatar: d.name.trim().split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
          votes: 0,
        })),
      },
      againstSide: {
        label: againstLabel.trim() || "Against",
        debaters: fa.map((d, i) => ({
          id: `na-${i}`, name: d.name.trim(), title: d.title.trim(),
          avatar: d.name.trim().split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
          votes: 0,
        })),
      },
    });
    router.push(`/topic/${t.id}`);
  };

  const input = "w-full rounded-lg border border-border-subtle bg-bg-elevated px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-white/20";

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <h1 className="font-display text-4xl tracking-wider text-center mb-8">CREATE A DEBATE</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Topic details */}
          <section className="rounded-xl border border-border-subtle bg-bg-card p-6 space-y-4">
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Topic title" className={input} required />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description..." rows={3} className={`${input} resize-none`} />
            <div className="grid grid-cols-2 gap-4">
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={input}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
              <select value={duration} onChange={(e) => setDuration(Number(e.target.value))} className={input}>
                {DURATIONS.map((d) => <option key={d.ms} value={d.ms}>{d.label}</option>)}
              </select>
            </div>
          </section>

          {/* Debaters */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* FOR */}
            <section className="rounded-xl border border-accent-red/20 bg-bg-card p-6">
              <h2 className="font-display text-lg tracking-wider text-accent-red mb-4">FOR SIDE</h2>
              <input type="text" value={forLabel} onChange={(e) => setForLabel(e.target.value)} placeholder='Label (e.g. "Justified")' className={`${input} mb-4`} />
              <div className="space-y-3">
                {forDebaters.map((d, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-red/10 text-xs font-bold text-accent-red">{i + 1}</span>
                    <input type="text" value={d.name} onChange={(e) => update("for", i, "name", e.target.value)} placeholder="Name" className={`${input} flex-1`} />
                    <input type="text" value={d.title} onChange={(e) => update("for", i, "title", e.target.value)} placeholder="Title" className={`${input} flex-1`} />
                  </div>
                ))}
              </div>
            </section>

            {/* AGAINST */}
            <section className="rounded-xl border border-accent-blue/20 bg-bg-card p-6">
              <h2 className="font-display text-lg tracking-wider text-accent-blue mb-4">AGAINST SIDE</h2>
              <input type="text" value={againstLabel} onChange={(e) => setAgainstLabel(e.target.value)} placeholder='Label (e.g. "Unjustified")' className={`${input} mb-4`} />
              <div className="space-y-3">
                {againstDebaters.map((d, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-blue/10 text-xs font-bold text-accent-blue">{i + 1}</span>
                    <input type="text" value={d.name} onChange={(e) => update("against", i, "name", e.target.value)} placeholder="Name" className={`${input} flex-1`} />
                    <input type="text" value={d.title} onChange={(e) => update("against", i, "title", e.target.value)} placeholder="Title" className={`${input} flex-1`} />
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="text-center">
            <button type="submit" className="rounded-xl bg-white px-8 py-3 font-display text-xl tracking-wider text-black hover:bg-white/90 active:bg-white/80 transition-colors">
              CREATE DEBATE
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
