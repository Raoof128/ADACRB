# API Reference

## `generateResume(options)`
Generates a resume payload, scores it, and renders HTML.

**Parameters**
- `name` (string): Candidate name. Defaults to `"Alex Candidate"`.
- `headline` (string): Role headline.
- `summary` (string): Professional summary paragraph.
- `targetRole` (string): Targeted cybersecurity role.
- `skills` (string[]): Skill list to sanitize, cluster, and render.
- `experience` (array): Experience entries with `role`, `company`, `period`, and `achievements`.
- `education` (array): Education entries with `degree`, `institution`, and `period`.
- `layout` (string): Template key (`modern` or `corporate`).
- `level` (string): Experience level (`entry`, `mid`, `senior`).
- `track` (string): Specialty (`red`, `blue`, `grc`).

**Returns**
- `resume`: Normalized resume data object.
- `html`: Rendered HTML string.
- `score`: ATS score with breakdown and weaknesses.
- `suggestions`: Keyword improvement recommendations.

## `scoreResume(resume)`
Scores a resume against ATS-inspired heuristics.
- Returns `total`, `breakdown`, `weaknesses`, and `keywordCounts`.

## `strengthSuggestions(role, content)`
Provides missing and low-frequency keywords for a target role with a recommendation string.

## `clusterSkills(skills)`
Groups skills into `cloud`, `securityOps`, `governance`, `development`, `tooling`, and `other` buckets.

## `render(layout, data)`
Renders a template by name with a data object. Falls back to `modern` if the layout is not registered.

## `registerTemplate(name, path)`
Registers a template path that can be referenced by `render`.

## `exportHTML(html, outputPath)` / `exportMarkdown(markdown, outputPath)`
Writes HTML or Markdown (converted to HTML) to disk.
