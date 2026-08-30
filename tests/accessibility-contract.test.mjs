import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

function channel(value) {
  const normalized = value / 255;
  return normalized <= 0.04045
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
}

function luminance(hex) {
  const [red, green, blue] = [1, 3, 5].map((index) =>
    Number.parseInt(hex.slice(index, index + 2), 16),
  );
  return (
    0.2126 * channel(red) +
    0.7152 * channel(green) +
    0.0722 * channel(blue)
  );
}

function contrast(first, second) {
  const a = luminance(first);
  const b = luminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

function token(css, name) {
  const match = css.match(new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`, "i"));
  assert.ok(match, `missing --${name} token`);
  return match[1];
}

test("editorial text tokens meet normal-text contrast on their intended surfaces", async () => {
  const css = await read("src/app/globals.css");
  const colors = Object.fromEntries(
    ["paper", "ink", "clay", "forest", "signal"].map((name) => [
      name,
      token(css, name),
    ]),
  );

  assert.ok(contrast(colors.clay, colors.paper) >= 4.5);
  assert.ok(contrast(colors.forest, colors.paper) >= 4.5);
  assert.ok(contrast(colors.signal, colors.ink) >= 4.5);
  assert.ok(contrast(colors.paper, colors.ink) >= 4.5);
});

test("article typography is explicitly readable on the light surface", async () => {
  const article = await read("src/app/blog/[slug]/page.tsx");
  assert.doesNotMatch(article, /prose-invert/);
  assert.match(article, /prose-headings:text-ink/);
  assert.match(article, /prose-p:text-foreground/);
  assert.match(article, /prose-a:text-forest/);
});

test("surface-specific accents do not reuse low-contrast combinations", async () => {
  const [work, skills, contact, bug, memory, reaction] = await Promise.all([
    read("src/components/SelectedWork.tsx"),
    read("src/components/Skills.tsx"),
    read("src/components/Contact.tsx"),
    read("src/components/games/BugSquash.tsx"),
    read("src/components/games/MemoryMatch.tsx"),
    read("src/components/games/ReactionTest.tsx"),
  ]);

  assert.match(work, /group-hover:text-paper[^"]*text-signal|text-signal[^"]*group-hover:text-paper/);
  assert.doesNotMatch(skills, /text-signal/);
  assert.match(contact, /bg-ink/);
  for (const game of [bug, memory, reaction]) {
    assert.doesNotMatch(game, /text-muted/);
  }
});

test("mobile, overflow, and reduced-motion contracts are guarded", async () => {
  const [css, header] = await Promise.all([
    read("src/app/globals.css"),
    read("src/components/Header.tsx"),
  ]);

  assert.match(css, /overflow-x:\s*clip/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(header, /className="grid h-11 w-11 place-items-center/);
});
