import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Define your tables here
  todos: defineTable({
    title: v.string(),
    completed: v.boolean(),
  }),
  users: defineTable({
    // Display name from an OAuth profile. Username/password users keep their
    // username in the auth username component instead.
    name: v.optional(v.string()),
  }),
});
