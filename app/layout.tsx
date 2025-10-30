import "@rainbow-me/rainbowkit/styles.css";
import "./globals.css";
import { ReactNode } from "react";
import { Providers } from "./providers";
import Navbar from "@/components/navbar";

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="es">
			<head>
				<title>Futuro Fútbol</title>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</head>
			<body className="min-h-screen bg-slate-50">
				<Providers>
					<Navbar />
					<div className="mx-auto max-w-6xl px-4 py-6">{children}</div>
				</Providers>
			</body>
		</html>
	);
}
