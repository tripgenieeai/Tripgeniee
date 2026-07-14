import { Router } from "express";
import { CalculateBudgetBody } from "@workspace/api-zod";

const router = Router();

const STYLE_MULTIPLIERS: Record<string, number> = {
  budget: 0.6,
  comfort: 1.0,
  luxury: 2.2,
  adventure: 0.85,
  cultural: 0.9,
  family: 1.1,
};

const BASE_COSTS = {
  transport: 400,
  accommodation: 80,
  food: 40,
  activities: 30,
};

// POST /api/budget/calculate
router.post("/calculate", async (req, res): Promise<void> => {
  const parsed = CalculateBudgetBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  const { days, groupSize, travelStyle } = parsed.data;
  const multiplier = STYLE_MULTIPLIERS[travelStyle] ?? 1.0;

  const transport = Math.round(BASE_COSTS.transport * multiplier * groupSize);
  const accommodation = Math.round(BASE_COSTS.accommodation * multiplier * days);
  const food = Math.round(BASE_COSTS.food * multiplier * days * groupSize);
  const activities = Math.round(BASE_COSTS.activities * multiplier * days * groupSize);
  const miscellaneous = Math.round((transport + accommodation + food + activities) * 0.1);
  const total = transport + accommodation + food + activities + miscellaneous;

  res.json({
    total,
    transport,
    accommodation,
    food,
    activities,
    miscellaneous,
    currency: "USD",
    savingTips: [
      "Book flights at least 6-8 weeks in advance for the best prices.",
      "Travel during shoulder season to save up to 30% on accommodation.",
      "Use local transport and street food to cut daily costs significantly.",
      "Look for combo attraction tickets and city passes for discounts.",
      "Stay in neighborhoods slightly outside the tourist center for cheaper accommodation.",
    ],
  });
});

export default router;
