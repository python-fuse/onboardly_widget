import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  analytics_events: defineTable({
    tourId: v.string(),
    eventType: v.string(),
    timestamp: v.string(),
    data: v.optional(v.any()), // flexible payload
  }),
});
