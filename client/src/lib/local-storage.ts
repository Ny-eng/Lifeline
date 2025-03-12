import { Event, Category } from "@shared/schema";

// Local storage keys
const EVENTS_KEY = 'lifeline_events';
const CATEGORIES_KEY = 'lifeline_categories';

// Get data from local storage
export function getStoredEvents(): Event[] {
  const stored = localStorage.getItem(EVENTS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function getStoredCategories(): Category[] {
  const stored = localStorage.getItem(CATEGORIES_KEY);
  return stored ? JSON.parse(stored) : [];
}

// Save data to local storage
export function saveEvents(events: Event[]) {
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}

export function saveCategories(categories: Category[]) {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
}

// Generate IDs for new items
export function generateId(): number {
  return Date.now();
}
