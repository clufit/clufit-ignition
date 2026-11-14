import { useEffect, useRef, useState } from "react";
import squat from "@/assets/clufit-squat.jpg";
import hero from "@/assets/clufit-hero.jpg";
import ropes from "@/assets/clufit-ropes.jpg";

const topics = [
  { label: "Strength", image: squat },
  { label: "Hypertrophy", image: hero },
  { label: "Fat Loss", image: "/images/about-banner.png" },
  { label: "Habits", image: ropes },
  { label: "Nutrition", image: "/images/about-bottom.png" },
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
