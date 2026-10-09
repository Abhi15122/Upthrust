import type { Content } from "@/lib/sanity/content";
import { ServiceBullet } from "./service-bullet";
import { Wireframe } from "../artwork/wireframe";

export function ServicePanel({
  service,
  contact,
  index,
}: {
  service: Content["services"][number];
  contact: { href: string; label: string };
  index: number;
}) {
  const refined = service.id === "product" || service.id === "creative";
  return (
    <section
      className="relative w-full shrink-0 overflow-hidden bg-black font-sans text-white min-[1024px]:group-data-[enhanced=true]/services:flex min-[1024px]:group-data-[enhanced=true]/services:h-full min-[1024px]:group-data-[enhanced=true]/services:w-screen min-[1024px]:group-data-[enhanced=true]/services:items-center min-[1024px]:group-data-[enhanced=true]/services:justify-center min-[1024px]:group-data-[enhanced=true]/services:bg-transparent"
      data-service={service.id}
      data-service-index={index}
      aria-labelledby={`title-${service.id}`}
    >
      <Wireframe
        variant="services"
        className="pointer-events-none absolute inset-0 size-full opacity-60 min-[1024px]:group-data-[enhanced=true]/services:hidden"
      />
      <img
        data-mobile-ribbon
        aria-hidden="true"
        alt=""
        src={`/images/ribbons/service-${index + 1}.webp`}
        width="720"
        height="720"
        loading="lazy"
        className="pointer-events-none absolute top-[125px] -left-[18%] block w-[136%] max-w-none opacity-100 [mask-image:linear-gradient(transparent,#000_15%,#000_55%,transparent_85%)] min-[601px]:top-0 min-[601px]:left-0 min-[601px]:w-full min-[1024px]:hidden"
      />
      <div className="@container relative w-full aspect-[16/9] min-[1024px]:group-data-[enhanced=true]/services:w-[min(100vw,calc((100svh-64px)*16/9))] max-[600px]:aspect-auto max-[600px]:px-[6%] max-[600px]:pt-12 max-[600px]:pb-[54px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[38%] right-[2%] hidden h-[51%] w-[49%] bg-[radial-gradient(ellipse_at_center,#000b_0%,#0008_50%,transparent_75%)] blur-[2cqw] min-[601px]:block"
        />
        <div
          data-service-heading
          className="absolute inset-x-[2.78%] top-[17.35%] max-[600px]:relative max-[600px]:inset-auto max-[600px]:mb-[30px]"
        >
          <p className="m-0 text-[1.074cqw] leading-[1.2] font-normal max-[600px]:mb-1.5 max-[600px]:text-[10px]">
            {service.eyebrow || "WHAT CAN WE DO FOR YOU"}
          </p>
          <h2
            id={`title-${service.id}`}
            className={[
              "m-0 leading-[1.04] selection:bg-transparent selection:text-white max-[600px]:text-[42px] max-[600px]:leading-[1.05]",
              refined
                ? "text-[6.6667cqw] font-semibold tracking-[-0.06em]"
                : "text-[6.25cqw] font-medium tracking-[-0.022em] max-[600px]:tracking-[-0.055em]",
            ].join(" ")}
          >
            {service.title}
          </h2>
        </div>
        <div
          data-service-content
          className="absolute inset-x-[8.3333%] top-[41.358%] grid grid-cols-[41%_45.6667%] items-start justify-between max-[600px]:relative max-[600px]:inset-auto max-[600px]:grid-cols-1 max-[600px]:gap-7"
        >
          <img
            data-service-collage
            className="block h-auto w-full rounded-[0.6cqw] max-[600px]:rounded-lg"
            src={
              service.image ||
              `/images/${service.id}-bento.${service.id === "creative" ? "svg" : "png"}`
            }
            alt={service.imageAlt || `${service.title} project collage`}
            width="492"
            height="332"
            loading="lazy"
          />
          <div
            data-service-copy
            className={[
              "flex h-[23.0556cqw] flex-col items-start text-[1.389cqw] leading-[1.4] max-[600px]:h-auto max-[600px]:text-base max-[600px]:leading-[1.45]",
              refined
                ? "font-semibold tracking-[-0.02em]"
                : "font-medium tracking-[-0.025em]",
            ].join(" ")}
          >
            <p
              className={`-mt-[0.4cqw] min-h-[3.8892cqw] max-w-[33cqw] ${service.id === "creative" ? "mb-[1cqw]" : "mb-[2.2cqw]"} max-[600px]:mt-0 max-[600px]:mb-6 max-[600px]:min-h-0 max-[600px]:max-w-none`}
            >
              {service.summary}
            </p>
            <ul className="m-0 grid list-none gap-[0.85cqw] p-0 max-[600px]:gap-3.5">
              {service.capabilities.map((capability) => (
                <li
                  key={capability}
                  className="flex items-baseline gap-[0.833cqw] max-[600px]:gap-2.5 [&>svg]:block [&>svg]:size-[1.1cqw] [&>svg]:shrink-0 [&>svg]:self-center [&>svg]:fill-white [&>svg]:stroke-orange [&>svg]:stroke-[1.5] [&>svg]:[stroke-linejoin:round] max-[600px]:[&>svg]:size-3.5"
                >
                  <ServiceBullet />
                  <span>{capability}</span>
                </li>
              ))}
            </ul>
            {service.note && (
              <p
                data-service-note
                className="mt-[1cqw] mb-0 max-w-[33.3333cqw] text-[0.972222cqw] leading-[1.5] font-normal tracking-[-0.02em] italic max-[600px]:mt-4 max-[600px]:max-w-none max-[600px]:text-xs"
              >
                {service.note}
              </p>
            )}
            <a
              data-service-contact
              className="mt-auto inline-block shrink-0 bg-white px-[1.4cqw] py-[1.1cqw] text-[2.22cqw] leading-none font-bold tracking-[-0.025em] text-orange no-underline hover:underline hover:underline-offset-4 max-[600px]:mt-7 max-[600px]:px-5 max-[600px]:py-[15px] max-[600px]:text-[26px]"
              href={service.contactLink?.href || contact.href}
            >
              {service.contactLink?.label || "CONTACT"}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
