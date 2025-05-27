const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || "demo_key";

export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: string;
  publishedAt: string;
}

export interface YouTubePlaylist {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoCount: number;
  videos: YouTubeVideo[];
}

class YouTubeAPI {
  private apiKey: string;
  private baseUrl = "https://www.googleapis.com/youtube/v3";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getPlaylistVideos(playlistId: string): Promise<YouTubeVideo[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch playlist videos");
      }
      
      const data = await response.json();
      
      return data.items.map((item: any) => ({
        id: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnailUrl: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
        duration: "0", // Would need additional API call to get duration
        publishedAt: item.snippet.publishedAt,
      }));
    } catch (error) {
      console.error("Error fetching YouTube playlist videos:", error);
      return [];
    }
  }

  async searchVideos(query: string, maxResults = 10): Promise<YouTubeVideo[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/search?part=snippet&maxResults=${maxResults}&q=${encodeURIComponent(query)}&type=video&key=${this.apiKey}`
      );
      
      if (!response.ok) {
        throw new Error("Failed to search YouTube videos");
      }
      
      const data = await response.json();
      
      return data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnailUrl: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
        duration: "0", // Would need additional API call to get duration
        publishedAt: item.snippet.publishedAt,
      }));
    } catch (error) {
      console.error("Error searching YouTube videos:", error);
      return [];
    }
  }

  getVideoEmbedUrl(videoId: string): string {
    return `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`;
  }

  getVideoWatchUrl(videoId: string): string {
    return `https://www.youtube.com/watch?v=${videoId}`;
  }
}

export const youtubeAPI = new YouTubeAPI(YOUTUBE_API_KEY);
