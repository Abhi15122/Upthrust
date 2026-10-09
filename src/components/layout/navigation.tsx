import { heroStyles as styles } from "../hero/hero-styles";
import { BrandLogo } from "./brand-logo";
export function Navigation({
  contact,
  logo,
}: {
  contact: { href: string; label: string };
  logo?: string;
}) {
  return (
    <header className={styles.navigation}>
      <a className={styles.brand} href="/" aria-label="Upthrust home">
        <BrandLogo logo={logo} />
      </a>
      <a className={styles.contact} href={contact.href}>
        {contact.label}
      </a>
    </header>
  );
}
