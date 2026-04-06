export function setupScrollReveal(container: HTMLElement | null) {
  if (!container || typeof window === "undefined") {
    return () => {};
  }

  const roots = Array.from(container.querySelectorAll<HTMLElement>("[data-reveal-root]"));

  if (!roots.length) {
    return () => {};
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    roots.forEach((root) => {
      root.dataset.revealVisible = "true";
    });

    return () => {};
  }

  roots.forEach((root) => {
    Array.from(root.querySelectorAll<HTMLElement>("[data-reveal-item]")).forEach((item, index) => {
      item.style.setProperty("--reveal-order", String(index));
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const target = entry.target as HTMLElement;
        target.dataset.revealVisible = "true";
        observer.unobserve(target);
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -4% 0px",
    },
  );

  roots.forEach((root) => observer.observe(root));

  return () => observer.disconnect();
}
