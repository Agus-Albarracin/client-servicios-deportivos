# Server Actions

Use Server Actions for UI-originated mutations. Treat each action as a reachable POST endpoint:

1. Verify the authenticated session inside the action.
2. Load and authorize the actor against the target resource.
3. Parse all fields, including hidden ones, with the application's schema.
4. Mutate through a server-only data layer, ideally with transactional or idempotent protection where an external effect exists.
5. Return a minimal typed result suitable for the form.

`useActionState` is a good fit for form status and field-level errors. Do not expose internal records or provider errors in its returned state.

Server Actions have origin protections, but multi-origin deployments require an intentional `serverActions.allowedOrigins` configuration and a stable `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` across production instances when applicable. Use Route Handlers instead for webhooks, streaming, OAuth callbacks, cron, and public non-form callers.

After a successful mutation, choose `updateTag` for immediate read-your-writes or `revalidateTag` when eventual freshness is acceptable.
