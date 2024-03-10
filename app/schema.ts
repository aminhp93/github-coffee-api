import { z } from "zod";

const RequestSchema = z.object({
  name: z.string(),
  url: z.string(),
});

const ResponseSchema = z.any();

export type RequestType = z.infer<typeof RequestSchema>;
export type ResponseType = z.infer<typeof ResponseSchema>;
