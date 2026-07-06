"use client";

import { ExternalLink } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { AuthorLinks } from "@/components/AuthorLinks";
import { GenComplyApp } from "@/components/gencomply/GenComplyApp";
import { AUTHOR } from "@/lib/site";
import { GENLAYER_LINKS } from "@/lib/genlayer-links";

const FOOTER_LINKS = [
  { label: "GenLayer", href: GENLAYER_LINKS.home },
  { label: "Documentation", href: GENLAYER_LINKS.docs },
  { label: "Studio", href: GENLAYER_LINKS.studio },
  { label: "GitHub", href: "https://github.com/hoasine/gencomply" },
] as const;

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <GenComplyApp />

      <footer className="border-t border-border bg-white/90 px-6 py-5 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">GenComply</span>
            <span className="mx-2">·</span>
            <span>{AUTHOR.name}</span>
            <span className="mx-2 hidden sm:inline">·</span>
            <span className="hidden sm:inline">Not legal advice</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {FOOTER_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
                <ExternalLink className="w-3 h-3" />
              </a>
            ))}
            <span className="hidden sm:inline text-border">|</span>
            <AuthorLinks size="md" />
          </div>
        </div>
      </footer>
    </div>
  );
}
