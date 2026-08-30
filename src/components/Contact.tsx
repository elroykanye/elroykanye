import { siteConfig, socials } from "@/lib/site";
import Reveal from "@/components/Reveal";

export default function Contact() {
  return (
    <section id="contact" className="scroll-mt-24 py-16 sm:py-24">
      <Reveal>
        <div className="grid gap-10 border border-ink bg-clay p-7 text-paper sm:p-12 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <div>
          <p className="field-label text-signal">Field / 10 · Open channel</p>
          <h2 className="mt-4 max-w-2xl font-display text-5xl leading-[0.95] sm:text-7xl">
            Let&apos;s build something that holds up.
          </h2>
          </div>
          <div>
          <p className="max-w-md leading-7 text-paper/75">
            I&apos;m open to interesting roles, collaborations, and
            conversations. The fastest way to reach me is by email.
          </p>

          <a
            href={`mailto:${siteConfig.email}`}
            className="mt-7 inline-flex min-h-11 items-center border border-paper bg-paper px-5 font-mono text-xs uppercase tracking-wide text-ink transition-colors hover:bg-signal focus-visible:outline-paper"
          >
            {siteConfig.email}
          </a>

          <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs uppercase tracking-wide">
            {socials
              .filter((s) => s.label !== "Email")
              .map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-paper/65 transition-colors hover:text-paper"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
          </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
