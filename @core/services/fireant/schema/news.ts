import { z } from "zod";
import { PostItemSchema, PostSchema } from "./posts";

export type NewsItem = z.infer<typeof PostItemSchema>;
export type NewsResponse = z.infer<typeof PostSchema>;
