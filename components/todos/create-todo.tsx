"use client";

import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z, ZodIssue } from "zod";
import { createTodoSchema } from "@/lib/zod";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ConvexError } from "convex/values";
import { Field, FieldError, FieldGroup, FieldLabel } from "../ui/field";
import { Button } from "../ui/button";

type TodoFormInput = z.input<typeof createTodoSchema>;
type TodoFormData = z.output<typeof createTodoSchema>;

export default function CreateTodo() {
  const createTodo = useMutation(api.todos.createTodo);

  const form = useForm<TodoFormInput, unknown, TodoFormData>({
    resolver: zodResolver(createTodoSchema),
    defaultValues: {
      title: "",
    },
  });

  useEffect(() => {
    const shouldFocusInput = !form.formState.isSubmitting;
    if (shouldFocusInput) {
      form.setFocus("title");
    }
  }, [form.formState.isSubmitting, form]);

  const getInputClassName = () => {
    const baseClasses =
      "px-4 py-7 focus:outline-none focus:ring-0 active:outline-none active:ring-0 focus-visible:ring-0 focus-visible:outline-none border";
    const errorClasses =
      "border-red-500 bg-red-500/10 shadow-lg shadow-red-500/20 focus:border-red-500";
    const defaultClasses =
      "shadow-md shadow-primary/20 border-primary/50 bg-primary text-primary-foreground placeholder:text-primary-foreground/50";

    return cn(
      baseClasses,
      form.formState.errors.title ? errorClasses : defaultClasses,
    );
  };

  const handleTodoCreation = async (data: TodoFormData) => {
    try {
      await createTodo({ title: data.title, completed: false });
      form.reset();
    } catch (error) {
      handleTodoCreationError(error);
    }
  };

  const handleTodoCreationError = (error: unknown) => {
    if (error instanceof ConvexError && error.data.ZodError) {
      const zodError = error.data.ZodError as ZodIssue[];
      const titleError = zodError.find((err) => err.path.includes("title"));
      if (titleError) {
        form.setError("title", { message: titleError.message });
      }
    } else {
      form.setError("title", { message: "Failed to create todo" });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleTodoCreation)} className="w-full">
      <FieldGroup>
        <Controller
          control={form.control}
          name="title"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <Input
                {...field}
                autoComplete="off"
                id="title"
                placeholder="What are you planning to do?"
                disabled={form.formState.isSubmitting}
                className={getInputClassName()}
              />
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />
      </FieldGroup>
    </form>
  );
}
