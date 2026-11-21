import { mutation, query } from "./_generated/server";
import { zCustomMutation } from "convex-helpers/server/zod4";
import { NoOp } from "convex-helpers/server/customFunctions";
import { createTodoSchema, deleteTodoSchema, updateTodoSchema } from "../lib/zod";

const zMutation = zCustomMutation(mutation, NoOp);

export const getTodos = query({
    handler: async (ctx) => {
        const todos = await ctx.db.query("todos").collect();
        return todos.reverse();
    }
})

export const createTodo = zMutation({
    args: createTodoSchema.shape,  
    handler: async (ctx, args: { title: string, completed: boolean }) => {
        const todo = await ctx.db.insert("todos", {
            title: args.title,
            completed: false
        });
        return todo;
    }
});

export const updateTodo = zMutation({   
    args: updateTodoSchema.shape,
    handler: async (ctx, args) => {
        const todo = await ctx.db.patch(args.id, {
            title: args.title,
            completed: args.completed
        });
        return todo;
    }
});

export const deleteTodo = zMutation({
    args: deleteTodoSchema.shape,
    handler: async (ctx, args) => {
        const todo = await ctx.db.delete(args.id);
        return todo;
    }
});