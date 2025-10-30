import { http, createConfig } from "wagmi";
import { avalancheFuji } from "viem/chains";
import { injected, walletConnect } from "wagmi/connectors";

// Core Wallet via injected connector

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

export const wagmiConfig = createConfig({
  chains: [avalancheFuji],
  transports: {
    [avalancheFuji.id]: http()
  },
  connectors: [
    injected({ shimDisconnect: true }),
    ...(projectId ? [walletConnect({ projectId, showQrModal: true })] : [])
  ],
  ssr: true,
  autoConnect: true
});
