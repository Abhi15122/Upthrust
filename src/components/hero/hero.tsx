import type { Content } from "@/lib/sanity/content";
import { heroStyles as styles } from "./hero-styles";
import {
  HeroArtwork,
  HeroRegistration,
  TrustLogo,
  TrustRegistration,
} from "./hero-artwork";

const logoCrops: Record<string, { x: number; width: number }> = {
  zomato: { x: 291, width: 146 },
  BOSCH: { x: 488, width: 157 },
  "L’ORÉAL": { x: 699, width: 148 },
  VEGA: { x: 906, width: 120 },
  DELL: { x: 1074, width: 106 },
};

export function Hero({
  page,
  clients,
}: {
  page: Content["page"];
  clients: Content["clients"];
}) {
  const originalHeadline =
    page.headlineTop === "BOLD DESIGN" &&
    page.headlineMiddle === "THAT" &&
    page.headlineBottom === "PERFORMS";
  const changedHeadline = {
    top: page.headlineTop !== "BOLD DESIGN",
    middle: page.headlineMiddle !== "THAT",
    bottom: page.headlineBottom !== "PERFORMS",
  };
  const strategy = page.strategyStatement.split(" ");
  const comfort = page.comfortStatement.split(" ");
  return (
    <div className={styles.firstSection}>
      <section className={styles.hero} aria-labelledby="hero-title">
        <h1 id="hero-title" className="sr-only">
          <span>{page.headlineTop}</span>
          <span>{page.headlineMiddle}</span>
          <span>{page.headlineBottom}</span>
        </h1>
        <HeroArtwork className={styles.artwork} changed={changedHeadline} />
        {!originalHeadline && (
          <div className={styles.editableHeadline} aria-hidden="true">
            {changedHeadline.top && (
              <span className={styles.editableTop}>{page.headlineTop}</span>
            )}
            {changedHeadline.middle && (
              <span className={styles.editableMiddle}>
                {page.headlineMiddle}
              </span>
            )}
            {changedHeadline.bottom && (
              <span className={styles.editableBottom}>
                {page.headlineBottom}
              </span>
            )}
          </div>
        )}
        {page.heroImage && (
          <img
            src={page.heroImage}
            alt={page.heroImageAlt || ""}
            className={styles.customArtwork}
          />
        )}
        <p className={styles.strategy}>
          {strategy.slice(0, -1).join(" ")}
          <br />
          {strategy.at(-1)}
        </p>
        <p className={styles.comfort}>
          {comfort[0]}
          <br />
          {comfort.slice(1).join(" ")}
        </p>
        <ul className={styles.disciplines}>
          {page.disciplines.map((item) => (
            <li key={item}>
              {item}
              <span> ·</span>
            </li>
          ))}
        </ul>
        <HeroRegistration className={styles.registration} />
      </section>
      <section className={styles.trust} aria-label="Trusted by leading brands">
        <div className={styles.trustCopy}>
          <strong>{page.trustStatistic}</strong>
          <p>{page.trustDescription}</p>
        </div>
        <ul className={styles.logos}>
          {clients.map((client, index) => {
            const crop = logoCrops[client.name];
            return (
              <li
                key={`${client.name}-${index}`}
                style={crop ? { width: `${crop.width / 14.4}cqw` } : undefined}
              >
                {client.image ? (
                  <img src={client.image} alt={client.alt} />
                ) : crop ? (
                  <TrustLogo x={crop.x} width={crop.width} name={client.name} />
                ) : (
                  <span>{client.name}</span>
                )}
              </li>
            );
          })}
        </ul>
        <TrustRegistration className={styles.trustRegistration} />
      </section>
    </div>
  );
}
