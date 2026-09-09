# Route Handlers

Route Handlers export HTTP methods from `app/**/route.ts`. Use them where full HTTP control matters: webhooks, machine clients, uploads, streaming, OAuth callbacks, or scheduled triggers.

For webhooks, read the raw request body, verify the provider signature before treating fields as trusted, and process the event idempotently. Reconcile money and ownership against server-side records rather than trusting a payload's totals.

For streaming, authenticate, authorize, rate-limit, and validate input before opening an upstream model or SSE stream. Return a standards-compatible streaming response and preserve cancellation/error handling. Cookie-authenticated write handlers require an explicit CSRF strategy.

`after()` is appropriate for non-critical post-response work such as analytics. It is not a substitute for a synchronous transaction on payment, security, or fulfillment paths. Declare `edge` or `nodejs` runtime only after confirming the deployment target and dependencies support it.
