// ============================================================
// CONFIGURACIÓN DEL PROYECTO — "El bautizo de Ainhoa"
// ============================================================
// Este es el ÚNICO archivo que necesitas editar para poner en
// marcha la galería. Todos los campos que debes rellenar están
// marcados con "REEMPLAZAR" o "PEGAR_AQUI".
//
// Instrucciones detalladas de cómo obtener cada valor en README.md
// ============================================================

const CONFIG = {

  // --------------------------------------------------------
  // GOOGLE DRIVE
  // --------------------------------------------------------
  // API key de Google Cloud, restringida a "Google Drive API"
  // y al dominio de GitHub Pages (ver README, sección 3-4).
  GOOGLE_API_KEY: "AIzaSyBTTJBQHTLQuEJMJKl4WH2Z9HX-aKYuU_8",

  // ID de la carpeta de Google Drive donde están las fotos.
  // Se obtiene de la URL de la carpeta:
  // https://drive.google.com/drive/folders/ESTO_ES_EL_ID
  GOOGLE_DRIVE_FOLDER_ID: "1nFEvjg03YQZEabua0HFlYC12xLGKup_q",

  // --------------------------------------------------------
  // DESCARGA DE TODAS LAS FOTOS
  // --------------------------------------------------------
  // Enlace de descarga directa de un ZIP con todas las fotos.
  // NO se genera en el navegador (ver README, sección 13 y
  // js/gallery.js para la explicación técnica de por qué).
  //
  // Cómo crearlo:
  // 1. Entra en la carpeta de Drive, selecciona todo (Ctrl/Cmd+A).
  // 2. Clic derecho → "Descargar". Drive comprime todo en un .zip.
  // 3. Sube ese .zip a Drive (a la carpeta, o a otra) y compártelo
  //    como "Cualquier persona con el enlace puede ver".
  // 4. Copia el ID del archivo zip desde su URL y pégalo abajo,
  //    o pega directamente la URL de descarga completa.
  DOWNLOAD_ALL_URL: "https://drive.google.com/file/d/1eP17EXAYKKB118dyhG4cPc9yyXcdXj_O/view?usp=sharing",

  // --------------------------------------------------------
  // TEXTOS DE LA GALERÍA
  // --------------------------------------------------------
  GALLERY_TITLE: "Ainhoa",
  GALLERY_SUBTITLE: "Un día para recordar para siempre",
  GALLERY_DATE: "9 de agosto de 2026",
  GALLERY_TIME: "12:30 pm",
  GALLERY_PLACE: "Iglesia San Jaime Apóstol, Villaverde",

  // --------------------------------------------------------
  // AJUSTES INTERNOS (normalmente no hace falta tocarlos)
  // --------------------------------------------------------
  // Tamaño de las miniaturas en la galería (px, lado mayor)
  THUMBNAIL_SIZE: 640,
  // Tamaño de la imagen ampliada en el visualizador (px, lado mayor)
  FULLSIZE_IMAGE_SIZE: 1800,
  // Cuántas imágenes precargar alrededor de la actual en el modal
  PRELOAD_NEIGHBORS: 1,
};
