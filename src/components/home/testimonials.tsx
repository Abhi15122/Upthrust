import type { Content } from "@/lib/sanity/content";

export function Testimonials({
  items,
}: {
  items: Content["page"]["testimonials"];
}) {
  if (!items?.length) return null;
  return (
    <section className="bg-[#e8e9de] px-[7%] py-[90px] max-[600px]:px-[6%] max-[600px]:py-[60px]">
      <p className="mb-[35px] text-[10px] leading-[1.6] tracking-[1.5px]">
        IN GOOD COMPANY
      </p>
      <div className="grid gap-10 md:grid-cols-2">
        {items.map((t) => (
          <figure key={t._key}>
            <span className="text-6xl text-orange">“</span>
            <blockquote className="text-[28px] leading-[1.4] tracking-[-1px] max-[600px]:text-[25px]">
              {t.quote}
            </blockquote>
            <figcaption className="mt-[25px] flex items-center gap-3.5 text-xs [&_img]:size-12 [&_img]:rounded-full [&_img]:object-cover">
              {t.image && (
                <img
                  src={t.image}
                  alt=""
                  width="48"
                  height="48"
                  loading="lazy"
                />
              )}
              <div>
                <strong>{t.name}</strong>
                <p>{t.role}</p>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
