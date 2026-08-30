"use client";

import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/lib/site";

const navItems = [
  { label: "Work", href: "/#work" },
  { label: "Experience", href: "/#experience" },
  { label: "Notes", href: "/#notes" },
  { label: "About", href: "/#about" },
  { label: "Arcade", href: "/#play" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/#contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-ink/25 bg-paper/95 backdrop-blur-sm">
      <nav
        aria-label="Primary navigation"
        className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12"
      >
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 font-mono text-xs font-semibold uppercase tracking-[0.12em]"
          >
            <span className="grid h-7 w-7 place-items-center border border-ink bg-ink text-[10px] text-signal">
              EK
            </span>
            <span>{siteConfig.name}</span>
          </Link>

          <ul className="hidden items-center gap-1 font-mono text-[11px] uppercase tracking-wider md:flex">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block px-3 py-2 transition-colors hover:text-clay"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((value) => !value)}
            className="grid h-11 w-11 place-items-center border border-ink md:hidden"
          >
            <span className="sr-only">{open ? "Close" : "Open"}</span>
            <span className="relative block h-4 w-5" aria-hidden>
              <span className={`absolute left-0 top-0 h-px w-5 bg-ink transition-transform ${open ? "translate-y-[7px] rotate-45" : ""}`} />
              <span className={`absolute left-0 top-[7px] h-px w-5 bg-ink transition-opacity ${open ? "opacity-0" : ""}`} />
              <span className={`absolute left-0 top-[14px] h-px w-5 bg-ink transition-transform ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>

        {open && (
          <ul
            id="mobile-navigation"
            className="grid border-t border-ink/25 bg-paper py-3 font-mono text-sm uppercase tracking-wider md:hidden"
          >
            {navItems.map((item, index) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-11 items-center justify-between border-b border-ink/15 px-2 py-3 last:border-0"
                >
                  {item.label}
                  <span className="text-[10px] text-clay">0{index + 1}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </header>
  );
}
