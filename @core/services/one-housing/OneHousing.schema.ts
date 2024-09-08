/* eslint-disable @typescript-eslint/no-unused-vars */

import { z } from "zod";

const ListRequestDataSchema = z.object({
  search_type: z.string(),
  property_provider_source: z.array(z.string()),
  available_for_sale: z.boolean(),
});

export type ListRequestData = z.infer<typeof ListRequestDataSchema>;

const GeolocationSchema = z.object({
  lat_cdnt: z.number(),
  long_cdnt: z.number(),
});

const GallerySchema = z.object({
  id: z.string(),
  category: z.string(),
  urls: z.array(z.string()).optional(),
  media_type: z.string(),
  created_date: z.number(),
  last_modified_date: z.number(),
});

const FacadeSchema = z.object({
  facade_width: z.number(),
  min_contiguous_road_width: z.number(),
  max_contiguous_road_width: z.number(),
  direction_code: z.string(),
  direction_name: z.string(),
});

const ViewCountSchema = z.object({
  count: z.number(),
  increased_by_week: z.number(),
});

const ConstructionSchema = z.object({
  number_of_floors: z.number(),
  number_of_basements: z.number(),
  gross_floor_area: z.number(),
  has_elevator: z.boolean(),
  has_swimming_pool: z.boolean(),
  construction_year: z.number(),
});

const ListResponseSchema = z.object({
  id: z.string(),
  project_id: z.string(),
  project_name: z.string(),
  province_code: z.string(),
  district_code: z.string(),
  province: z.string(),
  district: z.string(),
  inventory_code: z.string(),
  directions: z.array(z.string()),
  property_type: z.array(z.string()),
  property_group: z.string(),
  geolocation: GeolocationSchema,
  galleries: z.array(GallerySchema),
  classify: z.string(),
  min_selling_price: z.number(),
  max_selling_price: z.number(),
  min_unit_price: z.number(),
  max_unit_price: z.number(),
  min_area: z.number(),
  max_area: z.number(),
  urgent_sale: z.boolean(),
  status: z.string(),
  number_of_floors: z.number(),
  facade_directions: z.array(z.string()),
  available_for_sale_status: z.string(),
  facades: z.array(FacadeSchema),
  has_elevator: z.boolean(),
  has_swimming_pool: z.boolean(),
  legal_total_area: z.number(),
  main_road_dist: z.number(),
  main_street_name: z.string(),
  view_count: ViewCountSchema,
  constructions: z.array(ConstructionSchema),
});

export type ListResponseItem = z.infer<typeof ListResponseSchema>;

const ListResponse = z.object({
  data: z.array(ListResponseSchema),
  meta: z.object({
    code: z.string(),
    page: z.number(),
    size: z.number(),
    total: z.number(),
  }),
});

export type ListResponse = z.infer<typeof ListResponse>;
