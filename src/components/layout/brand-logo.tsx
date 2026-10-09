export function BrandLogo({
  className,
  logo,
}: {
  className?: string;
  logo?: string;
}) {
  if (logo) return <img className={className} src={logo} alt="Upthrust" />;
  return (
    <svg
      className={className}
      viewBox="70 18 162 34"
      role="img"
      aria-label="Upthrust"
    >
      <image href="/images/figma-hero.png" width="1440" height="1297" />
    </svg>
  );
}
