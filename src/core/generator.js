import { clusterSkills, strengthSuggestions } from "./keywordEngine.js";
import { scoreResume } from "./atsScorer.js";
import { render } from "./layoutEngine.js";
import TextCleaner from "../utils/textCleaner.js";
import { ensureArray, ensureArrayOfStrings, ensureNonEmptyString } from "../utils/validator.js";
import Logger from "../utils/logger.js";

const logger = new Logger("generator");

/**
 * Build role-aware achievements for use as defaults when experience is missing.
 * @param {"entry"|"mid"|"senior"} roleProfile
 * @param {"red"|"blue"|"grc"} track
 * @returns {string[]}
 */
function buildAchievements(roleProfile = "entry", track = "blue") {
  const base = {
    entry: [
      "Coordinated triage of security alerts and escalated incidents to Tier 2 analysts.",
      "Documented runbooks that reduced response time by 20% and improved shift handoffs.",
    ],
    mid: [
      "Implemented detection use cases aligned to MITRE ATT&CK, improving detection coverage by 25%.",
      "Automated evidence collection with Python, cutting investigation time by 30%.",
    ],
    senior: [
      "Led purple team exercises that validated controls and reduced false positives by 18%.",
      "Designed log enrichment pipeline to increase context for incident responders and auditors.",
    ],
  };

  const specialty = {
    red: [
      "Executed adversary emulation leveraging MITRE ATT&CK TTPs with documented findings and fixes.",
      "Delivered exploit chain reports with CVSS scoring to inform prioritized remediation.",
    ],
    blue: [
      "Built SIEM dashboards for SOC KPIs and delivered weekly threat trend summaries to leadership.",
      "Orchestrated containment workflows via SOAR, lowering mean time to respond (MTTR) by 22%.",
    ],
    grc: [
      "Mapped controls to NIST 800-53 and ISO 27001, closing audit gaps and strengthening evidence trails.",
      "Facilitated risk workshops that reclassified critical assets and refined RTO/RPO targets.",
    ],
  };

  return [...(base[roleProfile] || base.entry), ...(specialty[track] || [])];
}

/**
 * Generate a resume with ATS scoring and keyword suggestions.
 * All free-text fields are sanitized and HTML-escaped before rendering.
 * @param {object} options
 * @returns {Promise<{resume: object, html: string, score: object, suggestions: object}>}
 */
export async function generateResume({
  name = "Alex Candidate",
  headline = "Cybersecurity Professional",
  summary = "Security practitioner focused on resilient architectures and measurable outcomes.",
  targetRole = "Cloud Security Engineer",
  skills = [],
  experience = [],
  education = [],
  layout = "modern",
  level = "mid",
  track = "blue",
} = {}) {
  const safeName = ensureNonEmptyString(name, "Alex Candidate");
  const safeHeadline = ensureNonEmptyString(headline, "Cybersecurity Professional");
  const safeSummary = ensureNonEmptyString(
    summary,
    "Security practitioner focused on resilient architectures and measurable outcomes."
  );
  const safeRole = ensureNonEmptyString(targetRole, "Cloud Security Engineer");

  const cleanedSkills = TextCleaner.normalizeList(ensureArrayOfStrings(skills));
  const clusteredSkills = clusterSkills(cleanedSkills);
  const achievements = buildAchievements(level, track);

  const normalizedExperience = ensureArray(experience);
  const experienceFallback = [
    {
      role: "Security Analyst",
      company: "Fictional Corp",
      period: "2021 - Present",
      achievements,
    },
  ];

  const normalizedEducation = ensureArray(education).length
    ? education
    : [{ degree: "B.S. Cybersecurity", institution: "Example University", period: "2017 - 2021" }];

  const resume = {
    name: TextCleaner.sanitize(safeName),
    headline: TextCleaner.sentenceCase(safeHeadline),
    summary: TextCleaner.sentenceCase(safeSummary),
    targetRole: safeRole,
    skills: cleanedSkills,
    clusteredSkills,
    experience: normalizedExperience.length ? normalizedExperience : experienceFallback,
    education: normalizedEducation,
  };

  logger.info(`Generating resume for target role: ${resume.targetRole}`);

  const score = scoreResume(resume);
  const suggestions = strengthSuggestions(targetRole, JSON.stringify(resume));
  const html = await render(layout, {
    name: TextCleaner.escapeHTML(resume.name),
    headline: TextCleaner.escapeHTML(resume.headline),
    summary: TextCleaner.escapeHTML(resume.summary),
    skills: resume.skills.map((skill) => `<span class="pill">${TextCleaner.escapeHTML(skill)}</span>`).join(" "),
    experience: resume.experience
      .map((role) => {
        const safeRole = TextCleaner.escapeHTML(role.role || "");
        const safeCompany = TextCleaner.escapeHTML(role.company || "");
        const safePeriod = TextCleaner.escapeHTML(role.period || "");
        const bullets = (role.achievements || [])
          .map((achievement) => `<li>${TextCleaner.escapeHTML(TextCleaner.sentenceCase(achievement))}</li>`) // HTML escape prevents injection
          .join("\n");

        return `
        <div class="experience-item">
          <div class="title-row">
            <span class="role">${safeRole}</span>
            <span class="period">${safePeriod}</span>
          </div>
          <div class="company">${safeCompany}</div>
          <ul>${bullets}</ul>
        </div>
      `;
      })
      .join(""),
    education: resume.education
      .map((edu) => {
        const safeDegree = TextCleaner.escapeHTML(edu.degree || "");
        const safeInstitution = TextCleaner.escapeHTML(edu.institution || "");
        const safePeriod = TextCleaner.escapeHTML(edu.period || "");
        return `
        <div class="education-item">
          <div class="degree">${safeDegree}</div>
          <div class="institution">${safeInstitution}</div>
          <div class="period">${safePeriod}</div>
        </div>
      `;
      })
      .join(""),
    score: score.total,
    scoreBreakdown: `${score.breakdown.coverageScore}% coverage · ${score.breakdown.impactScore}% impact · ${score.breakdown.readabilityScore}% readability`,
    suggestions: TextCleaner.escapeHTML(suggestions.recommendation),
  });

  logger.info(`Generated resume with score ${score.total}`);

  return { resume, html, score, suggestions };
}

export default { generateResume };
