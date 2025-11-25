import assert from "assert";
import { test } from "node:test";
import { generateResume } from "../src/core/generator.js";
import { scoreResume } from "../src/core/atsScorer.js";
import { clusterSkills, strengthSuggestions } from "../src/core/keywordEngine.js";
import { render } from "../src/core/layoutEngine.js";

const sampleSkills = ["AWS", "IAM", "Python", "Kubernetes", "Terraform", "Nmap", "ISO 27001", "SIEM"];

test("generateResume returns html, score, and suggestions", async () => {
  const { html, score, resume, suggestions } = await generateResume({
    name: "Test User",
    skills: sampleSkills,
  });
  assert.ok(html.includes("Test User"));
  assert.ok(score.total > 0);
  assert.ok(Array.isArray(resume.skills));
  assert.ok(typeof suggestions.recommendation === "string");
});

test("scoreResume rewards keyword coverage", () => {
  const sample = {
    targetRole: "cloud security engineer",
    skills: ["AWS", "IAM", "Terraform", "KMS"],
    experience: [{ achievements: ["Delivered IAM hardening"] }],
  };
  const score = scoreResume(sample);
  assert.ok(score.breakdown.coverageScore > 0);
  assert.ok(score.total <= 100);
});

test("clusterSkills groups common domains", () => {
  const clusters = clusterSkills(["AWS", "Nmap", "Python", "ISO 27001"]);
  assert.ok(clusters.cloud.includes("AWS"));
  assert.ok(clusters.tooling.includes("Nmap"));
  assert.ok(clusters.development.includes("Python"));
  assert.ok(clusters.governance.includes("ISO 27001"));
});

test("layout engine falls back to modern for unknown template", async () => {
  const html = await render("nonexistent", { name: "Tester" });
  assert.ok(html.includes("Tester"));
});

test("keyword engine suggests missing terms", () => {
  const suggestions = strengthSuggestions("soc analyst", "Incident response playbooks");
  assert.ok(suggestions.missing.length > 0);
});
