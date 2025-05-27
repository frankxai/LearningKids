import type { InsertVideo, InsertPlaylist } from "@shared/schema";

export class YouTubeContentLoader {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async loadGermanEducationalContent(): Promise<{ videos: InsertVideo[], playlists: InsertPlaylist[] }> {
    const videos: InsertVideo[] = [];
    const playlists: InsertPlaylist[] = [];

    // Educational content categories
    const educationalCategories = [
      { id: 1, search: "deutsch alphabet kinder lernen ABC", name: "Alphabet" },
      { id: 2, search: "zahlen lernen deutsch kinder 1-10", name: "Zahlen" },
      { id: 3, search: "farben lernen deutsch kinder", name: "Farben" },
      { id: 4, search: "soziale fähigkeiten kinder deutsch freundschaft", name: "Soziales" },
      { id: 5, search: "verkehrssicherheit kinder deutsch", name: "Sicherheit" },
      { id: 6, search: "deutsche märchen kinder", name: "Kultur" }
    ];

    // German music hits across the years for cultural learning
    const musicCategories = [
      { id: 6, search: "deutsche kinderlieder klassiker", name: "Kinderlieder Klassiker" },
      { id: 6, search: "deutsche volkslieder kinder", name: "Volkslieder" },
      { id: 6, search: "Rolf Zuckowski kinderlieder", name: "Rolf Zuckowski Hits" },
      { id: 6, search: "deutsche weihnachtslieder kinder", name: "Weihnachtslieder" },
      { id: 6, search: "deutsche schlaflieder kinder", name: "Schlaflieder" }
    ];

    const allCategories = [...educationalCategories, ...musicCategories];

    for (const category of allCategories) {
      try {
        // Search for videos
        const videoSearchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${encodeURIComponent(category.search)}&type=video&safeSearch=strict&relevanceLanguage=de&key=${this.apiKey}`;
        
        console.log(`🔍 Searching for: ${category.search}`);
        const videoResponse = await fetch(videoSearchUrl);
        const videoData = await videoResponse.json();
        
        if (videoData.error) {
          console.error(`YouTube API Error for ${category.name}:`, videoData.error);
          continue;
        }

        if (videoData.items) {
          videoData.items.forEach((item: any, index: number) => {
            videos.push({
              title: item.snippet.title,
              description: item.snippet.description?.substring(0, 200) + "..." || `Authentisches deutsches Lernvideo für ${category.name}`,
              thumbnailUrl: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || "https://via.placeholder.com/320x180",
              videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
              duration: 300, // Default duration
              categoryId: category.id,
              ageGroups: category.id <= 3 ? ["2-3", "4-6"] : ["4-6"],
              source: "youtube",
              rating: 4 + (index % 2), // 4 or 5 stars
              isActive: true
            });
          });
        }

        // Search for playlists
        const playlistSearchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=2&q=${encodeURIComponent(category.search + " playlist")}&type=playlist&safeSearch=strict&relevanceLanguage=de&key=${this.apiKey}`;
        
        const playlistResponse = await fetch(playlistSearchUrl);
        const playlistData = await playlistResponse.json();

        if (playlistData.items) {
          playlistData.items.forEach((item: any) => {
            playlists.push({
              title: item.snippet.title,
              description: item.snippet.description?.substring(0, 200) + "..." || `Authentische deutsche ${category.name} Sammlung`,
              thumbnailUrl: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || "https://via.placeholder.com/320x180",
              source: "youtube",
              sourceId: item.id.playlistId,
              categoryId: category.id,
              videoCount: 10, // Default count
              totalDuration: 1800, // Default duration
              ageGroups: category.id <= 3 ? ["2-3", "4-6"] : ["4-6"]
            });
          });
        }

        // Small delay to respect API rate limits
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`Error fetching ${category.name} content:`, error);
      }
    }

    console.log(`🎥 Loaded ${videos.length} authentic German videos and ${playlists.length} playlists from YouTube`);
    return { videos, playlists };
  }
}