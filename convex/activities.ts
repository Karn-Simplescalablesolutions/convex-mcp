import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Schema for activities
const activityValidator = {
    ghlId: v.string(),
    title: v.string(),
    createdAt: v.string(),
    updatedAt: v.string(),
};

// Create a new activity
export const create = mutation({
    args: activityValidator,
    handler: async (ctx, args) => {
        const activityId = await ctx.db.insert("activities", {
            ghlId: args.ghlId,
            title: args.title,
            createdAt: args.createdAt,
            updatedAt: args.updatedAt,
        });
        return activityId;
    },
});

// Get all activities
export const list = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("activities").collect();
    },
});

// Get activity by ID
export const get = query({
    args: { id: v.id("activities") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.id);
    },
});

// Get activity by GHL ID
export const getByGhlId = query({
    args: { ghlId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("activities")
            .filter((q) => q.eq(q.field("ghlId"), args.ghlId))
            .first();
    },
});

// Update activity
export const update = mutation({
    args: {
        id: v.id("activities"),
        title: v.optional(v.string()),
        updatedAt: v.string(),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;
        await ctx.db.patch(id, updates);
        return id;
    },
});

// Delete activity
export const remove = mutation({
    args: { id: v.id("activities") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
        return args.id;
    },
});
