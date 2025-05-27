import { storage } from "./storage";
import type { InsertVideo, InsertPlaylist } from "@shared/schema";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3";

interface YouTubeSearchResult {
  id: { videoId: string };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      medium?: { url: string };
      default?: { url: string };
    };
    publishedAt: string;
  };
}

interface YouTubePlaylistResult {
  id: string;
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      medium?: { url: string };
      default?: { url: string };
    };
  };
  contentDetails: {
    itemCount: number;
  };
}

export class YouTubeIntegration {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async searchGermanKidsVideos(query: string, maxResults = 10): Promise<YouTubeSearchResult[]> {
    const searchQuery = `${query} deutsch kinder lernen`;
    const url = `${YOUTUBE_BASE_URL}/search?part=snippet&maxResults=${maxResults}&q=${encodeURIComponent(searchQuery)}&type=video&safeSearch=strict&key=${this.apiKey}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }
      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error("Error searching YouTube videos:", error);
      return [];
    }
  }

  async searchGermanKidsPlaylists(query: string, maxResults = 5): Promise<YouTubePlaylistResult[]> {
    const searchQuery = `${query} deutsch kinder playlist`;
    const url = `${YOUTUBE_BASE_URL}/search?part=snippet&maxResults=${maxResults}&q=${encodeURIComponent(searchQuery)}&type=playlist&safeSearch=strict&key=${this.apiKey}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`YouTube API error: ${response.status}`);
      }
      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error("Error searching YouTube playlists:", error);
      return [];
    }
  }

  async populateGermanLearningContent() {
    const categories = await storage.getCategories();
    
    const searchTerms = [
      { categoryId: 1, terms: ["ABC Lied", "Alphabet deutsch", "Buchstaben lernen"] },
      { categoryId: 2, terms: ["Zahlen lernen", "1 bis 10", "Mathe kinder"] },
      { categoryId: 3, terms: ["Farben lernen", "Regenbogen", "rot blau gelb"] },
      { categoryId: 4, terms: ["Freundschaft kinder", "soziale kompetenz", "teilen"] },
      { categoryId: 5, terms: ["Sicherheit kinder", "verkehr", "fremde"] },
      { categoryId: 6, terms: ["deutsche kultur", "traditionen", "feste"] }
    ];

    for (const category of searchTerms) {
      for (const term of category.terms) {
        const videos = await this.searchGermanKidsVideos(term, 3);
        
        for (const video of videos) {
          const videoData: InsertVideo = {
            title: video.snippet.title,
            description: video.snippet.description || "",
            thumbnailUrl: video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default?.url || "",
            videoUrl: `https://www.youtube.com/watch?v=${video.id.videoId}`,
            duration: 180, // Default duration, would need additional API call for actual duration
            categoryId: category.categoryId,
            ageGroups: ["2-3", "4-6"],
            source: "youtube",
            rating: 4,
            isActive: true
          };

          try {
            await storage.createVideo(videoData);
            console.log(`Added German video: ${video.snippet.title}`);
          } catch (error) {
            console.error("Error adding video:", error);
          }
        }
      }
    }

    // Add some curated German kids playlists
    const playlistSearches = [
      "deutsche kinderlieder",
      "ABC lieder deutsch",
      "zahlen lernen deutsch"
    ];

    for (const search of playlistSearches) {
      const playlists = await this.searchGermanKidsPlaylists(search, 2);
      
      for (const playlist of playlists) {
        const playlistData: InsertPlaylist = {
          title: playlist.snippet.title,
          description: playlist.snippet.description || "",
          thumbnailUrl: playlist.snippet.thumbnails.medium?.url || playlist.snippet.thumbnails.default?.url || "",
          source: "youtube",
          sourceId: playlist.id,
          categoryId: 1, // Default to Alphabet category
          videoCount: playlist.contentDetails?.itemCount || 10,
          totalDuration: 1800, // Estimated
          ageGroups: ["2-3", "4-6"]
        };

        try {
          await storage.createPlaylist(playlistData);
          console.log(`Added German playlist: ${playlist.snippet.title}`);
        } catch (error) {
          console.error("Error adding playlist:", error);
        }
      }
    }
  }
}

export const youtubeIntegration = YOUTUBE_API_KEY ? new YouTubeIntegration(YOUTUBE_API_KEY) : null;