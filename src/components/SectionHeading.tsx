import Reveal from "@/components/Reveal";

export default function SectionHeading({ index, title }: { index: string; title: string }) {
  return (
    <Reveal>
      <div className="flex items-end gap-4 border-b border-ink/25 pb-4">
        <span className="field-label text-clay">Field / {index}</span>
        <h2 className="font-display text-4xl leading-none tracking-tight sm:text-5xl">
          {title}
        </h2>
      </div>
    </Reveal>
  );
}
