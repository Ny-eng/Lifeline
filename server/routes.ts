import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertCategorySchema, insertEventSchema } from "@shared/schema";
import { z } from "zod";

// メモリ内のビジターカウンター
let visitorCount = 0;

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // ビジターカウントAPI
  app.post("/api/visitors/increment", (req, res) => {
    visitorCount++;
    res.json({ count: visitorCount });
  });

  app.get("/api/visitors/count", (req, res) => {
    res.json({ count: visitorCount });
  });

  // Categories
  app.get("/api/categories", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const categories = await storage.getCategoriesByUserId(req.user.id);
    res.json(categories);
  });

  app.post("/api/categories", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const parsed = insertCategorySchema.parse(req.body);
    const category = await storage.createCategory({
      ...parsed,
      userId: req.user.id,
    });
    res.status(201).json(category);
  });

  app.delete("/api/categories/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const id = parseInt(req.params.id);
    await storage.deleteCategory(id, req.user.id);
    res.sendStatus(204);
  });

  // Events
  app.get("/api/events", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const events = await storage.getEventsByUserId(req.user.id);
    res.json(events);
  });

  app.post("/api/events", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const parsed = insertEventSchema.parse(req.body);
    const event = await storage.createEvent({
      ...parsed,
      userId: req.user.id,
    });
    res.status(201).json(event);
  });

  app.patch("/api/events/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const id = parseInt(req.params.id);
    const parsed = insertEventSchema.partial().parse(req.body);
    const event = await storage.updateEvent(id, req.user.id, parsed);
    res.json(event);
  });

  app.delete("/api/events/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const id = parseInt(req.params.id);
    await storage.deleteEvent(id, req.user.id);
    res.sendStatus(204);
  });

  const httpServer = createServer(app);
  return httpServer;
}