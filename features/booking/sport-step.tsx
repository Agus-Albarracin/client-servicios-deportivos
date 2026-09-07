import { useState } from "react";
import { bookingApi } from "@/lib/api/client";
import { useResource } from "./use-resource";
import { Button, Choice, Empty, Feedback } from "./ui";
export function SportStep({
  selected,
  onContinue,
}: {
  selected?: string;
  onContinue: (id: string) => void;
}) {
  const [sportId, setSportId] = useState(selected ?? "");
  const sports = useResource("sports", bookingApi.sports);
  const options = sports.data?.filter((sport) => sport.isActive) ?? [];
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (options.some((sport) => sport.id === sportId)) onContinue(sportId);
      }}
      className="space-y-6"
    >
      <p className="text-muted">
        Elegí qué querés jugar. Después buscamos una sede y un horario.
      </p>
      <Feedback {...sports}>
        {options.length ? (
          <fieldset>
            <legend className="mb-3 font-semibold">Deportes disponibles</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {options.map((sport) => (
                <Choice
                  key={sport.id}
                  name="sport"
                  value={sport.id}
                  checked={sportId === sport.id}
                  onChange={() => setSportId(sport.id)}
                >
                  <span aria-hidden="true" className="mr-3">
                    {sport.icon}
                  </span>
                  {sport.name}
                </Choice>
              ))}
            </div>
          </fieldset>
        ) : (
          <Empty>
            Todavía no hay deportes habilitados. Volvé a consultar más tarde.
          </Empty>
        )}
      </Feedback>
      <Button
        type="submit"
        disabled={!options.some((sport) => sport.id === sportId)}
      >
        Continuar
      </Button>
    </form>
  );
}
