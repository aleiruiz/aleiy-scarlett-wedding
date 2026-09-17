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

1. Usa una pestaña llamada `Sheet1`. Las filas 1 y 2 son para título y
   encabezados; las invitaciones empiezan en la fila 3, una familia por fila.
2. Configura estas columnas; las demás se conservan sin cambios:

| Columna | Contenido |
| --- | --- |
| A | Nombre de la familia o grupo |
| B | Número de pases |
| C | Nombres completos separados por ` - ` dentro de la misma celda |
| G | WhatsApp (se actualiza al responder) |
| K | Resumen automático: Sí, No o Parcial |
| L | Total de asistentes confirmados |
| M | `CIVIL` si incluye ceremonia civil; vacío en otro caso |
| N | Token privado único, de 16 a 200 caracteres |
| O | Enlace: `https://tu-dominio.com/invitacion/TOKEN` |
| P | Respuesta JSON automática; no editar |
| Q | Resumen automático por nombre: Confirmado o No asistirá |

3. En C escribe hasta 20 nombres distintos separados por ` - `, por ejemplo
   `Nancy Ortega - Jorge Muñoz`. No necesitas escribir JSON.
   Los pases en B limitan cuántas personas pueden confirmar asistencia.
   Si faltan nombres para completar los pases, el sitio agrega `Invitado 1`,
   `Invitado 2`, etc. Por ejemplo, `Nancy Ortega` con 2 pases muestra a Nancy
   y a `Invitado 1`. Para desactivar una invitación, elimina su fila.

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

La columna M debe contener `CIVIL` para mostrar ceremonia y llegada temprana.
Un valor vacío oculta ambos eventos y la tarjeta de ceremonia.

Cada invitación privada muestra los estados guardados junto a los nombres.
Los cambios de nombres en Sheets aparecen al recargar la página. Reordenarlos
conserva las respuestas; agregar o renombrar una persona deja su estado pendiente.
J y Q son resúmenes: modificarlos manualmente no sustituye las respuestas en P.
Las filas antiguas sin O ni P siguen leyendo Sí/No de J; otros valores se
consideran pendientes. Cada familia solo ve los datos de su enlace privado.

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

El archivo `data/invitations.generated.csv` incluye las columnas A–Q y tokens
aleatorios. Importa sus encabezados en la fila 2 de `Sheet1` y sus datos desde
la fila 3. No sobrescribas invitaciones que ya repartiste: regenerar crea enlaces
nuevos. Para agregar personas a un grupo existente, edita C directamente y
sepáralas con ` - `.

Para indicar rutas distintas:

```bash
npm run generate:invitations -- data/entrada.json data/salida.csv
```

Cada token tiene 192 bits aleatorios. No uses nombres, teléfonos ni números
consecutivos como token.

## Comportamiento del RSVP

- El servidor comprueba que el token exista en la hoja.
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
