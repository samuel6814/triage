/** GSAP helpers for visualization scenes */

export function animateCounter(tl, el, selector, target, { duration = 1.2, decimals = 0, position } = {}) {
  const node = el.querySelector(selector);
  if (!node) return;
  const proxy = { val: parseFloat(node.textContent) || 0 };
  tl.to(proxy, {
    val: target,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      node.textContent = decimals > 0 ? proxy.val.toFixed(decimals) : Math.round(proxy.val).toLocaleString();
    },
  }, position);
}

export function drawArc(tl, el, cls, { duration = 0.8, position } = {}) {
  const path = el.querySelector(`.${cls}`);
  if (!path) return;
  tl.to(path, { strokeDashoffset: 0, duration, ease: 'power2.inOut' }, position);
  const label = el.querySelector(`.${cls}-label`);
  if (label) tl.to(label, { opacity: 1, duration: 0.35 }, `-=${duration * 0.4}`);
}

export function fillBar(tl, el, selector, pct, { duration = 0.7, position, stagger = 0.1 } = {}) {
  const bars = el.querySelectorAll(selector);
  if (!bars.length) return;
  tl.to(bars, {
    height: (i, t) => `${t.dataset.pct ?? pct}%`,
    duration,
    stagger,
    ease: 'power2.out',
  }, position);
}

export function fillWidthBar(tl, el, selector, { duration = 0.6, stagger = 0.08, position } = {}) {
  const fills = el.querySelectorAll(selector);
  if (!fills.length) return;
  tl.to(fills, {
    width: (i, t) => `${t.dataset.pct ?? t.dataset.target ?? 0}%`,
    duration,
    stagger,
    ease: 'power2.out',
  }, position);
}

export function typeText(tl, el, selector, text, { duration = 2, position } = {}) {
  const node = el.querySelector(selector);
  if (!node) return;
  node.textContent = '';
  const chars = text.split('');
  const proxy = { i: 0 };
  tl.to(proxy, {
    i: chars.length,
    duration,
    ease: 'none',
    onUpdate: () => {
      node.textContent = text.slice(0, Math.floor(proxy.i));
    },
  }, position);
}
