import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";

// Shared wrapper so every random diversion looks consistent in the post.
export default function Shell({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <aside className="glass rounded-2xl border border-accent/25 p-5 sm:p-6">
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-accent-2">
        <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
        {label}
      </div>
      {children}
    </aside>
  );
}
