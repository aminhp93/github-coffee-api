/* eslint-disable @typescript-eslint/no-unused-vars */

import { z } from "zod";

const UserSchema = z.object({
  name: z.string(),
  profile_image_90: z.string(),
  username: z.string(),
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
  public_reaction_categories: z.array(z.string()),
  comments_count: z.number(),
  video_duration_string: z.string(),
  published_at_int: z.number(),
  tag_list: z.array(z.string()),
  flare_tag: z.string().nullable(),
  user: UserSchema,
  organization: OrganizationSchema,
});

export type Article = z.infer<typeof ArticleSchema>;
export type ArticleList = Article[];

const SearchResponseSchema = z.object({
  result: z.array(ArticleSchema),
});

export type SearchResponse = z.infer<typeof SearchResponseSchema>;

// Stories

const StoriesUserSchema = z.object({
  name: z.string(),
  username: z.string(),
  slug: z.string(),
  profile_image_90: z.string(),
  profile_image_url: z.string(),
});

const ReactionCategorySchema = z.object({
  slug: z.string(),
  name: z.string(),
  icon: z.string(),
  position: z.number(),
});

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
  user: StoriesUserSchema,
  pinned: z.boolean(),
  main_image: z.string(),
  tag_list: z.array(z.string()),
  readable_publish_date: z.string(),
  flare_tag: z.string().nullable(),
  class_name: z.string(),
  cloudinary_video_url: z.string().nullable(),
  published_at_int: z.number(),
  published_timestamp: z.string(),
  main_image_background_hex_color: z.string(),
  public_reaction_categories: z.array(ReactionCategorySchema),
  top_comments: z.array(TopCommentSchema),
});

export type StoriesItem = z.infer<typeof StoriesItemSchema>;
export type StoriesResponse = StoriesItem[];
