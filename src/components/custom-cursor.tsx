"use client";

import { useEffect, useRef } from "react";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }

    const cursor = cursorRef.current;
    if (!cursor) {
      return;
    }

    document.body.classList.add("has-custom-cursor");

    cursor.dataset.visible = "true";

    const handleMove = (event: MouseEvent | PointerEvent) => {
      cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      cursor.dataset.visible = "true";
    };

    const handleLeave = () => {
      cursor.dataset.visible = "false";
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("mousemove", handleMove);
    document.documentElement.addEventListener("mouseleave", handleLeave);
    window.addEventListener("blur", handleLeave);

    return () => {
      document.body.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("mousemove", handleMove);
      document.documentElement.removeEventListener("mouseleave", handleLeave);
      window.removeEventListener("blur", handleLeave);
    };
  }, []);

  return (
    <div aria-hidden="true" className="custom-cursor" data-visible="false" ref={cursorRef}>
      <div className="custom-cursor-ring">
        <svg className="custom-cursor-text" viewBox="0 0 120 120">
          <defs>
            <path d="M60,60 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" id="cursor-text-circle" />
          </defs>
          <text>
            <textPath href="#cursor-text-circle" startOffset="0%">
              KAPTEN BATIK / KAPTEN BATIK /
            </textPath>
          </text>
        </svg>
        <span className="custom-cursor-core" />
      </div>
    </div>
  );
}
