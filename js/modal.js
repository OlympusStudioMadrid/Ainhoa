// ============================================================
// modal.js — Visualizador de fotografías a pantalla casi completa
// ============================================================
// Responsabilidad: abrir/cerrar el lightbox, navegar entre fotos
// (botones, teclado, swipe), precargar vecinas y ser accesible.
// ============================================================

const Modal = (() => {

  let images = [];
  let currentIndex = 0;
  let lastFocusedElement = null;

  const modalEl = document.getElementById("photo-modal");
  const imgEl = document.getElementById("photo-modal-img");
  const counterEl = document.getElementById("photo-modal-counter");
  const closeBtn = document.getElementById("photo-modal-close");
  const prevBtn = document.getElementById("photo-modal-prev");
  const nextBtn = document.getElementById("photo-modal-next");
  const downloadBtn = document.getElementById("photo-modal-download");

  let touchStartX = null;
  let touchStartY = null;

  function init(imageList) {
    images = imageList;

    closeBtn.addEventListener("click", close);
    prevBtn.addEventListener("click", () => go(-1));
    nextBtn.addEventListener("click", () => go(1));

    modalEl.addEventListener("click", (e) => {
      if (e.target === modalEl) close();
    });

    document.addEventListener("keydown", onKeydown);

    modalEl.addEventListener("touchstart", onTouchStart, { passive: true });
    modalEl.addEventListener("touchend", onTouchEnd, { passive: true });
  }

  function open(index) {
    currentIndex = index;
    lastFocusedElement = document.activeElement;

    renderCurrent();
    modalEl.classList.add("is-open");
    modalEl.setAttribute("aria-hidden", "false");
    Utils.lockScroll(true);
    closeBtn.focus();
  }

  function close() {
    modalEl.classList.remove("is-open");
    modalEl.setAttribute("aria-hidden", "true");
    Utils.lockScroll(false);
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  function isOpen() {
    return modalEl.classList.contains("is-open");
  }

  // Navegación circular: de la última pasa a la primera y viceversa,
  // para no dejar nunca al usuario "atascado" en un extremo.
  function go(direction) {
    currentIndex = (currentIndex + direction + images.length) % images.length;
    renderCurrent();
  }

  function renderCurrent() {
    const image = images[currentIndex];
    imgEl.src = image.fullUrl;
    imgEl.alt = `Fotografía ${currentIndex + 1} del bautizo de ${CONFIG.GALLERY_TITLE}`;
    counterEl.textContent = `${currentIndex + 1} / ${images.length}`;
    downloadBtn.href = image.downloadUrl;
    downloadBtn.setAttribute(
      "aria-label",
      `Descargar la fotografía ${currentIndex + 1} en máxima calidad`
    );
    preloadNeighbors();
  }

  function preloadNeighbors() {
    const n = CONFIG.PRELOAD_NEIGHBORS || 1;
    for (let offset = 1; offset <= n; offset++) {
      [currentIndex - offset, currentIndex + offset].forEach((rawIndex) => {
        const idx = (rawIndex + images.length) % images.length;
        const preload = new Image();
        preload.src = images[idx].fullUrl;
      });
    }
  }

  function onKeydown(e) {
    if (!isOpen()) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") go(-1);
    else if (e.key === "ArrowRight") go(1);
    else if (e.key === "Tab") trapFocus(e);
  }

  // Evita que Tab saque el foco del modal mientras está abierto
  function trapFocus(e) {
    const focusable = modalEl.querySelectorAll("button, a[href]");
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function onTouchStart(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }

  function onTouchEnd(e) {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;

    // Solo interpretamos como swipe horizontal si el movimiento
    // lateral domina claramente sobre el vertical, para no chocar
    // con el gesto de scroll/cierre vertical del usuario.
    const SWIPE_THRESHOLD = 50;
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy) * 1.5) {
      go(dx > 0 ? -1 : 1);
    }

    touchStartX = null;
    touchStartY = null;
  }

  return { init, open, close, isOpen };
})();
