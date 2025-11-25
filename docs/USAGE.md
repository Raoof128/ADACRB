# Usage Guide

## Generating a Resume
1. Install dependencies: `npm install`
2. Run the generator: `npm start`
3. Open `output/resume.html` to view the modern template output.

## Selecting a Template
- Modern (default): `npm start`
- Corporate: `RESUME_LAYOUT=corporate npm start`
- Custom: place a file in `src/templates`, then register it via `registerTemplate('custom', '/absolute/path/to/template.html')` before calling `render`.

## Customizing Content
Pass structured data into `generateResume`:
```javascript
await generateResume({
  name: "Alex Candidate",
  headline: "Security Engineer",
  targetRole: "Purple Team Engineer",
  skills: ["MITRE ATT&CK", "Azure", "Detection Engineering", "KQL"],
  experience: [
    {
      role: "Detection Engineer",
      company: "Example Corp",
      period: "2023 - Present",
      achievements: [
        "Built KQL analytics improving lateral movement detection by 18%",
        "Automated enrichment to reduce investigation time by 22%",
      ],
    },
  ],
});
```
- For a quick start, copy and adapt `examples/resume.sample.json` before invoking the generator.

## Exporting
- HTML (default): `exportHTML(html, './output/resume.html')`
- Markdown: `exportMarkdown(markdown, './output/resume.html')`

## Testing & Linting
- Run tests: `npm test`
- Run lint: `npm run lint`
