# Frontend del turnero

Leer primero [el contexto raíz](../AGENTS.md) y [el contrato de integración](../docs/integracion.md). Este archivo agrega instrucciones propias de `client/`.

- Stack instalado: Next.js 16.3.4, React 19, TypeScript y Tailwind CSS 4. Entrada actual: `app/page.tsx`; estructura global: `app/layout.tsx` y `app/globals.css`.
- El flujo público de seis pasos está implementado, con vistas de lista y calendario y horarios reservados no seleccionables.
- Mantener las pantallas separadas del transporte HTTP. Al crear módulos, agrupar el flujo en `features/booking/` y centralizar transporte y contratos en `lib/api/`; estas carpetas contienen la implementación actual.
- Consumir contratos públicos del backend; no importar código NestJS, repositorios ni credenciales de gestión.
- Implementar los seis pasos, navegación hacia atrás, formularios accesibles, diseño adaptable y estados de carga, vacío, error y guardado.
- Tras un PATCH, reemplazar el borrador persistido con la respuesta completa. No preservar IDs que el backend haya invalidado.
- No cachear borradores ni enlaces de WhatsApp; no exponer IDs secretos en logs o analítica.
- Antes de escribir código Next.js, leer las guías locales pertinentes indicadas en el bloque siguiente.

Comandos desde `client/`: `npm run dev`, `npm run lint`, `npm run build` y `npm test` (Playwright en móvil, tablet y escritorio). Los fixtures no prueban conectividad con la base real.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## CRÍTICO: proponer ítems antes de implementar

Preferencia explícita del usuario: antes de modificar código o documentación de
una tarea, presentar ítems listos para GitHub Projects con objetivo, repositorios,
criterios de aceptación, dependencias, rama y avances previstos. Una funcionalidad
puede tener varios commits. Reutilizar ítems existentes; si el trabajo ya se hizo,
identificar la propuesta como retrospectiva.

Aplicar `atomic-commits` y `git-workflow-and-versioning`, especialmente su referencia
`references/project-items.md`. Las skills están instaladas en
`C:/Users/Agust/.codex/skills/`; server y client también tienen una copia local de
`atomic-commits` en `.agents/skills/`. La propuesta no requiere una confirmación
adicional para continuar con trabajo autorizado. Publicar o modificar ítems en
GitHub requiere autorización vigente y un destino identificado.

Crear cada rama independiente desde `main` actualizada antes de editar; usar el mismo nombre en
los repositorios afectados y declarar la base real. Al terminar, relacionar los
ítems con los commits, las validaciones y los pendientes.
