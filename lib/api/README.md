# Cliente público de la API

`contracts.ts` refleja los modelos públicos y la respuesta de WhatsApp de NestJS.
`client.ts` centraliza las URLs, JSON, errores, cancelación y timeout de 15 segundos.
Todas las solicitudes usan `no-store` y omiten credenciales. No utiliza claves de gestión.

Configurar `NEXT_PUBLIC_API_BASE_URL` en `.env.local` antes de iniciar o compilar.
El valor por defecto es `http://localhost:4000/api`. Debe ser la URL pública del
backend accesible desde el navegador; no una dirección interna de la base de datos.
El backend debe permitir el origen exacto del frontend en `CORS_ORIGINS`.

Las operaciones escriben un borrador por POST/PATCH y generan la vista previa
mediante POST. Reemplazar el borrador con la respuesta completa de cada PATCH:
los campos ausentes pueden haber sido invalidados por el servidor.

Pruebas de transporte: `npm test -- tests/api.spec.ts --project=desktop`.
No contactan servicios externos ni requieren base de datos.

Calendario: calendarSettings() consulta la preferencia global y calendarMonth() los días disponibles. Son lecturas públicas sin credenciales ni caché. slots() consulta /scheduling/day y devuelve horarios AVAILABLE y RESERVED; solo los primeros se pueden seleccionar. El mes incluye reservedCount. Los cierres y la confirmación se validan en NestJS.
