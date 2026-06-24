import { siteConfig } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="mt-8 px-4 pb-6">
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-2 rounded-2xl border-t border-border py-8 text-center text-sm text-muted sm:flex-row sm:text-left">
        <p>
          © {new Date().getFullYear()} {siteConfig.fullName}
        </p>
        <p className="font-mono text-xs">{siteConfig.location}</p>
      </div>
    </footer>
  );
}
