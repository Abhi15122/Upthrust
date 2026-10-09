import { siteUrl } from "@/lib/sanity/site-url";
import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/demo", "/api/"] },
    sitemap: new URL("/sitemap.xml", siteUrl()).href,
  };
}
