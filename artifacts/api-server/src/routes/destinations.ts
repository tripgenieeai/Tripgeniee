import { Router } from "express";

const router = Router();

const POPULAR_DESTINATIONS = [
  {
    id: 1,
    name: "Bali",
    country: "Indonesia",
    imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    description: "Tropical paradise with stunning temples, rice terraces, and world-class beaches.",
    avgBudgetPerDay: 60,
    bestSeason: "Apr–Oct",
    tags: ["beach", "culture", "nature", "adventure"],
    rating: 4.8,
  },
  {
    id: 2,
    name: "Paris",
    country: "France",
    imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
    description: "The City of Light — iconic landmarks, world-class cuisine, and timeless romance.",
    avgBudgetPerDay: 150,
    bestSeason: "Apr–Jun, Sep–Nov",
    tags: ["culture", "food", "romance", "art"],
    rating: 4.7,
  },
  {
    id: 3,
    name: "Tokyo",
    country: "Japan",
    imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
    description: "A mesmerizing blend of ultramodern and traditional — neon lights, ancient temples, and incredible food.",
    avgBudgetPerDay: 120,
    bestSeason: "Mar–May, Sep–Nov",
    tags: ["culture", "food", "technology", "nature"],
    rating: 4.9,
  },
  {
    id: 4,
    name: "New York",
    country: "USA",
    imageUrl: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80",
    description: "The city that never sleeps — iconic skyline, diverse neighborhoods, and endless entertainment.",
    avgBudgetPerDay: 200,
    bestSeason: "Apr–Jun, Sep–Nov",
    tags: ["urban", "culture", "food", "shopping"],
    rating: 4.6,
  },
  {
    id: 5,
    name: "Santorini",
    country: "Greece",
    imageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80",
    description: "Dramatic volcanic cliffs, whitewashed villages, and sunsets that redefine beauty.",
    avgBudgetPerDay: 140,
    bestSeason: "May–Oct",
    tags: ["beach", "romance", "scenic", "food"],
    rating: 4.8,
  },
  {
    id: 6,
    name: "Dubai",
    country: "UAE",
    imageUrl: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=800&q=80",
    description: "Futuristic skyline meets ancient desert culture — luxury, adventure, and world records.",
    avgBudgetPerDay: 180,
    bestSeason: "Nov–Mar",
    tags: ["luxury", "shopping", "adventure", "modern"],
    rating: 4.6,
  },
  {
    id: 7,
    name: "Machu Picchu",
    country: "Peru",
    imageUrl: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&q=80",
    description: "The legendary Incan citadel perched above the Sacred Valley — a true wonder of the ancient world.",
    avgBudgetPerDay: 80,
    bestSeason: "May–Sep",
    tags: ["history", "adventure", "nature", "hiking"],
    rating: 4.9,
  },
  {
    id: 8,
    name: "Cape Town",
    country: "South Africa",
    imageUrl: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&q=80",
    description: "Mountains, ocean, vineyards, and wildlife — one of the world's most beautiful cities.",
    avgBudgetPerDay: 90,
    bestSeason: "Oct–Apr",
    tags: ["nature", "adventure", "beach", "wildlife"],
    rating: 4.7,
  },
];

// GET /api/destinations
router.get("/", async (req, res) => {
  res.json(POPULAR_DESTINATIONS);
});

export default router;
