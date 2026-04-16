"use client";

import { useEffect, useState } from "react";

interface Props {
  targetDate: string;
  size?: "sm" | "lg";
}

export default function CountdownTimer({ targetDate, size = "sm" }: Props) {
  const [diff, setDiff] = useState(0);

  useEffect(() => {
    const update = () => setDiff(Math.max(0, new Date(targetDate).getTime() - Date.now()));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  if (diff === 0) return <span className="text-xs text-accent-red font-medium">Ended</span>;

  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  const isLg = size === "lg";

  return (
    <span className={`font-display tracking-wider text-text-secondary ${isLg ? "text-3xl" : "text-sm"}`}>
      {pad(h)}:{pad(m)}:{pad(s)}
    </span>
  );
}
