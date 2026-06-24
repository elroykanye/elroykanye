import Reveal from "@/components/Reveal";

export default function SectionHeading({
  index,
  title,
}: {
  index: string;
  title: string;
}) {
  return (
    <Reveal>
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-sm text-accent">{index}</span>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h2>
        <span className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
      </div>
    </Reveal>
  );
}
