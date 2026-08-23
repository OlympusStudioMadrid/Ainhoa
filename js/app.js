// ============================================================
// app.js — Punto de entrada. Orquesta el resto de módulos.
// ============================================================

(function initApp() {
  const loadingEl = document.getElementById("loading-state");
  const errorEl = document.getElementById("error-state");
  const retryBtn = document.getElementById("retry-btn");
  const galleryEl = document.getElementById("gallery-grid");
  const downloadAllBtn = document.getElementById("download-all-btn");

  document.title = `${CONFIG.GALLERY_TITLE} · Recuerdos del bautizo`;
  document.querySelectorAll("[data-gallery-eyebrow]").forEach((n) => (n.textContent = CONFIG.GALLERY_EYEBROW));
  document.querySelectorAll("[data-gallery-title]").forEach((n) => (n.textContent = CONFIG.GALLERY_TITLE));
  document.querySelectorAll("[data-gallery-subtitle]").forEach((n) => (n.textContent = CONFIG.GALLERY_SUBTITLE));
  document.querySelectorAll("[data-gallery-date]").forEach((n) => (n.textContent = CONFIG.GALLERY_DATE));
  document.querySelectorAll("[data-gallery-time]").forEach((n) => (n.textContent = CONFIG.GALLERY_TIME));
  document.querySelectorAll("[data-gallery-place]").forEach((n) => (n.textContent = CONFIG.GALLERY_PLACE));
  document.querySelectorAll("[data-gallery-scroll-hint]").forEach((n) => (n.textContent = CONFIG.GALLERY_SCROLL_HINT));
  document.querySelectorAll("[data-gallery-footer]").forEach((n) => (n.textContent = CONFIG.GALLERY_FOOTER_TEXT));

  // El botón de descarga es un enlace directo a un ZIP ya existente
  // en Drive, no una descarga generada por JavaScript. Ver README
  // §13 y drive.js para la explicación de por qué es la solución
  // fiable dentro de las limitaciones de GitHub Pages + Drive.
  if (CONFIG.DOWNLOAD_ALL_URL && !CONFIG.DOWNLOAD_ALL_URL.includes("REEMPLAZAR")) {
    downloadAllBtn.href = CONFIG.DOWNLOAD_ALL_URL;
  } else {
    downloadAllBtn.classList.add("is-disabled");
    downloadAllBtn.setAttribute("aria-disabled", "true");
    downloadAllBtn.addEventListener("click", (e) => e.preventDefault());
  }

  Gallery.init({ onSelect: (index) => Modal.open(index) });
  Animations.initRevealElements();
  Animations.initLineArtDraw();
  Animations.initHeroParallax();

  retryBtn.addEventListener("click", loadGallery);
  loadGallery();

  async function loadGallery() {
    showState("loading");
    try {
      const images = await Drive.fetchGalleryImages();
      if (images.length === 0) {
        showState("empty");
        return;
      }
      Gallery.render(images);
      Modal.init(images);
      showState("ready");
    } catch (err) {
      console.error(err);
      showState("error");
    }
  }

  function showState(state) {
    loadingEl.hidden = state !== "loading";
    errorEl.hidden = state !== "error";
    galleryEl.hidden = state !== "ready";
    if (state === "ready") downloadAllBtn.classList.add("is-visible");

    if (state === "empty") {
      errorEl.hidden = false;
      errorEl.querySelector(".state-message__title").textContent = "Aún no hay fotografías";
      errorEl.querySelector(".state-message__text").textContent =
        "En cuanto se suban fotos a la carpeta compartida, aparecerán aquí.";
      retryBtn.textContent = "Comprobar de nuevo";
    }
  }
})();
