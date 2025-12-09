import { TourState } from "../types";

export class StepManager {
  private state: TourState = {
    currentStepIndex: 0,
    completed: false,
    skipped: false,
  };

  constructor(private tourId: string) {
    this.loadState();
  }

  getCurrentStepIndex() {
    return this.state.currentStepIndex;
  }

  next(totalSteps: number) {
    if (this.state.currentStepIndex < totalSteps - 1) {
      this.state.currentStepIndex++;
      this.saveState();
      return true;
    }
    return false;
  }

  prev() {
    if (this.state.currentStepIndex > 0) {
      this.state.currentStepIndex--;
      this.saveState();
      return true;
    }
    return false;
  }

  skip() {
    this.state.skipped = true;
    this.saveState();
  }

  isCompleted() {
    return this.state.completed;
  }

  private saveState() {
    localStorage.setItem(`tour_${this.tourId}`, JSON.stringify(this.state));
  }

  private loadState() {
    const saved = localStorage.getItem(`tour_${this.tourId}`);
    if (saved) this.state = JSON.parse(saved);
  }

  complete() {
    this.state.completed = true;
    console.log(this.state)
    this.saveState();
  }

  reset() {
    this.state = {
      currentStepIndex: 0,
      completed: false,
      skipped: false,
    };
    localStorage.removeItem(`tour_${this.tourId}`);
  }
}
