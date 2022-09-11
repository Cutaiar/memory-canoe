import React from "react";

/**
 * Attach events to `scrollableElement` so that its scrollLeft is adjusted according to grab and drag.
 * Adapted from: https://thomas.preissler.me/blog/2022/01/10/implementing-a-timeline-with-scrolling-and-zooming-or-how-i-failed-at-elementary-school-math
 */
export const useScrollable = (scrollableElement: HTMLDivElement | null) => {
  return React.useEffect(() => {
    if (!scrollableElement) {
      return;
    }
    let mouseDown = false;

    let initialGrabPosition = 0;
    let initialScrollPosition = 0;

    const handleMouseDown = (mouseEvent: MouseEvent) => {
      mouseDown = true;
      scrollableElement.style.cursor = "grabbing";
      initialGrabPosition = mouseEvent.clientX;
      initialScrollPosition = scrollableElement.scrollLeft;
    };
    scrollableElement.addEventListener("mousedown", handleMouseDown);

    const handleMouseUp = () => {
      mouseDown = false;
      scrollableElement.style.cursor = "grab";
    };

    scrollableElement.addEventListener("mouseup", handleMouseUp);

    const handleMouseMove = (mouseEvent: MouseEvent) => {
      if (mouseDown) {
        const mouseMovementDistance = mouseEvent.clientX - initialGrabPosition;
        scrollableElement.scrollLeft =
          initialScrollPosition - mouseMovementDistance;
      }
    };
    scrollableElement.addEventListener("mousemove", handleMouseMove);

    // Cleanup
    return () => {
      scrollableElement.removeEventListener("mousedown", handleMouseDown);
      scrollableElement.removeEventListener("mouseup", handleMouseUp);
      scrollableElement.removeEventListener("mousemove", handleMouseMove);
    };
  }, [scrollableElement]);
};
