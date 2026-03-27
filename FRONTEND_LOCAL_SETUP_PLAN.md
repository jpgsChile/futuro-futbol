# FRONTEND LOCAL SETUP PLAN — Futuro Fútbol

> Generado tras análisis completo del repositorio. **No se modificó ningún archivo del proyecto.**

---

## 1. Resumen Ejecutivo del Stack

### Framework y Librerías Principales

| Categoría | Tecnología | Versión |
|---|---|---|
| Framework web | **Next.js** (App Router) | ^14.2.5 |
| Lenguaje | TypeScript | ^5.4.5 |
| Biblioteca React | React + React DOM | ^18.2.0 |
| Conexión blockchain | **wagmi** | ^2.12.7 |
| Abstracción EVM | **viem** | ^2.10.5 |
| UI de wallet | **RainbowKit** | ^2.1.6 |
| Cache / async state | @tanstack/react-query | ^5.40.0 |
| Formularios | react-hook-form + zod + @hookform/resolvers | ^7 / ^3 |
| Estado global | zustand | ^4.5.2 |
| IPFS storage | web3.storage | ^4.5.5 |
| CSS | Vanilla CSS propio (`app/globals.css`) | - |
| Utilidades CSS | clsx | ^2.1.1 |
| Contratos/deploy | Hardhat + @nomicfoundation/hardhat-toolbox | ^2.22.6 |
| Contratos Solidity | @openzeppelin/contracts | ^5.0.2 |

### Red blockchain

- **Red:** Avalanche Fuji Testnet
- **chainId:** `43113`
- **RPC pública:** `https://api.avax-test.network/ext/bc/C/rpc`

### Wallets soportadas

- **Core Wallet** (extensión de navegador) vía conector `injected` de wagmi
- **Cualquier wallet EIP-1193** inyectada en window.ethereum (MetaMask, Rabby, etc.)
- **WalletConnect v2** (modal QR) — requiere `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`; se activa sólo si la variable existe

---

## 2. Mapa de Carpetas Relevantes

```
futuro-futbol/
│
├── app/                         ← FRONTEND - Next.js App Router
│   ├── layout.tsx               ← Raíz: carga Providers + Navbar
│   ├── providers.tsx            ← WagmiProvider + QueryClientProvider + RainbowKitProvider
│   ├── page.tsx                 ← Home page (/)
│   ├── globals.css              ← Sistema de diseño CSS vanilla (dark theme)
│   ├── entidades/               ← Rutas de gestión de entidades
│   │   ├── crear-liga/page.tsx
│   │   ├── crear-club/page.tsx
│   │   ├── registrar-jugador/page.tsx
│   │   └── unir-jugador-club/page.tsx
│   ├── partidos/                ← Rutas de partidos
│   │   ├── crear/page.tsx
│   │   ├── crear-ipfs/page.tsx
│   │   └── finalizar/page.tsx
│   ├── alineaciones/
│   │   ├── agregar/page.tsx
│   │   └── salida/page.tsx
│   ├── eventos/
│   │   ├── registrar/page.tsx
│   │   ├── registrar-ipfs/page.tsx
│   │   └── registrar-reputacion/page.tsx
│   ├── roles/
│   │   ├── asignar/page.tsx
│   │   └── verificar/page.tsx
│   ├── attestations/
│   │   ├── crear/page.tsx
│   │   └── elevar/page.tsx
│   └── lecturas/                ← Consultas de lectura on-chain
│       ├── liga/page.tsx
│       ├── club/page.tsx
│       ├── jugador/page.tsx
│       ├── partido/page.tsx
│       ├── alineacion/page.tsx
│       └── evento/page.tsx
│
├── components/                  ← FRONTEND - Componentes reutilizables
│   ├── navbar.tsx               ← Navegación principal con estado wallet
│   ├── Connect.tsx              ← Botones de conexión de wallet
│   ├── WalletStatus.tsx         ← Indicador de cuenta/red/nonce
│   ├── QuickChecks.tsx          ← Checks on-chain al cargar la home
│   ├── FormsBasics.tsx          ← Formularios: crear liga, club, jugador
│   ├── FormsGame.tsx            ← Formularios: partidos, alineaciones, eventos
│   ├── DetailList.tsx           ← Componente de detalle genérico
│   └── HybridTransaction.tsx    ← Gestor de transacciones híbridas
│
├── lib/                         ← FRONTEND - Helpers de integración
│   ├── wagmi.ts                 ← Configuración de wagmi (chains, connectors, transport)
│   ├── contracts.ts             ← Direcciones de contratos desplegados en Fuji
│   ├── ipfs.ts                  ← Helper para subir archivos a IPFS vía web3.storage
│   └── json.ts                  ← Utilidad JSON auxiliar
│
├── abi/                         ← FRONTEND - ABIs de contratos (TypeScript exports)
│   ├── FFRoles.ts               ← Roles y permisos
│   ├── FFLeague.ts              ← Ligas
│   ├── FFClub.ts                ← Clubes
│   ├── FFPlayer.ts              ← Jugadores
│   ├── FFGame.ts                ← Partidos
│   ├── FFEvent.ts               ← Eventos
│   └── FFViews.ts               ← Consultas de lectura (getters)
│
├── public/
│   └── futurofutbol_logo.jpeg   ← Logo usado en la home
│
│ ──── ZONA DE CONTRATOS (no tocar para trabajo frontend) ────
│
├── contracts/                   ← Solidity (.sol) — Solo para Hardhat
│   ├── ff-roles.sol
│   ├── ff-league.sol
│   ├── ff-club.sol
│   ├── ff-player.sol
│   ├── ff-game.sol
│   ├── ff-lineup.sol
│   ├── ff-event.sol
│   ├── ff-attest.sol
│   └── ff-views.sol
├── scripts/
│   └── deploy.ts                ← Script de deploy Hardhat a Fuji
├── hardhat.config.ts            ← Configuración de Hardhat (red fuji, compilador)
├── typechain-types/             ← Tipos autogenerados por Hardhat (no editar)
└── types/                       ← Tipos extra de TypeScript
```

