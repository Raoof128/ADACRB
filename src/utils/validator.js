/**
 * Input validation helpers to protect rendering logic and scoring from unexpected shapes.
 */
export function ensureArray(value, fallback = []) {
  return Array.isArray(value) ? value : fallback;
}

export function ensureString(value, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

export function ensureNonEmptyString(value, fallback = "") {
  const sanitized = ensureString(value, fallback).trim();
  return sanitized.length > 0 ? sanitized : fallback;
}

export function ensureArrayOfStrings(value, fallback = []) {
  if (!Array.isArray(value)) return fallback;
  return value.filter((item) => typeof item === "string" && item.trim().length > 0);
}

export default {
  ensureArray,
  ensureString,
  ensureNonEmptyString,
  ensureArrayOfStrings,
};
