# Technical Hardening

Security and privacy controls must not break crawlability, social previews, or valid route responses. Apply headers narrowly and verify them against the paths they affect.

Use consent-aware analytics for jurisdictions that require it. Return `503` with `Retry-After` during planned maintenance; do not serve a maintenance page as a durable 200 or 404. Test Content Security Policy changes against JSON-LD, image routes, and third-party resources before deployment.