---
name: optimise-seo
description: Build and audit technical SEO foundations for Next.js App Router applications, including metadata, canonicals, sitemaps, robots, structured data, redirects, indexing, and crawl accessibility. Use when improving SEO or diagnosing crawl, index, metadata, or structured-data issues.
---

# Optimise SEO

Make pages discoverable, correctly indexed, and technically truthful. Treat search engines and crawlers as clients with observable contracts.

## When to Apply

- Building or auditing metadata, canonicals, sitemaps, robots rules, redirects, or structured data.
- Diagnosing crawlability, indexing, soft 404s, social previews, or technical SEO regressions.
- Improving server-rendered semantic content and Core Web Vitals in a Next.js App Router application.

## Operating Contract

- MUST inspect the installed Next.js version and existing route behavior before changing SEO output.
- MUST make an explicit index decision for every route in scope.
- MUST use canonical URLs to consolidate duplicates and `noindex` only for pages that should not participate in search.
- MUST validate structured-data claims against visible rendered content.
- MUST verify redirects, headers, and crawler output against the served application—not only source code.
- SHOULD preserve existing visual design and hand off material UI changes to the appropriate UI skill.

## Reference Categories by Priority

| Reference | Priority | Use when |
| --- | --- | --- |
| [`nextjs-implementation`](references/nextjs-implementation.md) | `CRITICAL` | Implementing metadata, sitemap, robots, redirects, JSON-LD, or response behavior. |
| [`seo-checklist`](references/seo-checklist.md) | `CRITICAL` | Verifying a change or delivering an audit. |
| [`answer-engines`](references/answer-engines.md) | `HIGH` | Defining AI crawler policy, `llms.txt`, or citation accessibility. |
| [`internationalisation`](references/internationalisation.md) | `HIGH` | Serving more than one locale. |
| [`technical-hardening`](references/technical-hardening.md) | `HIGH` | Security headers, consent, maintenance behavior, or privacy controls. |

## Quick Reference

| Priority | Category | Goal |
| --- | --- | --- |
| `CRITICAL` | Crawl and index | Indexable routes are discoverable; non-indexable routes are explicit. |
| `CRITICAL` | Canonical and status | One preferred URL and an honest HTTP response. |
| `HIGH` | Metadata and schema | Accurate, route-specific information grounded in the DOM. |
| `HIGH` | Crawler policy | Intentional access for search, answer, and training crawlers. |
| `HIGH` | Technical resilience | Safe headers, consent, and correct maintenance behavior. |

## Workflow

1. Inventory routes in scope: URL, index intent, canonical target, status, and owner.
2. Resolve the relevant reference guidance before changing code.
3. Fix crawl and index foundations before metadata or enhancement work.
4. Implement route-specific metadata, semantic content, and structured data.
5. Verify served output and record evidence with the SEO checklist.

## Verification

- Sitemaps contain only canonical indexable URLs and robots points to them.
- Redirects have one intentional hop and missing routes return genuine 404 responses.
- Metadata, canonical URLs, and JSON-LD match the served page.
- Relevant crawler, header, and production checks pass or are reported as unavailable.