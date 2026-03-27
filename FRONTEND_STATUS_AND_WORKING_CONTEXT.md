# FRONTEND STATUS AND WORKING CONTEXT
## Futuro Fútbol — Avalanche Fuji

> Generado tras análisis exhaustivo del código real. Fecha: 2026-03-27.
> **Este documento es la fuente de verdad para todas las tareas de frontend.**

---

# 1. Objetivo del Frontend

**Futuro Fútbol** es una dApp web que permite gestionar ligas de fútbol amateur y semiprofesional sobre Avalanche Fuji Testnet. Los usuarios interactúan con contratos inteligentes ya desplegados en Fuji directamente desde el navegador usando su wallet.

Funciones principales expuestas en el frontend:
- Conectar y gestionar wallet (Core Wallet / MetaMask / WalletConnect)
- Crear y consultar ligas, clubes y jugadores on-chain
- Programar y cerrar partidos con metadata IPFS
- Agregar jugadores a alineaciones y registrar eventos de partido
- Asignar y verificar roles (LEAGUE_ROLE, CLUB_ROLE, REFEREE_ROLE, etc.)
- Crear attestations y elevar nivel de verificación
- Consultar todos los datos anteriores en tiempo real

---

# 2. Alcance de Mi Trabajo como Frontend

### ✅ Puedo tocar libremente
| Archivo / Carpeta | Descripción |
|---|---|
| `app/**/*.tsx` y `app/**/*.css` | Páginas, layouts, estilos |
| `components/**/*.tsx` | Componentes reutilizables |
| `app/globals.css` | Sistema de diseño CSS |
| `public/**` | Assets estáticos |

### ⚠️ Puedo tocar con precaución (reportar antes de cambiar)
| Archivo | Restricción |
|---|---|
| `lib/wagmi.ts` | Solo configuración de UI (RPC opcional, ssr flag). No cambiar chains ni connectors sin reportar. |
| `lib/ipfs.ts` | Lógica de upload. Solo tocar si hay un bug bloqueante. |
| `lib/contracts.ts` | Solo leer, NUNCA cambiar addresses sin autorización explícita. |
| `abi/*.ts` | Leer. Solo modificar si hay una rotura de compilación documentada. |

### 🚫 No tocar jamás
- `contracts/**` — Solidity
- `scripts/**` — Deploy scripts
- `hardhat.config.ts` — Config de Hardhat
- `typechain-types/**` — Tipos autogenerados

---

# 3. Stack Frontend Real

| Capa | Tecnología | Versión | Notas |
|---|---|---|---|
| Framework | Next.js App Router | ^14.2.5 | SSR habilitado (`ssr: true` en wagmi) |
| Lenguaje | TypeScript | ^5.4.5 | strict mode activo |
| Blockchain client | wagmi | ^2.12.7 | hooks de React para EVM |
| Low-level EVM | viem | ^2.10.5 | reemplaza ethers.js |
| Wallet UI | RainbowKit | ^2.1.6 | ConnectButton disponible pero infrautilizado |
| Cache / async | @tanstack/react-query | ^5.40.0 | Query client en providers.tsx |
| Forms | react-hook-form + zod | ^7.53 / ^3.23 | Solo usado en `crear-liga/page.tsx` |
| Estado global | zustand | ^4.5.2 | **Instalado pero no usado aún** |
| IPFS | web3.storage | ^4.5.5 | Legacy API v4, posible deprecación |
| Utilidades CSS | clsx | ^2.1.1 | Usado en navbar.tsx |
| CSS | Vanilla CSS custom | - | Definido en `globals.css` |
| Red | Avalanche Fuji | chainId 43113 | Único chain configurado |

### ⚠️ PROBLEMA CRÍTICO DE CSS
El proyecto **no tiene Tailwind instalado** pero casi todas las páginas usan clases Tailwind:
- `text-2xl`, `font-bold`, `text-sm`, `font-medium` → tipografía sin efecto
- `space-y-4` → espaciado sin efecto
- `text-red-500`, `text-slate-600`, `text-xs` → colores/tamaños sin efecto
- `block`, `flex` → display helpers sin efecto

