import { TourConfig } from "../types";

export class ConfigLoader {
  async loadConfig(tourId: string, configObject?: TourConfig) {
    if (configObject) return configObject;

    const response = await fetch(`https://google.com/${tourId}`);

    if (!response.ok) {
      throw new Error(`Failed toload config: ${response.statusText}`);
    }

    const config: TourConfig = await response.json();
    if (!config.steps || config.steps.length < 5) {
      throw new Error("Tour must have at least 5 steps");
    }

    return config;
  }
}
