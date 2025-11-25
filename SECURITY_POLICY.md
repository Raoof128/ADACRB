# Security Policy

## Reporting a Vulnerability
Please report security issues via the repository issue tracker with the label `security`. Provide a description, impact, and steps to reproduce. Do not include sensitive data. Maintainers will acknowledge within 2 business days and provide a remediation timeline after triage.

## Supported Versions
The `work` branch is actively maintained. Security fixes will be applied there and cherry-picked as needed.

## Hardening Guidelines
- Avoid storing personal identifiers or confidential data.
- Ensure templates remain ATS-compatible and free from tracking pixels or external assets.
- Prefer dependency-free or minimal-dependency implementations; review any new dependency for security posture.
- Validate and sanitize any user-supplied text via `TextCleaner` to prevent injection in templates.
