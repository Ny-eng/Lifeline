import { pgTable, text, serial, integer, boolean, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  color: text("color").notNull(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  categoryId: integer("category_id").references(() => categories.id),
  date: date("date").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  score: integer("score").notNull(),
  order: integer("order").notNull(),
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  color: true,
});

export type Category = {
  id: number;
  name: string;
  color: string;
};

export type Event = {
  id: number;
  categoryId: number | null;
  date: string;
  title: string;
  description: string | null;
  score: number;
  order: number;
};

export const insertEventSchema = z.object({
  categoryId: z.number().nullable(),
  date: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().nullable(),
  score: z.number().min(0).max(100),
  order: z.number(),
});