### Frontera Frontend / Blockchain

| Zona | Archivos | Rol |
|---|---|---|
| **Frontend puro** | `app/**`, `components/**`, `lib/wagmi.ts`, `lib/ipfs.ts`, `lib/json.ts`, `abi/**`, `app/globals.css` | Trabajo diario del desarrollador frontend |
| **Interfaz blockchain** | `lib/contracts.ts` | Sólo cambiar si se redesplegan contratos |
| **Zona blockchain (no tocar)** | `contracts/**`, `scripts/**`, `hardhat.config.ts`, `typechain-types/**` | Pertenece al equipo smart contracts |

---

## 3. Cómo se Conecta el Frontend a la Blockchain

```
Usuario (navegador)
  │
  ├─ Core Wallet / MetaMask (window.ethereum)
  │
  └─ wagmi (lib/wagmi.ts)
        chains: [avalancheFuji]
        connectors: [injected, walletConnect?]
        transport: http()  ← usa RPC pública de Fuji por defecto
              │
              ▼
        viem PublicClient ──── useReadContract ──────► ABIs en abi/*.ts
        viem WalletClient ──── useWriteContract ─────► Addresses en lib/contracts.ts
              │                                                    │
              └── Avalanche Fuji Testnet (chainId 43113) ──────────┘
                        9 contratos desplegados
```

**Direcciones de contratos (lib/contracts.ts):**

```
FFRoles:  0x1bb15c7B7C9bbe05a7f6ba37cA5b6d0B39A31037
FFLeague: 0x663876829ad6387a6D799F28db6c99cbba8E4558
FFClub:   0xd23259925B88ac18b31eEDF73558328eBF09Ea34
FFPlayer: 0xb2Df59fE7d28C2E9a79304Eb39AF676982cdfd5f
FFGame:   0xA2f17848717987D645d499ae0FcF24a01d6b6924
FFLineup: 0x4CA106ceC7105BD0d1c1afA32E8F736448C2438f
FFEvent:  0xdECC134c5b566d12FEac287F37bB26d7efa5A98F
FFAttest: 0x61736b882bb3cD4810c1b3A7814C91Bd9537B2b2
FFViews:  0x59d822AD0b8618C3EddaE2aE928496ba25EA2E9E
```

> ⚠️ Estas addresses están hardcodeadas en `lib/contracts.ts`. Los contratos ya están desplegados en Fuji, no es necesario redeplegar para trabajar en el frontend.

---

## 4. Diagnóstico de Ejecución Local

### 4.1 Prerrequisitos

| Requisito | Detalles |
|---|---|
| **Node.js** | `>=18` (recomendado: Node 20 LTS) |
| **npm** | Incluido con Node. El repo usa `npm` en vercel.json |
| **Git** | Para clonar / gestionar el repositorio |
| **Wallet en navegador** | Core Wallet o MetaMask con red Fuji configurada |
| **AVAX de test** | Faucet: https://core.app/tools/testnet-faucet?token=c&subnet=c |

> Nota: el README menciona `pnpm`, pero `vercel.json` usa `npm install`. Para evitar conflictos de lockfile, usar **npm** localmente.

### 4.2 Variables de Entorno

Crear un archivo `.env.local` en la raíz (basado en `env.sample`):

