import Link from 'next/link';
import Image from 'next/image';
import { BookingFlow } from "@/features/booking/booking-flow";

export default function Home() {
  return <>
    <a href="#solicitud" className="sr-only fixed top-3 left-3 z-10 rounded-lg bg-surface p-3 focus:not-sr-only">Ir a la solicitud</a>
    <header className="site-header"><div className="site-width header-content">
      <Link href="/" className="public-brand" aria-label="Turnero de polideportivos, inicio"><Image className="public-brand-icon" src="/turnerop-client-icon.svg" width={40} height={40} alt="" />turnero<span className="brand-caption">TU PRÓXIMO PARTIDO</span></Link>
      <a className="how-link" href="#como-funciona">Cómo funciona <span aria-hidden="true">↗</span></a>
    </div></header>
    <main className="site-width public-main">
      <section className="booking-hero" aria-labelledby="hero-title">
        <div className="hero-copy"><p className="hero-eyebrow"><span /> MENOS VUELTAS. MÁS DEPORTE.</p>
          <h1 id="hero-title">Tu próximo partido<br /><em>empieza acá.</em></h1>
          <p>Encontrá tu deporte, elegí dónde jugar y consultá los horarios. Nosotros te acompañamos hasta la confirmación.</p>
          <a className="hero-cta" href="#solicitud">Elegir mi turno <span aria-hidden="true">↗</span></a>
        </div>
        <div className="court-art" aria-hidden="true"><div className="court-lines"><i /><b /><span /></div><div className="court-ball" /><div className="court-caption">HACÉ LUGAR<br />PARA JUGAR.</div></div>
      </section>
      <div id="como-funciona" className="how-it-works" aria-label="Cómo funciona">
        <p><span>01</span><strong>Elegí tu deporte</strong><small>Buscá una sede cerca tuyo.</small></p>
        <p><span>02</span><strong>Encontrá un horario</strong><small>Consultá la lista o el calendario.</small></p>
        <p><span>03</span><strong>Esperá la confirmación</strong><small>La sede confirma y reserva tu turno.</small></p>
      </div>
      <div id="solicitud" className="booking-anchor"><BookingFlow /></div>
      <noscript><p>Activá JavaScript para consultar disponibilidad y preparar tu solicitud.</p></noscript>
    </main>
    <footer className="site-width public-footer"><strong>turnero.</strong><p>Horarios de Buenos Aires · La solicitud queda reservada cuando el administrador la confirma.</p><span>Nos vemos en la cancha.</span></footer>
  </>;
}
