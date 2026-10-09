export function FooterWordmark({
  className,
  emblem,
  label,
}: {
  className?: string;
  emblem: string;
  label: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 1174 184"
      role="img"
      aria-label={label}
    >
      <text x="0" y="166" textLength="660" lengthAdjust="spacingAndGlyphs">
        UPTHRUST
      </text>
      <image href={emblem} x="650" y="130" width="58" height="54" />
      <text x="716" y="166" textLength="458" lengthAdjust="spacingAndGlyphs">
        DESIGN
      </text>
    </svg>
  );
}
