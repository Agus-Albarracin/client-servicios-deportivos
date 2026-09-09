import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Solicitá tu turno | Turnero de polideportivos",
  description:
    "Elegí tu deporte, encontrá una sede y consultá horarios disponibles. Gestioná tu solicitud por WhatsApp con la sede.",
  // Transactional MVP: revisit indexing when a public landing and domain exist.
  robots: { index: false, follow: false },
  icons: { icon: { url: "/turnerop-client-icon.svg", type: "image/svg+xml" } },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-AR" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
