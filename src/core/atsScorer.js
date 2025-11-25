import { extractKeywords, prioritize } from "./keywordEngine.js";
import TextCleaner from "../utils/textCleaner.js";

function computeImpactDensity(experiences = []) {
  if (!experiences.length) return 0;
  const bulletCount = experiences.reduce((count, role) => count + (role.achievements?.length || 0), 0);
  if (bulletCount === 0) return 0;
  const metricBullets = experiences.reduce(
    (count, role) => count + (role.achievements || []).filter((line) => /%|\d|\$/.test(line)).length,
    0
  );
  return Math.min(100, Math.round((metricBullets / bulletCount) * 100)) || 0;
}

function computeReadability(text = "") {
  const length = TextCleaner.sanitize(text).length;
  if (length < 400) return 60;
  if (length < 1200) return 80;
  return 70;
}

/**
 * Score a resume against ATS-inspired heuristics.
 * @param {object} resume
 * @returns {{total: number, breakdown: object, weaknesses: string[], keywordCounts: object}}
 */
export function scoreResume(resume) {
  const narrative = JSON.stringify(resume);
  const keywordCounts = extractKeywords(narrative);
  const targeted = prioritize(resume.targetRole || "", narrative);
  const coverageScore = targeted.length
    ? Math.round((targeted.filter((item) => item.present).length / targeted.length) * 100)
    : 70;
  const impactScore = computeImpactDensity(resume.experience || []);
  const readabilityScore = computeReadability(narrative);
  const skillsCount = resume.skills?.length || 0;
  const roleRelevance = targeted.length ? Math.round(coverageScore * 0.7 + impactScore * 0.3) : 65;

  const total = Math.round(
    coverageScore * 0.35 + impactScore * 0.25 + readabilityScore * 0.15 + Math.min(skillsCount * 5, 25) + roleRelevance * 0.2
  );

  const weaknesses = [];
  if (coverageScore < 80) weaknesses.push("Increase role-specific keywords and framework references.");
  if (impactScore < 60) weaknesses.push("Add metrics to achievements using %, $, or quantitative outcomes.");
  if (readabilityScore < 70) weaknesses.push("Tighten phrasing and remove fluff to improve readability.");
  if (skillsCount < 8) weaknesses.push("Expand skills section with clustered, ATS-friendly keywords.");

  return {
    total: Math.min(total, 100),
    breakdown: {
      coverageScore,
      impactScore,
      readabilityScore,
      roleRelevance,
      skillsCount,
    },
    weaknesses,
    keywordCounts,
  };
}

export default { scoreResume };
