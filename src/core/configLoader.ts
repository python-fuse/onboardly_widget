import { TourConfig } from "../types";

export class ConfigLoader {
  async loadConfig(tourId: string) {
    try {
      const res = await fetch(
        "https://colorless-poodle-381.convex.cloud/api/query",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            path: "public:getTourByScriptId",
            args: { scriptId: tourId },
            format: "json",
          }),
        }
      );

      const data = await res.json();

      return data.value as TourConfig;
    } catch {
      throw new Error("Error while fetching config");
    }
  }
}
