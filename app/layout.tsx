import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";
import { ReactNode } from "react";
import { Providers } from "./providers";
import Navbar from "@/components/navbar";

export const metadata = {
  title: "Futuro Fútbol | Gestión on-chain en Avalanche",
  description:
    "Plataforma Web3 para gestionar ligas, clubes, jugadores y partidos de fútbol con contratos inteligentes en Avalanche Fuji. Transparencia en tiempo real.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head>
        <title>Futuro Fútbol | Avalanche</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Gestión de ligas de fútbol on-chain en Avalanche Fuji con contratos inteligentes, wallets y evidencia IPFS."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="app-body">
        <Providers>
          <Navbar />
          <div className="page-wrapper">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
