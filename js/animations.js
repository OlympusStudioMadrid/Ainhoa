// ============================================================
// animations.js — Animaciones de entrada al hacer scroll
// ============================================================

const Animations = (() => {

  let observer = null;

  function getObserver() {
    if (observer) return observer;

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    return observer;
  }

  /** Aplica la animación de entrada a cada tarjeta de la galería */
  function observeGalleryItems(nodeList) {
    if (Utils.prefersReducedMotion()) {
      nodeList.forEach((node) => node.classList.add("is-visible"));
      return;
    }
    const obs = getObserver();
    nodeList.forEach((node) => obs.observe(node));
  }

  /** Revela elementos genéricos marcados con [data-reveal] (hero, etc.) */
  function initRevealElements() {
    const nodes = document.querySelectorAll("[data-reveal]");
    if (Utils.prefersReducedMotion()) {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }
    nodes.forEach((node, i) => {
      setTimeout(() => node.classList.add("is-visible"), 80 * i);
    });
  }

  return { observeGalleryItems, initRevealElements };
})();
