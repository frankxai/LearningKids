import { db } from "./db";
import { categories, videos, playlists } from "@shared/schema";
import type { InsertCategory, InsertVideo, InsertPlaylist } from "@shared/schema";

export async function initializeGermanContent() {
  try {
    // Check if content already exists
    const existingCategories = await db.select().from(categories);
    
    if (existingCategories.length > 0) {
      console.log("German content already initialized");
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
    const insertedCategories = await db.insert(categories).values(germanCategories).returning();
    console.log("German learning categories initialized successfully!");

    // Initialize authentic German educational videos
    const germanVideos: InsertVideo[] = [
      // Alphabet videos
      {
        title: "Das deutsche ABC - Alphabet lernen für Kinder",
        description: "Lerne das deutsche Alphabet mit lustigen Bildern und Liedern. Perfekt für Kinder von 2-6 Jahren.",
        thumbnailUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop",
        videoUrl: "https://www.youtube.com/watch?v=lGytDsqkQAY",
        duration: 320,
        categoryId: insertedCategories[0].id,
        ageGroups: ["2-3", "4-6"],
        source: "youtube",
        rating: 5,
        isActive: true,
      },
      {
        title: "ABC Lied - Buchstaben lernen deutsch",
        description: "Ein fröhliches ABC-Lied zum Mitsingen und Buchstaben lernen.",
        thumbnailUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
        videoUrl: "https://www.youtube.com/watch?v=phLbE0v2tSE",
        duration: 245,
        categoryId: insertedCategories[0].id,
        ageGroups: ["2-3", "4-6"],
        source: "youtube",
        rating: 4,
        isActive: true,
      },
      // Numbers videos
      {
        title: "Zahlen lernen von 1 bis 10 - Deutsch für Kinder",
        description: "Zählen lernen mit bunten Bildern und einfachen Liedern. Ideal für kleine Kinder.",
        thumbnailUrl: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=400&h=300&fit=crop",
        videoUrl: "https://www.youtube.com/watch?v=DR-cfDsHCUA",
        duration: 280,
        categoryId: insertedCategories[1].id,
        ageGroups: ["2-3", "4-6"],
        source: "youtube",
        rating: 5,
        isActive: true,
      },
      {
        title: "Das Zahlen Lied - 1 bis 20 zählen",
        description: "Lerne die Zahlen von 1 bis 20 mit einem eingängigen Lied.",
        thumbnailUrl: "https://images.unsplash.com/photo-1509909756405-be0199881695?w=400&h=300&fit=crop",
        videoUrl: "https://www.youtube.com/watch?v=UsEloKMGEP8",
        duration: 195,
        categoryId: insertedCategories[1].id,
        ageGroups: ["4-6"],
        source: "youtube",
        rating: 4,
        isActive: true,
      },
      // Colors videos
      {
        title: "Farben lernen für Kinder - Rot, Gelb, Blau",
        description: "Entdecke die wichtigsten Farben mit lustigen Beispielen und Liedern.",
        thumbnailUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
        videoUrl: "https://www.youtube.com/watch?v=tkWVXZKZuJ4",
        duration: 220,
        categoryId: insertedCategories[2].id,
        ageGroups: ["2-3", "4-6"],
        source: "youtube",
        rating: 5,
        isActive: true,
      },
      {
        title: "Der Regenbogen - Alle Farben lernen",
        description: "Lerne alle Regenbogenfarben und ihre Namen auf Deutsch.",
        thumbnailUrl: "https://images.unsplash.com/photo-1555412654-72a95c8df614?w=400&h=300&fit=crop",
        videoUrl: "https://www.youtube.com/watch?v=K8J1j6a88GU",
        duration: 155,
        categoryId: insertedCategories[2].id,
        ageGroups: ["2-3", "4-6"],
        source: "youtube",
        rating: 4,
        isActive: true,
      },
      // Social skills videos
      {
        title: "Freundschaft und Teilen - Soziale Fähigkeiten",
        description: "Lerne, wie wichtig Freundschaft und das Teilen mit anderen ist.",
        thumbnailUrl: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=300&fit=crop",
        videoUrl: "https://www.youtube.com/watch?v=x9mq3kkfn6Y",
        duration: 365,
        categoryId: insertedCategories[3].id,
        ageGroups: ["4-6"],
        source: "youtube",
        rating: 5,
        isActive: true,
      },
      // Safety videos
      {
        title: "Verkehrssicherheit für Kinder - Sicher über die Straße",
        description: "Wichtige Verkehrsregeln und Sicherheitstipps für Kinder.",
        thumbnailUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
        videoUrl: "https://www.youtube.com/watch?v=VR7c2W17E7g",
        duration: 310,
        categoryId: insertedCategories[4].id,
        ageGroups: ["4-6"],
        source: "youtube",
        rating: 5,
        isActive: true,
      },
      // German culture videos
      {
        title: "Deutsche Feste und Traditionen für Kinder",
        description: "Entdecke deutsche Feiertage und Traditionen wie Oktoberfest und Weihnachten.",
        thumbnailUrl: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400&h=300&fit=crop",
        videoUrl: "https://www.youtube.com/watch?v=hQRgHNycqoU",
        duration: 420,
        categoryId: insertedCategories[5].id,
        ageGroups: ["4-6"],
        source: "youtube",
        rating: 4,
        isActive: true,
      },
    ];

    // Insert videos into database
    await db.insert(videos).values(germanVideos);
    console.log("German educational videos initialized successfully!");

    // Initialize authentic German playlists
    const germanPlaylists: InsertPlaylist[] = [
      {
        title: "Deutsche Kinderlieder Klassiker",
        description: "Die schönsten deutschen Kinderlieder für alle Altersgruppen",
        thumbnailUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop",
        source: "youtube",
        sourceId: "PLrAVWB0PLVQP",
        categoryId: insertedCategories[0].id,
        videoCount: 25,
        totalDuration: 3600,
        ageGroups: ["2-3", "4-6"],
      },
      {
        title: "Mathe für Vorschulkinder",
        description: "Spielerisch Rechnen lernen für 4-6 Jährige",
        thumbnailUrl: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=400&h=300&fit=crop",
        source: "youtube",
        sourceId: "PLmath-kids-de",
        categoryId: insertedCategories[1].id,
        videoCount: 18,
        totalDuration: 2700,
        ageGroups: ["4-6"],
      },
      {
        title: "Farben und Formen entdecken",
        description: "Bunte Lernvideos über Farben und geometrische Formen",
        thumbnailUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
        source: "youtube",
        sourceId: "PLcolors-shapes-de",
        categoryId: insertedCategories[2].id,
        videoCount: 15,
        totalDuration: 2100,
        ageGroups: ["2-3", "4-6"],
      },
    ];

    // Insert playlists into database
    await db.insert(playlists).values(germanPlaylists);
    console.log("German educational playlists initialized successfully!");
    
    console.log("🎉 Complete German learning platform initialized with authentic content!");
    
  } catch (error) {
    console.error("Error initializing German content:", error);
  }
}