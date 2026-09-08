# Glossary

| Term | Meaning |
| --- | --- |
| App Router | Routing system under `app/`, with nested layouts and Server Components. |
| RSC | React Server Component; it renders on the server and does not ship client JavaScript by default. |
| Server Action | A `'use server'` function invoked through a POST request. |
| Route Handler | A `route.ts` module exporting HTTP methods. |
| `'use cache'` | Opt-in persistent cache directive for cacheable server work. |
| PPR | Partial prerendering: a static shell with dynamic holes. |
| OpenNext | An adapter that runs Next.js on non-Vercel targets such as Cloudflare. |
| `workerd` | Cloudflare Workers runtime, distinct from Node.js. |
| `updateTag` | Cache invalidation for read-your-writes behavior. |
| `after()` | Next.js API for non-critical work after the response. |
| Client island | A deliberately small interactive Client Component subtree. |
