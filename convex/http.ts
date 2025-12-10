import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/analytics",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const headers = {
      "Access-Control-Allow-Origin": "*",
    };

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return new Response("Invalid JSON", { status: 400, headers });
    }

    const { tourId, eventType, timestamp, ...rest } = body;

    if (!tourId || !eventType || !timestamp) {
      return new Response(
        "Missing required fields: tourId, eventType, timestamp",
        { status: 400, headers }
      );
    }

    await ctx.runMutation(api.analytics.logEvent, {
      tourId,
      eventType,
      timestamp,
      data: rest,
    });

    return new Response("OK", { status: 200, headers });
  }),
});

http.route({
  path: "/analytics",
  method: "OPTIONS",
  handler: httpAction(async (ctx, request) => {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }),
});

export default http;
