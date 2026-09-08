---
name: tailwind-best-practices
description: Build, review, and refactor maintainable Tailwind CSS using semantic tokens, concise utility composition, stable variants, and project conventions. Use when writing Tailwind classes, component styling, Tailwind configuration, or responsive UI styles.
---

# Tailwind Best Practices

Use Tailwind as a shared visual language, not as a way to accumulate isolated utility strings.

## When to Apply

- Writing or reviewing Tailwind classes, components, themes, or configuration.
- Refactoring repeated utility patterns or responsive styles.
- Adding a shared component variant or extending a design token.

## Operating Contract

- MUST inspect existing tokens, components, and class-order tooling before adding new values.
- MUST prefer semantic tokens and established scales over arbitrary values.
- MUST keep shared design-system components constrained by explicit variants.
- MUST preserve the product’s existing Tailwind version and conventions.
- SHOULD keep class lists concise without hiding meaningful layout decisions.

## Reference Categories by Priority

| Priority | Category | Use for |
| --- | --- | --- |
| `CRITICAL` | Tokens and variants | Shared visual consistency and durable component APIs. |
| `HIGH` | Utility composition | Concise, readable, correctly ordered class lists. |
| `HIGH` | Responsive styling | Layout changes that preserve content hierarchy. |
| `MEDIUM` | Legacy cleanup | Incremental improvement of existing utility debt. |

## Quick Reference

- Reuse a semantic token before creating a raw value.
- Use `px-*`, `py-*`, and other shorthand when it preserves meaning.
- Prefer a component or an explicit variant over a shared component accepting arbitrary styling.
- Match the repository’s formatter order; do not generate diff noise by hand-sorting differently.
- Treat `@apply` as an exception for infrastructure, not a substitute for component composition.

## Workflow

1. Inspect the project’s Tailwind version, theme, tokens, component primitives, and formatter.
2. Identify whether the change belongs in a local utility list, a reusable component, or a token.
3. Implement with semantic utilities and the smallest stable variant surface.
4. Check narrow and wide layouts with realistic content.
5. Leave unrelated utility debt untouched unless the task includes cleanup.

## Verification

- No arbitrary value duplicates an available semantic token.
- Shared components expose intentional variants rather than unrestricted styling.
- Class order matches project tooling and responsive behavior remains usable.
- Relevant linting, visual checks, or unavailable checks are reported plainly.