import React from "react";

/**
 * Attach events to `zoomableElement`, contained by `containerElement` so that its width is adjusted to the scroll events.
 * Adapted from: https://thomas.preissler.me/blog/2022/01/10/implementing-a-timeline-with-scrolling-and-zooming-or-how-i-failed-at-elementary-school-math
 */
export const useZoomable = (
  zoomableElement: HTMLDivElement | null,
  containerElement: HTMLDivElement | null
) => {
  return React.useEffect(() => {
    if (!zoomableElement || !containerElement) {
      return;
    }

    let scale = 1;

    let mouseHasMoved = true;
    let mousePositionRelative: number;
    let elementUnderMouse: Element;

    const handleMouseMove = () => {
      mouseHasMoved = true;
    };
    zoomableElement.addEventListener("mousemove", handleMouseMove);

    const handleWheel = (wheelEvent: WheelEvent) => {
      if (isVerticalScrolling(wheelEvent)) {
        wheelEvent.preventDefault();

        scale = computeScale(scale, wheelEvent.deltaY);
        zoomableElement.style.width = scale * 100 + "%";

        if (mouseHasMoved) {
          elementUnderMouse = findElementUnderMouse(wheelEvent.clientX);
          mousePositionRelative =
            (wheelEvent.clientX - getLeft(elementUnderMouse)) /
            getWidth(elementUnderMouse);
          mouseHasMoved = false;
        }

        const mousePosition = wheelEvent.clientX;
        const elementUnderMouseLeft = getLeft(elementUnderMouse);
        const zoomableLeft = getLeft(zoomableElement);
        const containerLeft = getLeft(containerElement);
        const moveAfterZoom =
          getWidth(elementUnderMouse) * mousePositionRelative;

        containerElement.scrollLeft = Math.round(
          elementUnderMouseLeft -
            zoomableLeft -
            mousePosition +
            containerLeft +
            moveAfterZoom
        );
      }
    };

    zoomableElement.addEventListener("wheel", handleWheel);

    const isVerticalScrolling = (wheelEvent: WheelEvent) => {
      const deltaX = Math.abs(wheelEvent.deltaX);
      const deltaY = Math.abs(wheelEvent.deltaY);
      return deltaY > deltaX;
    };

    const computeScale = (currentScale: number, wheelDelta: number) => {
      const newScale = currentScale - wheelDelta * 0.005;
      return Math.max(1, newScale);
    };

    const findElementUnderMouse = (mousePosition: number) => {
      const children = zoomableElement.children;

      for (const childElement of children) {
        const childRect = childElement.getBoundingClientRect();

        if (
          childRect.left <= mousePosition &&
          childRect.right >= mousePosition
        ) {
          return childElement;
        }
      }

      return zoomableElement;
    };

    const getLeft = (element: Element) => element.getBoundingClientRect().left;
    const getWidth = (element: Element) =>
      element.getBoundingClientRect().width;

    return () => {
      zoomableElement.removeEventListener("mousemove", handleMouseMove);
      zoomableElement.removeEventListener("wheel", handleWheel);
    };
  }, [containerElement, zoomableElement]);
};
