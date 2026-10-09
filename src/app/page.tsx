import type { Metadata } from "next";
import { getContent } from "@/lib/sanity/content";
import { Navigation } from "@/components/layout/navigation";
import { Hero } from "@/components/hero/hero";
import { ServicePanel } from "@/components/services/service-panel";
import { ServiceShowcase } from "@/components/services/service-showcase";
import { Footer } from "@/components/layout/footer";
import { AdditionalServices } from "@/components/services/additional-services";
import { Testimonials } from "@/components/home/testimonials";

export const dynamic = "force-dynamic";
export async function generateMetadata(): Promise<Metadata> {
  const { page } = await getContent();
  return {
    title: page.seo.title,
    description: page.seo.description,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      title: page.seo.title,
      description: page.seo.description,
      url: "/",
      images: [
        { url: page.seo.image || "/svgs/og-image.svg", alt: page.seo.title },
      ],
    },
  };
}
const panelServiceIds = new Set(["strategy", "brand", "product", "creative"]);
export default async function Home() {
  const { page, clients, services, settings } = await getContent();
  const panelServices = services.filter((service) =>
    panelServiceIds.has(service.id),
  );
  const remainingServices = services.filter(
    (service) => !panelServiceIds.has(service.id),
  );
  return (
    <>
      <div className="relative bg-[#fafaf7] bg-[linear-gradient(#2626260b_1px,transparent_1px),linear-gradient(90deg,#2626260b_1px,transparent_1px)] bg-size-[72px_72px] max-[600px]:bg-size-[44px_44px]">
        <Navigation contact={page.contactLink} logo={settings.logo} />
        <main id="main">
          <Hero page={page} clients={clients} />
          <ServiceShowcase count={panelServices.length}>
            {panelServices.map((service, index) => (
              <ServicePanel
                key={service.id}
                service={service}
                index={index}
                contact={page.contactLink}
              />
            ))}
          </ServiceShowcase>
          <AdditionalServices
            services={remainingServices}
            contact={page.contactLink}
          />
          <Testimonials items={page.testimonials} />
        </main>
      </div>
      <Footer settings={settings} />
    </>
  );
}
