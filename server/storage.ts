import { IStorage } from "./storage";
import type { User, Category, Event, InsertUser } from "@shared/schema";
import createMemoryStore from "memorystore";
import session from "express-session";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByVerificationToken(token: string): Promise<User | undefined>;
  createUser(user: InsertUser & { verificationToken: string; emailVerified: boolean }): Promise<User>;
  updateUser(id: number, data: Partial<User>): Promise<User>;

  // Category operations
  getCategoriesByUserId(userId: number): Promise<Category[]>;
  createCategory(category: Omit<Category, "id">): Promise<Category>;
  deleteCategory(id: number, userId: number): Promise<void>;

  // Event operations
  getEventsByUserId(userId: number): Promise<Event[]>;
  createEvent(event: Omit<Event, "id">): Promise<Event>;
  updateEvent(id: number, userId: number, event: Partial<Event>): Promise<Event>;
  deleteEvent(id: number, userId: number): Promise<void>;

  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private events: Map<number, Event>;
  private currentId: { [key: string]: number };
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.events = new Map();
    this.currentId = { users: 1, categories: 1, events: 1 };
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByVerificationToken(token: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.verificationToken === token,
    );
  }

  async createUser(user: InsertUser & { verificationToken: string; emailVerified: boolean }): Promise<User> {
    const id = this.currentId.users++;
    const newUser: User = { 
      ...user,
      id,
      emailVerified: false,
      verificationToken: user.verificationToken
    };
    this.users.set(id, newUser);
    return newUser;
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const user = await this.getUser(id);
    if (!user) {
      throw new Error("User not found");
    }
    const updatedUser = { ...user, ...data };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getCategoriesByUserId(userId: number): Promise<Category[]> {
    return Array.from(this.categories.values()).filter(
      (category) => category.userId === userId,
    );
  }

  async createCategory(category: Omit<Category, "id">): Promise<Category> {
    const id = this.currentId.categories++;
    const newCategory = { ...category, id };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  async deleteCategory(id: number, userId: number): Promise<void> {
    const category = this.categories.get(id);
    if (category && category.userId === userId) {
      this.categories.delete(id);
    }
  }

  async getEventsByUserId(userId: number): Promise<Event[]> {
    return Array.from(this.events.values())
      .filter((event) => event.userId === userId)
      .sort((a, b) => a.order - b.order);
  }

  async createEvent(event: Omit<Event, "id">): Promise<Event> {
    const id = this.currentId.events++;
    const newEvent = { ...event, id };
    this.events.set(id, newEvent);
    return newEvent;
  }

  async updateEvent(
    id: number,
    userId: number,
    updateData: Partial<Event>,
  ): Promise<Event> {
    const event = this.events.get(id);
    if (!event || event.userId !== userId) {
      throw new Error("Event not found");
    }
    const updatedEvent = { ...event, ...updateData };
    this.events.set(id, updatedEvent);
    return updatedEvent;
  }

  async deleteEvent(id: number, userId: number): Promise<void> {
    const event = this.events.get(id);
    if (event && event.userId === userId) {
      this.events.delete(id);
    }
  }
}

export const storage = new MemStorage();