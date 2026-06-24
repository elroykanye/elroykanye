import { funFacts } from "@/lib/site";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

export default function FunFacts() {
  return (
    <section className="scroll-mt-24 py-12">
      <SectionHeading index="06" title="Unsolicited facts" />

      <div className="mt-8 columns-1 gap-4 sm:columns-2 [&>*]:mb-4">
        {funFacts.map((fact, i) => (
          <Reveal key={fact} delay={(i % 3) * 60}>
            <div className="glass glass-hover break-inside-avoid rounded-2xl p-5 text-sm leading-relaxed text-foreground/90">
              <span className="mr-2 font-mono text-accent-2">{`0${i + 1}`}</span>
              {fact}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
