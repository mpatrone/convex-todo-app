import { internalMutation, query } from "./_generated/server";
import { components } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { vGithubProfile } from "@convex-dev/auth/methods/github/server";
import { vGoogleProfile } from "@convex-dev/auth/methods/google/server";

/**
 * The signed-in user's display name: their username for username/password
 * accounts, or the name from their GitHub/Google profile. Null when signed
 * out. The user is derived from the session, never from an argument.
 */
export const currentUsername = query({
  args: {},
  returns: v.union(v.string(), v.null()),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    const username = await ctx.runQuery(
      components.authUsername.public.getUsername,
      { userId },
    );
    if (username !== null) {
      return username;
    }
    const user = await ctx.db.get("users", userId);
    return user?.name ?? null;
  },
});

/**
 * Create the user row for a new account and return its id. One callback
 * serves every sign-in method; OAuth accounts keep a display name.
 */
export const createUser = internalMutation({
  args: {
    method: v.union(
      v.object({
        name: v.literal("usernamePassword"),
        profile: v.object({}),
      }),
      v.object({ name: v.literal("github"), profile: vGithubProfile }),
      v.object({ name: v.literal("google"), profile: vGoogleProfile }),
    ),
  },
  returns: v.id("users"),
  handler: async (ctx, { method }) => {
    switch (method.name) {
      case "usernamePassword":
        return await ctx.db.insert("users", {});
      case "github":
        return await ctx.db.insert("users", {
          name: method.profile.name ?? method.profile.login,
        });
      case "google":
        return await ctx.db.insert("users", {
          name: method.profile.name ?? method.profile.email,
        });
    }
  },
});
