import { z } from "zod";

export const CuisineSchema = z.enum([
  "American",
  "Chinese",
  "Ethiopian",
  "French",
  "Indian",
  "Italian",
  "Japanese",
  "Korean",
  "Mexican",
  "Thai",
]);
export type Cuisine = z.output<typeof CuisineSchema>;

export const PriceTierSchema = z.enum(["$", "$$", "$$$", "$$$$"]);
export type PriceTier = z.output<typeof PriceTierSchema>;

const trimAndCoerceEmptyToNull = (value: unknown): unknown => {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
};

const IsoDateTimeUtc = z.iso.datetime({ offset: false });

export const PlaceSchema = z.strictObject({
  id: z.uuid(),
  name: z.string().min(1).max(200),
  neighborhood: z.string().max(120).nullable(),
  cuisine: CuisineSchema.nullable(),
  priceTier: PriceTierSchema.nullable(),
  websiteUrl: z.url({ protocol: /^https?$/ }).nullable(),
  createdAt: IsoDateTimeUtc,
  updatedAt: IsoDateTimeUtc,
});
export type Place = z.output<typeof PlaceSchema>;

export const CreatePlaceSchema = z.strictObject({
  name: z.string().trim().min(1).max(200),
  neighborhood: z
    .preprocess(trimAndCoerceEmptyToNull, z.string().max(120).nullable())
    .default(null),
  cuisine: CuisineSchema.nullable().default(null),
  priceTier: PriceTierSchema.nullable().default(null),
  websiteUrl: z
    .preprocess(
      trimAndCoerceEmptyToNull,
      z.url({ protocol: /^https?$/ }).nullable(),
    )
    .default(null),
});
export type CreatePlaceInput = z.input<typeof CreatePlaceSchema>;
export type CreatePlace = z.output<typeof CreatePlaceSchema>;

export const UpdatePlaceSchema = z.strictObject({
  name: z.string().trim().min(1).max(200).optional(),
  neighborhood: z
    .preprocess(trimAndCoerceEmptyToNull, z.string().max(120).nullable())
    .optional(),
  cuisine: CuisineSchema.nullable().optional(),
  priceTier: PriceTierSchema.nullable().optional(),
  websiteUrl: z
    .preprocess(
      trimAndCoerceEmptyToNull,
      z.url({ protocol: /^https?$/ }).nullable(),
    )
    .optional(),
});
export type UpdatePlaceInput = z.input<typeof UpdatePlaceSchema>;
export type UpdatePlace = z.output<typeof UpdatePlaceSchema>;
