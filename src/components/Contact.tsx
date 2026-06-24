import { siteConfig, socials } from "@/lib/site";
import Reveal from "@/components/Reveal";

export default function Contact() {
  return (
    <section id="contact" className="scroll-mt-24 py-16">
      <Reveal>
        <div className="glass relative overflow-hidden rounded-3xl p-10 text-center sm:p-14">
          <div
            className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-accent/30 blur-3xl"
            aria-hidden
          />
          <p className="font-mono text-sm text-accent-2">Let&apos;s build something</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Get in <span className="gradient-text">touch</span>
          </h2>
          <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted">
            I&apos;m open to interesting roles, collaborations, and
            conversations. The fastest way to reach me is by email.
          </p>

          <a
            href={`mailto:${siteConfig.email}`}
            className="mt-8 inline-block rounded-xl bg-accent px-7 py-3.5 text-sm font-medium text-white shadow-lg shadow-accent/30 transition-all hover:-translate-y-0.5 hover:shadow-accent/50"
          >
            {siteConfig.email}
          </a>

          <ul className="mt-8 flex items-center justify-center gap-6 text-sm">
            {socials
              .filter((s) => s.label !== "Email")
              .map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-muted transition-colors hover:text-foreground"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
