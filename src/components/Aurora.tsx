// Animated aurora background. Rendered once in the layout, sits behind all content.
export default function Aurora() {
  return (
    <>
      <div className="aurora" aria-hidden>
        <span />
      </div>
      <div className="aurora-grid" aria-hidden />
    </>
  );
}
