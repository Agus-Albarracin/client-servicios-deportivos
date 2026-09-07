import { BookingFlow } from "@/features/booking/booking-flow";

export default function Home() {
  return (
    <>
      <a
        href="#solicitud"
        className="sr-only fixed top-3 left-3 z-10 rounded-lg bg-surface p-3 focus:not-sr-only"
      >
        Ir a la solicitud
      </a>
      <header className="border-b border-line bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6">
          <p className="text-lg font-semibold">Turnero de polideportivos</p>
        </div>
      </header>
      <main
        id="solicitud"
        className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10"
      >
        <div className="mb-8 max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Encontrá tu próximo turno
          </h1>
          <p className="mt-3 text-muted">
            Elegí deporte, sede y horario. Coordiná la reserva con la sede por
            WhatsApp.
          </p>
        </div>
        <BookingFlow />
        <noscript>
          <p className="mt-5">
            Para consultar disponibilidad y preparar tu solicitud, activá
            JavaScript en tu navegador.
          </p>
        </noscript>
      </main>
      <footer className="mx-auto w-full max-w-6xl px-4 py-6 text-sm text-muted sm:px-6">
        La disponibilidad puede cambiar. La reserva queda confirmada cuando la
        sede te lo indique.
      </footer>
    </>
  );
}
