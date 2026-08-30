import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import { createServer } from "node:net";
import os from "node:os";
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
let browser;
let browserOutput = "";
let browserProfile;
let cdp;

const chromeCandidates = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
].filter(Boolean);

function freePort() {
  return new Promise((resolve, reject) => {
    const socket = createServer();
    socket.once("error", reject);
    socket.listen(0, host, () => {
      const address = socket.address();
      socket.close(() => resolve(address.port));
    });
  });
}

async function waitForJson(url, processHandle, getOutput) {
  const deadline = Date.now() + 15_000;
  while (Date.now() < deadline) {
    if (processHandle.exitCode !== null) {
      throw new Error(`Browser exited before becoming ready:\n${getOutput()}`);
    }
    try {
      const response = await fetch(url);
      if (response.ok) return response.json();
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Timed out waiting for browser:\n${getOutput()}`);
}

function connectCdp(url) {
  const socket = new WebSocket(url);
  let nextId = 0;
  const pending = new Map();
  const events = new Map();

  socket.addEventListener("message", ({ data }) => {
    const message = JSON.parse(data);
    if (message.id) {
      const request = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) request.reject(new Error(message.error.message));
      else request.resolve(message.result);
      return;
    }
    const listeners = events.get(message.method) ?? [];
    events.delete(message.method);
    for (const resolve of listeners) resolve(message.params);
  });

  const ready = new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });

  return {
    ready,
    send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const id = ++nextId;
        pending.set(id, { resolve, reject });
        socket.send(JSON.stringify({ id, method, params }));
      });
    },
    once(method) {
      return new Promise((resolve) => {
        const listeners = events.get(method) ?? [];
        listeners.push(resolve);
        events.set(method, listeners);
      });
    },
    close() {
      socket.close();
    },
  };
}

async function navigate(url) {
  const loaded = cdp.once("Page.loadEventFired");
  await cdp.send("Page.navigate", { url });
  await loaded;
}

async function evaluate(expression) {
  const result = await cdp.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  assert.equal(result.exceptionDetails, undefined, result.exceptionDetails?.text);
  return result.result.value;
}

const contrastAudit = String.raw`
(selector, text) => {
  const element = [...document.querySelectorAll(selector)].find(
    (node) => !text || node.textContent.trim() === text,
  );
  if (!element) return { error: 'missing element: ' + selector + ' / ' + text };

  const canvas = new OffscreenCanvas(1, 1);
  const context = canvas.getContext('2d', { willReadFrequently: true });
  const rgba = (color) => {
    context.clearRect(0, 0, 1, 1);
    context.fillStyle = color;
    context.fillRect(0, 0, 1, 1);
    return [...context.getImageData(0, 0, 1, 1).data].map((value, index) =>
      index === 3 ? value / 255 : value,
    );
  };
  const over = (front, back) => {
    const alpha = front[3] + back[3] * (1 - front[3]);
    if (alpha === 0) return [0, 0, 0, 0];
    return [0, 1, 2].map(
      (index) => (front[index] * front[3] + back[index] * back[3] * (1 - front[3])) / alpha,
    ).concat(alpha);
  };
  const layers = [];
  for (let node = element; node; node = node.parentElement) {
    layers.push(rgba(getComputedStyle(node).backgroundColor));
  }
  let background = [255, 255, 255, 1];
  for (const layer of layers.reverse()) background = over(layer, background);
  const foreground = over(rgba(getComputedStyle(element).color), background);
  const linear = (value) => {
    const normalized = value / 255;
    return normalized <= 0.04045
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  };
  const luminance = (color) =>
    0.2126 * linear(color[0]) + 0.7152 * linear(color[1]) + 0.0722 * linear(color[2]);
  const first = luminance(foreground);
  const second = luminance(background);
  return {
    ratio: (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05),
    color: getComputedStyle(element).color,
    background,
    text: element.textContent.trim(),
  };
}`;

async function audit(selector, text) {
  return evaluate(`(${contrastAudit})(${JSON.stringify(selector)}, ${JSON.stringify(text)})`);
}

async function stopProcess(processHandle) {
  if (!processHandle || processHandle.exitCode !== null) return;
  const exited = new Promise((resolve) => processHandle.once("exit", resolve));
  processHandle.kill();
  await exited;
}

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

  const chrome = chromeCandidates.find((candidate) => existsSync(candidate));
  assert.ok(chrome, "Chrome or Edge is required; set CHROME_PATH to its executable");
  const debuggingPort = await freePort();
  browserProfile = await mkdtemp(path.join(os.tmpdir(), "portfolio-contrast-"));
  browser = spawn(
    chrome,
    [
      "--headless=new",
      "--disable-gpu",
      "--no-first-run",
      "--no-default-browser-check",
      `--remote-debugging-port=${debuggingPort}`,
      `--user-data-dir=${browserProfile}`,
      "about:blank",
    ],
    { stdio: ["ignore", "pipe", "pipe"] },
  );
  browser.stdout.on("data", (chunk) => {
    browserOutput += chunk;
  });
  browser.stderr.on("data", (chunk) => {
    browserOutput += chunk;
  });
  const targets = await waitForJson(
    `http://${host}:${debuggingPort}/json/list`,
    browser,
    () => browserOutput,
  );
  const page = targets.find((target) => target.type === "page");
  assert.ok(page?.webSocketDebuggerUrl, "headless browser did not expose a page target");
  cdp = connectCdp(page.webSocketDebuggerUrl);
  await cdp.ready;
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
});

after(async () => {
  cdp?.close();
  await stopProcess(browser);
  await stopProcess(server);
  if (browserProfile) {
    await rm(browserProfile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  }
});

test("rendered homepage exposes real work evidence and three writing records", async () => {
  const response = await fetch(baseUrl);
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /href="https:\/\/github\.com\/elroykanye\/barme"/);
  assert.match(html, /Barme: I wanted a lightweight object store/);
  const notesStart = html.indexOf('id="notes"');
  assert.notEqual(notesStart, -1, "rendered Notes section is missing");
  const notesEnd = html.indexOf("<section", notesStart);
  const notes = html.slice(notesStart, notesEnd === -1 ? undefined : notesEnd);
  assert.equal((notes.match(/href="\/blog\/[^"#]+"/g) ?? []).length, 3);
});

test("rendered dark surfaces meet normal-text contrast after alpha composition", async () => {
  await navigate(baseUrl);
  const homepage = await Promise.all([
    audit("p", "Design proof"),
    audit("#play .font-mono.text-xs > span:first-child > span", ""),
  ]);
  await evaluate(`(() => {
    const button = [...document.querySelectorAll('button')].find(
      (node) => node.textContent.trim() === 'Match the Stack',
    );
    if (!button) throw new Error('missing Match the Stack tab');
    button.click();
  })()`);
  await new Promise((resolve) => setTimeout(resolve, 100));
  homepage.push(await audit("#play .font-mono.text-xs > span:first-child > span", ""));

  await navigate(`${baseUrl}/blog/maayo-offline-first-sync-library`);
  const articleCode = await audit("pre code", "");

  for (const result of [...homepage, articleCode]) {
    assert.equal(result.error, undefined, result.error);
    assert.ok(
      result.ratio >= 4.5,
      `${result.text} has ${result.ratio.toFixed(2)}:1 contrast (${result.color})`,
    );
  }
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
