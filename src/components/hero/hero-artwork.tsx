export function HeroArtwork({
  className,
  changed,
}: {
  className?: string;
  changed?: { top: boolean; middle: boolean; bottom: boolean };
}) {
  return (
    <svg className={className} viewBox="0 0 1440 1152" aria-hidden="true">
      <defs>
        <clipPath id="hero-original-art">
          <rect x="0" y="130" width="1440" height="200" />
          <rect x="450" y="240" width="660" height="695" />
          <rect x="0" y="895" width="1440" height="257" />
          <rect x="1080" y="590" width="360" height="562" />
          <rect x="1150" y="506" width="185" height="15" />
          <rect x="67" y="783" width="140" height="19" />
        </clipPath>
      </defs>
      <image
        href="/images/figma-hero.png"
        width="1440"
        height="1297"
        clipPath="url(#hero-original-art)"
      />
      {changed?.top && (
        <rect x="0" y="130" width="1440" height="200" fill="white" />
      )}
      {changed?.middle && (
        <rect x="790" y="535" width="350" height="155" fill="white" />
      )}
      {changed?.bottom && (
        <rect x="0" y="895" width="1440" height="257" fill="white" />
      )}
      <path
        d="M 387 541 C 352 523, 304 531, 283 545 C 264 560, 311 575, 350 573 C 391 571, 400 553, 376 537 C 351 525, 305 533, 298 548"
        fill="none"
        stroke="#ff4a00"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function RegistrationMark({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path
        d={`M${x - 10} ${y}h20 M${x} ${y - 10}v20`}
        stroke="white"
        strokeWidth="8"
      />
      <path d={`M${x - 5} ${y}h10 M${x} ${y - 5}v10`} stroke="#c7c7c7" />
    </g>
  );
}

export function HeroRegistration({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 1440 1152" aria-hidden="true">
      <g fill="none" strokeWidth="1">
        {[
          [288, 576],
          [1152, 576],
          [288, 864],
        ].map(([x, y]) => (
          <RegistrationMark key={`${x}-${y}`} x={x} y={y} />
        ))}
      </g>
    </svg>
  );
}

export function TrustLogo({
  x,
  width,
  name,
}: {
  x: number;
  width: number;
  name: string;
}) {
  return (
    <svg viewBox={`${x} 1200 ${width} 50`} role="img" aria-label={name}>
      <image href="/images/figma-hero.png" width="1440" height="1297" />
    </svg>
  );
}

export function TrustRegistration({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 1440 226" aria-hidden="true">
      <g fill="none">
        {[288, 576, 864, 1152].map((x) => (
          <RegistrationMark key={x} x={x} y={10} />
        ))}
      </g>
    </svg>
  );
}
