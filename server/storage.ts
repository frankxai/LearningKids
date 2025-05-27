import { 
  categories, videos, playlists, userProgress, userSettings, favorites,
  type Category, type Video, type Playlist, type UserProgress, type UserSettings, type Favorite,
  type InsertCategory, type InsertVideo, type InsertPlaylist, type InsertUserProgress, 
  type InsertUserSettings, type InsertFavorite
} from "@shared/schema";

export interface IStorage {
  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Videos
  getVideos(categoryId?: number, ageGroup?: string): Promise<Video[]>;
  getVideoById(id: number): Promise<Video | undefined>;
  createVideo(video: InsertVideo): Promise<Video>;
  searchVideos(query: string, ageGroup?: string): Promise<Video[]>;

  // Playlists
  getPlaylists(categoryId?: number, ageGroup?: string): Promise<Playlist[]>;
  getPlaylistById(id: number): Promise<Playlist | undefined>;
  createPlaylist(playlist: InsertPlaylist): Promise<Playlist>;

  // User Progress
  getUserProgress(): Promise<UserProgress[]>;
  getVideoProgress(videoId: number): Promise<UserProgress | undefined>;
  updateVideoProgress(progress: InsertUserProgress): Promise<UserProgress>;

  // User Settings
  getUserSettings(): Promise<UserSettings>;
  updateUserSettings(settings: Partial<InsertUserSettings>): Promise<UserSettings>;

