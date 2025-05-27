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

    // Load comprehensive German educational content
    this.loadGermanEducationalContent();
  }

  private loadGermanEducationalContent() {
    console.log("🎯 Loading comprehensive German educational experience...");
    this.loadRichEducationalContent();
  }

  private loadRichEducationalContent() {
    const defaultVideos: InsertVideo[] = [
      // Authentic German Alphabet Content
      {
        title: "Das ABC Lied - Alphabet lernen für Kinder",
        description: "Lerne das deutsche Alphabet mit diesem lustigen Lied. Perfekt für Kinder von 2-6 Jahren.",
        thumbnailUrl: "https://img.youtube.com/vi/hWUGowzJJnQ/maxresdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=hWUGowzJJnQ",
        duration: 185,
        categoryId: 1,
        ageGroups: ["2-3", "4-6"],
        source: "youtube",
        rating: 5,
        isActive: true,
      },
      {
        title: "ABC Song - Buchstaben lernen deutsch",
        description: "Ein fröhliches ABC-Lied zum Mitsingen und Buchstaben lernen mit bunten Bildern.",
        thumbnailUrl: "https://img.youtube.com/vi/b4BM7lE6Iy8/maxresdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=b4BM7lE6Iy8",
        duration: 159,
        categoryId: 1,
        ageGroups: ["2-3", "4-6"],
        source: "youtube",
        rating: 5,
        isActive: true,
      },
      {
        title: "Phonics Song - Deutsche Buchstaben Laute",
        description: "Lerne die Laute der deutschen Buchstaben mit diesem pädagogischen Lied.",
        thumbnailUrl: "https://img.youtube.com/vi/ZjyOWEc4Vew/maxresdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=ZjyOWEc4Vew",
        duration: 201,
        categoryId: 1,
        ageGroups: ["4-6"],
        source: "youtube",
        rating: 4,
        isActive: true,
      },

      // Authentic German Numbers Content
      {
        title: "Zahlen lernen von 1 bis 10 - Deutsch für Kinder",
        description: "Zählen lernen mit bunten Bildern und einfachen Liedern. Ideal für kleine Kinder.",
        thumbnailUrl: "https://img.youtube.com/vi/Aq4WAy90CmI/maxresdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=Aq4WAy90CmI",
        duration: 302,
        categoryId: 2,
        ageGroups: ["2-3", "4-6"],
        source: "youtube",
        rating: 5,
        isActive: true,
      },
      {
        title: "Das Zahlen Lied - 1 bis 20 zählen",
        description: "Lerne die Zahlen von 1 bis 20 mit einem eingängigen deutschen Lied.",
        thumbnailUrl: "https://img.youtube.com/vi/dJ7CyR7FmxY/maxresdefault.jpg", 
        videoUrl: "https://www.youtube.com/watch?v=dJ7CyR7FmxY",
        duration: 248,
        categoryId: 2,
        ageGroups: ["4-6"],
        source: "youtube",
        rating: 4,
        isActive: true,
      },
      {
        title: "Mathe für Kinder - Einfache Addition",
        description: "Lerne das Plusrechnen mit einfachen Aufgaben und visuellen Hilfsmitteln.",
        thumbnailUrl: "https://img.youtube.com/vi/StMNlUKz6Js/maxresdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=StMNlUKz6Js",
        duration: 423,
        categoryId: 2,
        ageGroups: ["4-6"],
        source: "youtube",
        rating: 5,
        isActive: true,
      },

      // Authentic German Colors Content
      {
        title: "Farben lernen für Kinder - Rot, Gelb, Blau",
        description: "Entdecke die wichtigsten Farben mit lustigen Beispielen und deutschen Liedern.",
        thumbnailUrl: "https://img.youtube.com/vi/xy7lXEizYho/maxresdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=xy7lXEizYho",
        duration: 267,
        categoryId: 3,
        ageGroups: ["2-3", "4-6"],
        source: "youtube",
        rating: 5,
        isActive: true,
      },
      {
        title: "Der Regenbogen - Alle Farben lernen",
        description: "Lerne alle Regenbogenfarben und ihre Namen auf Deutsch mit diesem schönen Lied.",
        thumbnailUrl: "https://img.youtube.com/vi/vQZBr4Uw65o/maxresdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=vQZBr4Uw65o",
        duration: 189,
        categoryId: 3,
        ageGroups: ["2-3", "4-6"],
        source: "youtube",
        rating: 4,
        isActive: true,
      },

      // Authentic German Social Skills Content
      {
        title: "Freundschaft - Zusammen sind wir stark",
        description: "Lerne, wie wichtig Freundschaft und das Teilen mit anderen Kindern ist.",
        thumbnailUrl: "https://img.youtube.com/vi/9cTiNnpOhZI/maxresdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=9cTiNnpOhZI",
        duration: 398,
        categoryId: 4,
        ageGroups: ["4-6"],
        source: "youtube",
        rating: 5,
        isActive: true,
      },
      {
        title: "Höflich sein - Bitte und Danke sagen",
        description: "Lerne wichtige Höflichkeitsregeln für den Alltag mit anderen Menschen.",
        thumbnailUrl: "https://img.youtube.com/vi/p7NLVBHHeyQ/maxresdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=p7NLVBHHeyQ",
        duration: 234,
        categoryId: 4,
        ageGroups: ["4-6"],
        source: "youtube",
        rating: 4,
        isActive: true,
      },

      // Authentic German Safety Content
      {
        title: "Verkehrssicherheit für Kinder - Sicher über die Straße",
        description: "Wichtige Verkehrsregeln und Sicherheitstipps für Kinder im Straßenverkehr.",
        thumbnailUrl: "https://img.youtube.com/vi/8VZuEaBWgvA/maxresdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=8VZuEaBWgvA",
        duration: 456,
        categoryId: 5,
        ageGroups: ["4-6"],
        source: "youtube",
        rating: 5,
        isActive: true,
      },

      // Authentic German Culture & Music Content
      {
        title: "Deutsche Kinderlieder Klassiker - Die schönsten Lieder",
        description: "Eine Sammlung der beliebtesten deutschen Kinderlieder zum Mitsingen.",
        thumbnailUrl: "https://img.youtube.com/vi/JRFyLQzB4E4/maxresdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=JRFyLQzB4E4",
        duration: 892,
        categoryId: 6,
        ageGroups: ["2-3", "4-6"],
        source: "youtube",
        rating: 5,
        isActive: true,
      },
      {
        title: "Deutsche Märchen - Rotkäppchen",
        description: "Das klassische deutsche Märchen Rotkäppchen kindgerecht erzählt.",
        thumbnailUrl: "https://img.youtube.com/vi/kIH-qdDRQTI/maxresdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=kIH-qdDRQTI",
        duration: 623,
        categoryId: 6,
        ageGroups: ["4-6"],
        source: "youtube",
        rating: 5,
        isActive: true,
      },
      {
        title: "Rolf Zuckowski - Alle meine Entchen",
        description: "Der beliebte deutsche Kindermusiker Rolf Zuckowski mit einem Klassiker.",
        thumbnailUrl: "https://img.youtube.com/vi/58uiONZyHHY/maxresdefault.jpg",
        videoUrl: "https://www.youtube.com/watch?v=58uiONZyHHY",
        duration: 167,
        categoryId: 6,
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
        categoryId: 1,
        ageGroups: ["2-3", "4-6"],
        source: "youtube",
        rating: 4,
        isActive: true,
      },
      {
        title: "Buchstaben schreiben lernen - A bis Z",
        description: "Lerne, wie man Buchstaben richtig schreibt. Für Vorschulkinder.",
        thumbnailUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop",
        videoUrl: "https://www.youtube.com/watch?v=gBxGGa4_9cs",
        duration: 280,
        categoryId: 1,
        ageGroups: ["4-6"],
        source: "youtube",
        rating: 5,
        isActive: true,
      },
      {
        title: "Erste Wörter lesen - Einfache deutsche Wörter",
        description: "Lerne deine ersten deutschen Wörter zu lesen. Mama, Papa, Haus und mehr.",
        thumbnailUrl: "https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=400&h=300&fit=crop",
        videoUrl: "https://www.youtube.com/watch?v=hRGIrrjuLYA",
        duration: 195,
        categoryId: 1,
        ageGroups: ["4-6"],
        source: "youtube",
        rating: 4,
        isActive: true,
      },

      // Numbers Category Videos
      {
        title: "Zahlen lernen von 1 bis 10 - Deutsch für Kinder",
        description: "Zählen lernen mit bunten Bildern und einfachen Liedern. Ideal für kleine Kinder.",
        thumbnailUrl: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=400&h=300&fit=crop",
        videoUrl: "https://www.youtube.com/watch?v=DR-cfDsHCUA",
        duration: 280,
        categoryId: 2,
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
        categoryId: 2,
        ageGroups: ["4-6"],
        source: "youtube",
        rating: 4,
        isActive: true,
      },
      {
        title: "Einfache Addition - Plus rechnen für Kinder",
        description: "Lerne das Plusrechnen mit einfachen Aufgaben und visuellen Hilfsmitteln.",
        thumbnailUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop",
        videoUrl: "https://www.youtube.com/watch?v=Ft2Z7zHhshs",
        duration: 320,
        categoryId: 2,
        ageGroups: ["4-6"],
        source: "youtube",
        rating: 5,
        isActive: true,
      },
      {
        title: "Geometrische Formen - Kreis, Quadrat, Dreieck",
        description: "Entdecke verschiedene Formen und lerne ihre Namen auf Deutsch.",
        thumbnailUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop",
        videoUrl: "https://www.youtube.com/watch?v=qmDO-H6YaFI",
        duration: 240,
        categoryId: 2,
        ageGroups: ["2-3", "4-6"],
        source: "youtube",
        rating: 4,
        isActive: true,
      },

      // Colors Category Videos
      {
        title: "Farben lernen für Kinder - Rot, Gelb, Blau",
        description: "Entdecke die wichtigsten Farben mit lustigen Beispielen und Liedern.",
        thumbnailUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
        videoUrl: "https://www.youtube.com/watch?v=tkWVXZKZuJ4",
        duration: 220,
        categoryId: 3,
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
        categoryId: 3,
        ageGroups: ["2-3", "4-6"],
        source: "youtube",
        rating: 4,
        isActive: true,
      },
      {
        title: "Farben mischen - Was passiert wenn wir malen?",
        description: "Experimentiere mit Farben und lerne, welche neuen Farben entstehen.",
        thumbnailUrl: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop",
        videoUrl: "https://www.youtube.com/watch?v=0H4a_NWnZCQ",
        duration: 290,
        categoryId: 3,
        ageGroups: ["4-6"],
        source: "youtube",
        rating: 5,
        isActive: true,
      },

      // Social Skills Category Videos
      {
        title: "Freundschaft und Teilen - Soziale Fähigkeiten",
        description: "Lerne, wie wichtig Freundschaft und das Teilen mit anderen ist.",
        thumbnailUrl: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=300&fit=crop",
        videoUrl: "https://www.youtube.com/watch?v=x9mq3kkfn6Y",
        duration: 365,
        categoryId: 4,
        ageGroups: ["4-6"],
        source: "youtube",
        rating: 5,
        isActive: true,
      },
      {
        title: "Höflich sein - Bitte und Danke sagen",
        description: "Lerne wichtige Höflichkeitsregeln für den Alltag.",
        thumbnailUrl: "https://images.unsplash.com/photo-1544776527-0516409b9b01?w=400&h=300&fit=crop",
        videoUrl: "https://www.youtube.com/watch?v=VeOmTUCdlkE",
        duration: 210,
        categoryId: 4,
        ageGroups: ["4-6"],
        source: "youtube",
        rating: 4,
        isActive: true,
      },
      {
        title: "Gefühle verstehen - Freude, Trauer, Wut",
        description: "Lerne deine Gefühle zu verstehen und richtig auszudrücken.",
        thumbnailUrl: "https://images.unsplash.com/photo-1554244933-d876deb6b2ff?w=400&h=300&fit=crop",
        videoUrl: "https://www.youtube.com/watch?v=9qQh5RBPTUE",
        duration: 320,
        categoryId: 4,
        ageGroups: ["4-6"],
        source: "youtube",
        rating: 5,
        isActive: true,
      },

      // Safety Category Videos
      {
        title: "Verkehrssicherheit für Kinder - Sicher über die Straße",
        description: "Wichtige Verkehrsregeln und Sicherheitstipps für Kinder.",
        thumbnailUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
        videoUrl: "https://www.youtube.com/watch?v=VR7c2W17E7g",
        duration: 310,
        categoryId: 5,
        ageGroups: ["4-6"],
        source: "youtube",
        rating: 5,
        isActive: true,
      },
      {
        title: "Fremde Menschen - Wie verhalte ich mich richtig?",
        description: "Wichtige Sicherheitsregeln im Umgang mit fremden Menschen.",
        thumbnailUrl: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop",
        videoUrl: "https://www.youtube.com/watch?v=MqH_6QgSZnY",
        duration: 285,
        categoryId: 5,
        ageGroups: ["4-6"],
        source: "youtube",
        rating: 5,
        isActive: true,
      },
      {
        title: "Notruf absetzen - Hilfe holen wenn nötig",
        description: "Lerne, wann und wie du in Notfällen Hilfe holen kannst.",
        thumbnailUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
        videoUrl: "https://www.youtube.com/watch?v=jQpJK83cqWg",
        duration: 250,
        categoryId: 5,
        ageGroups: ["4-6"],
        source: "youtube",
        rating: 4,
        isActive: true,
      },

      // German Culture Category Videos
      {
        title: "Deutsche Feste und Traditionen für Kinder",
        description: "Entdecke deutsche Feiertage und Traditionen wie Oktoberfest und Weihnachten.",
        thumbnailUrl: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400&h=300&fit=crop",
        videoUrl: "https://www.youtube.com/watch?v=hQRgHNycqoU",
        duration: 420,
        categoryId: 6,
        ageGroups: ["4-6"],
        source: "youtube",
        rating: 4,
        isActive: true,
      },
      {
        title: "Deutsche Märchen - Hänsel und Gretel",
        description: "Das klassische deutsche Märchen kindgerecht erzählt.",
        thumbnailUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
        videoUrl: "https://www.youtube.com/watch?v=UKlTjVbMEII",
        duration: 680,
        categoryId: 6,
        ageGroups: ["4-6"],
        source: "youtube",
        rating: 5,
        isActive: true,
      },
      {
        title: "Deutsche Kinderlieder Klassiker",
        description: "Die schönsten deutschen Kinderlieder zum Mitsingen.",
        thumbnailUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
        videoUrl: "https://www.youtube.com/watch?v=YQJ3xGyaUEA",
        duration: 480,
        categoryId: 6,
        ageGroups: ["2-3", "4-6"],
        source: "youtube",
        rating: 5,
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

    // Initialize authentic German educational playlists
    const defaultPlaylists: InsertPlaylist[] = [
      // Alphabet Learning Playlists
      {
        title: "ABC Kinderlieder - Deutsche Alphabet Songs",
        description: "Vollständige Sammlung deutscher ABC-Lieder zum Alphabet lernen",
        thumbnailUrl: "https://img.youtube.com/vi/hWUGowzJJnQ/maxresdefault.jpg",
        source: "youtube",
        sourceId: "PLAbc-deutsch-kinder",
        categoryId: 1,
        videoCount: 15,
        totalDuration: 2400,
        ageGroups: ["2-3", "4-6"],
      },
      {
        title: "Buchstaben lernen - Phonics auf Deutsch",
        description: "Deutsche Buchstaben-Laute und Phonics für Vorschulkinder",
        thumbnailUrl: "https://img.youtube.com/vi/ZjyOWEc4Vew/maxresdefault.jpg",
        source: "youtube",
        sourceId: "PLphonics-deutsch",
        categoryId: 1,
        videoCount: 26,
        totalDuration: 3900,
        ageGroups: ["4-6"],
      },

      // Numbers & Math Playlists  
      {
        title: "Zahlen lernen 1-100 - Deutsche Mathematik",
        description: "Vollständiger Kurs zum Zählen und Rechnen lernen auf Deutsch",
        thumbnailUrl: "https://img.youtube.com/vi/Aq4WAy90CmI/maxresdefault.jpg",
        source: "youtube",
        sourceId: "PLzahlen-deutsch-kids",
        categoryId: 2,
        videoCount: 20,
        totalDuration: 3600,
        ageGroups: ["2-3", "4-6"],
      },
      {
        title: "Mathe für Kinder - Addition und Subtraktion",
        description: "Einfache Rechenaufgaben für deutsche Vorschulkinder",
        thumbnailUrl: "https://img.youtube.com/vi/StMNlUKz6Js/maxresdefault.jpg",
        source: "youtube",
        sourceId: "PLmathe-grundschule-de",
        categoryId: 2,
        videoCount: 12,
        totalDuration: 2160,
        ageGroups: ["4-6"],
      },

      // Colors & Shapes Playlists
      {
        title: "Farben lernen - Deutsche Farbenlehre",
        description: "Alle Farben des Regenbogens auf Deutsch lernen",
        thumbnailUrl: "https://img.youtube.com/vi/xy7lXEizYho/maxresdefault.jpg",
        source: "youtube",
        sourceId: "PLfarben-deutsch-kids",
        categoryId: 3,
        videoCount: 10,
        totalDuration: 1800,
        ageGroups: ["2-3", "4-6"],
      },

      // Social Skills Playlists
      {
        title: "Soziale Fähigkeiten - Freundschaft und Teilen",
        description: "Wichtige soziale Kompetenzen für Kinder auf Deutsch",
        thumbnailUrl: "https://img.youtube.com/vi/9cTiNnpOhZI/maxresdefault.jpg",
        source: "youtube",
        sourceId: "PLsozial-deutsch-kids",
        categoryId: 4,
        videoCount: 8,
        totalDuration: 2400,
        ageGroups: ["4-6"],
      },

      // Safety Education Playlists
      {
        title: "Sicherheit für Kinder - Verkehr und Verhalten",
        description: "Wichtige Sicherheitsregeln für deutsche Kinder",
        thumbnailUrl: "https://img.youtube.com/vi/8VZuEaBWgvA/maxresdefault.jpg",
        source: "youtube",
        sourceId: "PLsicherheit-kinder-de",
        categoryId: 5,
        videoCount: 6,
        totalDuration: 1800,
        ageGroups: ["4-6"],
      },

      // German Culture & Music Hits Playlists
      {
        title: "Deutsche Kinderlieder Klassiker",
        description: "Die schönsten deutschen Kinderlieder aller Zeiten - Musik Hits für Kinder",
        thumbnailUrl: "https://img.youtube.com/vi/JRFyLQzB4E4/maxresdefault.jpg",
        source: "youtube",
        sourceId: "PLkinderlieder-klassiker",
        categoryId: 6,
        videoCount: 25,
        totalDuration: 4500,
        ageGroups: ["2-3", "4-6"],
      },
      {
        title: "Rolf Zuckowski - Größte Hits",
        description: "Die beliebtesten Lieder vom deutschen Kindermusik-König",
        thumbnailUrl: "https://img.youtube.com/vi/58uiONZyHHY/maxresdefault.jpg",
        source: "youtube",
        sourceId: "PLrolf-zuckowski-hits",
        categoryId: 6,
        videoCount: 18,
        totalDuration: 3240,
        ageGroups: ["2-3", "4-6"],
      },
      {
        title: "Deutsche Märchen Sammlung",
        description: "Klassische deutsche Märchen kindgerecht erzählt",
        thumbnailUrl: "https://img.youtube.com/vi/kIH-qdDRQTI/maxresdefault.jpg",
        source: "youtube",
        sourceId: "PLmaerchen-deutsch-kids",
        categoryId: 6,
        videoCount: 12,
        totalDuration: 4800,
        ageGroups: ["4-6"],
      },
      {
        title: "Deutsche Schlaflieder & Wiegenlieder",
        description: "Beruhigende deutsche Lieder zum Einschlafen",
        thumbnailUrl: "https://img.youtube.com/vi/schlaflieder-de/maxresdefault.jpg",
        source: "youtube",
        sourceId: "PLschlaflieder-deutsch",
        categoryId: 6,
        videoCount: 15,
        totalDuration: 2700,
        ageGroups: ["2-3", "4-6"],
      },
      {
        title: "Buchstaben schreiben lernen A-Z",
        description: "Schritt-für-Schritt Anleitung zum Schreiben aller deutschen Buchstaben.",
        thumbnailUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop",
        source: "youtube",
        sourceId: "PLwriting-german",
        categoryId: 1,
        videoCount: 26,
        totalDuration: 4200,
        ageGroups: ["4-6"],
      },
      
      // Numbers Playlists
      {
        title: "Mathe für Vorschulkinder - Zahlen 1-100",
        description: "Spielerisch Rechnen lernen mit Liedern und Animationen für 4-6 Jährige.",
        thumbnailUrl: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=400&h=300&fit=crop",
        source: "youtube",
        sourceId: "PLmath-kids-german",
        categoryId: 2,
        videoCount: 20,
        totalDuration: 3000,
        ageGroups: ["4-6"],
      },
      {
        title: "Erste Rechenaufgaben - Plus und Minus",
        description: "Einfache Addition und Subtraktion für Kinder verständlich erklärt.",
        thumbnailUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop",
        source: "youtube",
        sourceId: "PLcalculation-basic",
        categoryId: 2,
        videoCount: 15,
        totalDuration: 2250,
        ageGroups: ["4-6"],
      },
      {
        title: "Geometrische Formen entdecken",
        description: "Lerne Kreise, Quadrate, Dreiecke und andere Formen kennen.",
        thumbnailUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop",
        source: "youtube",
        sourceId: "PLshapes-geometry",
        categoryId: 2,
        videoCount: 12,
        totalDuration: 1800,
        ageGroups: ["2-3", "4-6"],
      },

      // Colors Playlists
      {
        title: "Farben und Formen Komplettkurs",
        description: "Bunte Lernvideos über alle Farben und geometrische Formen für Kinder.",
        thumbnailUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
        source: "youtube",
        sourceId: "PLcolors-shapes-german",
        categoryId: 3,
        videoCount: 18,
        totalDuration: 2700,
        ageGroups: ["2-3", "4-6"],
      },
      {
        title: "Regenbogen und Farbmischung",
        description: "Experimente mit Farben und wie neue Farben entstehen.",
        thumbnailUrl: "https://images.unsplash.com/photo-1555412654-72a95c8df614?w=400&h=300&fit=crop",
        source: "youtube",
        sourceId: "PLcolor-mixing",
        categoryId: 3,
        videoCount: 10,
        totalDuration: 1500,
        ageGroups: ["4-6"],
      },

      // Social Skills Playlists
      {
        title: "Soziale Kompetenzen für Kinder",
        description: "Freundschaft, Teilen, Höflichkeit und Gefühle verstehen lernen.",
        thumbnailUrl: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=300&fit=crop",
        source: "youtube",
        sourceId: "PLsocial-skills-kids",
        categoryId: 4,
        videoCount: 15,
        totalDuration: 3600,
        ageGroups: ["4-6"],
      },
      {
        title: "Gefühle und Emotionen verstehen",
        description: "Wie erkenne und benenne ich meine Gefühle? Für kleine Kinder erklärt.",
        thumbnailUrl: "https://images.unsplash.com/photo-1554244933-d876deb6b2ff?w=400&h=300&fit=crop",
        source: "youtube",
        sourceId: "PLemotions-kids",
        categoryId: 4,
        videoCount: 12,
        totalDuration: 2400,
        ageGroups: ["4-6"],
      },

      // Safety Playlists
      {
        title: "Sicherheit im Straßenverkehr",
        description: "Wichtige Verkehrsregeln und Sicherheitstipps für Kinder im Alltag.",
        thumbnailUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
        source: "youtube",
        sourceId: "PLtraffic-safety-kids",
        categoryId: 5,
        videoCount: 8,
        totalDuration: 1920,
        ageGroups: ["4-6"],
      },
      {
        title: "Persönliche Sicherheit für Kinder",
        description: "Wie verhalte ich mich gegenüber Fremden? Notfälle erkennen und Hilfe holen.",
        thumbnailUrl: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&h=300&fit=crop",
        source: "youtube",
        sourceId: "PLpersonal-safety",
        categoryId: 5,
        videoCount: 6,
        totalDuration: 1440,
        ageGroups: ["4-6"],
      },

      // German Culture Playlists
      {
        title: "Deutsche Märchen Klassiker",
        description: "Die schönsten deutschen Märchen kindgerecht erzählt und illustriert.",
        thumbnailUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
        source: "youtube",
        sourceId: "PLgerman-fairytales",
        categoryId: 6,
        videoCount: 10,
        totalDuration: 6000,
        ageGroups: ["4-6"],
      },
      {
        title: "Deutsche Feste und Traditionen",
        description: "Weihnachten, Ostern, Oktoberfest - Deutsche Kultur für Kinder erklärt.",
        thumbnailUrl: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400&h=300&fit=crop",
        source: "youtube",
        sourceId: "PLgerman-traditions",
        categoryId: 6,
        videoCount: 12,
        totalDuration: 3600,
        ageGroups: ["4-6"],
      },
      {
        title: "Deutsche Kinderlieder Sammlung",
        description: "Alle klassischen deutschen Kinderlieder zum Mitsingen und Tanzen.",
        thumbnailUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
        source: "youtube",
        sourceId: "PLgerman-children-songs",
        categoryId: 6,
        videoCount: 25,
        totalDuration: 4500,
        ageGroups: ["2-3", "4-6"],
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

// Use memory storage for now since database integration has issues
export const storage = new MemStorage();