Resultado: los títulos `<h1>` no tienen tamaño ni peso visual; los mensajes de error son invisibles (no se ven como rojos).

---

# 4. Mapa de Páginas

| Ruta | Archivo | Tipo | Contrato | Función |
|---|---|---|---|---|
| `/` | `app/page.tsx` | Read + Connect | FFRoles (vía QuickChecks) | Home con estado rápido |
| `/entidades/crear-liga` | `app/entidades/crear-liga/page.tsx` | Write | FFLeague | `createLeague(name, location, category)` |
| `/entidades/crear-club` | `app/entidades/crear-club/page.tsx` | Write | FFClub | `createClub(leagueId, name, fixedGK)` |
| `/entidades/registrar-jugador` | `app/entidades/registrar-jugador/page.tsx` | Write | FFPlayer | `registerPlayerFF(...)` — 9 parámetros |
| `/entidades/unir-jugador-club` | `app/entidades/unir-jugador-club/page.tsx` | Write | FFPlayer | `playerJoinClub(playerId, clubId)` |
| `/partidos/crear` | `app/partidos/crear/page.tsx` | Write | FFGame | `createGame(clubA, clubB, scheduledAt)` |
| `/partidos/crear-ipfs` | `app/partidos/crear-ipfs/page.tsx` | Write + IPFS | FFGame | `createGameFF(...)` + upload IPFS |
| `/partidos/finalizar` | `app/partidos/finalizar/page.tsx` | Write | FFGame | `closeGame(gameId)` |
| `/alineaciones/agregar` | `app/alineaciones/agregar/page.tsx` | Write | FFLineup | `addToLineup(game, club, player)` — ABI inline |
| `/alineaciones/salida` | `app/alineaciones/salida/page.tsx` | Write | FFLineup | `removeFromLineup(...)` — ABI inline |
| `/eventos/registrar` | `app/eventos/registrar/page.tsx` | Write | FFEvent | `registerEvent(game, club, player, type)` — ABI inline |
| `/eventos/registrar-ipfs` | `app/eventos/registrar-ipfs/page.tsx` | Write + IPFS | FFEvent | `registerEventFF(...)` + upload IPFS |
| `/eventos/registrar-reputacion` | `app/eventos/registrar-reputacion/page.tsx` | Write | FFEvent | Registrar evento con flags de reputación |
| `/roles/asignar` | `app/roles/asignar/page.tsx` | Read + Write | FFRoles | `assignRole(bytes32, address)` |
| `/roles/verificar` | `app/roles/verificar/page.tsx` | Read | FFRoles | `hasRole(bytes32, address)` — reactive |
| `/lecturas/liga` | `app/lecturas/liga/page.tsx` | Read | FFViews | `getLiga(id)` → DetailList |
| `/lecturas/club` | `app/lecturas/club/page.tsx` | Read | FFViews | `getClub(id)` → DetailList |
| `/lecturas/jugador` | `app/lecturas/jugador/page.tsx` | Read | FFViews | `getJugador(id)` → DetailList |
| `/lecturas/partido` | `app/lecturas/partido/page.tsx` | Read | FFViews | `getJuego(id)` → DetailList |
| `/lecturas/alineacion` | `app/lecturas/alineacion/page.tsx` | Read | FFViews | `getAlineacion(game, club)` → lista IDs |
| `/lecturas/evento` | `app/lecturas/evento/page.tsx` | Read | FFViews | `getEvento(id)` → DetailList |
| `/attestations/crear` | `app/attestations/crear/page.tsx` | **PLACEHOLDER** | — | Solo texto "implementación pendiente" |
| `/attestations/elevar` | `app/attestations/elevar/page.tsx` | **PLACEHOLDER** | — | Solo texto "implementación pendiente" |

---

# 5. Mapa de Componentes

