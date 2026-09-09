# Cache Components and data freshness

Current Next.js caching is opt-in. Use `'use cache'` for data that is safely shared and can be stale, such as public catalog content, static configuration, or non-personal CMS output. Do not add it to financial, private, authorization, inventory, cart, or checkout reads without a demonstrated server-side consistency model.

Tag cached resources by the thing they represent. `revalidateTag` is stale-while-revalidate; `updateTag` gives read-your-writes after a Server Action; `refresh()` refreshes uncached dynamic slices. Use the narrowest tag and invalidation that reflects the mutation.

`React.cache` deduplicates work within a request. `'use cache'` persists according to the configured Next.js cache model; do not conflate their scope. Suspense can combine a cacheable shell with dynamic holes. Treat PPR as platform-dependent and confirm its support before enabling it.
