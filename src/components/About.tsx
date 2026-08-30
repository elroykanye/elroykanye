import { experience, siteConfig } from "@/lib/site";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

const facts = [
  { value: siteConfig.yearsExperience, label: "Years building" },
  { value: String(experience.length), label: "Teams shipped with" },
  { value: "3", label: "Stacks: JVM · .NET · web" },
];

export default function About() {
  return (
    <section className="py-16 sm:py-24">
      <SectionHeading index="04" title="Operating principles" />
      <Reveal>
        <div className="mt-8 grid gap-10 lg:grid-cols-[0.8fr_1.7fr]">
          <p className="max-w-sm font-display text-3xl leading-tight text-clay sm:text-4xl">
            Good systems are understandable. Good teams make that understanding travel.
          </p>
          <div>
            <p className="max-w-3xl text-base leading-8 text-foreground/85 sm:text-lg">
              {siteConfig.summary}
            </p>
            <dl className="mt-8 grid border-y border-ink/25 sm:grid-cols-3">
              {facts.map((fact, index) => (
                <div key={fact.label} className={`py-5 sm:px-5 ${index ? "border-t border-ink/20 sm:border-l sm:border-t-0" : ""}`}>
                  <dt className="field-label text-muted">{fact.label}</dt>
                  <dd className="mt-2 font-display text-4xl text-forest">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
