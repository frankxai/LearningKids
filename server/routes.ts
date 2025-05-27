import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { youtubeIntegration } from "./youtube-integration";
import { insertVideoSchema, insertPlaylistSchema, insertUserProgressSchema, insertUserSettingsSchema, insertFavoriteSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const category = await storage.getCategoryById(id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  // Videos
  app.get("/api/videos", async (req, res) => {
    try {
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      const ageGroup = req.query.ageGroup as string;
      const videos = await storage.getVideos(categoryId, ageGroup);
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch videos" });
    }
  });

  app.get("/api/videos/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const video = await storage.getVideoById(id);
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      res.json(video);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch video" });
    }
  });

  app.post("/api/videos", async (req, res) => {
    try {
      const validatedData = insertVideoSchema.parse(req.body);
      const video = await storage.createVideo(validatedData);
      res.status(201).json(video);
    } catch (error) {
      res.status(400).json({ message: "Invalid video data" });
    }
  });

  app.get("/api/videos/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      const ageGroup = req.query.ageGroup as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      const videos = await storage.searchVideos(query, ageGroup);
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: "Failed to search videos" });
    }
  });

  // Playlists
  app.get("/api/playlists", async (req, res) => {
    try {
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      const ageGroup = req.query.ageGroup as string;
      const playlists = await storage.getPlaylists(categoryId, ageGroup);
      res.json(playlists);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch playlists" });
    }
  });

  app.get("/api/playlists/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const playlist = await storage.getPlaylistById(id);
      if (!playlist) {
        return res.status(404).json({ message: "Playlist not found" });
      }
      res.json(playlist);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch playlist" });
    }
  });

  app.post("/api/playlists", async (req, res) => {
    try {
      const validatedData = insertPlaylistSchema.parse(req.body);
      const playlist = await storage.createPlaylist(validatedData);
      res.status(201).json(playlist);
    } catch (error) {
      res.status(400).json({ message: "Invalid playlist data" });
    }
  });

  // User Progress
  app.get("/api/progress", async (req, res) => {
    try {
      const progress = await storage.getUserProgress();
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  app.get("/api/progress/:videoId", async (req, res) => {
    try {
      const videoId = parseInt(req.params.videoId);
      const progress = await storage.getVideoProgress(videoId);
      res.json(progress || null);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch video progress" });
    }
  });

  app.post("/api/progress", async (req, res) => {
    try {
      const validatedData = insertUserProgressSchema.parse(req.body);
      const progress = await storage.updateVideoProgress(validatedData);
      res.json(progress);
    } catch (error) {
      res.status(400).json({ message: "Invalid progress data" });
    }
  });

  // User Settings
  app.get("/api/settings", async (req, res) => {
    try {
      const settings = await storage.getUserSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  app.patch("/api/settings", async (req, res) => {
    try {
      const settings = await storage.updateUserSettings(req.body);
      res.json(settings);
    } catch (error) {
      res.status(400).json({ message: "Invalid settings data" });
    }
  });

  // Favorites
  app.get("/api/favorites", async (req, res) => {
    try {
      const favorites = await storage.getFavorites();
      res.json(favorites);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });

  app.post("/api/favorites", async (req, res) => {
    try {
      const validatedData = insertFavoriteSchema.parse(req.body);
      const favorite = await storage.addFavorite(validatedData);
      res.status(201).json(favorite);
    } catch (error) {
      res.status(400).json({ message: "Invalid favorite data" });
    }
  });

  app.delete("/api/favorites/:videoId", async (req, res) => {
    try {
      const videoId = parseInt(req.params.videoId);
      const removed = await storage.removeFavorite(videoId);
      if (!removed) {
        return res.status(404).json({ message: "Favorite not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove favorite" });
    }
  });

  app.get("/api/favorites/:videoId/check", async (req, res) => {
    try {
      const videoId = parseInt(req.params.videoId);
      const isFavorite = await storage.isFavorite(videoId);
      res.json({ isFavorite });
    } catch (error) {
      res.status(500).json({ message: "Failed to check favorite status" });
    }
  });

  // YouTube Integration - Populate with real German content
  app.post("/api/populate-german-content", async (req, res) => {
    try {
      if (!youtubeIntegration) {
        return res.status(400).json({ message: "YouTube API key not configured" });
      }
      
      await youtubeIntegration.populateGermanLearningContent();
      res.json({ message: "German learning content populated successfully!" });
    } catch (error) {
      console.error("Error populating content:", error);
      res.status(500).json({ message: "Failed to populate German content" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
