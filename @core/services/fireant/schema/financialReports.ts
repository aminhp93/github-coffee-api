/* eslint-disable @typescript-eslint/no-unused-vars */

import { z } from "zod";

// Financial Reports
const FinancialReportSchema = z.object({
  symbol: z.string(),
  columns: z.array(z.string()),
  rows: z.array(z.array(z.union([z.string(), z.number()]))),
});

export type FinancialReportsResponse = z.infer<typeof FinancialReportSchema>;
