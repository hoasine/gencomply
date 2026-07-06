"use client";

import { Navbar } from "@/components/Navbar";
import { AuthorLinks } from "@/components/AuthorLinks";
import { GenComplyApp } from "@/components/gencomply/GenComplyApp";
import { AUTHOR } from "@/lib/site";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <GenComplyApp />

      <footer className="hidden lg:block border-t border-border bg-white/80 py-5 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>
            {AUTHOR.name} · GenComply on GenLayer
          </span>
          <div className="flex items-center gap-3">
            <AuthorLinks size="md" />
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">Not legal advice</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
