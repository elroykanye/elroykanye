import { principles } from "@/lib/site";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

export default function Principles() {
  return (
    <section className="scroll-mt-24 py-12">
      <SectionHeading index="01" title="Things I believe" />

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {principles.map((p, i) => (
          <Reveal key={p.title} delay={i * 60}>
            <div className="glass glass-hover h-full rounded-2xl p-6">
              <div className="text-3xl">{p.emoji}</div>
              <h3 className="mt-3 text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {p.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
