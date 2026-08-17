// ============================================================
// drive.js — Comunicación con la API de Google Drive
// ============================================================
// Responsabilidad exclusiva: pedir la lista de fotos de la
// carpeta compartida y transformarla en un formato simple que
// el resto de la app pueda usar, sin saber nada de la API de
// Google. Si mañana cambias de proveedor de almacenamiento,
// solo este archivo debería cambiar.
//
// IMPORTANTE SOBRE LA API KEY (leer también el README):
// Esta clave viaja en el JavaScript que se descarga al navegador
// de cualquier visitante, así que NO es un secreto: cualquiera
// puede verla con "Inspeccionar elemento". Lo que la protege de
// un uso abusivo es la RESTRICCIÓN que configures en Google
// Cloud (por API y por dominio/referrer), no su ocultación.
// La clave sirve solo para autorizar llamadas a la API de Drive;
// NO controla qué fotos son visibles. Eso lo decide el permiso
// de "compartir" que le des a la carpeta en Drive.
// ============================================================

const Drive = (() => {

  const API_BASE = "https://www.googleapis.com/drive/v3/files";

  /**
   * Convierte un thumbnailLink de la API (que llega con un tamaño
   * pequeño fijo, ej. "=s220") en una URL para el tamaño que
   * necesitemos. Es más fiable que "uc?export=view" para mostrar
   * imágenes en <img>, porque no está sujeto a las cuotas/avisos
   * de virus-scan de las descargas directas de archivos grandes.
   */
  function resizeThumbnail(thumbnailLink, size) {
    if (!thumbnailLink) return null;
    return thumbnailLink.replace(/=s\d+$/, `=s${size}`);
  }

  /**
   * Pide todas las imágenes de la carpeta configurada.
   * Devuelve un array de objetos simplificados:
   * { id, name, gridUrl, fullUrl, createdTime }
   */
  async function fetchGalleryImages() {
    const { GOOGLE_API_KEY, GOOGLE_DRIVE_FOLDER_ID, THUMBNAIL_SIZE, FULLSIZE_IMAGE_SIZE } = CONFIG;

    if (!GOOGLE_API_KEY || GOOGLE_API_KEY.includes("PEGAR_AQUI")) {
      throw new Error("CONFIG_MISSING: falta configurar GOOGLE_API_KEY en js/config.js");
    }
    if (!GOOGLE_DRIVE_FOLDER_ID || GOOGLE_DRIVE_FOLDER_ID.includes("PEGAR_AQUI")) {
      throw new Error("CONFIG_MISSING: falta configurar GOOGLE_DRIVE_FOLDER_ID en js/config.js");
    }

    const files = await listAllFiles(GOOGLE_API_KEY, GOOGLE_DRIVE_FOLDER_ID);

    return files
      .filter((f) => f.mimeType && f.mimeType.startsWith("image/"))
      .map((f) => ({
        id: f.id,
        name: f.name,
        createdTime: f.createdTime,
        width: f.imageMediaMetadata?.width || null,
        height: f.imageMediaMetadata?.height || null,
        gridUrl: resizeThumbnail(f.thumbnailLink, THUMBNAIL_SIZE),
        fullUrl: resizeThumbnail(f.thumbnailLink, FULLSIZE_IMAGE_SIZE),
      }))
      // Orden cronológico por fecha de subida a Drive (ver README §18
      // sobre por qué esta es la señal de orden más fiable disponible)
      .sort((a, b) => new Date(a.createdTime) - new Date(b.createdTime));
  }

  /**
   * La API de Drive pagina los resultados (por defecto ~100 por
   * página). Esta función va acumulando páginas hasta traer todos
   * los archivos de la carpeta.
   */
  async function listAllFiles(apiKey, folderId) {
    let files = [];
    let pageToken = null;

    do {
      const params = new URLSearchParams({
        q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
        fields: "nextPageToken, files(id,name,mimeType,thumbnailLink,createdTime,imageMediaMetadata)",
        pageSize: "1000",
        key: apiKey,
      });
      if (pageToken) params.set("pageToken", pageToken);

      const response = await fetch(`${API_BASE}?${params.toString()}`);

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(
          `DRIVE_API_ERROR (${response.status}): ${body?.error?.message || "No se pudo contactar con Google Drive."}`
        );
      }

      const data = await response.json();
      files = files.concat(data.files || []);
      pageToken = data.nextPageToken || null;
    } while (pageToken);

    return files;
  }

  return { fetchGalleryImages };
})();
