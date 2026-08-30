import { education, volunteering } from "@/lib/site";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

export default function Education() {
  return (
    <section className="scroll-mt-24 py-16 sm:py-24">
      <SectionHeading index="08" title="Education & community" />

      <div className="mt-8 grid border-y border-ink/25 md:grid-cols-2">
        <Reveal>
          <div className="h-full py-7 md:pr-8">
            <h3 className="field-label text-clay">Education</h3>
            <ul className="mt-5 divide-y divide-ink/20">
              {education.map((item) => (
                <li key={item.school} className="py-4 first:pt-0 last:pb-0">
                  <p className="font-display text-xl">{item.credential}</p>
                  <p className="mt-1 font-mono text-xs text-muted">
                    {item.school} · {item.period}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="h-full border-t border-ink/25 py-7 md:border-l md:border-t-0 md:pl-8">
            <h3 className="field-label text-clay">
              Volunteering & leadership
            </h3>
            <ul className="mt-5 divide-y divide-ink/20">
              {volunteering.map((item) => (
                <li key={item.org} className="py-4 first:pt-0 last:pb-0">
                  <p className="font-display text-xl">{item.role}</p>
                  <p className="mt-1 font-mono text-xs text-muted">
                    {item.org} · {item.period}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
