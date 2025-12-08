export interface TourStep {
  id: string;
  targetSelector: string;
  title: string;
  content: string;
  placement?: "top" | "bottom" | "left" | "right";
  action?: "click" | "hover" | "focus" | "none";
}

export interface TourConfig {
  tourId: string;
  steps: TourStep[];
  autoStart?: boolean;
  showProgress?: boolean;
  allowSkip?: boolean;
}

export interface TourState {
  currentStepIndex: number;
  completed: boolean;
  skipped: boolean;
}