```env
# REQUERIDA para que el frontend funcione sin errores en IPFS
NEXT_PUBLIC_WEB3STORAGE_TOKEN=TU_TOKEN_WEB3_STORAGE

# REQUERIDA para activar WalletConnect (si no la pones, se omite el conector)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=TU_PROJECT_ID

# OPCIONAL - ya tiene default en wagmi.ts
NEXT_PUBLIC_CHAIN_ID=43113

# SOLO para Hardhat (no necesaria para npm run dev)
AVALANCHE_FUJI_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc
PRIVATE_KEY=0xTU_CLAVE_PRIVADA_DE_TEST
```

**¿Cuáles son OBLIGATORIAS para levantar el frontend?**

| Variable | Obligatoria frontend | Efecto si falta |
|---|---|---|
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | ❌ Opcional | Solo se omite WalletConnect; injected (Core/MetaMask) sigue funcionando |
| `NEXT_PUBLIC_WEB3STORAGE_TOKEN` | ⚠️ Necesaria en runtime | `lib/ipfs.ts` lanza error si se intenta subir a IPFS sin token |
| `NEXT_PUBLIC_CHAIN_ID` | ❌ Opcional | Sólo referencia informativa |
| `AVALANCHE_FUJI_RPC_URL` | ❌ No (es para Hardhat) | No afecta `npm run dev` |
| `PRIVATE_KEY` | ❌ No (es para deploy) | No afecta `npm run dev` |

### 4.3 Posibles Errores Probables

| Error | Causa probable | Solución |
|---|---|---|
| `Module not found: pino-pretty` | Dependencia opcional de wagmi/viem | Ya aliasada a `false` en `next.config.mjs` |
| `Module not found: encoding` | Dependencia de web3.storage | Ya aliasada a `false` en `next.config.mjs` |
| `Module not found: lokijs` | Dependencia de WalletConnect | Ya aliasada a `false` en `next.config.mjs` |
| `Error: Falta NEXT_PUBLIC_WEB3STORAGE_TOKEN` | Subir archivo IPFS sin token | Agregar token en `.env.local` |
| `Cannot read properties of undefined (reading 'id')` | SSR con window.ethereum | Los componentes de wallet usan patrón `mounted` para evitarlo |
| Wallet no conecta en Fuji | Red mal configurada | Usar el botón "Cambiar a Fuji" en el navbar o configurar manualmente |
| `Not authorized` en transacción | Sin rol asignado en el contrato | Asignar rol via `/roles/asignar` con la cuenta admin |

---

## 5. Plan Paso a Paso para Ejecutar Localmente

### Paso 1 — Verificar Node.js

```powershell
node -v   # debe ser >= 18 (recomendado 20.x LTS)
npm -v    # debe ser >= 9
```

Si Node no está instalado o es < 18, descargar desde https://nodejs.org/

### Paso 2 — Instalar dependencias

```powershell
cd "C:\Users\galin\OneDrive\Documentos\futuro-futbol"
npm install
```

> El `package-lock.json` ya existe (~780KB), la instalación debería ser reproducible.

### Paso 3 — Crear `.env.local`

En la raíz del proyecto, crear el archivo `.env.local`:

```powershell
# En PowerShell:
Copy-Item env.sample .env.local
```

