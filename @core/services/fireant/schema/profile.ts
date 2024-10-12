import { z } from "zod";

export const ProfileSchema = z.object({
  institutionID: z.number(),
  symbol: z.string(),
  icbCode: z.string(),
  companyName: z.string(),
  shortName: z.string(),
  internationalName: z.string(),
  headQuarters: z.string(),
  phone: z.string(),
  fax: z.string(),
  email: z.string(),
  webAddress: z.string(),
  overview: z.string(),
  history: z.string(),
  businessAreas: z.string(),
  employees: z.number(),
  branches: z.number(),
  establishmentDate: z.string(),
  businessLicenseNumber: z.string(),
  dateOfIssue: z.string(),
  taxIDNumber: z.string(),
  charterCapital: z.number(),
  dateOfListing: z.string(),
  exchange: z.string(),
  initialListingPrice: z.number(),
  listingVolume: z.number(),
  stateOwnership: z.number(),
  foreignOwnership: z.number(),
  otherOwnership: z.number(),
  isListed: z.boolean(),
});

export type ProfileResponse = z.infer<typeof ProfileSchema>;