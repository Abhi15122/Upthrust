// Shared Tailwind classes keep the existing header and hero on the same grid.
export const heroStyles = {
  firstSection:
    "@container ml-0.5 w-[calc(100%-8px)] bg-white bg-[linear-gradient(#00000018_1px,transparent_1px),linear-gradient(90deg,#00000018_1px,transparent_1px),linear-gradient(#00000028_1px,transparent_1px),linear-gradient(90deg,#00000028_1px,transparent_1px)] [background-size:calc((100vw-8px)/20)_calc((100vw-8px)/20),calc((100vw-8px)/20)_calc((100vw-8px)/20),calc((100vw-8px)/5)_calc((100vw-8px)/5),calc((100vw-8px)/5)_calc((100vw-8px)/5)] text-black [font-family:Arial,Helvetica,sans-serif]",
  navigation:
    "pointer-events-none absolute inset-x-0 top-0 z-5 flex items-start justify-between pt-[1.28vw] pr-[6.45vw] pl-[5.02vw] [&_a]:pointer-events-auto max-[600px]:pt-[2vw]",
  brand:
    "block h-[2.36vw] w-[11.25vw] [&_svg]:block [&_svg]:h-auto [&_svg]:w-full [&_img]:block [&_img]:h-auto [&_img]:w-full max-[600px]:h-auto max-[600px]:w-[15vw]",
  contact:
    "bg-transparent p-0 font-display text-[2.5vw] leading-none font-normal whitespace-nowrap text-orange no-underline hover:underline hover:underline-offset-[0.2em] max-[600px]:text-[3.1vw]",
  hero: "relative aspect-[1440/1152] overflow-hidden",
  artwork: "pointer-events-none absolute inset-0 size-full",
  registration: "pointer-events-none absolute inset-0 size-full",
  strategy:
    "absolute top-[43.9%] left-[20.278%] m-0 text-[1.736cqw] leading-[1.28] font-bold tracking-[-0.055em] max-[600px]:text-[1.8cqw]",
  comfort:
    "absolute top-[37%] left-[80.417%] m-0 text-[2.222cqw] leading-[1.26] font-bold tracking-[-0.055em] whitespace-nowrap max-[600px]:text-[2.2cqw]",
  disciplines:
    "absolute top-[56.05%] left-[5%] m-0 list-none p-0 text-[2.778cqw] leading-[1.2] font-bold tracking-[-0.055em] [&>li>span]:text-[0px] [&>li>span]:after:ml-[0.23em] [&>li>span]:after:inline-block [&>li>span]:after:size-[0.14em] [&>li>span]:after:rounded-full [&>li>span]:after:bg-current [&>li>span]:after:align-middle [&>li>span]:after:text-[2.778cqw] [&>li>span]:after:content-['']",
  editableHeadline:
    "pointer-events-none absolute inset-0 z-4 font-sans text-orange leading-[0.9] font-black tracking-[-0.08em] whitespace-nowrap italic [&>span]:absolute [&>span]:block",
  editableTop: "top-[11.5%] left-[2.6%] w-[95%] text-center text-[13.5cqw]",
  editableMiddle: "top-[49.2%] left-[56.7%] text-[8cqw]",
  editableBottom: "bottom-[8%] left-[7%] w-[87%] text-center text-[13.5cqw]",
  customArtwork:
    "absolute top-[21.5%] left-[31.5%] h-[59%] w-[37.5%] object-contain",
  trust:
    "relative min-h-[15.694cqw] border-t border-[#c9c9c9] max-[600px]:min-h-[18cqw]",
  trustCopy:
    "absolute top-[1.1cqw] left-[2.778%] w-[12.2%] [&_strong]:block [&_strong]:text-[3.472cqw] [&_strong]:leading-[1.15] [&_strong]:font-bold [&_strong]:tracking-[-0.04em] [&_p]:mt-[0.35cqw] [&_p]:mb-0 [&_p]:text-[1.111cqw] [&_p]:leading-[1.5] [&_p]:tracking-[-0.025em] max-[600px]:[&_p]:text-[1.3cqw]",
  logos:
    "absolute top-[3.2cqw] right-[3.6%] left-[20.28%] m-0 flex list-none items-center justify-between gap-[1cqw] p-0 [&_li]:flex-[0_1_auto] [&_svg]:block [&_svg]:h-auto [&_svg]:w-full [&_img]:block [&_img]:max-h-[3.472cqw] [&_img]:w-full [&_img]:object-contain [&_li>span]:text-[2cqw] [&_li>span]:font-bold",
  trustRegistration: "pointer-events-none absolute inset-0 h-auto w-full",
} as const;
