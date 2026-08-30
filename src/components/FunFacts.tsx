import { funFacts } from "@/lib/site";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

export default function FunFacts() {
  return (
    <section className="scroll-mt-24 py-16 sm:py-24">
      <SectionHeading index="09" title="Unsolicited facts" />

      <div className="mt-8 grid border-y border-ink/25 sm:grid-cols-2">
        {funFacts.map((fact, i) => (
          <Reveal key={fact} delay={(i % 3) * 60}>
            <div className={`h-full py-5 text-sm leading-7 text-foreground/90 sm:px-5 ${i % 2 ? "sm:border-l sm:border-ink/25" : ""} ${i > 1 ? "border-t border-ink/25" : i > 0 ? "border-t border-ink/25 sm:border-t-0" : ""}`}>
              <span className="mr-3 font-mono text-xs text-clay">{`0${i + 1}`}</span>
              {fact}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
