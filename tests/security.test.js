import assert from "assert";
import { test } from "node:test";
import { generateResume } from "../src/core/generator.js";
import { registerTemplate, render } from "../src/core/layoutEngine.js";

test("generateResume escapes HTML-sensitive fields", async () => {
  const payload = "<script>alert('xss')</script>";
  const { html } = await generateResume({
    name: payload,
    headline: payload,
    summary: payload,
    skills: [payload],
    experience: [
      {
        role: payload,
        company: payload,
        period: "2020 - Present",
        achievements: [payload],
      },
    ],
    education: [{ degree: payload, institution: payload, period: "2018 - 2020" }],
  });

  assert.ok(!html.includes(payload), "Raw HTML should be escaped");
  assert.ok(
    html.includes("&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;"),
    "Escaped content should render safely"
  );
});

test("render falls back to modern template when a registered file is missing", async () => {
  registerTemplate("broken", "/tmp/nonexistent-template.html");
  const html = await render("broken", { name: "Fallback User" });
  assert.ok(html.includes("Fallback User"));
});
