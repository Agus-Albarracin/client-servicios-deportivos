# OpenNext and Workers deployment

Treat `next dev` and production Workers as different runtimes. Before shipping Worker-specific code, use the adapter's production-like build and preview commands, then test the affected flow there.

For Cloudflare/OpenNext deployments, maintain an explicit `compatibility_date`, enable only the compatibility flags the adapter requires, and verify the currently installed adapter's security advisories and support matrix. Do not hardcode a version floor in this skill: use current official release guidance for the dependency actually present.

Confirm Worker support for Node APIs, image optimization, PPR, middleware/proxy behavior, and bindings before adopting them. Keep build-time and runtime environment variables correctly configured; `NEXT_PUBLIC_*` is browser-visible, while secrets must stay server-side. Do not create an additional service merely to mirror logic already owned by the application or its authoritative backend.
