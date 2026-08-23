// ============================================================
// carousel.js — Carrusel de vista previa (imágenes al azar)
// ============================================================
// Muestra una selección aleatoria de hasta 10 fotos en formato
// pequeño, a modo de avance. A propósito NO abre el visualizador
// al tocarlas: es solo una vista previa decorativa. La galería
// completa con el visualizador sigue intacta más abajo.
// ============================================================

const Carousel = (() => {

  const MAX_ITEMS = 10;

  const sectionEl = document.getElementById("preview-carousel");
  const trackEl = document.getElementById("preview-carousel-track");
  const prevBtn = document.getElementById("carousel-prev");
  const nextBtn = document.getElementById("carousel-next");

  function init() {
    prevBtn.addEventListener("click", () => scrollByPage(-1));
    nextBtn.addEventListener("click", () => scrollByPage(1));
  }

  function render(images) {
    if (!images.length) return;

    const selection = pickRandom(images, Math.min(MAX_ITEMS, images.length));
    trackEl.innerHTML = "";

    selection.forEach((image) => {
      const item = Utils.el("div", { class: "preview-carousel__item" });
      const img = Utils.el("img", {
        src: image.gridUrl,
        alt: `Vista previa de una fotografía del bautizo de ${CONFIG.GALLERY_TITLE}`,
        loading: "lazy",
        decoding: "async",
        class: "preview-carousel__img",
      });
      item.appendChild(img);
      trackEl.appendChild(item);
    });

    sectionEl.hidden = false;
  }

  function pickRandom(images, count) {
    const pool = [...images];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, count);
  }

  function scrollByPage(direction) {
    const amount = trackEl.clientWidth * 0.85 * direction;
    trackEl.scrollBy({ left: amount, behavior: Utils.prefersReducedMotion() ? "auto" : "smooth" });
  }

  return { init, render };
})();