Luego editar `.env.local` con un editor de texto y completar:
- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` → obtener en https://cloud.walletconnect.com/ (cuenta gratuita)
- `NEXT_PUBLIC_WEB3STORAGE_TOKEN` → obtener en https://web3.storage/ (cuenta gratuita)

> Si no quieres usar IPFS ni WalletConnect en esta etapa, puedes dejar esas variables vacías o no ponerlas. El frontend arrancará igual; solo fallará al intentar subir archivos IPFS.

### Paso 4 — Arrancar el servidor de desarrollo

```powershell
npm run dev
```

Deberías ver:

```
▲ Next.js 14.x.x
- Local:        http://localhost:3000
- Ready in ...ms
```

### Paso 5 — Abrir en el navegador

Ir a: **http://localhost:3000**

Deberías ver la home con el logo, descripción, botones de conexión y el panel "Estado rápido".

---

## 6. Checklist de Validación

- [ ] `npm install` termina sin errores críticos
- [ ] `npm run dev` arranca en `localhost:3000`
- [ ] La home carga con el logo `/futurofutbol_logo.jpeg`
- [ ] El navbar muestra las secciones (Gestión de Entidades, Partidos, etc.)
- [ ] El componente QuickChecks muestra estado (aunque diga "Desconectado")
- [ ] Instalar Core Wallet o MetaMask en el navegador
- [ ] Conectar wallet con la red Fuji (chainId 43113)
- [ ] El pill de red en el navbar muestra "43113" en verde
- [ ] El balance de AVAX aparece en el navbar
- [ ] Navegar a `/entidades/crear-liga` y verificar que carga el formulario
- [ ] Navegar a `/roles/verificar` y verificar que carga
- [ ] Navegar a `/lecturas/liga` y verificar que carga
- [ ] Intentar una transacción de prueba (crear liga de test) y verificar que Core Wallet pide firma
- [ ] Verificar que `QuickChecks` muestra "Permiso para crear liga: No" (esperado si la cuenta no tiene rol)

---

## 7. Cómo Probar la Conexión Wallet y Flujo Básico

### Pre-condición
- Core Wallet (extensión Chrome/Firefox) instalada y desbloqueada
- Cuenta con algo de AVAX en Fuji (faucet: https://core.app/tools/testnet-faucet)

### Flujo mínimo de prueba

1. Ir a `http://localhost:3000`
2. Hacer click en **"Conectar Injected"** (o el botón que aparezca según la wallet detectada)
3. Aprobar en Core Wallet
4. El navbar debe mostrar la red en verde (43113) y el saldo AVAX
5. Ir a `/lecturas/liga` e ingresar ID `1` para ver si hay ligas creadas
6. Ir a `/entidades/crear-liga`, llenar el formulario y hacer submit
7. Core Wallet pedirá aprobar la transacción (requiere AVAX para gas)
8. Esperar confirmación (puede tardar 5-10 seg en Fuji)

> La primera transacción fallará si la cuenta no tiene rol LEAGUE_ROLE. Esto es esperado. Para asignarlo se usaría `/roles/asignar` desde la cuenta con DEFAULT_ADMIN_ROLE.

---

## 8. Riesgos y Dudas Abiertas

### ⚠️ Riesgos detectados

1. **`web3.storage` v4 puede estar deprecado.** La librería `web3.storage@4.5.5` usa la API legacy de Web3.Storage. El servicio cambió su modelo en 2023-2024. Los tokens del dashboard antiguo pueden no funcionar para subir. Verificar si el token funciona antes de depender de IPFS.

2. **No hay `tailwind.config` pero hay clases de Tailwind en `layout.tsx`.** El layout usa `min-h-screen bg-slate-50 mx-auto max-w-6xl px-4 py-6` que son clases Tailwind, pero **Tailwind no está instalado** en el proyecto. Esto puede causar que esos estilos no apliquen en desarrollo. Los estilos CSS custom en `globals.css` SÍ funcionan. Los estilos Tailwind del layout serán inoperantes salvo que se instale Tailwind.

   > Impacto: el body tendrá `bg-slate-50` (que no existe sin Tailwind) pero el fondo real vendrá de `globals.css` que define `background: #0b0f1a`. El contenido central puede no estar centrado correctamente en algunos casos.

3. **FFLineup no tiene ABI en `abi/`.** Existe `contracts/ff-lineup.sol` y `lib/contracts.ts` contiene `FFLineup`, pero no hay `abi/FFLineup.ts`. Si alguna página intenta importar ese ABI, romperá en compilación. Verificar si `/alineaciones/agregar` y `/alineaciones/salida` usan FFLineup.

4. **No existe `abi/FFAttest.ts`.** El contrato `FFAttest` tiene dirección en `lib/contracts.ts` pero no hay ABI en `abi/`. Si `/attestations/crear` lo importa, fallará.

5. **`FFViews` en lugar de `FFLineup` para alineaciones.** `FFViews.ts` tiene el método `getAlineacion`, lo que sugiere que las lecturas se hacen por FFViews. Pero las escrituras de alineación necesitarían FFLineup con ABI.

6. **El RPC de Fuji en `lib/wagmi.ts` usa `http()` sin URL.** Esto usará el RPC público por defecto de viem para avalancheFuji. Puede ser lento o tener rate limits. Si hay problemas de conexión, agregar la URL explícita.

### ❓ Dudas abiertas

- ¿Existen los `page.tsx` dentro de cada subdirectorio de rutas? (ej: `app/alineaciones/agregar/page.tsx`). No se verificó el contenido de todas las subcarpetas de rutas.
- ¿Los contratos en Fuji siguen activos? Las addresses en `lib/contracts.ts` son fijas pero si se redesplegaron, el frontend apuntará a contratos viejos.
- ¿Hay un `.gitignore` que excluya `abi/FFLineup.ts` y `abi/FFAttest.ts`? Si es así, puede que esos archivos no hayan sido comiteados pero existan localmente.

---

*Documento generado el 2026-03-27. Basado en análisis estático del repositorio sin ejecución del código.*
