import Image from "next/image";

type MdxImageProps = {
  src?: string;
  alt?: string;
};

// Markdown `![alt](src)` gives no intrinsic dimensions, so this renders at a
// fixed aspect ratio and lets CSS scale it responsively (Next's documented
// pattern for next/image when real dimensions aren't known upfront) — still
// reserves layout space to avoid CLS.
export default function MdxImage({ src, alt = "" }: MdxImageProps) {
  if (!src) return null;

  return (
    <Image
      src={src}
      alt={alt}
      width={1200}
      height={630}
      sizes="(min-width: 768px) 720px, 100vw"
      className="rounded-xl border border-border"
      style={{ width: "100%", height: "auto" }}
    />
  );
}
