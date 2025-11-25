import { readFile } from "fs/promises";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import Logger from "../utils/logger.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const logger = new Logger("layout");

const TEMPLATE_MAP = {
  modern: resolve(__dirname, "../templates/modern.html"),
  corporate: resolve(__dirname, "../templates/corporate.html"),
};

async function loadTemplate(layout = "modern") {
  const templatePath = TEMPLATE_MAP[layout] || TEMPLATE_MAP.modern;
  if (!TEMPLATE_MAP[layout]) {
    logger.warn(`Layout '${layout}' not found. Falling back to 'modern'.`);
  }

  try {
    const template = await readFile(templatePath, "utf-8");
    return template;
  } catch (error) {
    if (templatePath !== TEMPLATE_MAP.modern) {
      logger.error(`Failed to load template '${layout}'. Attempting modern fallback.`, error);
      return readFile(TEMPLATE_MAP.modern, "utf-8");
    }

    logger.error("Failed to load default template.", error);
    throw error;
  }
}

function inject(template, data) {
  return template.replace(/{{\s*(\w+)\s*}}/g, (_, key) => data[key] ?? "");
}

export async function render(layout, data) {
  const template = await loadTemplate(layout);
  return inject(template, data);
}

export function registerTemplate(name, path) {
  TEMPLATE_MAP[name] = path;
  logger.info(`Registered template '${name}' at ${path}`);
}

export default { render, registerTemplate };
