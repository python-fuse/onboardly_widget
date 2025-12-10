import { trackEvent } from "../analytics";
import { TourConfig } from "../types";
import { Spotlight } from "../ui/Spotlight";
import { ToolTip } from "../ui/Tooltip";
import { ResetButton } from "../ui/ResetButton";
import { scrollToElement, waitForElement } from "../utils/dom";
import { StepManager } from "./stepManager";

export class TourEngine {
  private config: TourConfig | null = null;
  private stepManager: StepManager | null = null;
  private spotlight = new Spotlight();
  private tooltip = new ToolTip();
  private resetButton = new ResetButton(() => this.handleReset());

  async start(config: TourConfig) {
    this.config = config;
    this.stepManager = new StepManager(config.tourId);
    this.resetButton.show();

    // Check if already completed
    if (this.stepManager.isCompleted()) {
      return;
    }

    trackEvent(config.tourId, "tour_started");
    await this.showStep(this.stepManager.getCurrentStepIndex());
  }

  reset() {
    this.stepManager?.reset();
    this.spotlight.hide();
    this.tooltip.hide();
  }

  private async showStep(index: number) {
    if (!this.config || !this.stepManager) return;
    const step = this.config?.steps[index];
    if (!step) return;

    try {
      // wait for element
      const element = await waitForElement(step.targetSelector, 5000);

      //   scroll it toview
      scrollToElement(element);

      // Add small delay for scroll to complete
      await new Promise((resolve) => setTimeout(resolve, 300));

      //   show spotlight
      this.spotlight.show(element);
      this.tooltip.show(step, element, index, this.config?.steps.length, {
        onNext: () => this.handleNext(),
        onPrev: () => this.handlePrev(),
        onSkip: () => this.handleSkip(),
      });

      trackEvent(this.config.tourId, "step_viewed", {
        stepId: step.id,
        stepIndex: index,
      });
    } catch (error) {
      console.error(`Failed to show step ${step.id}:`, error);
      trackEvent(this.config.tourId, "step_error", {
        stepId: step.id,
        error: (error as Error).message,
      });
      // Auto-advance to next step
      this.handleNext();
    }
  }

  private async handleNext() {
    if (!this.config || !this.stepManager) return;
    const currentIndex = this.stepManager.getCurrentStepIndex();
    trackEvent(this.config.tourId, "step_completed", {
      stepId: this.config.steps[currentIndex].id,
    });

    if (this.stepManager.next(this.config.steps.length)) {
      await this.showStep(this.stepManager.getCurrentStepIndex());
    } else {
      this.finish();
    }
  }

  private async handlePrev(): Promise<void> {
    if (!this.stepManager) return;

    if (this.stepManager.prev()) {
      await this.showStep(this.stepManager.getCurrentStepIndex());
    }
  }

  private handleSkip(): void {
    if (!this.config || !this.stepManager) return;

    trackEvent(this.config.tourId, "tour_skipped");
    this.stepManager.skip();
    this.cleanup();
  }

  private finish(): void {
    if (!this.config || !this.stepManager) return;

    trackEvent(this.config.tourId, "tour_completed");
    this.stepManager.complete();
    this.cleanup();
  }

  private cleanup(): void {
    this.spotlight.hide();
    this.tooltip.hide();
  }

  private async handleReset() {
    if (!this.config) return;
    this.reset();

    window.scrollTo({ top: 0, behavior: "smooth" });
    // Wait for scroll to complete
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await this.start(this.config);
  }
}
