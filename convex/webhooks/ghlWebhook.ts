import { v } from "convex/values";
import { mutation } from "../_generated/server";

export const updateRecord = mutation({
    args: {
        ghlId: v.string(),
        updates: v.object({
            title: v.optional(v.string()),
            updatedAt: v.string(),
        }),
    },
    handler: async (ctx, args) => {
        const { ghlId, updates } = args;

        // Check if the record exists
        const existing = await ctx.db
            .query("activities")
            .withIndex("by_ghlId", (q) => q.eq("ghlId", ghlId))
            .first();

        if (existing) {
            // Record exists: Update it
            await ctx.db.patch(existing._id, updates);
            return { status: "updated", id: existing._id };
        } else {
            // Record missing: Create it (Upsert)
            const newId = await ctx.db.insert("activities", {
                ghlId: ghlId,
                title: updates.title || "Untitled Activity",
                createdAt: updates.updatedAt,
                updatedAt: updates.updatedAt,
            });
            return { status: "created", id: newId };
        }
    },
});
