"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/lib/site";

const navItems = [
  { label: "About", href: "/#about" },
  { label: "Skills", href: "/#skills" },
  { label: "Experience", href: "/#experience" },
  { label: "Arcade", href: "/#play" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/#contact" },
];

export default function Header() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 12);
      if (y > lastY.current && y > 160) {
        setHidden(true);
        setOpen(false);
      } else {
        setHidden(false);
      }
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 px-3 pt-3 transition-transform duration-300 sm:px-4 sm:pt-4 ${
        hidden ? "-translate-y-[140%]" : "translate-y-0"
      }`}
    >
      <nav
        className={`mx-auto max-w-4xl rounded-2xl px-4 py-3 transition-all duration-300 ${
          scrolled || open ? "glass shadow-2xl shadow-black/40" : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="font-mono text-sm font-semibold tracking-tight"
          >
            <span className="gradient-text">EK</span>
            <span className="ml-2 text-foreground">{siteConfig.name}</span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden items-center gap-0.5 text-sm text-muted md:flex">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-lg px-3 py-1.5 transition-colors hover:bg-white/10 hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Mobile toggle */}
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white/5 md:hidden"
          >
            <div className="space-y-1.5">
              <span
                className={`block h-0.5 w-5 bg-foreground transition-transform ${
                  open ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-5 bg-foreground transition-opacity ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-5 bg-foreground transition-transform ${
                  open ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <ul className="mt-3 grid gap-1 border-t border-border pt-3 text-sm md:hidden">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-muted transition-colors hover:bg-white/10 hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </header>
  );
}
