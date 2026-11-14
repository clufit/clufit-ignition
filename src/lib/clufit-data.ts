export const categories = ["All", "Training", "Nutrition", "Habits & Mindset", "Recovery", "Athletes"] as const;

export const categorySlug = (category: string) => category.toLowerCase().replaceAll(" & ", "-").replaceAll(" ", "-");
