# Base de datos (Firebase · Firestore) — paso a paso

Las confirmaciones y canciones se guardan en tu Firestore, así no se pierde nada.

## 1. Proyecto y base de datos
1. https://console.firebase.google.com → usá tu proyecto existente o **Agregar proyecto** (podés desactivar Analytics).
2. Menú **Compilación → Firestore Database → Crear base de datos**. Elegí ubicación `southamerica-east1` (São Paulo) y modo **producción**.
   (Si ya tenés Firestore en ese proyecto, no hace falta crear otra: se crean solas las colecciones `rsvps` y `canciones`.)

## 2. Reglas de seguridad
1. Firestore Database → pestaña **Reglas**.
2. Borrá lo que haya, pegá todo el contenido de `firestore.rules` y tocá **Publicar**.
   Con esto la web solo puede agregar datos válidos; nadie puede leer, editar ni borrar desde afuera.

## 3. Conectar la tarjeta (los 2 valores a reemplazar)
1. ⚙️ **Configuración del proyecto → General → Tus apps**. Si no hay una app web, tocá **</>** y registrala (sin hosting).
2. Copiá `apiKey` y `projectId` del bloque `firebaseConfig` y pegalos en `config.js`:
   ```js
   firebase: { projectId: "boda-meli-pablo", apiKey: "AIza..." },
   ```
   La `apiKey` de Firebase es pública por diseño; lo que protege tus datos son las reglas del paso 2.

## 4. Ver y exportar las respuestas
- **Ver:** Firestore Database → Datos → colecciones `rsvps` y `canciones`.
- **Exportar a Excel:** usá la carpeta `exportar-respuestas` (instrucciones en su LEEME). Genera `rsvps.csv` y `canciones.csv` y muestra los totales de adultos, menores y menús infantiles.
  ⚠️ Esa carpeta tiene tu clave privada: **no la subas a Vercel ni a GitHub**.

## Probar
Abrí la tarjeta, confirmá con un nombre de prueba y mirá que aparezca en Firestore → Datos → `rsvps`. Borrá las pruebas desde ahí.

## Si falla
- Con `projectId` o `apiKey` vacíos, la tarjeta usa WhatsApp como respaldo.
- Si da error al guardar: revisá que publicaste las reglas y que pegaste bien los dos valores. En el navegador (F12 → Network) el error de Firestore indica el motivo.
- Opcional: en Google Cloud Console → Credenciales, restringí la apiKey a tu dominio de Vercel.
