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
    <section className="scroll-mt-24 py-12">
      <SectionHeading index="01" title="Things I believe" />

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {principles.map((p, i) => {
          const Icon = ICONS[p.icon] ?? Layers;
          return (
            <Reveal key={p.title} delay={i * 60}>
              <div className="glass glass-hover h-full rounded-2xl p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-white/5">
                  <Icon className="h-5 w-5 text-accent-2" strokeWidth={1.75} />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {p.body}
                </p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
