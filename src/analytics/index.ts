export function trackEvent(
  tourId: string,
  eventType: string,
  data?: Record<string, any>
): void {
  fetch("https://colorless-poodle-381.convex.site/analytics", {
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
