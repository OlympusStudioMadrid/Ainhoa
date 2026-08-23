// ============================================================
// utils.js — Funciones auxiliares reutilizables
// ============================================================

const Utils = (() => {

  /** Devuelve true si el usuario prefiere movimiento reducido */
  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  /** Devuelve true si el dispositivo es táctil (heurística razonable) */
  function isTouchDevice() {
    return "ontouchstart" in window || navigator.maxTouchPoints > 0;
  }

  /** Limita la frecuencia de ejecución de una función (para scroll/resize) */
  function throttle(fn, waitMs) {
    let lastCall = 0;
    let timeoutId = null;
    return (...args) => {
      const now = Date.now();
      const remaining = waitMs - (now - lastCall);
      if (remaining <= 0) {
        lastCall = now;
        fn(...args);
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          lastCall = Date.now();
          fn(...args);
        }, remaining);
      }
    };
  }

  /** Bloquea / desbloquea el scroll del body (para el modal) */
  function lockScroll(lock) {
    document.body.classList.toggle("scroll-locked", lock);
  }

  /** Crea un elemento con atributos y clases en una sola llamada */
  function el(tag, attrs = {}, ...children) {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([key, value]) => {
      if (key === "class") node.className = value;
      else if (key === "text") node.textContent = value;
      else node.setAttribute(key, value);
    });
    children.forEach((child) => node.appendChild(child));
    return node;
  }

  return { prefersReducedMotion, isTouchDevice, throttle, lockScroll, el };
})();
