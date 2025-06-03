import { categories, videos, playlists, userProgress, userSettings, favorites, chatMessages, type Category, type Video, type Playlist, type UserProgress, type UserSettings, type Favorite, type ChatMessage, type InsertCategory, type InsertVideo, type InsertPlaylist, type InsertUserProgress, type InsertUserSettings, type InsertFavorite, type InsertChatMessage } from "@shared/schema";
import { db } from "./db";
import { eq, and, like, or } from "drizzle-orm";
import type { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category || undefined;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db
      .insert(categories)
      .values(category)
      .returning();
    return newCategory;
  }

  async getVideos(categoryId?: number, ageGroup?: string): Promise<Video[]> {
    let query = db.select().from(videos).where(eq(videos.isActive, true));
    
    const conditions = [];
    if (categoryId) {
      conditions.push(eq(videos.categoryId, categoryId));
    }
    if (ageGroup) {
      // Note: This is a simplified check - in production you'd use proper array operations
      conditions.push(like(videos.ageGroups, `%${ageGroup}%`));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query;
  }

  async getVideoById(id: number): Promise<Video | undefined> {
    const [video] = await db.select().from(videos).where(eq(videos.id, id));
    return video || undefined;
  }

  async createVideo(video: InsertVideo): Promise<Video> {
    const [newVideo] = await db
      .insert(videos)
      .values(video)
      .returning();
    return newVideo;
  }

  async searchVideos(query: string, ageGroup?: string): Promise<Video[]> {
    const lowerQuery = query.toLowerCase();
    let dbQuery = db.select().from(videos).where(
      and(
        eq(videos.isActive, true),
        or(
          like(videos.title, `%${lowerQuery}%`),
          like(videos.description, `%${lowerQuery}%`)
        )
      )
    );

    if (ageGroup) {
      dbQuery = dbQuery.where(like(videos.ageGroups, `%${ageGroup}%`));
    }

    return await dbQuery;
  }

  async getPlaylists(categoryId?: number, ageGroup?: string): Promise<Playlist[]> {
    let query = db.select().from(playlists);
    
    const conditions = [];
    if (categoryId) {
      conditions.push(eq(playlists.categoryId, categoryId));
    }
    if (ageGroup) {
      conditions.push(like(playlists.ageGroups, `%${ageGroup}%`));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query;
  }

  async getPlaylistById(id: number): Promise<Playlist | undefined> {
    const [playlist] = await db.select().from(playlists).where(eq(playlists.id, id));
    return playlist || undefined;
  }

  async createPlaylist(playlist: InsertPlaylist): Promise<Playlist> {
    const [newPlaylist] = await db
      .insert(playlists)
      .values(playlist)
      .returning();
    return newPlaylist;
  }

  async getUserProgress(): Promise<UserProgress[]> {
    return await db.select().from(userProgress);
  }

  async getVideoProgress(videoId: number): Promise<UserProgress | undefined> {
    const [progress] = await db.select().from(userProgress).where(eq(userProgress.videoId, videoId));
    return progress || undefined;
  }

  async updateVideoProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const existing = await this.getVideoProgress(progress.videoId!);
    
    if (existing) {
      const [updated] = await db
        .update(userProgress)
        .set(progress)
        .where(eq(userProgress.id, existing.id))
        .returning();
      return updated;
    } else {
      const [newProgress] = await db
        .insert(userProgress)
        .values(progress)
        .returning();
      return newProgress;
    }
  }

  async getUserSettings(): Promise<UserSettings> {
    const [settings] = await db.select().from(userSettings).limit(1);
    
    if (!settings) {
      // Create default settings if none exist
      const [newSettings] = await db
        .insert(userSettings)
        .values({
          ageGroup: "2-3",
          dailyTimeLimit: 45,
          weekendMode: false,
          allowedCategories: ["alphabet", "zahlen", "farben", "soziales", "sicherheit", "kultur"],
          parentalControlsEnabled: true,
        })
        .returning();
      return newSettings;
    }
    
    return settings;
  }

  async updateUserSettings(settings: Partial<InsertUserSettings>): Promise<UserSettings> {
    const existing = await this.getUserSettings();
    
    const [updated] = await db
      .update(userSettings)
      .set(settings)
      .where(eq(userSettings.id, existing.id))
      .returning();
    return updated;
  }

  async getFavorites(): Promise<Favorite[]> {
    return await db.select().from(favorites);
  }

  async addFavorite(favorite: InsertFavorite): Promise<Favorite> {
    const [newFavorite] = await db
      .insert(favorites)
      .values(favorite)
      .returning();
    return newFavorite;
  }

  async removeFavorite(videoId: number): Promise<boolean> {
    const result = await db.delete(favorites).where(eq(favorites.videoId, videoId));
    return result.rowCount > 0;
  }

  async isFavorite(videoId: number): Promise<boolean> {
    const [favorite] = await db.select().from(favorites).where(eq(favorites.videoId, videoId)).limit(1);
    return !!favorite;
  }

  async getChatMessages(userId: string): Promise<ChatMessage[]> {
    return await db.select().from(chatMessages).where(eq(chatMessages.userId, userId)).orderBy(chatMessages.timestamp);
  }

  async addChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [newMessage] = await db.insert(chatMessages).values(message).returning();
    return newMessage;
  }
}