import { zid } from "convex-helpers/server/zod4";
import { z } from "zod";

export const createTodoSchema = z.object({
	title: z.string().min(3, "Todo must contain at least 3 characters"),
	completed: z.boolean().default(false),
});

export const updateTodoSchema = z.object({
	id: zid("todos"),
	title: z.string().min(3, "Todo must contain at least 3 characters"),
	completed: z.boolean(),
});

export const deleteTodoSchema = z.object({
	id: zid("todos"),
});