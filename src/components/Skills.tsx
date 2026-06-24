import { skills } from "@/lib/site";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

export default function Skills() {
  return (
    <section id="skills" className="scroll-mt-24 py-12">
      <SectionHeading index="02" title="Skills & tooling" />

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {skills.map((group, i) => (
          <Reveal key={group.category} delay={i * 60}>
            <div className="glass glass-hover h-full rounded-2xl p-6">
              <h3 className="font-mono text-sm text-accent-2">
                {group.category}
              </h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-lg border border-border bg-white/5 px-3 py-1.5 text-sm text-foreground/90"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
