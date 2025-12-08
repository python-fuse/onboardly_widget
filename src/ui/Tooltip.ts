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
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    max-width: 400px;
    min-width: 300px;
    opacity: 0;
    transform: scale(0.95);
    transition: opacity 0.3s ease, transform 0.3s ease;
    `;

    // Building the content..... omooooooorrrhhhhh
    this.container.innerHTML = `
    <div class="tour-tooltip-header">
        <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600;">${
          step.title
        }</h3>
        <div style="font-size: 12px; color: #666;">Step ${
          currentIndex + 1
        } of ${totalSteps}</div>
      </div>
      <div class="tour-tooltip-content" style="margin: 16px 0; line-height: 1.6; color: #333;">
        ${step.content}
      </div>
      <div class="tour-tooltip-footer" style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px;">
        <button class="tour-btn-skip" style="background: none; border: none; color: #666; cursor: pointer; font-size: 14px;">Skip Tour</button>
        <div style="display: flex; gap: 8px;">
          <button class="tour-btn-prev" style="padding: 8px 16px; border: 1px solid #ddd; border-radius: 4px; background: white; cursor: pointer; font-size: 14px;" ${
            currentIndex === 0 ? "disabled" : ""
          }>Back</button>
          <button class="tour-btn-next" style="padding: 8px 16px; border: none; border-radius: 4px; background: #0066ff; color: white; cursor: pointer; font-size: 14px; font-weight: 500;">
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
