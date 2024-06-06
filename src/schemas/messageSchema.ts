import { z } from "zod";

export const messagesSchema = z.object({
  content: z
    .string()
    .min(10, "Content must be at least 10 characters long.")
    .max(500, "Content must be less than 500 characters long."),
})