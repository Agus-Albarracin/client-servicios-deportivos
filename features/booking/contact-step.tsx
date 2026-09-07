import { useState } from "react";
import type { Contact } from "@/lib/api/contracts";
import { Button, inputClass } from "./ui";
const fields = [
  { name: "renterFirstName", label: "Nombre", autoComplete: "given-name" },
  { name: "renterLastName", label: "Apellido", autoComplete: "family-name" },
  { name: "renterPhone", label: "Teléfono", autoComplete: "tel" },
] as const;
export function ContactStep({
  contact,
  onChange,
  onContinue,
}: {
  contact: Contact;
  onChange: (contact: Contact) => void;
  onContinue: (contact: Contact) => void;
}) {
  const [errors, setErrors] = useState<Partial<Contact>>({});
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const clean = {
      renterFirstName: contact.renterFirstName.trim(),
      renterLastName: contact.renterLastName.trim(),
      renterPhone: contact.renterPhone.trim(),
    };
    const next: Partial<Contact> = {};
    for (const name of ["renterFirstName", "renterLastName"] as const) {
      if (
        !clean[name] ||
        clean[name].length > 80 ||
        /[<>\p{Cc}]/u.test(clean[name])
      )
        next[name] =
          "Ingresá entre 1 y 80 caracteres, sin HTML ni caracteres de control.";
    }
    if (!/^\+[1-9]\d{7,14}$/.test(clean.renterPhone))
      next.renterPhone =
        "Usá + y el código de país, sin espacios. Por ejemplo: +5491123456789.";
    setErrors(next);
    if (Object.keys(next).length) {
      event.currentTarget
        .querySelector<HTMLInputElement>(`[name="${Object.keys(next)[0]}"]`)
        ?.focus();
      return;
    }
    onChange(clean);
    onContinue(clean);
  }
  return (
    <form noValidate onSubmit={submit} className="space-y-6">
      <p className="text-muted">
        Estos datos se incluirán en el mensaje para que la sede pueda
        contactarte.
      </p>
      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map(({ name, label, autoComplete }) => (
          <div
            key={name}
            className={name === "renterPhone" ? "sm:col-span-2" : ""}
          >
            <label htmlFor={name} className="mb-2 block font-medium">
              {label}
            </label>
            <input
              id={name}
              name={name}
              value={contact[name]}
              onChange={(event) => {
                onChange({ ...contact, [name]: event.target.value });
                setErrors((previous) => ({ ...previous, [name]: undefined }));
              }}
              type={name === "renterPhone" ? "tel" : "text"}
              autoComplete={autoComplete}
              required
              maxLength={name === "renterPhone" ? 32 : 80}
              aria-invalid={Boolean(errors[name])}
              aria-describedby={
                errors[name]
                  ? `${name}-error`
                  : name === "renterPhone"
                    ? "phone-help"
                    : undefined
              }
              className={inputClass}
            />
            {name === "renterPhone" ? (
              <p id="phone-help" className="mt-2 text-sm text-muted">
                Incluí el código de país. Argentina: +54. Ejemplo:
                +5491123456789.
              </p>
            ) : null}
            {errors[name] ? (
              <p id={`${name}-error`} className="mt-2 text-sm text-danger">
                {errors[name]}
              </p>
            ) : null}
          </div>
        ))}
      </div>
      <Button type="submit">Guardar y continuar</Button>
    </form>
  );
}
