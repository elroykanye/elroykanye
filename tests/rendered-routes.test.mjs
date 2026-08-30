import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import path from "node:path";
import test, { after, before } from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const host = "127.0.0.1";
const port = 3199;
const baseUrl = `http://${host}:${port}`;
const nextBin = path.join(root, "node_modules", "next", "dist", "bin", "next");
let server;
let serverOutput = "";

async function waitForServer() {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(`Next.js exited before becoming ready:\n${serverOutput}`);
    }
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error(`Timed out waiting for Next.js:\n${serverOutput}`);
}

before(async () => {
  server = spawn(
    process.execPath,
    [nextBin, "dev", "--hostname", host, "--port", String(port)],
    {
      cwd: root,
      env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  server.stdout.on("data", (chunk) => {
    serverOutput += chunk;
  });
  server.stderr.on("data", (chunk) => {
    serverOutput += chunk;
  });
  await waitForServer();
});

after(() => {
  server?.kill();
});

test("rendered homepage exposes real work evidence and three writing records", async () => {
  const response = await fetch(baseUrl);
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /href="https:\/\/github\.com\/elroykanye\/barme"/);
  assert.match(html, /href="\/blog\/maayo-offline-first-sync-library"/);
  assert.match(html, /Barme: I wanted a lightweight object store/);
  assert.match(html, /Eight teams, one demo day/);
  assert.match(html, /How Serena made Claude Code usable/);
});

test("rendered article, share page, and résumé remain available", async () => {
  const [article, share, resume] = await Promise.all([
    fetch(`${baseUrl}/blog/maayo-offline-first-sync-library`),
    fetch(`${baseUrl}/share`),
    fetch(`${baseUrl}/resume.pdf`),
  ]);

  assert.equal(article.status, 200);
  assert.match(await article.text(), /data-post-content/);
  assert.equal(share.status, 200);
  assert.match(await share.text(), /Share your story/);
  assert.equal(resume.status, 200);
  assert.match(resume.headers.get("content-type") ?? "", /application\/pdf/);
});