| Archivo | Tipo | Usa wagmi | Usa ABI | Notas |
|---|---|---|---|---|
| `components/navbar.tsx` | Layout global | Sí | No | Dropdown nav, pill red/balance, switch chain |
| `components/Connect.tsx` | Widget wallet | Sí | No | Botones por conector + ConnectButton RainbowKit |
| `components/WalletStatus.tsx` | Debug card | Sí | No | Red, address, nonce. No integrado en ninguna página activa |
| `components/QuickChecks.tsx` | Status card | Sí | FFRoles | Checks de conexión, red, permisos. Usado en la home |
| `components/FormsBasics.tsx` | Formularios legacy | Sí | FFLeague, FFClub, FFPlayer | Formulario sin validación zod. Parece ser versión anterior a las páginas de entidades |
| `components/FormsGame.tsx` | Formularios legacy | Sí | FFGame, FFEvent | Mismo patrón que FormsBasics |
| `components/HybridTransaction.tsx` | Wrapper genérico | Sí | Any | Botón submit + error display. **Subutilizado** — solo 1 instancia de uso detectada |
| `components/DetailList.tsx` | Display de datos | No | No | Grid `dt/dd` para mostrar structs on-chain |

### Observación crítica
`FormsBasics.tsx` y `FormsGame.tsx` parecen ser **prototipos/versiones previas** de los formularios. No están referenciados por ninguna página actual (solo existirían en la home si se importan directamente). Las páginas de `app/entidades/` son la implementación actual.

---

# 6. Flujo Wallet / Red / Lectura / Escritura

### 6.1 Conexión de Wallet
```
Usuario abre la app
  → providers.tsx envuelve la app en WagmiProvider + QueryClientProvider + RainbowKitProvider
  → wagmiConfig (lib/wagmi.ts):
      - chains: [avalancheFuji]
      - connectors: [injected(shimDisconnect:true), walletConnect?(si NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID)]
      - transport: http() sin URL → usa RPC pública default de viem para Fuji
      - ssr: true, multiInjectedProviderDiscovery: true
  → Connect.tsx: mapea connectors[] → botón por cada uno + ConnectButton de RainbowKit
  → Estado visible en navbar: pill verde (red correcta) o naranja (red incorrecta)
```

### 6.2 Cambio de Red
```
navbar.tsx → botón "Cambiar a Fuji"
  → Si hay address: useSwitchChain({ chainId: avalancheFuji.id })
  → Si no hay address: window.ethereum.request({ wallet_switchEthereumChain, '0xa869' })
```

### 6.3 Lecturas On-Chain (Read)
```
Página /lecturas/* o QuickChecks o roles/verificar
  → useReadContract({
      address: CONTRACTS.XXX,
      abi: FFViewsAbi | FFRolesAbi,
      functionName: "getLiga" | "getClub" | ... | "hasRole",
      args: [BigInt(id)]
    })
  → data → DetailList o texto inline
```
No hay polling automático. Todas las lecturas son `refetch()` manual o reactivas al cambiar args.

### 6.4 Escrituras On-Chain (Write)
Patrón uniforme en TODAS las páginas de escritura:
```typescript
const { writeContract, data: hash, isPending, error } = useWriteContract();
const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

// En el submit:
writeContract({ address, abi, functionName, args });

// Estados del botón:
isPending  → "Firmando…"   (esperando firma en wallet)
isLoading  → "Enviando…"   (tx enviada, esperando confirmación)
isSuccess  → "Creada/OK"   (tx confirmada)
default    → texto normal
```

### 6.5 Subida a IPFS
Solo en dos páginas: `/partidos/crear-ipfs` y `/eventos/registrar-ipfs`
```
Usuario selecciona archivo o ingresa CID manualmente
  → ensureCid():
      si ya hay CID → usa el CID existente
      si hay file → uploadToIPFS(file) via lib/ipfs.ts → web3.storage v4 → ipfs://CID
  → writeContract con el CID como argumento
  → Estado adicional: uploading → "Subiendo…"
```

---

