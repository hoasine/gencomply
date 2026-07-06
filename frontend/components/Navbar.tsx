"use client";

import { ExternalLink } from "lucide-react";
import { AccountPanel } from "./AccountPanel";
import { AuthorLinks } from "./AuthorLinks";
import { Scale } from "lucide-react";
import { GENLAYER_LINKS } from "@/lib/genlayer-links";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Docs", href: GENLAYER_LINKS.docs },
  { label: "Studio", href: GENLAYER_LINKS.studio },
  { label: "SDK", href: GENLAYER_LINKS.sdk },
] as const;

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl gradient-comply text-white shadow-sm">
            <Scale className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-lg font-bold font-display leading-tight truncate">
              GenComply
            </p>
            <p className="text-[10px] text-muted-foreground hidden sm:block">
              AI compliance on GenLayer
            </p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground",
                "hover:text-primary hover:bg-primary/5 transition-colors"
              )}
            >
              {link.label}
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>
          ))}
          <a
            href="#genlayer"
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
          >
            About GenLayer
          </a>
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <AuthorLinks className="hidden sm:flex" />
          <AccountPanel />
        </div>
      </div>
    </header>
  );
}
