"use client";

import { ReactNode, useRef } from "react";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "@/lib/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";

/**
 * Providers — wraps wagmi + react-query + rainbowkit.
 *
 * OPTIMIZACIÓN: QueryClient se crea con useRef para garantizar
 * que sea la misma instancia en re-renders del componente.
 * El anti-patrón es `const queryClient = new QueryClient()` fuera
 * del componente (recreado en cada HMR) o dentro sin ref (recreado
 * en cada render). useRef garantiza instancia estable durante el
 * ciclo de vida del árbol.
 */
export function Providers({ children }: { children: ReactNode }) {
  const queryClientRef = useRef<QueryClient | null>(null);
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient({
      defaultOptions: {
        queries: {
          // Desactiva refetch automático al enfocar ventana — evita
          // rafagas de peticiones wagmi al volver de otra pestaña.
          refetchOnWindowFocus: false,
          // Las lecturas de contratos on-chain cambian poco;
          // 30s de staleTime evita llamadas duplicadas entre rutas.
          staleTime: 30_000,
          // Reintentos reducidos: contratos on-chain dan error determinista
          retry: 1,
        },
      },
    });
  }

  return (
    <QueryClientProvider client={queryClientRef.current}>
      <WagmiProvider config={wagmiConfig}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#5B8DEF",
            accentColorForeground: "white",
            borderRadius: "large",
            fontStack: "system",
            overlayBlur: "small",
          })}
        >
          {children}
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}
