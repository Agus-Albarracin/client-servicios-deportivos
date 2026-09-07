import { expect, test } from "@playwright/test";
import { ApiError, createBookingApi } from "../lib/api/client";

test("sends public JSON requests without credentials or caches", async () => {
  const original = globalThis.fetch;
  const calls: RequestInit[] = [];
  globalThis.fetch = async (_url, init) => {
    calls.push(init!);
    return Response.json({ id: "draft", sportId: "sport" }, { status: 201 });
  };
  try {
    const result = await createBookingApi("http://localhost:4000/api").create(
      "sport",
    );
    expect(result).toEqual({ id: "draft", sportId: "sport" });
    expect(calls[0]).toMatchObject({
      method: "POST",
      cache: "no-store",
      credentials: "omit",
      body: '{"sportId":"sport"}',
    });
    expect(calls[0].headers).not.toHaveProperty("X-API-Key");
  } finally {
    globalThis.fetch = original;
  }
});

test("handles validation arrays and non-JSON infrastructure failures", async () => {
  const original = globalThis.fetch;
  try {
    globalThis.fetch = async () =>
      Response.json(
        { message: ["Nombre requerido", "Teléfono inválido"] },
        { status: 400 },
      );
    await expect(
      createBookingApi("http://localhost/api").create("sport"),
    ).rejects.toThrow("Nombre requerido Teléfono inválido");
    globalThis.fetch = async () =>
      new Response("<html>Unavailable</html>", { status: 503 });
    await expect(
      createBookingApi("http://localhost/api").sports(),
    ).rejects.toMatchObject({ status: 503 });
    globalThis.fetch = async () => {
      throw new TypeError("network");
    };
    await expect(
      createBookingApi("http://localhost/api").sports(),
    ).rejects.toBeInstanceOf(ApiError);
  } finally {
    globalThis.fetch = original;
  }
});
