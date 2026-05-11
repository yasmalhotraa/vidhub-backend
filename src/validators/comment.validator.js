import * as z from "zod";

const commentBodySchema = z.object({
  content: z
    .string({ error: "Content is required" })
    .trim()
    .min(1, "Content is required"),
});

export { commentBodySchema };
