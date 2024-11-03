/* eslint-disable @typescript-eslint/no-unused-vars */

import { z } from "zod";

// Common

const ItemData = z.object({
  createdAt: z.number().nullable(),
  id: z.number(),
  nav: z.number(),
  navDate: z.string(),
  productId: z.number(),
});

export const NavHistoryResponseSchema = z.object({
  data: z.array(ItemData),
  code: z.number(),
  message: z.string(),
  status: z.number(),
  target: z.null(),
  time: z.number(),
  extra: z.object({
    clientCode: z.string(),
    clientVersion: z.string(),
    cmsVersion: z.string(),
  }),
});

export type NavHistoryResponse = z.infer<typeof NavHistoryResponseSchema>;
