/**
 * Wait for element to appear in DOM
 * Usage: await waitForElement('.my-button', 5000)
 */
export function waitForElement(
  selector: string,
  timeout: number = 3000
): Promise<Element> {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);
    if (element) return resolve(element);

    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) {
        observer.disconnect();
        resolve(el);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    setTimeout(() => {
      observer.disconnect();
      reject(
        new Error(
          `Element with selector "${selector}" not found within ${timeout}ms`
        )
      );
    }, timeout);
  });
}

/**
 * Scroll element into view smoothly
 */
export function scrollToElement(element: Element): void {
  if (element) {
    element.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  }
}

/**
 * Get element position for tooltip placement
 */
export function getElementPosition(element: Element) {
  const rect = element.getBoundingClientRect();

  return {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX,
    width: rect.width,
    height: rect.height,
    bottom: rect.bottom + window.scrollY,
    right: rect.right + window.scrollX,
  };
}

/**
 * calculate the best position for a tooltip
 */
export function calculateTooltipPosition(
  targetBounds: DOMRect,
  tooltipWidth: number,
  tooltipHeight: number,
  placement: "top" | "bottom" | "left" | "right" = "top"
) {
  const padding = 16;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let top = 0;
  let left = 0;
  let finalPlacement = placement;

  // Calculate positions using viewport coordinates (for fixed positioning)
  switch (placement) {
    case "top":
      top = targetBounds.top - tooltipHeight - padding;
      left = targetBounds.left + (targetBounds.width - tooltipWidth) / 2;
      if (top < padding) finalPlacement = "bottom";
      break;
    case "bottom":
      top = targetBounds.bottom + padding;
      left = targetBounds.left + (targetBounds.width - tooltipWidth) / 2;
      if (top + tooltipHeight > viewportHeight - padding)
        finalPlacement = "top";
      break;
    case "left":
      top = targetBounds.top + (targetBounds.height - tooltipHeight) / 2;
      left = targetBounds.left - tooltipWidth - padding;
      if (left < padding) finalPlacement = "right";
      break;
    case "right":
      top = targetBounds.top + (targetBounds.height - tooltipHeight) / 2;
      left = targetBounds.right + padding;
      if (left + tooltipWidth > viewportWidth - padding)
        finalPlacement = "left";
      break;
  }
  // clamp to viewport
  left = Math.max(
    padding,
    Math.min(left, viewportWidth - tooltipWidth - padding)
  );
  top = Math.max(
    padding,
    Math.min(top, viewportHeight - tooltipHeight - padding)
  );

  return { top, left, finalPlacement };
}
