import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";
import { ReactNode } from "react";
import { Providers } from "./providers";
import Navbar from "@/components/navbar";
import dynamic from "next/dynamic";

const MouseGlow = dynamic(() => import("@/components/MouseGlow"), { ssr: false });

export const metadata = {
  title: "LigaX | Gestión on-chain en Avalanche",
  description:
    "Plataforma Web3 para gestionar ligas, clubes, jugadores y partidos de fútbol con contratos inteligentes en Avalanche Fuji. Transparencia en tiempo real.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head>
        <title>LigaX | Avalanche</title>
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
        <MouseGlow />
        <Providers>
          <Navbar />
          <div className="page-wrapper">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
