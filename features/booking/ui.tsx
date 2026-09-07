import type { ButtonHTMLAttributes, ReactNode } from "react";
const variants = {
  primary: "border-accent bg-accent text-white hover:bg-accent-strong",
  secondary: "border-line bg-surface text-foreground hover:bg-background",
};
export const primaryLink =
  "inline-flex min-h-12 items-center justify-center rounded-lg bg-accent px-5 py-3 font-semibold text-white hover:bg-accent-strong";
export function Button({
  variant = "primary",
  ...props
}: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
  variant?: keyof typeof variants;
}) {
  return (
    <button
      {...props}
      className={`inline-flex min-h-12 items-center justify-center rounded-lg border px-5 py-3 font-semibold disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]}`}
    />
  );
}
export function Feedback({
  loading,
  error,
  retry,
  children,
}: {
  loading?: boolean;
  error?: string;
  retry: () => void;
  children: ReactNode;
}) {
  if (loading)
    return (
      <p role="status" className="py-8 text-muted">
        Cargando opciones…
      </p>
    );
  if (error)
    return (
      <div
        role="alert"
        className="space-y-3 rounded-lg border border-danger p-4"
      >
        <p>{error}</p>
        <Button type="button" variant="secondary" onClick={retry}>
          Volver a intentar
        </Button>
      </div>
    );
  return children;
}
export function Empty({ children }: { children: ReactNode }) {
  return (
    <p
      role="status"
      className="rounded-lg border border-dashed border-line p-5 text-muted"
    >
      {children}
    </p>
  );
}
export function Choice({
  name,
  value,
  checked,
  onChange,
  children,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  children: ReactNode;
}) {
  return (
    <label
      className={`flex min-h-16 cursor-pointer items-center gap-3 rounded-lg border p-4 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent ${checked ? "border-accent bg-accent-soft" : "border-line bg-surface hover:border-accent"}`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="size-5 shrink-0 accent-accent"
      />
      <span className="min-w-0 flex-1 wrap-break-word">{children}</span>
      {checked ? (
        <span className="text-sm font-medium text-accent">Elegido</span>
      ) : null}
    </label>
  );
}
export const inputClass =
  "min-h-12 w-full rounded-lg border border-line bg-surface px-3 py-2 text-base disabled:opacity-50";
