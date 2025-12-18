import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    activities: defineTable({
        ghlId: v.string(),
        title: v.string(),
        createdAt: v.string(),
        updatedAt: v.string(),
    }).index("by_ghlId", ["ghlId"]),

    test: defineTable({
        // Empty table for testing
    }),
});
