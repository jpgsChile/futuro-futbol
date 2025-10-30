# Futuro Fútbol (Avalanche + Core Wallet)

Proyecto EVM en Avalanche (Fuji) con contratos Solidity y frontend Next.js + Wagmi con soporte para Core Wallet.

## Requisitos
- Node.js 18+
- Core Wallet (extensión) o WalletConnect v2
- RPC Fuji (`https://api.avax-test.network/ext/bc/C/rpc`) o proveedor propio

## Instalación
```bash
pnpm i # o npm i / yarn
```

## Variables de entorno
Crea `.env` (ver `.env.example`):
```
AVALANCHE_FUJI_RPC_URL=
PRIVATE_KEY=
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
```

## Scripts
```bash
# Desarrollo web
npm run dev

# Compilación contratos
npm run compile

# Despliegue a Fuji
npm run deploy:fuji
```

## Estructura
- `contracts/` contratos Solidity
- `scripts/` scripts de despliegue
- `app/` App Router Next.js
- `components/` UI y conexión de wallet
- `abi/` ABIs para el frontend (placeholder, actualizar tras compilar)
- `public/` assets

## Red
- Fuji (chainId 43113)

## Nota
Este repo toma inspiración de `handicap-futbol` (Stacks) y la adapta a Avalanche (EVM/solidity).
