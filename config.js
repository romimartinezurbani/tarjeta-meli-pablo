/* ============================================================
   ✏️  EDITÁ SOLO ESTE ARCHIVO PARA PERSONALIZAR LA TARJETA
   ============================================================ */
const CONFIG = {
  novia: "Meli",
  novio: "Pablo",

  frase: " El amor nunca deja de ser ",
  frase: "1 Corintios 13:8",

  // Fotos (copialas en /img con estos nombres, o cambialos). Si falta alguna se ve un recuadro.
  portada: "img/portada.jpg",
  fotos: ["img/foto1.jpg", "img/foto2.jpg", "img/foto3.jpg", "img/foto4.jpg", "img/foto5.jpg"],

  // Fechas en formato AAAA-MM-DDTHH:MM:SS-03:00  (la ceremonia es la que cuenta para el contador)
  ceremonia: {
    fecha: "2027-02-20T20:00:00-03:00",
    lugar: "Parroquia Sagrado Corazón de Jesús / Berrotarán",
    direccion: "Mons.Aquilino Argüello Ardiles 255, X5817 Berrotarán, Córdoba",
    mapa: "https://www.google.com/maps/place/Parroquia+Sagrado+Coraz%C3%B3n+de+Jes%C3%BAs/@-32.4535908,-64.3906568,603m/data=!3m2!1e3!4b1!4m6!3m5!1s0x95d280f4d195bebd:0x431ccd3df6c8f64f!8m2!3d-32.4535908!4d-64.3880819!16s%2Fg%2F11c5wx005x?entry=ttu&g_ep=EgoyMDI2MTExOC4xIKXMDSoASAFQAw%3D%3D"
  },
  fiesta: {
    fecha: "2027-02-20T22:00:00-03:00",
    lugar: "La Casona",
    direccion: "España , X5817 Berrotarán, Córdoba",
    mapa: "https://www.google.com/maps/place/La+casona+de+G%C3%BCemes/@-32.4399548,-64.3910079,17z/data=!3m1!4b1!4m6!3m5!1s0x95d2813a5f6a2217:0x1ef1bb3ca049d759!8m2!3d-32.4399548!4d-64.388433!16s%2Fg%2F11t333zsvt?entry=ttu&g_ep=EgoyMDI2MTExOC4xIKXMDSoASAFQAw%3D%3D"
  },

  // WhatsApp de contacto (código país + área + número, sin + ni espacios)
  whatsapp: "5493585623191",
  confirmarHasta: "13 de febrero",

  // DESTINO DE LAS RESPUESTAS (se usa el primero que esté completo):
  // 1) Google Sheets: pegá la URL de la aplicación web de Apps Script (ver carpeta google-sheets)
  hoja: { url: "" },
  // Si no está completo, se abre WhatsApp como respaldo.

  menuInfantil: "Habrá menú infantil para chicos hasta 10 años.",

  // Valor de la tarjeta (se muestra en la sección de confirmación). "" para ocultar
  valorTarjeta: "A confirmar",

  // Código de vestimenta: título y párrafos (los saltos de línea \n se respetan)
  vestimentaTitulo: "Un pedido",
  vestimentaTexto: [
    "Queremos que vengan siendo ustedes mismos.",
    "Que esta noche sea una celebración auténtica.\nElegí ese look que te represente.\nDisfrutá de nuestro momento a tu manera."
  ],

  // Regalo (si agregás alias: "..." y titular: "..." aparece también el botón para copiar el alias)
  regalo: {
    texto: "Que estén a nuestro lado en este día tan especial es el mejor regalo que podríamos recibir."
  },

  hashtag: "#MeliyPablo",
  redes: {
    instagramMeli: "https://www.instagram.com/meli_mfernandez/",
    instagramPablo: "https://www.instagram.com/pablo_boffadossi/",
    album: "" // link a álbum compartido (Google Fotos/Drive). "" para ocultar
  },

  // Música: "Perfect" de Ed Sheeran (video oficial de YouTube; suena sin mostrar nada en pantalla)
  musica: {
    youtubeId: "2Vv-BfVoq4g",
    archivo: "" // opcional: "music/perfect.mp3" si tenés el archivo (tiene prioridad)
  }
};
