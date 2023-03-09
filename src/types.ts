import { z } from "zod";

export const todoInput = z
  .string({
    required_error: "Describe your Todo",
  })
  .min(1)
  .max(55);

export const todoUpdate = z.object({
  id: z.string(),
  completed: z.boolean(),
});