# 7. Integración Frontend ↔ Blockchain

### Mapa de dependencias por archivo

| Archivo | Usa lib/contracts.ts | Usa ABI | ABI importado desde |
|---|---|---|---|
| `QuickChecks.tsx` | FFRoles | FFRolesAbi | `@/abi/FFRoles` |
| `FormsBasics.tsx` | FFLeague, FFClub, FFPlayer | FFLeague, FFClub, FFPlayer Abi | `@/abi/FFLeague`, `@/abi/FFClub`, `@/abi/FFPlayer` |
| `FormsGame.tsx` | FFGame, FFEvent | FFGameAbi, FFEventAbi | `@/abi/FFGame`, `@/abi/FFEvent` |
| `entidades/crear-liga` | FFLeague | FFLeagueAbi | `@/abi/FFLeague` |
| `entidades/crear-club` | FFClub | FFClubAbi | `@/abi/FFClub` |
| `entidades/registrar-jugador` | FFPlayer | FFPlayerAbi | `@/abi/FFPlayer` |
| `entidades/unir-jugador-club` | FFPlayer | FFPlayerAbi | `@/abi/FFPlayer` |
| `partidos/crear` | FFGame | FFGameAbi | `@/abi/FFGame` |
| `partidos/crear-ipfs` | FFGame | FFGameAbi | `@/abi/FFGame` |
| `partidos/finalizar` | FFGame | FFGameAbi | `@/abi/FFGame` |
| `alineaciones/agregar` | FFLineup | FFLineupAbi | ⚠️ **Inline en el propio archivo** |
| `alineaciones/salida` | FFLineup | FFLineupAbi | ⚠️ **Inline en el propio archivo** |
| `eventos/registrar` | FFEvent | BasicAbi | ⚠️ **Inline en el propio archivo** |
| `eventos/registrar-ipfs` | FFEvent | FFEventAbi | `@/abi/FFEvent` |
| `eventos/registrar-reputacion` | FFEvent | (verificar) | verificar |
| `roles/asignar` | FFRoles | FFRolesAbi | `@/abi/FFRoles` |
| `roles/verificar` | FFRoles | FFRolesAbi | `@/abi/FFRoles` |
| `lecturas/*` | FFViews | FFViewsAbi | `@/abi/FFViews` |
| `attestations/*` | — | — | **PLACEHOLDER sin integración** |

### Partes sensibles — NO tocar al rediseñar
- El objeto de argumentos `args: [...]` dentro de `writeContract(...)` — orden y tipos importan
- Los imports `@/abi/XXX` y `@/lib/contracts` — no mover ni renombrar
- Los hooks `useWriteContract`, `useWaitForTransactionReceipt`, `useReadContract` — no eliminar ni renombrar variables
- El patrón `mounted` en Connect.tsx y navbar.tsx — evita hidration mismatch SSR

---

# 8. Estado Visual Actual

### 8.1 Layout General
```
<html>
  <body class="min-h-screen bg-slate-50">   ← bg-slate-50 DEAD (sin Tailwind)
    <Navbar />                               ← sticky top, dark glassmorphism
    <div class="mx-auto max-w-6xl px-4 py-6"> ← clases DEAD (sin Tailwind)
      {page content}
    </div>
  </body>
</html>
```
El contenedor del contenido usa `max-w-6xl px-4 py-6` que son clases Tailwind MUERTAS. El ancho real del contenido es 100% del viewport sin restricción ni padding lateral definidos por CSS propio.

### 8.2 Problemas de Layout Detectados

