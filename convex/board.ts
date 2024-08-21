import { v } from "convex/values";
import { mutation, query } from "./_generated/server"

const images = [
    "/placeholders/1.svg",
    "/placeholders/2.svg",
    "/placeholders/3.svg",
    "/placeholders/4.svg",
    "/placeholders/5.svg",
    "/placeholders/6.svg",
    "/placeholders/7.svg",
    "/placeholders/8.svg",
    "/placeholders/9.svg",
    "/placeholders/10.svg",
    "/placeholders/11.svg",
    "/placeholders/12.svg",
    "/placeholders/13.svg",
    "/placeholders/14.svg",
    "/placeholders/15.svg",
    "/placeholders/16.svg",
    "/placeholders/17.svg",
    "/placeholders/18.svg",
    "/placeholders/19.svg",
    "/placeholders/20.svg",
    "/placeholders/21.svg",
    "/placeholders/22.svg",
    "/placeholders/23.svg",
    "/placeholders/24.svg",
    "/placeholders/25.svg",
    "/placeholders/26.svg",
    "/placeholders/27.svg",
    "/placeholders/28.svg",
    "/placeholders/29.svg",
    "/placeholders/30.svg",
    "/placeholders/31.svg",
    "/placeholders/32.svg",
    "/placeholders/33.svg",
    "/placeholders/34.svg",
    "/placeholders/35.svg",
    "/placeholders/36.svg",
    "/placeholders/37.svg",
    "/placeholders/38.svg",
    "/placeholders/39.svg",
    "/placeholders/40.svg",
    "/placeholders/41.svg",
]


export const create = mutation({
    args: {
        orgId: v.string(),
        title: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Unauthorized");
        }

        const randomImage = images[Math.floor(Math.random() * images.length)];

        const board = await ctx.db.insert("boards", {
            title: args.title,
            orgId: args.orgId,
            authorId: identity.subject,
            authorName: identity.name!,
            imageUrl: randomImage,
        });

        return board;
    },
});

export const remove = mutation({
    args: { id: v.id("boards") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("UnAuthorized");
        }

        const userId = identity.subject;

        const existingFavorite = await ctx.db
            .query("userFavorites")
            .withIndex("by_user_board", (q) =>
                q
                    .eq("userId", userId)
                    .eq("boardId", args.id)
            )

            .unique();

        if (existingFavorite) {
            await ctx.db.delete(existingFavorite._id)
        }

        await ctx.db.delete(args.id);
    },
});

export const update = mutation({
    args: { id: v.id("boards"), title: v.string() },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("UnAuthorized");
        }

        const title = args.title.trim();

        if (!title) {
            throw new Error("Title is Required..😐");
        }

        if (title.length > 60) {
            throw new Error("Title cannot be longer than 60 Charecter..😲")
        }

        const board = await ctx.db.patch(args.id, {
            title: args.title,
        });
        return board;
    },
});


export const favorite = mutation({
    args: {
        id: v.id("boards"),
        orgId: v.string()
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error(" UnAuthorized...😐")
        }

        const board = await ctx.db.get(args.id);

        if (!board) {
            throw new Error(" Craft not Found..😕")
        }

        const userId = identity.subject;

        const existingFavorites = await ctx.db
            .query("userFavorites")
            .withIndex("by_user_board_org", (q) =>
                q
                    .eq("userId", userId)
                    .eq("boardId", board._id)
                    .eq("orgId", args.orgId)
            )
            .unique();

        if (existingFavorites) {
            throw new Error("Craft already Favorited...⭐")
        }

        await ctx.db.insert("userFavorites", {
            userId,
            boardId: board._id,
            orgId: args.orgId,
        });
        return board;
    },
});

// For UnFavorite

export const unfavorite = mutation({
    args: { id: v.id("boards") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new Error("Unauthorized");
        }

        const board = await ctx.db.get(args.id);

        if (!board) {
            throw new Error("Board not found");
        }

        const userId = identity.subject;

        const existingFavorite = await ctx.db
            .query("userFavorites")
            .withIndex("by_user_board", (q) =>
                q
                    .eq("userId", userId)
                    .eq("boardId", board._id)
            )
            .unique();

        if (!existingFavorite) {
            throw new Error("Favorited board not found");
        }

        await ctx.db.delete(existingFavorite._id);

        return board;
    },
});

export const get = query({
    args: { id: v.id("boards") },
    handler: async (ctx, args) => {
        const board = ctx.db.get(args.id);

        return board;
    },
});

