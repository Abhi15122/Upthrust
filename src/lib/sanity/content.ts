import "server-only";
import { cache } from "react";
import { createClient } from "@sanity/client";
import { page, clients, services, settings } from "../../content/defaults";

const query = `{
  "home": *[_id == "homePage"][0]{
    ..., "heroImage": heroImage.asset->url, "heroImageAlt": heroImage.alt,
    testimonials[]{..., "image": image.asset->url},
    clientLogos[]{name, "image": image.asset->url, "alt": image.alt},
    services[]->{..., "id": slug.current, "image": image.asset->url, "imageAlt": image.alt},
    seo{..., "image": image.asset->url}
  },
  "settings": *[_id == "siteSettings"][0]{
    ..., "logo": logo.asset->url, "footerWordmark": footerWordmark.asset->url, "footerWordmarkAlt": footerWordmark.alt, "footerEmblem": footerEmblem.asset->url
  }
}`;
type Client = { name: string; image: string; alt: string };
type Service = (typeof services)[number] & {
  imageAlt?: string;
  eyebrow?: string;
  contactLink?: { label: string; href: string };
};
export type Content = {
  page: typeof page & {
    heroImage?: string;
    heroImageAlt?: string;
    introHeading?: string;
    introBody?: string;
    faqHeading?: string;
    faqs?: Array<{ _key: string; question: string; answer: string }>;
    testimonials?: Array<{
      _key: string;
      quote: string;
      name: string;
      role: string;
      image?: string;
    }>;
    seo: typeof page.seo & { image?: string };
  };
  clients: Client[];
  services: Service[];
  settings: typeof settings & {
    logo?: string;
    footerWordmark?: string;
    footerWordmarkAlt?: string;
    footerEmblem?: string;
    socialLinks?: Array<{ label: string; href: string }>;
    privacyPolicyUrl?: string;
  };
};
const local: Content = {
  page,
  services,
  settings,
  clients: clients.map((name) => ({ name, image: "", alt: name })),
};
const isString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

export const getContent = cache(async (): Promise<Content> => {
  if (process.env.SANITY_ENABLED !== "true") return local;
  const projectId = process.env.SANITY_PROJECT_ID;
  if (!projectId)
    throw new Error("SANITY_PROJECT_ID is required when Sanity is enabled.");
  const client = createClient({
    projectId,
    dataset: process.env.SANITY_DATASET || "production",
    apiVersion: "2025-02-19",
    perspective: "published",
    useCdn: false,
  });
  const result = await client.fetch(query);
  const home = result?.home;
  const site = result?.settings;
  if (!home || !site)
    throw new Error(
      "Publish Homepage and Site settings in Sanity before enabling the CMS.",
    );
  for (const key of [
    "headlineTop",
    "headlineMiddle",
    "headlineBottom",
    "strategyStatement",
    "comfortStatement",
    "trustStatistic",
    "trustDescription",
  ]) {
    if (!isString(home[key]))
      throw new Error("The published homepage is missing " + key + ".");
  }
  if (!isString(home.seo?.title) || !isString(home.seo?.description))
    throw new Error("The published homepage needs SEO metadata.");
  if (!Array.isArray(home.disciplines) || !home.disciplines.every(isString))
    throw new Error("The published homepage needs valid disciplines.");
  if (!Array.isArray(home.services) || !home.services.length)
    throw new Error("The published homepage needs services.");
  for (const service of home.services) {
    if (
      !service ||
      !isString(service.title) ||
      !isString(service.summary) ||
      !isString(service.id) ||
      !/^[a-z0-9-]+$/.test(service.id) ||
      !Array.isArray(service.capabilities) ||
      !service.capabilities.every(isString) ||
      !service.capabilities.length ||
      (service.image && !isString(service.imageAlt))
    ) {
      throw new Error(
        "A published service is missing valid text or an image description.",
      );
    }
  }
  if (
    !Array.isArray(site.contacts) ||
    !site.contacts.length ||
    !site.contacts.every(
      (contact: Content["settings"]["contacts"][number]) =>
        contact &&
        isString(contact.label) &&
        isString(contact.url) &&
        isString(contact.email),
    ) ||
    ![
      site.siteName,
      site.copyrightName,
      site.newsletterHeading,
      site.newsletterConsent,
      site.newsletterPlaceholder,
      site.newsletterSubmitLabel,
      site.newsletterSuccessMessage,
    ].every(isString) ||
    (site.footerWordmark && !isString(site.footerWordmarkAlt)) ||
    (site.socialLinks != null &&
      (!Array.isArray(site.socialLinks) ||
        !site.socialLinks.every(
          (link: { label: string; href: string }) =>
            link && isString(link.label) && isString(link.href),
        )))
  ) {
    throw new Error("The published site settings are incomplete.");
  }
  return {
    page: { ...page, ...home },
    clients: (home.clientLogos || []).map((client: Client) => ({
      ...client,
      image: client.image || "",
      alt: client.alt || client.name,
    })),
    services: home.services.map((service: Service) => ({
      ...service,
      image: service.image || "",
      note: service.note || "",
    })),
    settings: {
      ...settings,
      ...site,
      footerNote: site.footerNote ?? "",
      socialText: site.socialText ?? "",
      privacyPolicyLabel:
        site.privacyPolicyLabel ?? settings.privacyPolicyLabel,
      contacts: site.contacts.map(
        (contact: Content["settings"]["contacts"][number]) => ({
          ...contact,
          description: contact.description ?? "",
        }),
      ),
    },
  };
});
