"use client";
import { useEffect, useRef, useState } from "react";

/** Changed keys hide stale data immediately; aborted requests cannot replace it. */
export function useResource<T>(
  key: string | null,
  loader: (signal: AbortSignal) => Promise<T>,
) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{
    key: string;
    data?: T;
    error?: string;
  }>();
  const loadRef = useRef(loader);
  useEffect(() => {
    loadRef.current = loader;
  });
  const requestKey = key === null ? null : `${key}:${attempt}`;
  useEffect(() => {
    if (requestKey === null) return;
    const controller = new AbortController();
    loadRef.current(controller.signal).then(
      (data) => {
        if (!controller.signal.aborted) setResult({ key: requestKey, data });
      },
      (error: unknown) => {
        if (!controller.signal.aborted)
          setResult({
            key: requestKey,
            error:
              error instanceof Error
                ? error.message
                : "No pudimos cargar la información.",
          });
      },
    );
    return () => controller.abort();
  }, [requestKey]);
  const current = result?.key === requestKey ? result : undefined;
  return {
    data: current?.data,
    error: current?.error,
    loading: requestKey !== null && !current,
    retry: () => setAttempt((value) => value + 1),
  };
}
