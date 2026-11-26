import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");
const moduleUrl = (source) => `data:text/javascript;base64,${Buffer.from(
  ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText,
).toString("base64")}`;
const siteUrl = moduleUrl(await read("src/lib/site.ts"));
const { siteConfig, experience, education } = await import(siteUrl);
const schemaSource = (await read("src/lib/structured-data.ts")).replace('"@/lib/site"', JSON.stringify(siteUrl));
const { personSchema } = await import(moduleUrl(schemaSource));

test("current residence uses one shared Yaoundé value without erasing historical Bamenda", async () => {
  assert.equal(siteConfig.location, "Yaoundé, Cameroon");
  assert.equal(personSchema().address.addressLocality, siteConfig.location);
  for (const file of ["src/components/Hero.tsx", "src/components/Footer.tsx"]) {
    const source = await read(file);
    assert.match(source, /\{siteConfig\.location\}/);
    assert.doesNotMatch(source, /Bamenda, (Cameroon|North West)/);
  }
  assert.ok(education.some((item) => item.school.includes("Bamenda")));
  assert.match(await read("content/blog/building-software-from-cameroon.mdx"), /I am from Bamenda/);
});

test("current roles retain verified titles, dates and approved responsibilities", () => {
  const current = experience.filter((item) => item.current);
  assert.deepEqual(current.map(({ company, role, period }) => ({ company, role, period })), [
    { company: "Effulgence Tech", role: "Software Engineer", period: "Jul 2026 — Present" },
    { company: "SkyArc Solution FZ-LLC", role: "Software Engineer", period: "Jan 2026 — Present" },
    { company: "Veridyl", role: "Technical Lead", period: "May 2024 — Present" },
  ]);
  assert.deepEqual(current[0].highlights, [
    "Maintain and improve WordPress plugins.",
    "Integrate WordPress websites with external data systems.",
    "Plan, design and develop software solutions around business requirements.",
  ]);
  assert.deepEqual(current[1].highlights, [
    "Backend and infrastructure with C# .NET, Python, and Kubernetes.",
    "Design and deploy microservices and APIs.",
    "Build AI service infrastructure and pipelines.",
    "Frontend development with React.",
    "Work across the full stack from infrastructure to UI.",
  ]);
  assert.deepEqual(current[2].highlights, [
    "Lead product and engineering delivery for SenaSuite, Veridyl’s school administration and learning platform.",
    "Set priorities and acceptance criteria, coordinate frontend, backend and QA work, and guide product demos and school onboarding.",
    "Guide technical work across Angular, TypeScript, Kotlin, Spring Boot, PostgreSQL and offline data synchronization.",
    "Translate feedback from administrators, teachers, students and parents into product improvements.",
  ]);
});

test("person metadata includes all current employers, not previous employers", () => {
  const schema = personSchema();
  assert.deepEqual(schema.worksFor, [
    { "@type": "Organization", name: "Effulgence Tech" },
    { "@type": "Organization", name: "SkyArc Solution FZ-LLC" },
    { "@type": "Organization", name: "Veridyl" },
  ]);
  assert.ok(experience.some((item) => item.company === "Drifting Desk" && !item.current));
  assert.ok(experience.some((item) => item.company === "OpenRefine" && !item.current));
});

test("introduction reflects current work and quantities describe the actual record", async () => {
  for (const company of ["Veridyl", "SkyArc", "Effulgence Tech"]) {
    assert.ok(siteConfig.introduction?.includes(company), `intro must mention ${company}`);
    assert.ok(siteConfig.summary.includes(company), `summary must mention ${company}`);
  }
  assert.equal(siteConfig.yearsExperience, "6+");
  assert.doesNotMatch(siteConfig.summary, /4\+ years|years of experience leading/i);
  assert.match(await read("src/components/Hero.tsx"), /\{siteConfig\.introduction\}/);
  const about = await read("src/components/About.tsx");
  assert.match(about, /value: String\(experience\.length\), label: "Roles in this record"/);
  assert.doesNotMatch(about, /Teams shipped with/);
  const readme = await read("README.md");
  assert.match(readme, /Yaoundé/);
  assert.doesNotMatch(readme, /4\+ years/);
});
