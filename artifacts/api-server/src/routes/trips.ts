import { Router } from "express";
import { db, tripsTable } from "@workspace/db";
import { desc, eq } from "drizzle-orm";
import { logger } from "../lib/logger";
import {
  GenerateTripBody,
  SaveTripBody,
  GetTripParams,
  DeleteTripParams,
} from "@workspace/api-zod";

const router = Router();

async function callCohere(prompt: string): Promise<string> {
  const apiKey = process.env.COHERE_API_KEY;
  if (!apiKey) throw new Error("COHERE_API_KEY is not set");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60_000);

  try {
    const res = await fetch("https://api.cohere.com/v2/chat", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        model: "command-r-plus-08-2024",
        messages: [{ role: "user", content: prompt }],
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Cohere API error ${res.status}: ${body}`);
    }

    const data = (await res.json()) as {
      message?: { content?: Array<{ type: string; text?: string }> };
    };
    const text =
      data.message?.content?.find((c) => c.type === "text")?.text ?? "";
    return text;
  } finally {
    clearTimeout(timeout);
  }
}

// GET /api/trips
router.get("/", async (req, res) => {
  try {
    const trips = await db.select().from(tripsTable).orderBy(desc(tripsTable.createdAt));
    res.json(trips.map(formatTrip));
  } catch (err) {
    req.log.error({ err }, "Failed to list trips");
    res.status(500).json({ error: "Failed to list trips" });
  }
});

// POST /api/trips
router.post("/", async (req, res): Promise<void> => {
  const parsed = SaveTripBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid trip data" });
    return;
  }
  try {
    const [trip] = await db
      .insert(tripsTable)
      .values({
        destination: parsed.data.destination,
        days: parsed.data.days,
        budget: String(parsed.data.budget),
        currency: parsed.data.currency ?? "USD",
        travelStyle: parsed.data.travelStyle,
        interests: parsed.data.interests ?? null,
        groupSize: parsed.data.groupSize ?? 1,
        plan: parsed.data.plan as object,
      })
      .returning();
    res.status(201).json(formatTrip(trip));
  } catch (err) {
    req.log.error({ err }, "Failed to save trip");
    res.status(500).json({ error: "Failed to save trip" });
  }
});

// GET /api/trips/stats — must be before /:id
router.get("/stats", async (req, res) => {
  try {
    const trips = await db.select().from(tripsTable);
    const totalTrips = trips.length;
    const destinations = new Set(trips.map((t) => t.destination));
    const totalDestinations = destinations.size;
    const avgBudget =
      trips.length > 0
        ? trips.reduce((sum, t) => sum + Number(t.budget), 0) / trips.length
        : 0;
    const totalDaysPlanned = trips.reduce((sum, t) => sum + t.days, 0);

    const destCount: Record<string, number> = {};
    for (const t of trips) {
      destCount[t.destination] = (destCount[t.destination] ?? 0) + 1;
    }
    const popularDestination =
      Object.entries(destCount).sort((a, b) => b[1] - a[1])[0]?.[0] ??
      "None yet";

    res.json({ totalTrips, totalDestinations, avgBudget, popularDestination, totalDaysPlanned });
  } catch (err) {
    req.log.error({ err }, "Failed to get trip stats");
    res.status(500).json({ error: "Failed to get stats" });
  }
});

// POST /api/trips/generate — must be before /:id
router.post("/generate", async (req, res): Promise<void> => {
  const parsed = GenerateTripBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const {
    destination,
    days,
    budget,
    currency = "USD",
    travelStyle,
    interests,
    groupSize = 1,
  } = parsed.data;

  logger.info({ destination, days, budget, travelStyle }, "Generating trip");

  const prompt = `You are an expert travel planner. Generate a complete, detailed travel plan as valid JSON only (no markdown, no explanation, just the JSON object).

Trip details:
- Destination: ${destination}
- Duration: ${days} days
- Total budget: ${budget} ${currency} for ${groupSize} person(s)
- Travel style: ${travelStyle}
- Interests: ${interests ?? "general sightseeing"}

Return a JSON object with EXACTLY this structure:
{
  "summary": "2-3 sentence overview of the trip",
  "bestTimeToVisit": "recommended months/season",
  "weather": "typical weather description",
  "itinerary": [
    {
      "day": 1,
      "title": "Day title",
      "activities": [
        { "time": "9:00 AM", "name": "Activity name", "description": "Short description", "estimatedCost": 20, "category": "sightseeing" }
      ]
    }
  ],
  "hotels": [
    { "name": "Hotel name", "stars": 4, "pricePerNight": 80, "description": "Short description", "amenities": ["WiFi", "Pool"], "location": "Central area" }
  ],
  "transport": [
    { "type": "Flight", "description": "Description of transport option", "estimatedCost": 300, "duration": "2h" }
  ],
  "packingList": [
    { "category": "Clothing", "items": ["T-shirts", "Comfortable shoes"] }
  ],
  "tips": ["Local tip 1", "Money-saving tip 2", "Cultural tip 3"],
  "budgetBreakdown": {
    "total": ${budget},
    "transport": 0,
    "accommodation": 0,
    "food": 0,
    "activities": 0,
    "miscellaneous": 0,
    "currency": "${currency}",
    "savingTips": ["Saving tip 1", "Saving tip 2"]
  },
  "attractions": [
    { "name": "Attraction name", "description": "Brief description", "type": "landmark", "entryFee": 10, "mustSee": true }
  ]
}

Ensure the budgetBreakdown numbers add up to approximately ${budget}. Generate ${days} days in the itinerary. Include 3 hotel options and 3 transport options.`;

  try {
    const text = await callCohere(prompt);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      logger.error({ text: text.slice(0, 500) }, "No JSON in Cohere response");
      res.status(500).json({ error: "AI returned an unexpected response. Please try again." });
      return;
    }
    const plan = JSON.parse(jsonMatch[0]);
    res.json(plan);
  } catch (err) {
    logger.error({ err }, "Failed to generate trip");
    res.status(500).json({
      error: "Failed to generate trip plan. Please try again in a moment.",
    });
  }
});

// GET /api/trips/:id
router.get("/:id", async (req, res): Promise<void> => {
  const parsed = GetTripParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  try {
    const [trip] = await db
      .select()
      .from(tripsTable)
      .where(eq(tripsTable.id, parsed.data.id));
    if (!trip) {
      res.status(404).json({ error: "Trip not found" });
      return;
    }
    res.json(formatTrip(trip));
  } catch (err) {
    req.log.error({ err }, "Failed to get trip");
    res.status(500).json({ error: "Failed to get trip" });
  }
});

// DELETE /api/trips/:id
router.delete("/:id", async (req, res): Promise<void> => {
  const parsed = DeleteTripParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  try {
    await db.delete(tripsTable).where(eq(tripsTable.id, parsed.data.id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete trip");
    res.status(500).json({ error: "Failed to delete trip" });
  }
});

function formatTrip(trip: typeof tripsTable.$inferSelect) {
  return {
    ...trip,
    budget: Number(trip.budget),
    createdAt: trip.createdAt.toISOString(),
  };
}

export default router;
