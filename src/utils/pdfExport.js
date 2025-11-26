import { writeFile, mkdir } from "fs/promises";
import { dirname } from "path";
import { marked } from "marked";
import Logger from "./logger.js";

const logger = new Logger("export");

/**
 * Minimal PDF export abstraction. In a production deployment, this can be
 * swapped with a real HTML-to-PDF renderer such as Playwright, Puppeteer, or
 * wkhtmltopdf. For now, it writes portable HTML to disk to remain dependency
 * light while keeping the interface stable.
 */
export async function exportHTML(html, outputPath) {
  try {
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, html, "utf-8");
    logger.info(`Wrote HTML export to ${outputPath}`);
    return outputPath;
  } catch (error) {
    logger.error(`Failed to export HTML to ${outputPath}`, error);
    throw error;
  }
}

export async function exportMarkdown(markdown, outputPath) {
  try {
    const html = marked.parse(markdown);
    return exportHTML(html, outputPath);
  } catch (error) {
    logger.error("Failed to convert Markdown to HTML for export", error);
    throw error;
  }
}

export default { exportHTML, exportMarkdown };
