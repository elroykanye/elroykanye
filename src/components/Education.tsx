import { education, volunteering } from "@/lib/site";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

export default function Education() {
  return (
    <section className="scroll-mt-24 py-12">
      <SectionHeading index="05" title="Education & community" />

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Reveal>
          <div className="glass glass-hover h-full rounded-2xl p-6">
            <h3 className="font-mono text-sm text-accent-2">Education</h3>
            <ul className="mt-4 space-y-4">
              {education.map((item) => (
                <li key={item.school}>
                  <p className="font-medium">{item.credential}</p>
                  <p className="text-sm text-muted">
                    {item.school} · {item.period}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="glass glass-hover h-full rounded-2xl p-6">
            <h3 className="font-mono text-sm text-accent-2">
              Volunteering & leadership
            </h3>
            <ul className="mt-4 space-y-4">
              {volunteering.map((item) => (
                <li key={item.org}>
                  <p className="font-medium">{item.role}</p>
                  <p className="text-sm text-muted">
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
