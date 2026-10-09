import type { Content } from "@/lib/sanity/content";
import { Newsletter } from "../newsletter/newsletter";
import { FooterWordmark } from "./footer-artwork";
import { Wireframe } from "../artwork/wireframe";
const styles = {
  footer:
    "bg-black pt-[16.8vw] text-xs leading-[1.25] text-white [font-family:Arial,Helvetica,sans-serif] min-[1600px]:pt-[269px] max-[540px]:pt-[95px]",
  wordmark:
    "mx-auto w-[90%] [&_svg]:block [&_svg]:h-auto [&_svg]:w-full [&>img]:block [&>img]:h-auto [&>img]:w-full [&_text]:fill-white [&_text]:font-display [&_text]:text-[180px] min-[1600px]:max-w-[1440px] max-[540px]:w-[94%]",
  wordmarkSvg: "block h-auto w-full",
  grid: "grid min-h-[410px] grid-cols-[61.7%_38.3%] border-t border-[#8a8a8a] max-[800px]:grid-cols-[56%_44%] max-[540px]:min-h-0 max-[540px]:grid-cols-1",
  left: "flex min-w-0 flex-col max-[540px]:min-h-[205px]",
  contacts:
    "grid grid-cols-3 pt-[18px] max-[800px]:grid-cols-2 max-[540px]:pt-6",
  contact: "min-w-0 px-[17px] max-[800px]:px-3 max-[540px]:px-[18px]",
  websiteLink:
    "inline-flex items-center gap-[7px] whitespace-nowrap [&>span:first-child]:underline [&>span:first-child]:underline-offset-2 [&>span:last-child]:text-[19px] [&>span:last-child]:leading-none",
  contactDetails:
    "mt-[38px] [&_p]:m-0 [&>a]:text-[#808080] [&>a]:[overflow-wrap:anywhere] max-[540px]:mt-[27px]",
  note: "mx-[17px] mt-auto mb-[18px] text-[#808080] max-[800px]:ml-3 max-[540px]:mx-[18px] max-[540px]:mt-[45px] max-[540px]:mb-6",
  right:
    "flex min-w-0 flex-col border-l border-[#8a8a8a] px-[18px] pt-[18px] pb-[19px] max-[800px]:px-3.5 max-[540px]:border-t max-[540px]:border-l-0 max-[540px]:px-[18px] max-[540px]:py-6",
  newsletter: "max-w-[320px] max-[540px]:max-w-[360px]",
  siteLinks:
    "mt-auto flex flex-wrap gap-[22px] pt-[35px] max-[800px]:gap-[15px] max-[540px]:mt-[35px] max-[540px]:gap-6 max-[540px]:pt-0",
  legal:
    "mt-20 text-[#808080] [&_p]:m-0 [&>a]:block [&>span]:block max-[540px]:mt-[54px]",
  socials: "mb-[13px]! text-white",
  wireframe: "block h-[72px] w-full overflow-hidden max-[540px]:h-[55px]",
} as const;

export function Footer({ settings }: { settings: Content["settings"] }) {
  return (
    <footer id="contact" className={styles.footer}>
      <div className={styles.wordmark}>
        {settings.footerWordmark ? (
          <img
            src={settings.footerWordmark}
            alt={settings.footerWordmarkAlt || settings.siteName}
            width="1174"
            height="184"
          />
        ) : (
          <FooterWordmark
            className={styles.wordmarkSvg}
            label={settings.siteName}
            emblem={settings.footerEmblem || "/images/footer-emblem.png"}
          />
        )}
      </div>
      <div className={styles.grid}>
        <div className={styles.left}>
          <div className={styles.contacts}>
            {settings.contacts.map((contact) => (
              <div className={styles.contact} key={contact.url}>
                <a className={styles.websiteLink} href={contact.url}>
                  <span>{contact.label}</span>
                  <span aria-hidden="true">↗</span>
                </a>
                <div className={styles.contactDetails}>
                  {contact.description && <p>{contact.description}</p>}
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </div>
              </div>
            ))}
          </div>
          {settings.footerNote && (
            <p className={styles.note}>{settings.footerNote}</p>
          )}
        </div>
        <div className={styles.right}>
          <div className={styles.newsletter} id="newsletter">
            <Newsletter copy={settings} compact />
          </div>
          <div className={styles.siteLinks}>
            {settings.contacts.map((contact) => (
              <a
                key={contact.url}
                className={styles.websiteLink}
                href={contact.url}
              >
                <span>{contact.label}</span>
                <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
          <div className={styles.legal}>
            {(settings.socialLinks?.length || settings.socialText) && (
              <p className={styles.socials}>
                {settings.socialLinks?.length
                  ? settings.socialLinks.map((link, index) => (
                      <span key={link.href}>
                        {index > 0 && ", "}
                        <a href={link.href}>{link.label}</a>
                      </span>
                    ))
                  : settings.socialText}
              </p>
            )}
            {settings.privacyPolicyUrl ? (
              <a href={settings.privacyPolicyUrl}>
                {settings.privacyPolicyLabel}
              </a>
            ) : (
              <span>{settings.privacyPolicyLabel}</span>
            )}
            <p>© {settings.copyrightName || settings.siteName}</p>
          </div>
        </div>
      </div>
      <Wireframe className={styles.wireframe} />
    </footer>
  );
}
