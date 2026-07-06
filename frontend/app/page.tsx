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
  { label: "Live demo", href: "https://gencomply.vercel.app" },
] as const;

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <GenComplyApp />

      <footer className="border-t border-border bg-white/90 py-8 px-6 mt-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div>
              <p className="font-bold font-display">GenComply</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-md leading-relaxed">
                On-chain policy registry and compliance violation bounties — an intelligent
                contract dApp built on GenLayer Studionet by {AUTHOR.name}.
              </p>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
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
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border text-xs text-muted-foreground">
            <span>{AUTHOR.name} · GenComply on GenLayer</span>
            <div className="flex items-center gap-3">
              <AuthorLinks size="md" />
              <span className="hidden sm:inline">·</span>
              <span>Not legal advice</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
