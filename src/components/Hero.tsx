import { siteConfig, socials } from "@/lib/site";
import Reveal from "@/components/Reveal";
import CurrentlyTicker from "@/components/CurrentlyTicker";

export default function Hero() {
  return (
    <section
      id="about"
      className="scroll-mt-24 py-20 sm:py-28"
    >
      <Reveal>
        <div className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs text-muted">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-2 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-2" />
          </span>
          Available for select opportunities
        </div>
      </Reveal>

      <Reveal delay={80}>
        <h1 className="mt-6 text-5xl font-bold leading-[1.05] tracking-tight sm:text-7xl">
          {siteConfig.name.split(" ")[0]}
          <br />
          <span className="gradient-text">
            {siteConfig.name.split(" ").slice(1).join(" ")}
          </span>
        </h1>
      </Reveal>

      <Reveal delay={160}>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
          {siteConfig.role}. {siteConfig.tagline}
        </p>
        <p className="mt-3 max-w-2xl font-mono text-sm text-accent-2">
          {siteConfig.quip}
        </p>
      </Reveal>

      <Reveal delay={200}>
        <div className="mt-6">
          <CurrentlyTicker />
        </div>
      </Reveal>

      <Reveal delay={240}>
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <a
            href="#contact"
            className="rounded-xl bg-accent px-6 py-3 text-sm font-medium text-white shadow-lg shadow-accent/30 transition-all hover:-translate-y-0.5 hover:shadow-accent/50"
          >
            Get in touch
          </a>
          <a
            href={siteConfig.resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="glass glass-hover rounded-xl px-6 py-3 text-sm font-medium text-foreground"
          >
            Download résumé
          </a>
        </div>
      </Reveal>

      <Reveal delay={320}>
        <ul className="mt-8 flex flex-wrap items-center gap-5 text-sm">
          {socials.map((social) => (
            <li key={social.label}>
              <a
                href={social.href}
                target={social.href.startsWith("http") ? "_blank" : undefined}
                rel={social.href.startsWith("http") ? "noreferrer" : undefined}
                className="text-muted transition-colors hover:text-foreground"
              >
                {social.label}
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
