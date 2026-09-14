import { describe, expect, it } from "vitest";
import {
  CreatePlaceSchema,
  PlaceSchema,
  UpdatePlaceSchema,
} from "./places.ts";

const validPlace = {
  id: "11111111-1111-4111-8111-111111111111",
  name: "Joe's Pizza",
  neighborhood: "Brooklyn",
  cuisine: "Italian",
  priceTier: "$$",
  websiteUrl: "https://joespizza.example",
  createdAt: "2026-09-14T12:00:00Z",
  updatedAt: "2026-09-14T12:00:00Z",
};

describe("PlaceSchema", () => {
  it("accepts a fully-populated valid record", () => {
    expect(PlaceSchema.parse(validPlace)).toEqual(validPlace);
  });

  it("accepts null on each nullable field", () => {
    const nulled = {
      ...validPlace,
      neighborhood: null,
      cuisine: null,
      priceTier: null,
      websiteUrl: null,
    };
    expect(PlaceSchema.parse(nulled)).toEqual(nulled);
  });

  it("rejects missing required fields", () => {
    for (const field of ["id", "name", "createdAt", "updatedAt"] as const) {
      const rest: Record<string, unknown> = { ...validPlace };
      delete rest[field];
      expect(() => PlaceSchema.parse(rest)).toThrow();
    }
  });

  it("rejects a non-UUID id", () => {
    expect(() =>
      PlaceSchema.parse({ ...validPlace, id: "not-a-uuid" }),
    ).toThrow();
  });

  it("rejects a createdAt with a timezone offset", () => {
    expect(() =>
      PlaceSchema.parse({
        ...validPlace,
        createdAt: "2026-09-14T12:00:00-04:00",
      }),
    ).toThrow();
  });

  it("rejects unknown top-level keys", () => {
    expect(() =>
      PlaceSchema.parse({ ...validPlace, extra: "nope" }),
    ).toThrow();
  });
});

describe("CreatePlaceSchema", () => {
  it("accepts { name } alone and fills nullable fields with null", () => {
    expect(CreatePlaceSchema.parse({ name: "Joe's Pizza" })).toEqual({
      name: "Joe's Pizza",
      neighborhood: null,
      cuisine: null,
      priceTier: null,
      websiteUrl: null,
    });
  });

  it("trims name and rejects if empty after trim", () => {
    expect(CreatePlaceSchema.parse({ name: "  Joe's Pizza  " }).name).toBe(
      "Joe's Pizza",
    );
    expect(() => CreatePlaceSchema.parse({ name: "   " })).toThrow();
  });

  it("coerces empty and whitespace-only neighborhood to null", () => {
    expect(
      CreatePlaceSchema.parse({ name: "X", neighborhood: "" }).neighborhood,
    ).toBeNull();
    expect(
      CreatePlaceSchema.parse({ name: "X", neighborhood: "   " })
        .neighborhood,
    ).toBeNull();
  });

  it("coerces empty and whitespace-only websiteUrl to null", () => {
    expect(
      CreatePlaceSchema.parse({ name: "X", websiteUrl: "" }).websiteUrl,
    ).toBeNull();
    expect(
      CreatePlaceSchema.parse({ name: "X", websiteUrl: "   " }).websiteUrl,
    ).toBeNull();
  });

  it("rejects websiteUrl with a non-http(s) scheme", () => {
    expect(() =>
      CreatePlaceSchema.parse({
        name: "X",
        websiteUrl: "ftp://example.com",
      }),
    ).toThrow();
    expect(() =>
      CreatePlaceSchema.parse({
        name: "X",
        websiteUrl: "javascript:alert(1)",
      }),
    ).toThrow();
  });

  it("rejects invalid enum values for cuisine and priceTier", () => {
    expect(() =>
      CreatePlaceSchema.parse({ name: "X", cuisine: "Klingon" }),
    ).toThrow();
    expect(() =>
      CreatePlaceSchema.parse({ name: "X", priceTier: "$$$$$" }),
    ).toThrow();
  });

  it("rejects passing id, createdAt, or updatedAt", () => {
    for (const field of ["id", "createdAt", "updatedAt"] as const) {
      expect(() =>
        CreatePlaceSchema.parse({
          name: "X",
          [field]: "2026-09-14T12:00:00Z",
        }),
      ).toThrow();
    }
  });
});

describe("UpdatePlaceSchema", () => {
  it("accepts an empty patch", () => {
    expect(UpdatePlaceSchema.parse({})).toEqual({});
  });

  it("accepts a single-field patch", () => {
    expect(UpdatePlaceSchema.parse({ name: "New Name" })).toEqual({
      name: "New Name",
    });
  });

  it("accepts null on nullable fields (clearing)", () => {
    const cleared = UpdatePlaceSchema.parse({
      neighborhood: null,
      cuisine: null,
      priceTier: null,
      websiteUrl: null,
    });
    expect(cleared).toEqual({
      neighborhood: null,
      cuisine: null,
      priceTier: null,
      websiteUrl: null,
    });
  });

  it("rejects null on name", () => {
    expect(() => UpdatePlaceSchema.parse({ name: null })).toThrow();
  });

  it("rejects passing id, createdAt, or updatedAt", () => {
    for (const field of ["id", "createdAt", "updatedAt"] as const) {
      expect(() =>
        UpdatePlaceSchema.parse({ [field]: "2026-09-14T12:00:00Z" }),
      ).toThrow();
    }
  });
});
