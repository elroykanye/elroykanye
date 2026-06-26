// Minimal admin auth for a personal site: a single shared password set via the
// ADMIN_PASSWORD env var, sent as a Bearer token. Good enough to gate a private
// moderation page; not a full auth system.

export function checkAdmin(req: Request): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;

  const header = req.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  return token.length > 0 && token === expected;
}