  // Favorites
  getFavorites(): Promise<Favorite[]>;
  addFavorite(favorite: InsertFavorite): Promise<Favorite>;
  removeFavorite(videoId: number): Promise<boolean>;
  isFavorite(videoId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private categories: Map<number, Category>;
  private videos: Map<number, Video>;
  private playlists: Map<number, Playlist>;
  private userProgress: Map<number, UserProgress>;
  private userSettings: UserSettings;
  private favorites: Map<number, Favorite>;
  private currentId: number;

  constructor() {
    this.categories = new Map();
    this.videos = new Map();
    this.playlists = new Map();
    this.userProgress = new Map();
    this.favorites = new Map();
    this.currentId = 1;

    // Initialize with default user settings
    this.userSettings = {
      id: 1,
      ageGroup: "2-3",
      dailyTimeLimit: 45,
      weekendMode: false,
      allowedCategories: ["alphabet", "numbers", "colors", "social", "safety", "culture"],
      parentalControlsEnabled: true,
    };

    this.initializeData();
  }

  private initializeData() {
    // Initialize categories
    const defaultCategories: InsertCategory[] = [
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

    defaultCategories.forEach(category => {
      const id = this.currentId++;
      this.categories.set(id, { ...category, id });
    });

    // Initialize sample videos
    const defaultVideos: InsertVideo[] = [
      {
        title: "Das ABC Lied - Lerne alle Buchstaben!",
        description: "Ein lustiges Lied um das deutsche Alphabet zu lernen",
        thumbnailUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        duration: 332,
        categoryId: 1,
        ageGroups: ["2-3", "4-6"],
        source: "youtube",
        rating: 4,
        isActive: true,
      },
      {
        title: "Zahlen lernen 1-10",
        description: "Zählen lernen mit lustigen Animationen",
        thumbnailUrl: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=400&h=300&fit=crop",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        duration: 245,
        categoryId: 2,
        ageGroups: ["2-3"],
        source: "youtube",
        rating: 5,
        isActive: true,
      },
      {
        title: "Farben entdecken",
        description: "Lerne die Grundfarben kennen",
        thumbnailUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        duration: 180,
        categoryId: 3,
        ageGroups: ["2-3", "4-6"],
        source: "youtube",
        rating: 4,
        isActive: true,
      },
    ];

    defaultVideos.forEach(video => {
      const id = this.currentId++;
      this.videos.set(id, { 
        ...video, 
        id,
        categoryId: video.categoryId || null,
        rating: video.rating || null,
        isActive: video.isActive || true
      });
    });

    // Initialize sample playlists
    const defaultPlaylists: InsertPlaylist[] = [
      {
        title: "Kinder Lieder Mix",
        description: "Die besten deutschen Kinderlieder",
        thumbnailUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop",
        source: "youtube",
        sourceId: "PLrAVWB0PLVQP",
        categoryId: 1,
        videoCount: 15,
        totalDuration: 2700,
        ageGroups: ["2-3", "4-6"],
      },
      {
        title: "Mathe für Anfänger",
        description: "Grundlagen der Mathematik",
        thumbnailUrl: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=400&h=300&fit=crop",
        source: "coursera",
        sourceId: "math-basics-kids",
        categoryId: 2,
        videoCount: 12,
        totalDuration: 1800,
        ageGroups: ["4-6"],
      },
    ];

    defaultPlaylists.forEach(playlist => {
      const id = this.currentId++;
      this.playlists.set(id, { 
        ...playlist, 
        id,
        description: playlist.description || null,
        categoryId: playlist.categoryId || null,
        sourceId: playlist.sourceId || null,
        videoCount: playlist.videoCount || 0,
        totalDuration: playlist.totalDuration || 0
      });
    });
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.currentId++;
    const newCategory: Category = { ...category, id };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  async getVideos(categoryId?: number, ageGroup?: string): Promise<Video[]> {
    let videos = Array.from(this.videos.values());
    
    if (categoryId) {
      videos = videos.filter(video => video.categoryId === categoryId);
    }
    
    if (ageGroup) {
      videos = videos.filter(video => video.ageGroups.includes(ageGroup));
    }
    
    return videos.filter(video => video.isActive);
  }

  async getVideoById(id: number): Promise<Video | undefined> {
    return this.videos.get(id);
  }

  async createVideo(video: InsertVideo): Promise<Video> {
    const id = this.currentId++;
    const newVideo: Video = { 
      ...video, 
      id,
      categoryId: video.categoryId || null,
      rating: video.rating || null,
      isActive: video.isActive ?? true
    };
    this.videos.set(id, newVideo);
    return newVideo;
  }

  async searchVideos(query: string, ageGroup?: string): Promise<Video[]> {
    const lowerQuery = query.toLowerCase();
    let videos = Array.from(this.videos.values()).filter(video =>
      video.isActive && (
        video.title.toLowerCase().includes(lowerQuery) ||
        video.description.toLowerCase().includes(lowerQuery)
      )
    );

    if (ageGroup) {
      videos = videos.filter(video => video.ageGroups.includes(ageGroup));
    }

    return videos;
  }

  async getPlaylists(categoryId?: number, ageGroup?: string): Promise<Playlist[]> {
    let playlists = Array.from(this.playlists.values());
    
    if (categoryId) {
      playlists = playlists.filter(playlist => playlist.categoryId === categoryId);
    }
    
    if (ageGroup) {
      playlists = playlists.filter(playlist => playlist.ageGroups.includes(ageGroup));
    }
    
    return playlists;
  }

  async getPlaylistById(id: number): Promise<Playlist | undefined> {
    return this.playlists.get(id);
  }

  async createPlaylist(playlist: InsertPlaylist): Promise<Playlist> {
    const id = this.currentId++;
    const newPlaylist: Playlist = { 
      ...playlist, 
      id,
      description: playlist.description || null,
      categoryId: playlist.categoryId || null,
      sourceId: playlist.sourceId || null,
      videoCount: playlist.videoCount || 0,
      totalDuration: playlist.totalDuration || 0
    };
    this.playlists.set(id, newPlaylist);
    return newPlaylist;
  }

  async getUserProgress(): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values());
  }

  async getVideoProgress(videoId: number): Promise<UserProgress | undefined> {
    return Array.from(this.userProgress.values()).find(p => p.videoId === videoId);
  }

  async updateVideoProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const existing = Array.from(this.userProgress.values()).find(p => p.videoId === progress.videoId);
    
    if (existing) {
      const updated = { ...existing, ...progress };
      this.userProgress.set(existing.id, updated);
      return updated;
    } else {
      const id = this.currentId++;
      const newProgress: UserProgress = { 
        ...progress, 
        id,
        videoId: progress.videoId || null,
        watchedDuration: progress.watchedDuration || 0,
        completed: progress.completed || false,
        starsEarned: progress.starsEarned || 0
      };
      this.userProgress.set(id, newProgress);
      return newProgress;
    }
  }

  async getUserSettings(): Promise<UserSettings> {
    return this.userSettings;
  }

  async updateUserSettings(settings: Partial<InsertUserSettings>): Promise<UserSettings> {
    this.userSettings = { ...this.userSettings, ...settings };
    return this.userSettings;
  }

  async getFavorites(): Promise<Favorite[]> {
    return Array.from(this.favorites.values());
  }

  async addFavorite(favorite: InsertFavorite): Promise<Favorite> {
    const id = this.currentId++;
    const newFavorite: Favorite = { 
      ...favorite, 
      id,
      videoId: favorite.videoId || null
    };
    this.favorites.set(id, newFavorite);
    return newFavorite;
  }

  async removeFavorite(videoId: number): Promise<boolean> {
    const favorite = Array.from(this.favorites.values()).find(f => f.videoId === videoId);
    if (favorite) {
      this.favorites.delete(favorite.id);
      return true;
    }
    return false;
  }

  async isFavorite(videoId: number): Promise<boolean> {
    return Array.from(this.favorites.values()).some(f => f.videoId === videoId);
  }
}

export const storage = new MemStorage();
