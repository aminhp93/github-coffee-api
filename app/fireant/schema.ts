import { z } from "zod";

export const FundamentalSchema = z.object({
  symbol: z.null(),
  companyType: z.number(),
  sharesOutstanding: z.number(),
  freeShares: z.number(),
  beta: z.number(),
  dividend: z.number(),
  dividendYield: z.number(),
  marketCap: z.number(),
  low52Week: z.number(),
  high52Week: z.number(),
  priceChange1y: z.number(),
  avgVolume10d: z.number(),
  avgVolume3m: z.number(),
  pe: z.number(),
  eps: z.number(),
  sales_TTM: z.number(),
  netProfit_TTM: z.number(),
  insiderOwnership: z.number(),
  institutionOwnership: z.number(),
  foreignOwnership: z.number(),
});

export const WatchlistSchema = z.array(
  z.object({
    watchlistID: z.number(),
    name: z.string(),
    userName: z.string(),
    symbols: z.array(z.string()),
    displayIndex: z.number(),
  })
);

export type FundamentalType = z.infer<typeof FundamentalSchema>;
export type WatchlistType = z.infer<typeof WatchlistSchema>;

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  bio: z.nullable(z.string()),
  followed: z.boolean(),
});

const PostGroupSchema = z.object({
  postGroupID: z.number(),
  name: z.string(),
  description: z.nullable(z.string()),
});

const PostSourceSchema = z.object({
  postSourceID: z.number(),
  name: z.string(),
  url: z.string(),
});

const TaggedSymbolSchema = z.object({
  symbol: z.string(),
  price: z.number(),
  change: z.number(),
  percentChange: z.number(),
  changeSince: z.number(),
  percentChangeSince: z.number(),
});

const TaggedIndividualSchema = z.object({
  individualID: z.number(),
  name: z.string(),
});

const ImageSchema = z.object({
  imageID: z.number(),
  base64Image: z.nullable(z.string()),
  imageUrl: z.nullable(z.string()),
});

const PostSchema = z.object({
  postID: z.number(),
  userName: z.nullable(z.string()),
  user: UserSchema,
  title: z.string(),
  description: z.string(),
  type: z.number(),
  videoUrl: z.nullable(z.string()),
  videoThumbnailUrl: z.nullable(z.string()),
  videoWidth: z.nullable(z.number()),
  videoHeight: z.nullable(z.number()),
  language: z.string(),
  postGroup: PostGroupSchema,
  postSource: PostSourceSchema,
  isSourceContentFull: z.boolean(),
  postSourceUrl: z.nullable(z.string()),
  content: z.nullable(z.string()),
  originalContent: z.nullable(z.string()),
  date: z.string(),
  priority: z.number(),
  hasImage: z.boolean(),
  hasFile: z.boolean(),
  link: z.nullable(z.string()),
  linkImage: z.nullable(z.string()),
  linkTitle: z.nullable(z.string()),
  linkDescription: z.nullable(z.string()),
  sentiment: z.number(),
  approved: z.boolean(),
  isTop: z.boolean(),
  isExpertIdea: z.boolean(),
  liked: z.boolean(),
  totalLikes: z.number(),
  totalReplies: z.number(),
  totalShares: z.number(),
  replyToPostID: z.nullable(z.number()),
  referToPostID: z.nullable(z.number()),
  taggedSymbols: z.array(TaggedSymbolSchema),
  taggedIndividuals: z.array(TaggedIndividualSchema),
  taggedHashTags: z.array(z.string()),
  taggedUsers: z.array(z.string()),
  images: z.array(ImageSchema),
  files: z.array(z.string()),
  roomID: z.nullable(z.string()),
  roomName: z.nullable(z.string()),
  isRoomSticky: z.boolean(),
  videoType: z.nullable(z.string()),
  isVideo: z.boolean(),
  isEmagazine: z.boolean(),
  isInfographic: z.boolean(),
});

export type PostType = z.infer<typeof PostSchema>;
