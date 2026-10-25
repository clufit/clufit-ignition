import hero from "@/assets/clufit-hero.jpg";
import squat from "@/assets/clufit-squat.jpg";
import ropes from "@/assets/clufit-ropes.jpg";

export const images = { hero, squat, ropes };
export const categories = ["All", "Training", "Nutrition", "Habits & Mindset", "Recovery", "Athletes"] as const;

export const categorySlug = (category: string) => category.toLowerCase().replaceAll(" & ", "-").replaceAll(" ", "-");
