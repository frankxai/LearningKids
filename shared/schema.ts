import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  description: text("description").notNull(),
  ageGroups: text("age_groups").array().notNull(), // ["2-3", "4-6"]
});

export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  thumbnailUrl: text("thumbnail_url").notNull(),
  videoUrl: text("video_url").notNull(),
  duration: integer("duration").notNull(), // in seconds
  categoryId: integer("category_id").references(() => categories.id),
  ageGroups: text("age_groups").array().notNull(),
  source: text("source").notNull(), // "youtube", "local", "coursera"
  rating: integer("rating").default(0), // 1-5 stars
  isActive: boolean("is_active").default(true),
});

export const playlists = pgTable("playlists", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  thumbnailUrl: text("thumbnail_url").notNull(),
  source: text("source").notNull(), // "youtube", "coursera", "custom"
  sourceId: text("source_id"), // external playlist ID
  categoryId: integer("category_id").references(() => categories.id),
  videoCount: integer("video_count").default(0),
  totalDuration: integer("total_duration").default(0), // in seconds
  ageGroups: text("age_groups").array().notNull(),
});

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  videoId: integer("video_id").references(() => videos.id),
  watchedDuration: integer("watched_duration").default(0), // in seconds
  completed: boolean("completed").default(false),
  starsEarned: integer("stars_earned").default(0),
  watchedAt: text("watched_at").notNull(),
});

export const userSettings = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  ageGroup: text("age_group").notNull().default("2-3"),
  dailyTimeLimit: integer("daily_time_limit").default(45), // in minutes
  weekendMode: boolean("weekend_mode").default(false),
  allowedCategories: text("allowed_categories").array().notNull(),
  parentalControlsEnabled: boolean("parental_controls_enabled").default(true),
});

export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  videoId: integer("video_id").references(() => videos.id),
  addedAt: text("added_at").notNull(),
});

// Insert schemas
export const insertCategorySchema = createInsertSchema(categories).omit({ id: true });
export const insertVideoSchema = createInsertSchema(videos).omit({ id: true });
export const insertPlaylistSchema = createInsertSchema(playlists).omit({ id: true });
export const insertUserProgressSchema = createInsertSchema(userProgress).omit({ id: true });
export const insertUserSettingsSchema = createInsertSchema(userSettings).omit({ id: true });
export const insertFavoriteSchema = createInsertSchema(favorites).omit({ id: true });

// Types
export type Category = typeof categories.$inferSelect;
export type Video = typeof videos.$inferSelect;
export type Playlist = typeof playlists.$inferSelect;
export type UserProgress = typeof userProgress.$inferSelect;
export type UserSettings = typeof userSettings.$inferSelect;
export type Favorite = typeof favorites.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type InsertPlaylist = z.infer<typeof insertPlaylistSchema>;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type InsertUserSettings = z.infer<typeof insertUserSettingsSchema>;
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
