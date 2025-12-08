import { ConfigLoader } from "./core/configLoader";
import { TourEngine } from "./core/tourEngine";
import { TourConfig } from "./types";

interface WindowWithTour extends Window {
  TourWidget?: {
    init: (tourId: string) => Promise<void>;
    initWithConfig: (config: TourConfig) => Promise<void>;
  };
}

(function () {
  const tourEngine = new TourEngine();
  const configLoader = new ConfigLoader();

  (window as WindowWithTour).TourWidget = {
    async init(tourId) {
      try {
        const config = await configLoader.loadConfig(tourId);
        await tourEngine.start(config);
      } catch (error) {
        console.error("Tour initialization failed: ", error);
      }
    },

    async initWithConfig(config) {
      await tourEngine.start(config);
    },
  };
  console.log("🎯 Tour Widget loaded");
})();
