import "./additional-services.css";
import type { Content } from "@/lib/sanity/content";

export function AdditionalServices({
  services,
  contact,
}: {
  services: Content["services"];
  contact: Content["page"]["contactLink"];
}) {
  if (!services.length) return null;
  return (
    <section className="services">
      {services.map((service, index) => (
        <article
          key={service.id}
          className={`service service-${index % 3}`}
          aria-labelledby={`title-${service.id}`}
        >
          <div className="service-top">
            <span className="service-number">0{index + 1}</span>
            <h3 id={`title-${service.id}`}>{service.title}</h3>
            <span className="service-cross" aria-hidden="true">
              ✳
            </span>
          </div>
          <div className="service-layout">
            <div className="service-artwork">
              {service.image ? (
                <img
                  src={service.image}
                  alt={service.imageAlt || service.title}
                  width="680"
                  height="480"
                  loading="lazy"
                />
              ) : (
                <div
                  className={`concept-art concept-${index % 3}`}
                  aria-hidden="true"
                >
                  <div className="art-caption">
                    <span>UPTHRUST / {service.id.toUpperCase()}</span>
                    <span>0{index + 1}</span>
                  </div>
                  {index % 3 === 0 ? (
                    <>
                      <div className="orbital-art">
                        <i />
                        <i />
                        <i />
                        <i />
                      </div>
                      <strong>
                        QUESTION
                        <br />
                        EVERYTHING.
                      </strong>
                      <span className="art-footnote">
                        A NEW WAY TO SEE WHAT’S NEXT. ↗
                      </span>
                    </>
                  ) : index % 3 === 1 ? (
                    <>
                      <div className="identity-letters">
                        <span>Aa</span>
                        <span>↗</span>
                      </div>
                      <strong>
                        BUILT TO
                        <br />
                        BE DISTINCT.
                      </strong>
                      <span className="art-footnote">
                        MAKE YOUR MARK. OWN YOUR SPACE.
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="campaign-star">✳</div>
                      <strong>
                        MAKE
                        <br />
                        SOME NOISE.
                      </strong>
                      <span className="art-footnote">
                        IDEAS THAT MOVE PEOPLE. ↗
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="service-copy">
              <p className="service-summary">{service.summary}</p>
              <ul>
                {service.capabilities.map((capability) => (
                  <li key={capability}>
                    <span aria-hidden="true">↗</span>
                    {capability}
                  </li>
                ))}
              </ul>
              {service.note && <p className="service-note">{service.note}</p>}
              <a
                className="service-contact"
                href={service.contactLink?.href || contact.href}
              >
                {service.contactLink?.label || "LET’S TALK"}
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
