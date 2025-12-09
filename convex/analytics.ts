import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const logEvent = mutation({
  args: {
    tourId: v.string(),
    eventType: v.string(),
    timestamp: v.string(),
    data: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("analytics_events", args);
  },
});
