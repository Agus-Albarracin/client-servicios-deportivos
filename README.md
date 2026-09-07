# Frontend del turnero de polideportivos

Interfaz Next.js para solicitar turnos por WhatsApp. Implementa el recorrido:

1. Elegir deporte activo.
2. Completar nombre, apellido y teléfono internacional.
3. Elegir zona y sede compatible.
4. Revisar la ficha, dirección y enlace a Google Maps.
5. Consultar fecha y elegir un horario disponible.
6. Preparar el resumen, verificarlo y abrir WhatsApp.

La reserva queda pendiente de confirmación por la sede. La aplicación no envía
mensajes automáticamente ni bloquea turnos.

## Desarrollo

```powershell
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Abrir `http://localhost:3000`. El navegador consulta `NEXT_PUBLIC_API_BASE_URL`
(por defecto `http://localhost:4000/api`). Iniciar NestJS y preparar sus catálogos
según `../server/README.md`; sin API se muestra un error con reintento y sin
catálogos se muestra el estado vacío. No hay datos ficticios en la aplicación.
Para probar desde un teléfono real, usar una URL de API accesible desde ese
aparato y permitir el origen del frontend en `CORS_ORIGINS` del backend.
Las variables `NEXT_PUBLIC_*` se incorporan al build: no incluir secretos.

## Estructura y decisiones

- `app/`: página y layout de servidor, metadatos y tokens visuales mínimos.
- `features/booking/`: un componente por paso, primitivas accesibles y consultas cancelables.
- `lib/api/`: contratos y transporte público, sin imports del backend.
- `tests/`: pruebas de transporte y navegador con respuestas HTTP controladas.

La navegación guarda antes de avanzar y permite volver a pasos anteriores. Los
campos de contacto viven en el componente del flujo, por lo que no se pierden al
retroceder ni ante un error. El borrador y su UUID se mantienen solo en memoria de
la pestaña: recargar o cerrar la página inicia otro flujo; no hay recuperación
persistente en esta versión. No se incluyen UUIDs en URLs de la página o analítica.

Zona y sede se guardan juntas al continuar; fecha y turno también. Las consultas
previas no modifican el borrador. Cada PATCH reemplaza por completo el estado
persistido local para reflejar las invalidaciones del servidor. Las mutaciones
se bloquean mientras una está pendiente y las lecturas cancelan respuestas viejas.

El último paso prepara el resumen a pedido y ofrece un enlace explícito a WhatsApp
para evitar bloqueadores de ventanas emergentes. Cambiar de paso, ocultar la pestaña
o dejar pasar un minuto exige preparar de nuevo el enlace; la disponibilidad final
siempre la confirma la sede. Abrir el enlace no demuestra envío del mensaje.

Diseño primero móvil, con opciones en dos columnas desde `sm` y navegación lateral
desde `lg`. Tipografía del sistema, controles de al menos 48 px, foco visible,
campos etiquetados, errores asociados y texto plano. Los íconos de deportes vienen
del catálogo y son decorativos junto al nombre. No se cargan fuentes ni imágenes externas.
Tailwind escanea únicamente `app/` y `features/`, no los ejemplos de las skills.

La única ruta del MVP, `/`, devuelve HTML en español y usa `noindex, nofollow` por
ser un flujo transaccional inicial. No se inventan dominio canónico, sitemap ni
marcado estructurado; revisar indexación al definir la página pública y el dominio.

## Verificación

```powershell
npm run lint
npm run build
npx playwright install chromium
npm test -- --workers=3
```

Playwright inicia Next.js si el puerto 3000 está libre. Usar un servidor de este
proyecto con la configuración de API predeterminada, o detenerlo antes de probar.
Las pruebas interceptan la API con fixtures exclusivos de prueba; no verifican una
base MySQL real. Cubren el recorrido en móvil, tablet y escritorio, validación,
errores, cambios de selección, turnos bloqueados y metadatos. Las capturas quedan
en `test-results/` y los traces se conservan si una prueba falla.

Para validación operativa, repetir el recorrido con el backend y catálogos reales:
revisar dirección, horarios, contacto y destino de WhatsApp antes de enviar.
