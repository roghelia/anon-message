import { z } from "zod";

export const acceptMessagesSchema = z.object({
  accpetMessages: z.boolean(),
})