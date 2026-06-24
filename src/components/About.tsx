import { siteConfig, experience } from "@/lib/site";
import Reveal from "@/components/Reveal";

const stats = [
  { value: siteConfig.yearsExperience, label: "Years experience" },
  { value: `${experience.length}`, label: "Companies shipped for" },
  { value: "∞", label: "Curiosity" },
];

export default function About() {
  return (
    <section className="scroll-mt-24 py-12">
      <Reveal>
        <div className="glass rounded-3xl p-8 sm:p-10">
          <p className="text-base leading-relaxed text-foreground/90 sm:text-lg">
            {siteConfig.summary}
          </p>

          <div className="mt-8 grid grid-cols-3 gap-4 border-t border-border pt-8">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold gradient-text sm:text-4xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs text-muted sm:text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
