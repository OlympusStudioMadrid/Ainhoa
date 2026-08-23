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

  /** Anima el trazo de los motivos decorativos (iglesia, paloma, ramas) */
  function initLineArtDraw() {
    const paths = document.querySelectorAll(".line-art path, .line-art circle, .line-art ellipse");
    if (Utils.prefersReducedMotion()) {
      paths.forEach((p) => p.classList.add("is-drawn"));
      return;
    }
    paths.forEach((p, i) => {
      setTimeout(() => p.classList.add("is-drawn"), 400 + i * 90);
    });
  }

  /** Movimiento sutil de paralaje al mover el ratón (solo escritorio) */
  function initHeroParallax() {
    if (Utils.isTouchDevice() || Utils.prefersReducedMotion()) return;
    const hero = document.querySelector(".hero");
    const motifs = document.querySelectorAll(".line-art");
    if (!hero || motifs.length === 0) return;

    const onMove = Utils.throttle((e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2;
      const y = (e.clientY / innerHeight - 0.5) * 2;
      motifs.forEach((motif) => {
        const depth = parseFloat(motif.dataset.depth || "1");
        motif.style.transform = `translate(${x * depth * 10}px, ${y * depth * 10}px)`;
      });
    }, 40);

    hero.addEventListener("mousemove", onMove);
    hero.addEventListener("mouseleave", () => {
      motifs.forEach((motif) => (motif.style.transform = "translate(0, 0)"));
    });
  }

  return { observeGalleryItems, initRevealElements, initLineArtDraw, initHeroParallax };
})();
