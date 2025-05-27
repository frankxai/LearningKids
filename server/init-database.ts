import { db } from "./db";
import { categories } from "@shared/schema";
import type { InsertCategory } from "@shared/schema";

export async function initializeGermanCategories() {
  try {
    // Check if categories already exist
    const existingCategories = await db.select().from(categories);
    
    if (existingCategories.length > 0) {
      console.log("Categories already initialized");
      return;
    }

    // Initialize German learning categories
    const germanCategories: InsertCategory[] = [
      {
        name: "Alphabet",
        icon: "fas fa-font",
        color: "coral",
        description: "Lerne Buchstaben A-Z",
        ageGroups: ["2-3", "4-6"],
      },
      {
        name: "Zahlen",
        icon: "fas fa-calculator",
        color: "kidblue",
        description: "Zählen von 1 bis 20",
        ageGroups: ["2-3", "4-6"],
      },
      {
        name: "Farben",
        icon: "fas fa-palette",
        color: "pink",
        description: "Entdecke alle Farben",
        ageGroups: ["2-3", "4-6"],
      },
      {
        name: "Soziales",
        icon: "fas fa-handshake",
        color: "mint",
        description: "Freundschaft & Teilen",
        ageGroups: ["4-6"],
      },
      {
        name: "Sicherheit",
        icon: "fas fa-shield-alt",
        color: "teal",
        description: "Sicher bleiben",
        ageGroups: ["4-6"],
      },
      {
        name: "Kultur",
        icon: "fas fa-flag",
        color: "sunny",
        description: "Deutsche Traditionen",
        ageGroups: ["4-6"],
      },
    ];

    // Insert categories into database
    await db.insert(categories).values(germanCategories);
    console.log("German learning categories initialized successfully!");
    
  } catch (error) {
    console.error("Error initializing categories:", error);
  }
}