---
name: nextjs-specialist
description: Build, review, and refactor Next.js 16 App Router applications using React Server Components, Server Actions, Cache Components, Route Handlers, and OpenNext. Use for Next.js routes, rendering, mutations, caching, endpoints, or deployment; not generic React outside Next.js.
---

# Next.js Specialist

Build, review, and refactor production Next.js App Router applications. Start from the project's installed versions, deployment target, and conventions; do not introduce a second data layer, UI system, or hosting platform without a user request.

## When to Apply

- Building or reviewing Next.js App Router routes, layouts, mutations, caching, endpoints, or deployment.
- Deciding Server/Client Component boundaries, rendering behavior, or Next.js-specific security and consistency concerns.

## Operating Contract

- The server is authoritative: authenticate, authorize, validate, and recompute sensitive values from server-side sources.
- Prefer Server Components. Keep `'use client'` at the smallest interactive leaf and pass only serializable props across that boundary.
- Treat Server Actions as public POST endpoints. Use Route Handlers for webhooks, uploads, streaming, scheduled callers, and external HTTP contracts.
- Decide caching explicitly. Never cache personalized, permission-sensitive, inventory, price, cart, or checkout state without a documented consistency design.
- Keep secrets and privileged data access behind `import 'server-only'`; fail closed when an auth, signature, or safety check is absent.
- Inspect the relevant code path before changing it, verify both sides of each contract, and run the repository's required checks.

## Reference Categories by Priority

Read only the reference that matches the task:

- Routing, layouts, dynamic segments, parallel routes, or `proxy.ts`: [app router](references/patterns/app-router.md)
- Server/Client boundaries, serialization, Suspense, or server-only modules: [server components](references/patterns/server-components.md)
- Forms, `useActionState`, Server Actions, or cache updates after mutation: [server actions](references/patterns/server-actions.md)
- `'use cache'`, tags, `updateTag`, `revalidateTag`, PPR, or freshness: [caching](references/patterns/use-cache.md)
- Webhooks, streaming, `after()`, CSRF, or runtime selection: [route handlers](references/patterns/route-handlers.md)
- OpenNext, Cloudflare Workers, bindings, or production-like preview: [Workers deployment](references/patterns/deployment-workers.md)
- Failure modes and unsafe shortcuts: [anti-patterns](references/anti-patterns.md)
- Terminology and official documentation: [glossary](references/glossary.md) and [official links](references/official-docs-links.md)

## Quick Reference

| Priority | Category | Use for |
| --- | --- | --- |
| `CRITICAL` | Server authority and boundaries | Authentication, authorization, serialization, and privileged data. |
| `CRITICAL` | Caching and mutation safety | Personalized or consistency-sensitive application state. |
| `HIGH` | App Router and Route Handlers | Routes, layouts, external contracts, and runtime behavior. |
| `HIGH` | Deployment | OpenNext, Workers, and production-like verification. |

## Workflow

1. Inspect installed versions, target runtime, and the relevant route or component boundary.
2. Read the focused guidance matching the task before changing code.
3. Implement the smallest safe Next.js-specific change.
4. Run repository checks and verify both sides of the affected contract.

## Handoffs

Use `vercel-react-best-practices` for React or Next.js performance work, `tailwind-best-practices` for Tailwind edits, and `optimise-seo` for metadata, indexing, structured data, or sitemaps. This skill owns their Next.js-specific integration.

## Verification

- Server-only access, authorization, cache behavior, and serialization boundaries are explicit.
- Relevant repository checks pass, or unavailable checks are reported plainly.
