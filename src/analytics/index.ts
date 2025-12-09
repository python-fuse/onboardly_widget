export function trackEvent(
  tourId: string,
  eventType: string,
  data?: Record<string, any>
): void {
  // Send to your dashboard API
  fetch("https://befitting-chicken-939.convex.site/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tourId,
      eventType,
      timestamp: new Date().toISOString(),
      ...data,
    }),
  }).catch((err) => console.error("Analytics error:", err));
}
