# Server Components

Choose the boundary by capability: browser APIs, hooks, or event handlers require a Client Component; otherwise retain a Server Component. Push `'use client'` to the smallest subtree.

Only serializable values cross server-to-client boundaries. Pass IDs and display data, never database connections, service clients, functions, or privileged objects. Fetch sensitive data on the server and guard data-access modules with `import 'server-only'`.

Server Components can await data directly. Isolate optional or slow work behind Suspense so it does not delay unrelated content. Validate any model or tool payload with the application's schema at the render boundary; model output is untrusted input.

Use React state-preservation features only when an observed navigation or interaction need justifies their added lifecycle complexity.
