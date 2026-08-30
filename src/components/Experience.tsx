import { experience } from "@/lib/site";
import Reveal from "@/components/Reveal";

export default function Experience() {
  return (
    <section id="experience" className="scroll-mt-24 py-16 sm:py-24">
      <Reveal>
        <div className="grid gap-4 border-b border-ink/25 pb-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="field-label text-clay">Record / 02</p>
            <h2 className="mt-2 font-display text-4xl leading-none sm:text-6xl">Experience</h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-muted lg:text-right">
            Roles are useful. The decisions, systems, and people behind them are the actual record.
          </p>
        </div>
      </Reveal>

      <div className="divide-y divide-ink/25 border-b border-ink/25">
        {experience.map((item, index) => (
          <Reveal key={`${item.company}-${item.period}`} delay={index * 45}>
            <article className="grid gap-6 py-8 lg:grid-cols-[12rem_1fr_1.3fr] lg:gap-10">
              <div>
                <p className="field-label text-forest">{item.period}</p>
                <p className="mt-3 font-mono text-xs text-clay">0{index + 1}</p>
              </div>
              <div>
                <h3 className="font-display text-3xl leading-none">{item.role}</h3>
                <p className="mt-2 text-sm font-semibold text-clay">{item.company}</p>
                <p className="mt-4 text-sm leading-relaxed text-muted">{item.description}</p>
                <ul className="mt-5 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-wider text-forest">
                  {item.stack.map((tech) => <li key={tech}>{tech}</li>)}
                </ul>
              </div>
              <ul className="space-y-3 text-sm leading-relaxed text-foreground/80">
                {item.highlights.map((highlight) => (
                  <li key={highlight} className="grid grid-cols-[0.8rem_1fr] gap-3">
                    <span className="mt-2 h-1.5 w-1.5 bg-clay" aria-hidden />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
