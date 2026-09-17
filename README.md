# Invitación de boda de Alei & Scarlett

Sitio de boda en español, optimizado para celular, con invitaciones privadas por
grupo, pases nominativos y confirmaciones administradas desde Google Sheets.

## Vista local

Requisitos: Node.js 20.19 o posterior.

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`. Sin credenciales de Google el sitio ofrece una
invitación de muestra en:

```text
http://localhost:3000/invitacion/demo-alei-scarlett-2026
```

El RSVP de muestra se valida, pero no se guarda.

## Personalizar la boda

Edita [`src/content/wedding.ts`](src/content/wedding.ts). Ahí se encuentran:

- nombres, fecha y ubicación;
- ceremonia, recepción e itinerario;
- vestimenta y detalles de la celebración;
- mesas de regalos, preguntas frecuentes y WhatsApp.

Las fotografías de Scarlett y Alei están optimizadas en `public/photos/`. Para
regenerarlas desde el ZIP original sin modificarlo:

```bash
python scripts/prepare_wedding_photos.py "ruta/a/la-galeria.zip"
```

La selección y las posiciones de cada fotografía se encuentran en
[`src/app/globals.css`](src/app/globals.css).

## Configurar Google Sheets

1. Crea una hoja y agrega dos pestañas: `Invitaciones` y `Confirmaciones`.
2. En `Invitaciones`, usa estas columnas desde A hasta G:

```text
token | groupName | greeting | guestsJson | maxPasses | active | expiresAt | civil
```

3. En `Confirmaciones`, usa estas columnas desde A hasta I:

```text
token | guestId | guestName | attending | dietary | phone | message | submittedAt | groupName
```

4. En Google Cloud, habilita **Google Sheets API** y crea una cuenta de
   servicio.
5. Comparte la hoja con el correo de la cuenta de servicio como editor.
6. Copia `.env.example` a `.env.local` y llena:

```text
GOOGLE_SHEETS_ID
GOOGLE_SERVICE_ACCOUNT_EMAIL
GOOGLE_PRIVATE_KEY
INVITATION_BASE_URL
```

La llave privada debe conservar los saltos de línea como `\n`. Las credenciales
solo se usan en el servidor y nunca se envían al navegador.

La columna `civil` debe contener `CIVIL` para mostrar ceremonia y llegada temprana.
Un valor vacío oculta ambos eventos y la tarjeta de ceremonia.

Sin credenciales de Sheets, `INVITATIONS_JSON` permite cargar una copia privada
de las invitaciones en el servidor (array del tipo `Invitation`, con `civil`
booleano). Esta copia requiere actualizar la variable y desplegar de nuevo cuando
cambie la lista. En este modo las confirmaciones reales devuelven un error explícito
y no se guardan; solo la invitación de demostración admite respuestas simuladas.

## Generar invitaciones

1. Copia `data/invitations.example.json` como `data/invitations.json`.
2. Agrega un grupo por familia o invitación.
3. Ejecuta:

```bash
npm run generate:invitations
```

El archivo `data/invitations.generated.csv` incluye tokens aleatorios, JSON de
invitados, enlaces privados y mensajes listos para WhatsApp. Importa las
columnas A–G en la pestaña `Invitaciones`. Las columnas H–I son solo para
distribución y no necesita importarlas.

Para indicar rutas distintas:

```bash
npm run generate:invitations -- data/entrada.json data/salida.csv
```

Cada token tiene 192 bits aleatorios. No uses nombres, teléfonos ni números
consecutivos como token.

## Comportamiento del RSVP

- El servidor comprueba que el token esté activo y no haya vencido.
- Solo acepta las personas nominadas en esa invitación.
- Nunca permite confirmar más asistentes que pases asignados.
- Un segundo envío actualiza las filas existentes en lugar de duplicarlas.
- Las respuestas anteriores se cargan para que el invitado pueda corregirlas.

## Calidad y despliegue

```bash
npm run lint
npm test
npm run build
```

Para desplegar en Vercel, importa el repositorio, configura las mismas variables
de entorno y publica. Después cambia `INVITATION_BASE_URL` al dominio final y
vuelve a generar los enlaces antes de enviarlos.

El sitio deshabilita indexación, no incluye nombres en metadatos sociales y
ofrece soporte para teclado, contraste legible y movimiento reducido.
