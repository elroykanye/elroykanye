import { siteConfig } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="px-5 pb-8 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-2 border-t border-ink/25 py-7 font-mono text-xs uppercase tracking-wide text-muted sm:flex-row">
        <p>
          © {new Date().getFullYear()} {siteConfig.fullName}
        </p>
        <p className="font-mono text-xs">{siteConfig.location}</p>
      </div>
    </footer>
  );
}