| Problema | Ubicación | Gravedad |
|---|---|---|
| Clases Tailwind sin efecto en TODAS las páginas | Todas las páginas de app/ | 🔴 Alta |
| `h1` sin tamaño visible — `text-2xl font-bold` inoperante | Todas las páginas write/read | 🔴 Alta |
| `text-red-500` para errores — color invisible (sin Tailwind) | Todos los formularios | 🔴 Alta |
| `space-y-4` sin efecto — los hijos no tienen gap | Todas las páginas | 🟡 Media |
| Contenedor global sin `max-width` ni padding definido en CSS propio | layout.tsx | 🟡 Media |
| `bg-slate-50` body (blanco Tailwind) vs fondo real `#0b0f1a` (darkmode CSS) | layout.tsx | 🟡 Media |
| `text-slate-600` en párrafos descriptivos — sin efecto | entidades/crear-liga | 🟡 Media |
| `block text-sm font-medium` en labels — sin efecto | TODOS los formularios | 🟡 Media |
| Inputs sin label visible para alineaciones (solo placeholder) | alineaciones/agregar | 🟡 Media |
| Formulario de jugador: indentación rota (return fuera del scope correcto) | registrar-jugador | 🟡 Media |
| Formulario unir-jugador-club y varios: return antes que estado declarado | múltiples páginas | 🟡 Media |

### 8.3 Tipografía
- No hay tipografía definida explícitamente más allá de `ui-sans-serif, system-ui`. Usa fuente del sistema.
- `h1` aparece visualmente igual que `p` porque `text-2xl font-bold` no tiene efecto.
- Labels de formulario sin diferenciación visual real.

### 8.4 Color y Contraste
El sistema de diseño CSS real (en `globals.css`) usa:
```
background: #0b0f1a  (body)
card:        #121725  border #1f273a
button:      #e84142  (rojo Avalanche)
text:        #e6e8ea
muted:       #aab1c5
input bg:    #0f1422  border #2a3450
```
Este sistema es coherente internamente. El problema es que los errores (`text-red-500`) se muestran como el color default del navegador, no como el rojo del sistema.

### 8.5 Botones — Inconsistencia
Hay 3 clases de botón en uso simultáneo:
- `.button` → rojo `#e84142`, usado en `FormsBasics.tsx`, `FormsGame.tsx`, `Connect.tsx`
- `.btn` → negro `#000`, background negro, texto blanco. Usado en TODAS las páginas del App Router
- `.btn-secondary` → gris oscuro `#1f273a`. Usado en navbar y links "Ver tx"

Un mismo flujo puede mostrar botones `.btn` (negro) en el formulario y `.btn-secondary` gris en el link. El rojo de Avalanche (`.button`) no aparece en ninguna página de escritura real.

---

# 9. Problemas UX Detectados

### 9.1 Estados de Transacción Incompletos

| Estado | ¿Implementado? | Detalle |
|---|---|---|
| Cargando / subiendo IPFS | ✅ Parcial | Solo en `/partidos/crear-ipfs` con "Subiendo…" |
| Firmando (pending signature) | ✅ Textual | "Firmando…" en el botón |
| Enviando tx (pending confirmation) | ✅ Textual | "Enviando…" en el botón |
| Éxito | ✅ Textual | Texto cambia en botón a "Creada/OK" |
| Error de contrato | ✅ Parcial | `String(error.message)` en texto rojo Tailwind (invisible) |
| Hash de tx con link a explorer | ✅ En algunas páginas | Solo en criar-club, registrar-jugador, partidos, alineaciones |
| Hash de tx ausente | ❌ Falta | En crear-liga no hay link al explorer tras éxito |
| Reset de formulario tras éxito | ❌ Solo en crear-liga | El resto no resetea el formulario |
| Wallet desconectada | ❌ No hay guard | Las páginas de escritura no muestran nada si no hay wallet |
| Red incorrecta | ❌ No hay guard | Las páginas no detectan si el usuario está en una red incorrecta |
| Sin permiso (not authorized) | ❌ No hay guard | El error solo aparece después de intentar la tx |
| Loading skeleton en lecturas | ❌ Ausente | Solo hay "Ingresa un ID y presiona Buscar" como placeholder |
| isFetching en lecturas | ❌ Sin indicador visual | `isFetching` está disponible pero no se muestra nada |

