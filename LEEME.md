# Tarjeta de casamiento · Meli & Pablo (versión minimalista)

## Probar en tu compu
Dentro de la carpeta: `npx serve`  (o la extensión Live Server de VS Code).

## Personalizar
Todo se edita en **config.js** (fechas, lugares, WhatsApp, alias, tips, redes, historia).

## Base de datos
Las confirmaciones y canciones se guardan en una hoja de Google Sheets (carpeta google-sheets) o en Firebase (BASE-DE-DATOS.md).

## Fotos
Copialas en `img/`: `portada.jpg` y `foto1.jpg` … `foto5.jpg` (5 fotos fijas) (la portada se muestra en un arco que se abre al scrollear). Achicalas antes (~1600 px, <400 KB).

## Música (Perfect – Ed Sheeran)
Usa el video oficial de YouTube y suena si el invitado elige "Entrar con música".
Para usar un MP3 propio: ponelo en `music/perfect.mp3` y en config.js `archivo: "music/perfect.mp3"`.

## Invitación personalizada para cada invitado
Agregá `?i=Nombre` al link y aparece su nombre en la entrada y en la tarjeta (además se pre-completa en la confirmación). Ejemplo:
`https://TU-SITIO.vercel.app/?i=Lola%20y%20Tom%C3%A1s`
(los espacios se escriben %20).

## Subir a Vercel
vercel.com → Add New → Project → arrastrá la carpeta, o en la terminal `npx vercel --prod`.

## Vista previa en WhatsApp
Con el link final, agregá en `<head>` de index.html:
`<meta property="og:image" content="https://TU-SITIO.vercel.app/img/portada.jpg">`

## Importante al actualizar archivos
Copiá **toda** la carpeta (index.html, style.css, script.js, config.js **y la carpeta fonts**). Si mezclás archivos de versiones distintas, la tarjeta se ve rota o sin efectos.
Las fuentes (letra manuscrita de los nombres, etc.) ya vienen dentro de `fonts/`: no dependen de internet.
