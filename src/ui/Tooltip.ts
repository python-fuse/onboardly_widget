import { TourStep } from "../types";
import { calculateTooltipPosition } from "../utils/dom";

export class ToolTip {
  private container: HTMLDivElement | null = null;
  private onNext?: () => void;
  private onPrev?: () => void;
  private onSkip?: () => void;

  show(
    step: TourStep,
    targetElement: Element,
    currentIndex: number,
    totalSteps: number,
    handlers: {
      onNext?: () => void;
      onPrev?: () => void;
      onSkip?: () => void;
    }
  ) {
    this.hide();
    this.onNext = handlers.onNext;
    this.onPrev = handlers.onPrev;
    this.onSkip = handlers.onSkip;

    this.container = document.createElement("div");
    this.container.className = "tour-tooltip";
    this.container.style.cssText = `
    position: fixed;
    z-index: 10000;
    background: #23222d;
    color: white;
    border-radius: 16px;
    padding: 24px;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05);
    max-width: 340px;
    min-width: 300px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    opacity: 0;
    transform: translateY(8px) scale(0.96);
    transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    `;

    const progress = Math.round(((currentIndex + 1) / totalSteps) * 100);

    this.container.innerHTML = `
      <div class="tour-tooltip-header" style="margin-bottom: 8px;">
        <h3 style="margin: 0; font-size: 16px; font-weight: 700; color: #fff; letter-spacing: -0.01em;">${
          step.title
        }</h3>
      </div>
      
      <div class="tour-tooltip-content" style="margin-bottom: 24px; font-size: 14px; line-height: 1.5; color: #9ca3af;">
        ${step.content}
      </div>

      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
        <div style="flex: 1; height: 6px; background: #323040; border-radius: 10px; overflow: hidden;">
          <div style="width: ${progress}%; height: 100%; background: #590df2; border-radius: 10px; transition: width 0.3s ease;"></div>
        </div>
        <div style="font-size: 12px; font-weight: 500; color: #9ca3af;">
          ${currentIndex + 1} of ${totalSteps}
        </div>
      </div>

      <div class="tour-tooltip-footer" style="display: flex; justify-content: space-between; align-items: center;">
        <button class="tour-btn-skip" style="background: none; border: none; color: #fff; opacity: 0.8; cursor: pointer; font-size: 14px; font-weight: 500; padding: 6px 0;">Skip</button>
        <div style="display: flex; gap: 10px;">
          <button class="tour-btn-prev" style="
            padding: 8px 20px; 
            border: none; 
            border-radius: 20px; 
            background: #323040; 
            color: white; 
            cursor: pointer; 
            font-size: 13px; 
            font-weight: 600;
            transition: background 0.2s;
            ${currentIndex === 0 ? "opacity: 0.5; cursor: not-allowed;" : ""}
          " ${currentIndex === 0 ? "disabled" : ""}>Back</button>
          
          <button class="tour-btn-next" style="
            padding: 8px 20px; 
            border: none; 
            border-radius: 20px; 
            background: #590df2; 
            color: white; 
            cursor: pointer; 
            font-size: 13px; 
            font-weight: 600;
            box-shadow: 0 4px 12px rgba(89, 13, 242, 0.3);
            transition: background 0.2s, transform 0.1s;
          ">
            ${currentIndex === totalSteps - 1 ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(this.container);

    //   Positioning the tooltip
    const targetBounds = targetElement.getBoundingClientRect();
    const toolTipRect = this.container.getBoundingClientRect();
    const pos = calculateTooltipPosition(
      targetBounds,
      toolTipRect.width,
      toolTipRect.height,
      step.placement
    );

    this.container.style.top = `${pos.top}px`;
    this.container.style.left = `${pos.left}px`;

    // Attach ev listeners
    this.container
      .querySelector(".tour-btn-next")
      ?.addEventListener("click", () => this.onNext?.());
    this.container
      .querySelector(".tour-btn-prev")
      ?.addEventListener("click", () => this.onPrev?.());
    this.container
      .querySelector(".tour-btn-skip")
      ?.addEventListener("click", () => this.onSkip?.());

    //   fade in
    requestAnimationFrame(() => {
      if (this.container) {
        this.container.style.opacity = "1";
        this.container.style.transform = "scale(1)";
      }
    });
  }
  hide() {
    if (this.container) {
      this.container.remove();
      this.container = null;
    }
  }
}
