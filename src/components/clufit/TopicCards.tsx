import { useEffect, useRef, useState } from "react";
import strength from "@/assets/strength.webp";
import hypertrophy from "@/assets/hypertrophy.webp";
import habits from "@/assets/habits.webp";
import nutrition from "@/assets/nutrition.webp";

const topics = [
  { label: "Strength", image: strength },
  { label: "Hypertrophy", image: hypertrophy },
  { label: "Fat Loss", image: "/images/about-banner.png" },
  { label: "Habits", image: habits },
  { label: "Nutrition", image: nutrition },
] as const;

/** Mobile carousel scales up whichever card sits nearest the track's center. */
export function TopicCards() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(2);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    function onScroll() {
      if (!track) return;
      const center = track.getBoundingClientRect().left + track.clientWidth / 2;
      let closest = 0;
      let closestDist = Infinity;
      track.querySelectorAll<HTMLElement>(".topic-card").forEach((card, i) => {
        const rect = card.getBoundingClientRect();
        const dist = Math.abs(rect.left + rect.width / 2 - center);
        if (dist < closestDist) { closestDist = dist; closest = i; }
      });
      setActive(closest);
    }
    onScroll();
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="topic-cards" ref={trackRef}>
      {topics.map((t, i) => (
        <div key={t.label} className={`topic-card${i === active ? " is-active" : ""}`}>
          <img src={t.image} alt={`${t.label} training`} loading="lazy" />
          <span>{t.label}</span>
        </div>
      ))}
    </div>
  );
}