### 9.2 Problemas de Formularios
- Ningún formulario (excepto `crear-liga`) usa validación con react-hook-form + zod, aunque las librerías están instaladas.
- Campos de ID numérico (leagueId, gameId, etc.) aceptan texto libre sin validación.
- El campo "Unix time" en crear partido requiere conocimiento técnico del usuario (epoch timestamp).
- El campo "Tutor" en registrar-jugador aparece siempre, debería ocultarse si `isMinor = false`.
- Doble render del `.btn` en `crear-liga` (JSX incorrecto: botón sin `type="submit"` explícito causa comportamiento inesperado — falta el closing `</div>` en form-actions).

### 9.3 Problemas de Navegación
- La home (`/`) tiene dos variantes de clases en el mismo carrusel de links: `.btn` y `.button`.
- `Connect.tsx` muestra tanto botones de conector individuales como `<ConnectButton>` de RainbowKit al mismo tiempo, lo que duplica opciones visualmente.
- La sección de QuickChecks en la home hace lecturas RPC al contrato FFRoles en cada carga, incluso si el usuario no está conectado.

### 9.4 WalletStatus no integrado
`WalletStatus.tsx` es un componente diagnóstico que no aparece en ninguna página. Es útil para desarrollo pero debería ocultarse en producción o integrarse en una sección de debug.

### 9.5 Attestations — Páginas vacías
`/attestations/crear` y `/attestations/elevar` muestran exclusivamente "Placeholder: implementación pendiente." sin ningún formulario real. Están en el menú de navegación.

---

# 10. Riesgos al Tocar el Frontend

| Riesgo | Nivel | Descripción |
|---|---|---|
| Romper los hooks de wagmi | 🔴 Alto | Si se renombran variables de `writeContract`, `hash`, `isPending`, `isLoading`, `isSuccess` dentro de un componente, la lógica de estados deja de funcionar |
| Eliminar el patrón `mounted` | 🔴 Alto | `Connect.tsx` y `navbar.tsx` usan `useEffect(() => setMounted(true), [])` para evitar hydration mismatch SSR. Eliminarlo causa crash en producción |
| Cambiar `CONTRACTS` object | 🔴 Alto | Las addresses en `lib/contracts.ts` son las del deploy real en Fuji. Cualquier cambio rompe todas las interacciones |
| Mover o renombrar imports `@/abi/*` | 🔴 Alto | Muchas páginas importan directamente desde esa ruta. El alias está definido en `tsconfig.json` |
| Añadir Tailwind CSS | 🟡 Medio | Instalar Tailwind de repente activaría las clases ya escritas, lo cual haría visible muchos estilos "fantasma". Es una buena mejora pero debe hacerse conscientemente |
| Cambiar la estructura del objeto `args` en `writeContract` | 🔴 Alto | El orden de argumentos debe coincidir exactamente con la función del contrato |
| Eliminar `"use client"` directivas | 🔴 Alto | Los componentes con hooks wagmi y useState REQUIEREN "use client". Sin esa directiva fallan en SSR |
| Modificar `lib/wagmi.ts` chains | 🔴 Alto | Solo hay una chain configurada. Agregar/eliminar chains rompe el wagmiConfig global |
| Cambiar lógica de `ensureCid()` en páginas IPFS | 🟡 Medio | Es la lógica de upload antes de la tx. Si se rompe, la tx se envía con CID vacío |
| ABI inline en alineaciones/agregar y eventos/registrar | 🟡 Medio | Están definidas directamente en el archivo página. Si se extraen a `abi/`, hay que verificar que los nombres de función coincidan con el contrato desplegado |

---

# 11. Archivos Prioritarios para Intervenir

Ordenados de mayor a menor impacto sobre la experiencia visual:

### Prioridad 1 — Impacto Inmediato y Global
1. **`app/globals.css`** — Agregar las clases CSS faltantes equivalentes a las Tailwind usadas. Es el cambio con mayor ROI: activa visualmente todos los `h1`, labels, errores y espaciados en una sola edición.
2. **`app/layout.tsx`** — Reemplazar las clases Tailwind muertas del body y container por clases CSS propias. Añadir Google Fonts aquí.

