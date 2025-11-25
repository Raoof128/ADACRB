import { generateResume } from "./core/generator.js";
import { exportHTML } from "./utils/pdfExport.js";
import Logger from "./utils/logger.js";

const logger = new Logger("entrypoint");

async function main() {
  const { html, score } = await generateResume({
    name: "Alex Candidate",
    headline: "Cloud Security Engineer",
    targetRole: "Cloud Security Engineer",
    skills: ["AWS", "IAM", "Kubernetes", "Terraform", "SIEM", "Python", "Incident Response", "Zero Trust"],
    layout: process.env.RESUME_LAYOUT || "modern",
  });

  await exportHTML(html, "./output/resume.html");
  logger.info(`Generated resume with ATS score ${score.total}. Output: output/resume.html`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    logger.error("Error generating resume", error);
    process.exit(1);
  });
}
