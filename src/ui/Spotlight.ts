export class Spotlight {
  private overlay: HTMLDivElement | null = null;
  private clone: HTMLElement | null = null;
  private originalOverflow: string = "";

  show(targetElemnt: Element) {
    this.hide();

    this.originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Create dark overlay
    this.overlay = document.createElement("div");
    this.overlay.className = "tour-overlay";
    this.overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.7);
    z-index: 9998;
    pointer-events: none;
    transition: opacity 0.3s ease;
    `;

    const bounds = targetElemnt.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(targetElemnt);

    this.clone = (targetElemnt as HTMLElement).cloneNode(true) as HTMLElement;
    this.clone.classList.add("tour-spotlight-clone");

    // Copy computed styles from original element
    this.clone.style.cssText = `
    position: fixed;
    top: ${bounds.top}px;
    left: ${bounds.left}px;
    width: ${bounds.width}px;
    height: ${bounds.height}px;
    z-index: 9999;
    box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.5), 0 0 0 9999px rgba(0, 0, 0, 0.7);
    border-radius: ${computedStyle.borderRadius};
    transition: all 0.3s ease;
    pointer-events: none;
    background: ${computedStyle.background};
    background-color: ${computedStyle.backgroundColor};
    background-image: ${computedStyle.backgroundImage};
    color: ${computedStyle.color};
    font-family: ${computedStyle.fontFamily};
    font-size: ${computedStyle.fontSize};
    font-weight: ${computedStyle.fontWeight};
    line-height: ${computedStyle.lineHeight};
    padding: ${computedStyle.padding};
    border: ${computedStyle.border};
    margin: 0;
    box-sizing: ${computedStyle.boxSizing};
    text-align: ${computedStyle.textAlign};
    display: ${computedStyle.display};
    align-items: ${computedStyle.alignItems};
    justify-content: ${computedStyle.justifyContent};
    flex-direction: ${computedStyle.flexDirection};
    flex-wrap: ${computedStyle.flexWrap};
    gap: ${computedStyle.gap};
    `;

    document.body.appendChild(this.overlay);
    document.body.appendChild(this.clone);

    // fade in
    requestAnimationFrame(() => {
      if (this.overlay) this.overlay.style.opacity = "1";
    });
  }
  hide() {
    if (this.overlay) {
      document.body.style.overflow = this.originalOverflow;
      this.overlay.remove();
      this.overlay = null;
    }
    if (this.clone) {
      this.clone.remove();
      this.clone = null;
    }
  }
}
