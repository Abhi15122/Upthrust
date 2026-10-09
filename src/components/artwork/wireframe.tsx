/** Decorative warped grids shared by the footer and service backgrounds. */
export function Wireframe({
  className,
  variant = "footer",
}: {
  className?: string;
  variant?: "footer" | "services";
}) {
  if (variant === "footer") return <FooterGrid className={className} />;
  return (
    <img
      data-service-wireframe
      className={className}
      src="/svgs/services-wireframe.svg"
      width="1440"
      height="900"
      alt=""
      aria-hidden="true"
    />
  );
}

function FooterGrid({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1308 72"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
    >
      <g stroke="#353535" strokeWidth="1">
        {Array.from({ length: 34 }, (_, i) => {
          const x = i * 42 - 70;
          return (
            <path
              key={`v${i}`}
              d={`M ${x} -20 C ${x - 25} 14, ${x + (i < 13 ? -65 : 35)} 43, ${x + (i < 13 ? -80 : 65)} 92`}
            />
          );
        })}
        {Array.from({ length: 8 }, (_, i) => (
          <path
            key={`h${i}`}
            d={`M -80 ${82 - i * 16} C 230 ${16 - i * 24}, 315 ${-24 - i * 13}, 550 ${59 - i * 16} S 860 ${87 - i * 24}, 1035 ${8 - i * 22} S 1190 ${-10 - i * 9}, 1380 ${-34 - i * 5}`}
          />
        ))}
        <path d="M 0 69 C 360 62, 406 29, 642 59 S 1020 35, 1308 38" />
      </g>
    </svg>
  );
}
