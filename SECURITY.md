# Security Policy

## Supported Versions

Security updates are provided for the latest version on the default branch.

## Reporting a Vulnerability

Please do **not** open public GitHub issues for security vulnerabilities.

Instead:

1. Use GitHub's private vulnerability reporting feature for this repository, if enabled.
2. If that is not available, contact the maintainers privately.
3. Include as much detail as possible:
   - A description of the issue
   - Steps to reproduce
   - Potential impact
   - Suggested mitigation, if known

You can expect:

- An acknowledgment within a reasonable timeframe
- Triage and investigation
- Coordination on disclosure if the issue is confirmed

## Secret Management

This project uses environment variables and Cloudflare/Wrangler secrets for sensitive values.

Do not commit:

- `.env`
- API keys
- encryption keys
- session secrets
- Cloudflare resource identifiers tied to production environments

If you believe a secret has been exposed, rotate it immediately before opening a report.
