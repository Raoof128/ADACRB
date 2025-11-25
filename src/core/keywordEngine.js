import TextCleaner from "../utils/textCleaner.js";
import { ensureString } from "../utils/validator.js";

export const ROLE_KEYWORDS = {
  "cloud security engineer": [
    "IAM",
    "CSPM",
    "KMS",
    "AWS",
    "Azure",
    "GCP",
    "SIEM",
    "EDR",
    "Kubernetes",
    "Terraform",
    "Zero Trust",
    "Key Management",
  ],
  "soc analyst": ["SIEM", "SOAR", "MITRE ATT&CK", "UEBA", "EDR", "SOPs", "KPIs"],
  "penetration tester": [
    "Burp Suite",
    "Nmap",
    "Metasploit",
    "OWASP",
    "Exploit",
    "CVE",
    "Red Team",
    "Reporting",
  ],
  grc: ["NIST", "ISO 27001", "Risk", "Policy", "Audit", "Controls", "Evidence"],
};

/**
 * Extract keyword frequency from free text.
 * @param {string} text
 * @returns {Record<string, number>}
 */
export function extractKeywords(text = "") {
  const sanitized = TextCleaner.sanitize(ensureString(text)).toLowerCase();
  const tokens = sanitized.split(/[^a-z0-9+]+/i).filter(Boolean);
  const counts = tokens.reduce((acc, token) => {
    const key = token.toLowerCase();
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  return counts;
}

/**
 * Rank keywords for a target role against a narrative.
 * @param {string} role
 * @param {string} narrative
 * @returns {Array<{keyword: string; present: boolean; frequency: number}>}
 */
export function prioritize(role = "", narrative = "") {
  const roleKey = ensureString(role).toLowerCase();
  const base = ROLE_KEYWORDS[roleKey] || [];
  const narrativeCounts = extractKeywords(narrative);
  const ranked = base
    .map((keyword) => ({
      keyword,
      present: Boolean(narrativeCounts[keyword.toLowerCase()]),
      frequency: narrativeCounts[keyword.toLowerCase()] || 0,
    }))
    .sort((a, b) => b.frequency - a.frequency || Number(b.present) - Number(a.present));
  return ranked;
}

/**
 * Cluster skills into domain buckets for layout and ATS clarity.
 * @param {string[]} skills
 * @returns {Record<string, string[]>}
 */
export function clusterSkills(skills = []) {
  const buckets = {
    cloud: [],
    securityOps: [],
    governance: [],
    development: [],
    tooling: [],
    other: [],
  };

  skills.forEach((skill) => {
    const normalized = TextCleaner.sanitize(skill).toLowerCase();
    if (/aws|azure|gcp|kubernetes|terraform|cloud/.test(normalized)) {
      buckets.cloud.push(skill);
    } else if (/siem|soar|edr|soc|incident|mitre/.test(normalized)) {
      buckets.securityOps.push(skill);
    } else if (/nist|iso|policy|audit|risk|governance/.test(normalized)) {
      buckets.governance.push(skill);
    } else if (/python|javascript|bash|automation|scripting|development/.test(normalized)) {
      buckets.development.push(skill);
    } else if (/burp|nmap|wireshark|metasploit|nessus/.test(normalized)) {
      buckets.tooling.push(skill);
    } else {
      buckets.other.push(skill);
    }
  });

  return buckets;
}

/**
 * Suggest keyword improvements based on target role.
 * @param {string} role
 * @param {string} content
 * @returns {{missing: string[]; lowFrequency: string[]; recommendation: string}}
 */
export function strengthSuggestions(role = "", content = "") {
  const prioritized = prioritize(role, content);
  const missing = prioritized.filter((item) => !item.present).map((item) => item.keyword);
  const lowFrequency = prioritized.filter((item) => item.frequency === 1).map((item) => item.keyword);

  return {
    missing,
    lowFrequency,
    recommendation:
      missing.length === 0 && lowFrequency.length === 0
        ? "Great coverage. Consider adding specific outcomes or metrics to strengthen impact."
        : `Consider weaving in these priority terms: ${missing.join(", ")}. Reinforce limited mentions: ${lowFrequency.join(", ")}.`,
  };
}

export default {
  ROLE_KEYWORDS,
  extractKeywords,
  prioritize,
  clusterSkills,
  strengthSuggestions,
};
