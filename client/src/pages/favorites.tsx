import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Header } from "@/components/header";
import { BottomNavigation } from "@/components/bottom-navigation";
import { VideoCard } from "@/components/video-card";
import { Button } from "@/components/ui/button";
import { useAppState } from "@/hooks/use-app-state";
import type { Video, Favorite } from "@shared/schema";

export default function Favorites() {
  const [, setLocation] = useLocation();
  const { showCelebration } = useAppState();

  const { data: favorites = [] } = useQuery<Favorite[]>({
    queryKey: ["/api/favorites"],
  });

  const { data: videos = [] } = useQuery<Video[]>({
    queryKey: ["/api/videos"],
  });

  const favoriteVideos = videos.filter(video => 
    favorites.some(fav => fav.videoId === video.id)
  );

  const handleVideoPlay = (videoId: number) => {
    showCelebration();
    setLocation(`/video/${videoId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-skyblue via-teal to-mint pb-24">
      <Header onOpenParentalDashboard={() => {}} />

      <main className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-3xl p-8 shadow-xl mb-8 text-center">
          <div className="text-coral mb-4">
            <i className="fas fa-heart text-6xl"></i>
          </div>
          <h1 className="text-4xl font-fredoka text-darkgray mb-4">Meine Favoriten</h1>
          <p className="text-xl text-gray-600">
            Hier findest du all deine Lieblingsvideos ❤️
          </p>
        </div>

        {/* Favorites Grid */}
        {favoriteVideos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favoriteVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onPlay={() => handleVideoPlay(video.id)}
                showCategory={true}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 shadow-xl text-center">
            <div className="text-gray-400 mb-6">
              <i className="fas fa-heart text-8xl"></i>
            </div>
            <h3 className="text-3xl font-fredoka text-darkgray mb-4">
              Noch keine Favoriten
            </h3>
            <p className="text-xl text-gray-600 mb-8">
              Tippe auf das Herz-Symbol bei Videos, die dir gefallen, um sie hier zu speichern.
            </p>
            <Button
              onClick={() => setLocation("/")}
              className="bg-coral hover:bg-coral/90 text-white px-8 py-4 rounded-full text-lg font-semibold hover:scale-105 transition-transform"
            >
              <i className="fas fa-home mr-2"></i>
              Videos entdecken
            </Button>
          </div>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
}
