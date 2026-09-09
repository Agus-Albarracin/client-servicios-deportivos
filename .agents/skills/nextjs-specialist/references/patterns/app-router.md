# App Router

Layouts persist through navigation; pages are route leaves; route groups organize without changing the URL. Use dynamic segments as untrusted input and await then validate asynchronous `params` or `searchParams` before querying.

```tsx
type Props = { params: Promise<{ id: string }> };

export default async function Page({ params }: Props) {
  const { id } = await params;
  const input = IdSchema.safeParse(id);
  if (!input.success) notFound();
  return <OrderView order={await getOrder(input.data)} />;
}
```

Keep pages server-first and compose client islands beneath them. Use `redirect()` and `notFound()` in server code rather than representing navigation failures as successful content. Use parallel and intercepting routes only when their independent loading and navigation behavior are understood.

`proxy.ts` can make fast request-time redirects or coarse checks. It is not the final authorization layer and must not hold database-heavy business logic. Verify runtime limits before using it in a Workers deployment.
