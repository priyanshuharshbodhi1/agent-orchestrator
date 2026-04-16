"use client";

import Link from "next/link";
import { Swords, Plus } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-40 border-b border-border-subtle bg-bg-primary/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Swords className="h-5 w-5 text-accent-red" />
          <span className="font-display text-xl tracking-wider">DEBATOR</span>
        </Link>

        <Link
          href="/create"
          className="flex items-center gap-1.5 rounded-lg bg-accent-red px-3.5 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-accent-red/90"
        >
          <Plus className="h-4 w-4" />
          New Topic
        </Link>
      </div>
    </nav>
  );
}
