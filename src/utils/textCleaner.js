/**
 * Utility helpers for cleaning and normalizing free-form resume text.
 * Avoids storing personal data and enforces consistent styling for downstream rendering.
 */
export const TextCleaner = {
  /**
   * Normalize whitespace and remove non-breaking spaces.
   * @param {string} input
   * @returns {string}
   */
  sanitize(input = "") {
    const safeValue = typeof input === "string" ? input : String(input ?? "");
    const normalized = safeValue.replace(/\s+/g, " ").replace(/\u00A0/g, " ").trim();
    return normalized;
  },

  /**
   * Escape HTML-reserved characters to prevent injection when rendering templates.
   * @param {string} input
   * @returns {string}
   */
  escapeHTML(input = "") {
    const sanitized = this.sanitize(input);
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return sanitized.replace(/[&<>"']/g, (char) => entities[char] || char);
  },

  /**
   * Convert a string to sentence case.
   * @param {string} input
   * @returns {string}
   */
  sentenceCase(input = "") {
    if (!input) return "";
    const sanitized = this.sanitize(input);
    return sanitized.charAt(0).toUpperCase() + sanitized.slice(1);
  },

  /**
   * Bulletize an array of strings while sanitizing entries.
   * @param {string[]} lines
   * @returns {string[]}
   */
  bulletize(lines = []) {
    return lines.map((line) => `• ${this.sanitize(line)}`).filter((line) => line.trim() !== "•");
  },

  /**
   * Normalize a list of strings by trimming and removing empties.
   * @param {string[]} values
   * @returns {string[]}
   */
  normalizeList(values = []) {
    return values.map((value) => this.sanitize(value)).filter(Boolean);
  },
};

export default TextCleaner;
