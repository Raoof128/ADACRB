import assert from "assert";
import { test } from "node:test";
import { mkdtemp, readFile } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";

import TextCleaner from "../src/utils/textCleaner.js";
import { ensureArray, ensureArrayOfStrings, ensureNonEmptyString, ensureString } from "../src/utils/validator.js";
import { exportHTML } from "../src/utils/pdfExport.js";

test("TextCleaner handles non-string inputs safely", () => {
  const sanitized = TextCleaner.sanitize(42);
  assert.strictEqual(sanitized, "42");
  const escaped = TextCleaner.escapeHTML("<tag>");
  assert.strictEqual(escaped, "&lt;tag&gt;");
});

test("Validator utilities enforce shape expectations", () => {
  assert.deepStrictEqual(ensureArray("nope", [1]), [1]);
  assert.strictEqual(ensureString(5, "fallback"), "fallback");
  assert.strictEqual(ensureNonEmptyString("   ", "fallback"), "fallback");
  assert.deepStrictEqual(ensureArrayOfStrings(["ok", 1, "  "], ["x"]), ["ok"]);
});

test("exportHTML writes content to disk", async () => {
  const dir = await mkdtemp(join(tmpdir(), "resume-export-"));
  const filePath = join(dir, "sample.html");
  await exportHTML("<p>hello</p>", filePath);
  const saved = await readFile(filePath, "utf-8");
  assert.strictEqual(saved.trim(), "<p>hello</p>");
});