### Prioridad 2 — Navegación y Shell
3. **`components/navbar.tsx`** — Refinamiento visual: logo, branding, responsive, estados de wallet más claros.
4. **`components/Connect.tsx`** — Eliminar la duplicación ConnectButton + botones individuales. Unificar UX de conexión.

### Prioridad 3 — Formularios de Escritura
5. **`app/entidades/crear-liga/page.tsx`** — Es la única página con react-hook-form. Usarla como template para estandarizar el resto.
6. **`app/entidades/registrar-jugador/page.tsx`** — Mayor complejidad de UI. Mostrar/ocultar tutor según isMinor.
7. **`app/partidos/crear-ipfs/page.tsx`** — Único flujo IPFS complejo. Necesita mejor feedback de estados.

### Prioridad 4 — Feedback de Transacciones
8. **Todos los formularios de escritura** — Añadir: guard de wallet desconectada, guard de red incorrecta, link al explorer consistente, reset tras éxito.

### Prioridad 5 — Páginas de Lectura
9. **`app/lecturas/*.tsx`** — Añadir skeleton de carga cuando `isFetching: true`.
10. **`components/DetailList.tsx`** — Mejorar la presentación visual del grid de datos.

---

# 12. Estrategia de Mejora por Fases

### Fase 1 — Fundación CSS (sin cambios funcionales, solo estilos)
**Objetivo:** Hacer visible lo que ya existe. Sin tocar lógica.
1. En `globals.css`, añadir clases equivalentes a las Tailwind usadas:
   - `.text-2xl` → `font-size: 1.5rem`
   - `.font-bold` → `font-weight: 700`
   - `.text-sm`, `.text-xs` → tamaños
   - `.font-medium` → peso
   - `.space-y-4` → gap entre hijos
   - `.text-red-500` → color de error
   - `.text-slate-600` → texto muted
   - `.block` → display block
2. Corregir `layout.tsx` para usar CSS propio en lugar de Tailwind.
3. Agregar Google Fonts (Inter o similar) en layout.tsx.

**Riesgo:** Ninguno. Solo CSS puro.

### Fase 2 — Sistema de Diseño (refactoring de estilos, sin lógica)
**Objetivo:** Establecer tokens visuales coherentes.
1. Unificar los 3 estilos de botón en 2: primario (rojo Avalanche) y secundario (gris).
2. Crear clases `.form-field`, `.form-label`, `.form-error` para reemplazar el mix actual.
3. Estandarizar espaciados con variables CSS (`--space-sm`, `--space-md`, etc.).
4. Mejorar visualmente `navbar.tsx` y `Connect.tsx`.

**Riesgo:** Bajo. Cambios solo en CSS y className strings.

### Fase 3 — Feedback de Transacciones (UX transaccional)
**Objetivo:** El usuario siempre sabe qué está pasando.
1. Crear componente reutilizable `<TxStatus>` que reciba `{isPending, isLoading, isSuccess, hash, error}`.
2. Añadir guard de wallet: si !isConnected → mostrar mensaje "Conecta tu wallet para continuar".
3. Añadir guard de red: si chainId !== 43113 → mostrar "Cambia a red Fuji".
4. Estandarizar reset de formulario tras `isSuccess`.
5. Mostrar link a testnet.snowtrace.io en TODOS los formularios (no solo en algunos).

**Riesgo:** Bajo-Medio. El guard de wallet es solo UI, no cambia la lógica wagmi.

### Fase 4 — Validación de Formularios (UX de entrada)
**Objetivo:** El usuario no puede enviar datos incorrectos.
1. Extender el patrón de `crear-liga/page.tsx` (react-hook-form + zod) a TODAS las páginas de escritura.
2. Convertir inputs de ID numérico a `type="number"` con `min="0"`.
3. Convertir Unix timestamp a `type="datetime-local"` y transformar a epoch en el submit.
4. Mostrar/ocultar campo tutor según `isMinor`.

