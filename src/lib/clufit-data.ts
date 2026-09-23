import hero from "@/assets/clufit-hero.jpg";
import squat from "@/assets/clufit-squat.jpg";
import ropes from "@/assets/clufit-ropes.jpg";

export const images = { hero, squat, ropes };
export const categories = ["All", "Training", "Nutrition", "Habits & Mindset", "Recovery", "Athletes"] as const;
export const articles = [
  { slug: "strength-without-the-noise", category: "Training", title: "Strength Without the Noise", deck: "The five movements that earn their place in every serious program.", image: squat, read: "6 min", author: "Maya Brooks", date: "September 18, 2026" },
  { slug: "eat-for-the-work", category: "Nutrition", title: "Eat for the Work", deck: "Fuel the session in front of you. Recover for the one after it.", image: ropes, read: "5 min", author: "Evan Cole", date: "September 15, 2026" },
  { slug: "the-partner-rule", category: "Habits & Mindset", title: "The Partner Rule", deck: "Accountability is not motivation. It is architecture.", image: hero, read: "4 min", author: "Nia James", date: "September 12, 2026" },
  { slug: "recovery-is-training", category: "Recovery", title: "Recovery Is Training", deck: "Adaptation happens after the last rep. Treat it that way.", image: squat, read: "7 min", author: "Dr. Leo Grant", date: "September 8, 2026" },
  { slug: "built-under-pressure", category: "Athletes", title: "Built Under Pressure", deck: "Three competitors on standards, nerves and showing up anyway.", image: ropes, read: "8 min", author: "Clufit Editors", date: "September 4, 2026" },
  { slug: "stop-testing-start-building", category: "Training", title: "Stop Testing. Start Building.", deck: "Why chasing a new max every week keeps you exactly where you are.", image: hero, read: "5 min", author: "Marcus Reed", date: "August 29, 2026" },
] as const;

export const categorySlug = (category: string) => category.toLowerCase().replaceAll(" & ", "-").replaceAll(" ", "-");
