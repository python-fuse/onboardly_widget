export class ResetButton {
  private element: HTMLButtonElement | null = null;
  private onClick: () => void;

  constructor(onClick: () => void) {
    this.onClick = onClick;
  }

  show() {
    if (this.element) return;

    this.element = document.createElement("button");
    this.element.className = "tour-reset-button";
    this.element.title = "Reset Tour";

    // Icon (Refresh CW)
    this.element.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
        <path d="M3 3v5h5"/>
        <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
        <path d="M16 16h5v5"/>
      </svg>
    `;

    this.element.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      width: 40px;
      height: 40px;
      padding: 0;
      border-radius: 50%;
      background: #ffffff;
      color: #333;
      border: 1px solid #e5e5e5;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      transition: all 0.2s ease;
    `;

    this.element.onmouseenter = () => {
      if (this.element) {
        this.element.style.transform = "scale(1.1)";
        this.element.style.boxShadow = "0 6px 16px rgba(0,0,0,0.15)";
      }
    };
    this.element.onmouseleave = () => {
      if (this.element) {
        this.element.style.transform = "scale(1)";
        this.element.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
      }
    };

    this.element.onclick = (e) => {
      e.stopPropagation();
      this.onClick();
    };

    document.body.appendChild(this.element);
  }

  hide() {
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
  }
}
