import { ArrowDownRight, Download, MapPin } from "lucide-react";
import { siteConfig, socials } from "@/lib/site";
import Reveal from "@/components/Reveal";
import CurrentlyTicker from "@/components/CurrentlyTicker";

export default function Hero() {
  return (
    <section id="about" className="scroll-mt-24 border-b border-ink/25 pb-16 pt-20 sm:pb-24 sm:pt-28">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.65fr)_minmax(18rem,0.75fr)] lg:items-end">
        <div>
          <Reveal>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.12em]">
              <span className="inline-flex items-center gap-2 text-forest">
                <span className="h-2 w-2 bg-signal ring-1 ring-ink" aria-hidden />
                Available for select opportunities
              </span>
              <span className="inline-flex items-center gap-2 text-muted">
                <MapPin className="h-3.5 w-3.5" aria-hidden /> Bamenda, Cameroon
              </span>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="mt-8 max-w-5xl font-display text-[clamp(4.5rem,12vw,10rem)] leading-[0.76] tracking-[-0.055em]">
              Elroy Kimbi
            </h1>
          </Reveal>

          <Reveal delay={140}>
            <p className="mt-10 max-w-4xl font-display text-[clamp(2rem,4.6vw,4.8rem)] leading-[0.94] text-clay">
              I build reliable systems and the teams behind them.
            </p>
          </Reveal>

          <Reveal delay={200}>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a
                href="#work"
                className="inline-flex min-h-12 items-center gap-3 border border-ink bg-ink px-5 py-3 text-sm font-semibold text-paper transition-colors hover:bg-clay focus-visible:outline-signal"
              >
                View selected systems <ArrowDownRight className="h-4 w-4" aria-hidden />
              </a>
              <a
                href={siteConfig.resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center gap-3 border border-ink px-5 py-3 text-sm font-semibold transition-colors hover:bg-paper-bright"
              >
                Résumé <Download className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={160}>
          <aside className="border border-ink/35 bg-paper-bright/70 p-5 sm:p-6" aria-label="Professional dossier">
            {[
              ["Role", siteConfig.role],
              ["Focus", "System design · software engineering · team enablement"],
              ["Approach", "Clarity over complexity · evidence over claims"],
            ].map(([label, value], index) => (
              <div key={label} className={`py-4 ${index ? "border-t border-ink/20" : "pt-0"}`}>
                <p className="field-label text-clay">{label} / 0{index + 1}</p>
                <p className="mt-2 text-sm font-semibold leading-relaxed">{value}</p>
              </div>
            ))}
            <div className="border-t border-ink/20 pt-5">
              <CurrentlyTicker />
            </div>
          </aside>
        </Reveal>
      </div>

      <Reveal delay={260}>
        <ul className="mt-14 flex flex-wrap gap-x-7 gap-y-3 border-t border-ink/20 pt-5 font-mono text-[11px] uppercase tracking-wider">
          {socials.map((social) => (
            <li key={social.label}>
              <a
                href={social.href}
                target={social.href.startsWith("http") ? "_blank" : undefined}
                rel={social.href.startsWith("http") ? "noreferrer" : undefined}
                className="transition-colors hover:text-clay"
              >
                {social.label} ↗
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
