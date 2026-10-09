"use client";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { ServiceRibbon } from "./service-ribbon";
import { Wireframe } from "../artwork/wireframe";

export function ServiceShowcase({
  children,
  count,
}: {
  children: ReactNode;
  count: number;
}) {
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [enhanced, setEnhanced] = useState(false);

  useEffect(() => {
    const media = matchMedia(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
    );
    const update = () => setEnhanced(media.matches && count > 1);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [count]);

  useEffect(() => {
    const host = root.current,
      viewport = stage.current,
      row = track.current;
    if (!host || !viewport || !row) return;
    if (!enhanced) {
      row.style.removeProperty("transform");
      host.style.removeProperty("--services-travel");
      delete host.dataset.progress;
      return;
    }
    let frame = 0,
      travel = 0,
      previous = -1;
    const update = () => {
      frame = 0;
      const offset = Math.max(
        0,
        Math.min(travel, -host.getBoundingClientRect().top),
      );
      if (offset === previous) return;
      previous = offset;
      row.style.transform = `translate3d(${-offset}px, 0, 0)`;
      const progress = travel > 0 ? offset / travel : 0;
      host.dataset.progress = String(progress);
      host.dispatchEvent(
        new CustomEvent("services:progress", { detail: progress }),
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const measure = () => {
      travel = Math.max(0, row.scrollWidth - viewport.clientWidth);
      host.style.setProperty("--services-travel", `${travel}px`);
      previous = -1;
      schedule();
    };
    const moveTo = (panel: HTMLElement) => {
      const index = Number(panel.dataset.serviceIndex);
      if (!Number.isFinite(index)) return;
      const top = host.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: top + index * viewport.clientWidth,
        behavior: "instant",
      });
    };
    const hashChange = () => {
      let id: string;
      try {
        id = decodeURIComponent(window.location.hash.slice(1));
      } catch {
        return;
      }
      const target = document.getElementById(id);
      const panel = target?.closest<HTMLElement>("[data-service-index]");
      if (panel && host.contains(panel)) moveTo(panel);
    };
    const focus = (event: FocusEvent) => {
      const panel = (event.target as HTMLElement).closest<HTMLElement>(
        "[data-service-index]",
      );
      if (!panel) return;
      const bounds = panel.getBoundingClientRect();
      if (bounds.left < -1 || bounds.right > viewport.clientWidth + 1)
        moveTo(panel);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    measure();
    hashChange();
    host.addEventListener("focusin", focus);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("hashchange", hashChange);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      host.removeEventListener("focusin", focus);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("hashchange", hashChange);
      row.style.removeProperty("transform");
    };
  }, [enhanced, count]);

  return (
    <div
      id="services"
      ref={root}
      data-enhanced={enhanced}
      className="group/services relative bg-black min-[1024px]:data-[enhanced=true]:h-[calc(100svh+var(--services-travel))]"
      style={
        {
          "--services-travel": `calc(${Math.max(0, count - 1)} * 100vw)`,
        } as CSSProperties
      }
    >
      <div
        ref={stage}
        data-services-stage
        className="relative isolate min-[1024px]:group-data-[enhanced=true]/services:sticky min-[1024px]:group-data-[enhanced=true]/services:top-0 min-[1024px]:group-data-[enhanced=true]/services:h-svh min-[1024px]:group-data-[enhanced=true]/services:overflow-clip"
      >
        <Wireframe
          variant="services"
          className="pointer-events-none absolute inset-0 -z-20 hidden size-full opacity-80 min-[1024px]:group-data-[enhanced=true]/services:block"
        />
        {enhanced && <ServiceRibbon source={root} count={count} />}
        <div
          ref={track}
          data-services-track
          className="relative min-[1024px]:group-data-[enhanced=true]/services:flex min-[1024px]:group-data-[enhanced=true]/services:h-full min-[1024px]:group-data-[enhanced=true]/services:w-max min-[1024px]:group-data-[enhanced=true]/services:will-change-transform"
        >
          {children}
        </div>
      </div>
    </div>
  );
}
