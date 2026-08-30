import { skills } from "@/lib/site";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

export default function Skills() {
  return (
    <section id="skills" className="scroll-mt-24 py-16 sm:py-24">
      <SectionHeading index="06" title="Skills & tooling" />

      <div className="mt-8 divide-y divide-ink/25 border-y border-ink/25">
        {skills.map((group, i) => (
          <Reveal key={group.category} delay={i * 60}>
            <div className="grid gap-4 py-6 sm:grid-cols-[12rem_1fr] sm:items-start">
              <h3 className="field-label text-clay">
                {group.category}
              </h3>
              <ul className="flex flex-wrap gap-x-5 gap-y-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="font-mono text-xs uppercase tracking-wide text-foreground/85"
                  >
                    <span className="mr-2 text-signal">/</span>{item}
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
