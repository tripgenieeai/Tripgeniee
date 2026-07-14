import { pgTable, text, serial, timestamp, integer, numeric, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const tripsTable = pgTable("trips", {
  id: serial("id").primaryKey(),
  destination: text("destination").notNull(),
  days: integer("days").notNull(),
  budget: numeric("budget", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  travelStyle: text("travel_style").notNull(),
  interests: text("interests"),
  groupSize: integer("group_size").notNull().default(1),
  plan: jsonb("plan").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertTripSchema = createInsertSchema(tripsTable).omit({ id: true, createdAt: true });
export type InsertTrip = z.infer<typeof insertTripSchema>;
export type Trip = typeof tripsTable.$inferSelect;
