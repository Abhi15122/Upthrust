import { siteUrl } from "@/lib/sanity/site-url";
import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: new URL("/", siteUrl()).href,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
