# Anti-patterns

## Security and truth

- A Server Action without in-action authentication and authorization.
- Taking an actor, tenant, price, total, or permission from form data as proof.
- Importing a service client, database connection, or secret-bearing module into a Client Component.
- Returning raw database records or provider errors from a mutation.
- Cookie-authenticated Route Handler writes without an explicit CSRF posture.

## Caching and rendering

- Assuming `fetch` has an implicit persistent cache in current Next.js.
- Adding `'use cache'` to money, permissions, private state, cart, or checkout data.
- Using `revalidateTag` where the current user must immediately see their own mutation; choose `updateTag` when read-your-writes is required.
- Making a page a Client Component to fetch data that is available during server rendering.
- Leaving independent slow server slices without a deliberate Suspense or loading boundary.

## Boundaries and deployment

- Using a Server Action for a webhook, third-party callback, SSE, or public machine API.
- Performing heavy database authorization in `proxy.ts`; it is only an early routing aid.
- Running payment finality in `after()`; commit critical work before responding.
- Deploying Workers behavior after only `next dev` testing.
- Exposing credentials through `NEXT_PUBLIC_*`, or importing Node-only code in a Worker path without compatibility verification.

## AI and agents

- Calling a model before rate limits, authorization, or input-safety gates.
- Rendering model/tool payloads without schema validation at the render boundary.
- Loading every reference for a narrow task instead of the relevant pattern.
