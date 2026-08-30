import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { selectedWork } from "@/lib/site";
import Reveal from "@/components/Reveal";

export default function SelectedWork() {
  return (
    <section id="work" className="scroll-mt-24 py-16 sm:py-24">
      <Reveal>
        <div className="mb-7 flex flex-col gap-3 border-b border-ink/25 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="field-label text-clay">Evidence / 01</p>
            <h2 className="mt-2 font-display text-4xl leading-none sm:text-6xl">
              Selected systems
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-muted sm:text-right">
            Three builds where the architecture is the story. No mystery bars,
            no percentage confetti.
          </p>
        </div>
      </Reveal>

      <div className="border-x border-t border-ink/25 bg-ink text-paper">
        {selectedWork.map((item, index) => (
          <Reveal key={item.title} delay={index * 70}>
            <article className="group grid border-b border-paper/20 lg:grid-cols-[5rem_1.1fr_1.6fr_1fr]">
              <div className="border-b border-paper/20 p-5 font-mono text-3xl text-clay lg:border-r lg:border-b-0 lg:p-6">
                {item.number}
              </div>
              <div className="border-b border-paper/20 p-5 lg:border-r lg:border-b-0 lg:p-6">
                <p className="field-label text-signal">{item.kind}</p>
                <h3 className="mt-3 font-display text-3xl leading-none">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-paper/70">
                  {item.summary}
                </p>
              </div>
              <div className="border-b border-paper/20 p-5 lg:border-r lg:border-b-0 lg:p-6">
                <p className="field-label text-paper/70">Design proof</p>
                <p className="mt-3 text-sm leading-relaxed text-paper/82">
                  {item.proof}
                </p>
              </div>
              <div className="flex flex-col justify-between gap-7 p-5 lg:p-6">
                <ul className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-wide text-paper/55">
                  {item.stack.map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>
                <Link
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noreferrer" : undefined}
                  className="inline-flex min-h-11 items-center justify-between border-t border-paper/25 pt-4 text-sm font-semibold text-signal transition-colors group-hover:text-paper focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal"
                >
                  {item.linkLabel}
                  <ArrowUpRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
