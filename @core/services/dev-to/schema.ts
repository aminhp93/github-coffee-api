/* eslint-disable @typescript-eslint/no-unused-vars */

import { z } from "zod";

// Common

const FlareTagSchema = z.object({
  name: z.string(),
  bg_color_hex: z.string(),
  text_color_hex: z.string(),
});

const PublicReactionCategorySchema = z.object({
  slug: z.string(),
  name: z.string(),
  icon: z.string(),
  position: z.number(),
});

const UserSchema = z.object({
  name: z.string(),
  username: z.string(),
  slug: z.string().optional(),
  profile_image_90: z.string(),
  profile_image_url: z.string().optional(),
  cached_base_subscriber: z.boolean().optional(),
  "cached_base_subscriber?": z.boolean().optional(),
});

const OrganizationSchema = z.object({
  name: z.string(),
  profile_image_90: z.string(),
  slug: z.string(),
});

const ArticleSchema = z.object({
  class_name: z.string(),
  cloudinary_video_url: z.string().nullable(),
  id: z.number(),
  path: z.string(),
  public_reactions_count: z.number(),
  readable_publish_date: z.string(),
  reading_time: z.number(),
  title: z.string(),
  user_id: z.number(),
  public_reaction_categories: z.array(PublicReactionCategorySchema),
  comments_count: z.number(),
  video_duration_string: z.string(),
  published_at_int: z.number(),
  tag_list: z.array(z.string()),
  flare_tag: FlareTagSchema.nullable(),
  user: UserSchema,
  organization: OrganizationSchema.optional(),
});

export type Article = z.infer<typeof ArticleSchema>;
export type ArticleList = Article[];

export const SearchResponseSchema = z.object({
  result: z.array(ArticleSchema),
});

export type SearchResponse = z.infer<typeof SearchResponseSchema>;

// Stories

const TopCommentSchema = z.object({
  comment_id: z.number(),
  user_id: z.number(),
  published_timestamp: z.string(),
  published_at_int: z.number(),
  safe_processed_html: z.string(),
  path: z.string(),
  username: z.string(),
  name: z.string(),
  profile_image_90: z.string(),
});

const StoriesItemSchema = z.object({
  title: z.string(),
  path: z.string(),
  id: z.number(),
  user_id: z.number(),
  comments_count: z.number(),
  public_reactions_count: z.number(),
  organization_id: z.number().nullable(),
  reading_time: z.number(),
  video_thumbnail_url: z.string().nullable(),
  video: z.string().nullable(),
  video_duration_in_minutes: z.string(),
  experience_level_rating: z.number(),
  experience_level_rating_distribution: z.number(),
  main_image_height: z.number(),
  user: UserSchema,
  pinned: z.boolean(),
  main_image: z.string().nullable(),
  tag_list: z.array(z.string()),
  readable_publish_date: z.string(),
  flare_tag: FlareTagSchema.nullable(),
  class_name: z.string(),
  cloudinary_video_url: z.string().nullable(),
  published_at_int: z.number(),
  published_timestamp: z.string(),
  main_image_background_hex_color: z.string(),
  public_reaction_categories: z.array(PublicReactionCategorySchema),
  top_comments: z.array(TopCommentSchema),
});

export const StoriesResponseSchema = z.array(StoriesItemSchema);

export type StoriesItem = z.infer<typeof StoriesItemSchema>;
export type StoriesResponse = StoriesItem[];
