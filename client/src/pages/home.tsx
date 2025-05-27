import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Header } from "@/components/header";
import { BottomNavigation } from "@/components/bottom-navigation";
import { ParentalDashboard } from "@/components/parental-dashboard";
import { CategoryCard } from "@/components/category-card";
import { VideoCard } from "@/components/video-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAppState } from "@/hooks/use-app-state";
import type { Category, Video, Playlist } from "@shared/schema";

export default function Home() {
  const [, setLocation] = useLocation();
  const [showParentalDashboard, setShowParentalDashboard] = useState(false);
  
  const { 
    selectedAge, 
    totalVideosWatched, 
    totalStarsEarned, 
    showCelebration,
    updateProgress 
  } = useAppState();

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: videos = [] } = useQuery<Video[]>({
    queryKey: ["/api/videos", { ageGroup: selectedAge }],
    queryFn: async () => {
      const res = await fetch(`/api/videos?ageGroup=${selectedAge}`);
      if (!res.ok) throw new Error("Failed to fetch videos");
      return res.json();
    },
  });

  const { data: playlists = [] } = useQuery<Playlist[]>({
    queryKey: ["/api/playlists", { ageGroup: selectedAge }],
    queryFn: async () => {
      const res = await fetch(`/api/playlists?ageGroup=${selectedAge}`);
      if (!res.ok) throw new Error("Failed to fetch playlists");
      return res.json();
    },
  });

  const handleCategoryClick = (categoryId: number) => {
    showCelebration();
    setLocation(`/category/${categoryId}`);
  };

  const handleVideoPlay = (videoId: number) => {
    showCelebration();
    setLocation(`/video/${videoId}`);
  };

  const handlePlaylistClick = (playlistId: number) => {
    showCelebration();
    // Navigate to the playlist's category to show the German educational videos
    const playlist = playlists.find(p => p.id === playlistId);
    if (playlist && playlist.categoryId) {
      setLocation(`/category/${playlist.categoryId}`);
    }
  };

  // Get category video counts
  const getCategoryVideoCount = (categoryId: number) => {
    return videos.filter(v => v.categoryId === categoryId).length;
  };

  // Get category stars (mock calculation based on completed videos)
  const getCategoryStars = (categoryId: number) => {
    const categoryVideos = videos.filter(v => v.categoryId === categoryId);
    if (categoryVideos.length === 0) return 0;
    
    // Mock: assume some videos are completed for demonstration
    const completedCount = Math.min(categoryVideos.length, Math.floor(Math.random() * 3) + 1);
    return Math.min(3, completedCount);
  };

  const featuredVideo = videos[0];
  const progressPercentage = Math.min(100, (totalVideosWatched / Math.max(videos.length, 1)) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-skyblue via-teal to-mint pb-24">
      <Header onOpenParentalDashboard={() => setShowParentalDashboard(true)} />

      <main className="max-w-7xl mx-auto p-6">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-fredoka text-white mb-4">
            Hallo! Lass uns lernen! 🌟
          </h2>
          <p className="text-xl text-white/90">
            Wähle eine Kategorie und starte dein Abenteuer
          </p>
        </div>

        {/* Learning Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {categories
            .filter(category => category.ageGroups.includes(selectedAge))
            .map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                videoCount={getCategoryVideoCount(category.id)}
                stars={getCategoryStars(category.id)}
                onClick={() => handleCategoryClick(category.id)}
              />
            ))}
        </div>

        {/* Interactive Quiz Section */}
        <Card className="bg-gradient-to-r from-coral to-pink rounded-3xl shadow-xl mb-8">
          <CardContent className="p-8 text-center">
            <h3 className="text-3xl font-fredoka text-white mb-4">
              🧠 Deutsches Lern-Quiz
            </h3>
            <p className="text-xl text-white/90 mb-6">
              Teste dein Wissen mit lustigen Fragen!
            </p>
            <Button
              size="lg"
              className="bg-white hover:bg-white/90 text-coral text-xl px-8 py-4 rounded-2xl font-fredoka hover:scale-105 transition-transform"
              onClick={() => setLocation('/quiz')}
            >
              <i className="fas fa-brain mr-2"></i>
              Quiz starten
            </Button>
          </CardContent>
        </Card>

        {/* Featured Content Section */}
        <Card className="bg-white rounded-3xl shadow-xl mb-8">
          <CardContent className="p-8">
            <h3 className="text-3xl font-fredoka text-darkgray mb-6 text-center">
              🌟 Heute Empfohlen
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Featured Video */}
              {featuredVideo && (
                <div className="space-y-4">
                  <div className="relative">
                    <div className="bg-darkgray rounded-2xl overflow-hidden aspect-video">
                      <img
                        src={featuredVideo.thumbnailUrl}
                        alt={featuredVideo.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://via.placeholder.com/800x450/2F3640/FFFFFF?text=Video";
                        }}
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <Button
                          size="lg"
                          className="bg-coral hover:bg-coral/90 rounded-full w-20 h-20 hover:scale-110 transition-transform"
                          onClick={() => handleVideoPlay(featuredVideo.id)}
                        >
                          <i className="fas fa-play text-white text-2xl ml-1"></i>
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xl font-fredoka text-darkgray">{featuredVideo.title}</h4>
                    <p className="text-gray-600 mt-2">{featuredVideo.description}</p>
                    <div className="flex items-center mt-3 space-x-4">
                      <span className="bg-coral text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {selectedAge} Jahre
                      </span>
                      <span className="text-gray-500">
                        {Math.floor(featuredVideo.duration / 60)}:{(featuredVideo.duration % 60).toString().padStart(2, '0')} min
                      </span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`fas fa-star ${
                              i < featuredVideo.rating ? "text-sunny" : "text-gray-300"
                            }`}
                          ></i>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Progress & Stats */}
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-coral to-pink rounded-2xl p-6 text-white">
                  <h4 className="text-xl font-fredoka mb-4">Dein Fortschritt 📈</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Videos angeschaut</span>
                        <span>{totalVideosWatched}/{videos.length}</span>
                      </div>
                      <Progress value={progressPercentage} className="bg-white/20" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Sterne gesammelt</span>
                        <span>★ {totalStarsEarned}</span>
                      </div>
                      <Progress value={(totalStarsEarned / Math.max(videos.length * 3, 1)) * 100} className="bg-white/20" />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-teal to-mint rounded-2xl p-6 text-white">
                  <h4 className="text-xl font-fredoka mb-4">Belohnungen 🏆</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                        <i className="fas fa-trophy text-2xl"></i>
                      </div>
                      <span className="text-sm">Alphabet Meister</span>
                    </div>
                    <div className="text-center opacity-50">
                      <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                        <i className="fas fa-medal text-2xl"></i>
                      </div>
                      <span className="text-sm">Zahlen Experte</span>
                    </div>
                    <div className="text-center opacity-50">
                      <div className="bg-white/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
                        <i className="fas fa-star text-2xl"></i>
                      </div>
                      <span className="text-sm">Farben König</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* YouTube Playlists Section */}
        <Card className="bg-white rounded-3xl shadow-xl">
          <CardContent className="p-8">
            <h3 className="text-3xl font-fredoka text-darkgray mb-6 text-center">
              📺 Playlists für dich
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {playlists.map((playlist) => (
                <Card
                  key={playlist.id}
                  className="bg-gray-50 rounded-2xl hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handlePlaylistClick(playlist.id)}
                >
                  <CardContent className="p-4">
                    <img
                      src={playlist.thumbnailUrl}
                      alt={playlist.title}
                      className="rounded-xl w-full h-32 object-cover mb-3"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x200/E5E7EB/6B7280?text=Playlist";
                      }}
                    />
                    <h4 className="font-fredoka text-darkgray mb-1">{playlist.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{playlist.videoCount} Videos</p>
                    <div className="flex justify-between items-center">
                      <span className={`text-white text-xs px-2 py-1 rounded-full ${
                        playlist.source === 'youtube' ? 'bg-coral' : 
                        playlist.source === 'coursera' ? 'bg-kidblue' : 'bg-sunny text-darkgray'
                      }`}>
                        {playlist.source === 'youtube' ? 'YouTube' : 
                         playlist.source === 'coursera' ? 'Coursera Kids' : 'Eigene'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {Math.floor(playlist.totalDuration / 60)} min
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNavigation />
      
      <ParentalDashboard
        open={showParentalDashboard}
        onOpenChange={setShowParentalDashboard}
      />
    </div>
  );
}
