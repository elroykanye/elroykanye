import { Layers, Compass, Users, Rocket, type LucideIcon } from "lucide-react";
import { principles } from "@/lib/site";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

const ICONS: Record<string, LucideIcon> = {
  layers: Layers,
  compass: Compass,
  users: Users,
  rocket: Rocket,
};

export default function Principles() {
  return (
    <section className="scroll-mt-24 py-16 sm:py-24">
      <SectionHeading index="05" title="Things I believe" />

      <div className="mt-8 grid border-y border-ink/25 sm:grid-cols-2">
        {principles.map((p, i) => {
          const Icon = ICONS[p.icon] ?? Layers;
          return (
            <Reveal key={p.title} delay={i * 60}>
              <article className={`h-full px-1 py-7 sm:p-7 ${i % 2 ? "sm:border-l sm:border-ink/25" : ""} ${i > 1 ? "border-t border-ink/25" : i > 0 ? "border-t border-ink/25 sm:border-t-0" : ""}`}>
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-clay" strokeWidth={1.5} />
                  <span className="field-label text-forest">Rule 0{i + 1}</span>
                </div>
                <h3 className="mt-5 font-display text-2xl leading-none">{p.title}</h3>
                <p className="mt-3 max-w-xl text-sm leading-7 text-muted">
                  {p.body}
                </p>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
