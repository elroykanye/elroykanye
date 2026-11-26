import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("local agent state is ignored without removing project instructions", async () => {
  const paths = [".claude/settings.local.json", ".serena/fixture", ".superpowers/fixture", ".vince/tasks/fixture"];
  const result = spawnSync("git", ["check-ignore", "--stdin"], {
    cwd: root, input: paths.join("\n") + "\n", encoding: "utf8",
  });
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(result.stdout.trim().split("\n"), paths);
  await access(new URL("AGENTS.md", root));
  await access(new URL("CLAUDE.md", root));
});

test("mentoring draft retains its author-provided date and series order", async () => {
  const article = await readFile(new URL("content/blog/mentoring-without-a-mentor.mdx", root), "utf8");
  assert.match(article, /date: "2026-07-05"/);
  assert.match(article, /series: "Notes from the Grassfields"\norder: 4/);
  assert.match(article, /I had no mentor of my own/);
  assert.match(article, /All four are working engineers now/);
  assert.match(article, /\[Tell me your story\.\]\(\/share\)/);
});
