import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("homepage puts selected work and writing before personality extras", async () => {
  const page = await read("src/app/page.tsx");
  const selectedWork = page.indexOf("<SelectedWork");
  const writing = page.indexOf("<Writing");
  const games = page.indexOf("<Games");
  const funFacts = page.indexOf("<FunFacts");

  assert.ok(selectedWork >= 0, "SelectedWork must be rendered on the homepage");
  assert.ok(writing > selectedWork, "Writing must follow selected work");
  assert.ok(games > writing, "Arcade must appear after proof and writing");
  assert.ok(funFacts > games, "Personality extras must remain after the arcade");
});

test("hero makes selected work the primary action without repeating the role", async () => {
  const hero = await read("src/components/Hero.tsx");

  assert.match(hero, /href=["']#work["']/);
  assert.doesNotMatch(hero, /siteConfig\.role\}\.?\s*\{siteConfig\.tagline/);
  assert.match(hero, /I build reliable systems/i);
});

test("selected work is backed by at least three named real projects", async () => {
  const site = await read("src/lib/site.ts");

  assert.match(site, /export const selectedWork/);
  for (const project of ["Barme", "Maayo", "OpenRefine"]) {
    assert.match(site, new RegExp(`title:\\s*["']${project}["']`));
  }
});

test("navigation exposes work and notes as first-class destinations", async () => {
  const header = await read("src/components/Header.tsx");

  assert.match(header, /label:\s*["']Work["'][^\n]+href:\s*["']\/#work["']/);
  assert.match(header, /label:\s*["']Notes["'][^\n]+href:\s*["']\/#notes["']/);
});

test("global design tokens use the editorial field-dossier palette", async () => {
  const css = await read("src/app/globals.css");

  for (const token of ["--paper", "--ink", "--clay", "--forest", "--signal"]) {
    assert.match(css, new RegExp(`${token}:`), `${token} must be defined`);
  }
  assert.doesNotMatch(css, /\.aurora\s*\{/);
});
