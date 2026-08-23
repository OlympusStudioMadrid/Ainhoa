// ============================================================
// gallery.js — Construcción de la galería tipo Pinterest/Masonry
// ============================================================
// Responsabilidad: pintar las fotos en el DOM con lazy loading,
// y avisar a modal.js cuándo se hace click/tap sobre una.
// El propio ajuste visual del masonry lo resuelve CSS (columns),
// así que este módulo no calcula posiciones manualmente.
// ============================================================

const Gallery = (() => {

  let images = [];
  let onPhotoSelect = () => {};

  const gridEl = document.getElementById("gallery-grid");

  function init({ onSelect }) {
    onPhotoSelect = onSelect;
  }

  function render(imageList) {
    images = imageList;
    gridEl.innerHTML = "";

    images.forEach((image, index) => {
      const figure = buildFigure(image, index);
      gridEl.appendChild(figure);
    });

    Animations.observeGalleryItems(gridEl.querySelectorAll(".photo-card"));
  }

  function buildFigure(image, index) {
    const figure = Utils.el("figure", { class: "photo-card" });

    const img = Utils.el("img", {
      src: image.gridUrl,
      alt: `Fotografía ${index + 1} del bautizo de ${CONFIG.GALLERY_TITLE}`,
      loading: "lazy",
      decoding: "async",
      class: "photo-card__img",
    });

    // Reserva de espacio para evitar salto de layout mientras carga,
    // usando la proporción real de la imagen cuando Drive la da.
    if (image.width && image.height) {
      figure.style.aspectRatio = `${image.width} / ${image.height}`;
    }

    img.addEventListener("load", () => figure.classList.add("is-loaded"));
    img.addEventListener("error", () => figure.classList.add("is-error"));

    figure.appendChild(img);
    figure.appendChild(Utils.el("div", { class: "photo-card__skeleton" }));

    figure.tabIndex = 0;
    figure.setAttribute("role", "button");
    figure.setAttribute("aria-label", `Ver fotografía ${index + 1} de ${images.length} en grande`);

    const activate = () => onPhotoSelect(index);
    figure.addEventListener("click", activate);
    figure.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        activate();
      }
    });

    return figure;
  }

  function getImages() {
    return images;
  }

  return { init, render, getImages };
})();
