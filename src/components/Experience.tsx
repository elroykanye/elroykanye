import { experience } from "@/lib/site";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

export default function Experience() {
  return (
    <section id="experience" className="scroll-mt-24 py-12">
      <SectionHeading index="03" title="Experience" />

      <div className="mt-8 space-y-5">
        {experience.map((item, i) => (
          <Reveal key={`${item.company}-${item.period}`} delay={i * 50}>
            <article className="glass glass-hover rounded-2xl p-6 sm:p-8">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h3 className="text-lg font-semibold">
                  {item.role}
                  <span className="text-accent"> · {item.company}</span>
                </h3>
                <p className="font-mono text-xs text-muted">{item.period}</p>
              </div>

              <p className="mt-2 text-sm text-muted">{item.description}</p>

              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-foreground/85">
                {item.highlights.map((highlight, j) => (
                  <li key={j} className="flex gap-3">
                    <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-accent-2 to-accent" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>

              <ul className="mt-5 flex flex-wrap gap-2">
                {item.stack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-md border border-border px-2.5 py-1 font-mono text-xs text-muted"
                  >
                    {tech}
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