**Riesgo:** Bajo. Solo afecta validación de UI, no los argumentos que se envían al contrato.

### Fase 5 — Páginas de Lectura y Datos (UX de información)
**Objetivo:** Lecturas claras, con estados de carga y errores.
1. Añadir skeletos de loading cuando `isFetching`.
2. Mejorar `DetailList.tsx` con formato de dirección (truncar 0x...) y valores booleanos.
3. Implementar páginas de attestations (actualmente placeholder).
4. Considerar navegación entre entidades (clic en ID de liga → va a /lecturas/liga?id=X).

**Riesgo:** Bajo para lecturas. La implementación de attestations requiere el ABI de FFAttest.

---

# 13. Reglas para Futuras Modificaciones

1. **No modificar contratos, scripts ni ABIs** salvo documentar la razón primero.
2. **No cambiar `lib/contracts.ts`** sin autorización explícita. Son las addresses reales en Fuji.
3. **Mantener el patrón** `useWriteContract + useWaitForTransactionReceipt` intacto. No reemplazar por lógica custom.
4. **Mantener `"use client"`** en todos los archivos que usen hooks (useAccount, useState, useEffect, etc.).
5. **Mantener el patrón `mounted`** en componentes que leen wallet state para evitar SSR hydration mismatch.
6. **No eliminar `ssr: true`** de `lib/wagmi.ts`.
7. **Al agregar Tailwind**, hacerlo conscientemente siendo consciente de que hay clases ya escritas que se activarán. Verificar que no sobreescriban el sistema CSS propio.
8. **Al crear componentes nuevos**, usar los tokens de color de `globals.css` (`#e84142`, `#121725`, `#e6e8ea`, etc.).
9. **Al agregar una página nueva**, seguir el patrón de `crear-liga/page.tsx` (react-hook-form + zod + useWriteContract).
10. **Los ABI inline** en `alineaciones/agregar`, `alineaciones/salida` y `eventos/registrar` son intencionales. No moverlos a `abi/` sin verificar que las signatures son idénticas a las del contrato.

---

# 14. Checklist de Validación Después de Cambios Visuales

### CSS / Estilos
- [ ] El fondo del body es `#0b0f1a` (dark) en todas las páginas
- [ ] Los `<h1>` tienen tamaño visible y diferenciación jerárquica respecto a `<p>`
- [ ] Los labels de formulario tienen estilo diferenciado del texto de inputs
- [ ] Los mensajes de error son visibles (color rojo, tamaño legible)
- [ ] Los botones de acción principal son rojos `#e84142`, los secundarios son grises
- [ ] Los estados del botón (Firmando/Enviando/Éxito) son legibles
- [ ] Las cards tienen borde y fondo oscuro diferenciado del body

### Wallet / Blockchain
- [ ] La navbar muestra correctamente el chainId y el saldo AVAX de la wallet conectada
- [ ] El pill de red es verde cuando chainId === 43113, naranja cuando no
- [ ] El botón "Cambiar a Fuji" solo aparece cuando la red es incorrecta
- [ ] Connect.tsx conecta correctamente con Core Wallet (injected)
- [ ] `isFetching` / `isPending` / `isLoading` se muestran adecuadamente en la UI
- [ ] El hash de transacción aparece con link a testnet.snowtrace.io tras submit exitoso
- [ ] QuickChecks en la home muestra estado correcto de roles

### Responsive
- [ ] El navbar cambia a versión móvil (☰ burger) en pantallas < 768px
- [ ] Los formularios son legibles en mobile (no overflow horizontal)
- [ ] El grid de home se apila verticalmente en mobile

### Compilación
- [ ] `npm run build` pasa sin errores TypeScript
- [ ] No hay errores de módulo faltante (`Cannot find module '@/abi/XXX'`)
- [ ] No hay errores de hidratación en la consola del navegador

---

*Documento basado en análisis estático completo de 23 páginas, 8 componentes, 4 helpers de lib y 7 archivos ABI. Fecha: 2026-03-27.*
