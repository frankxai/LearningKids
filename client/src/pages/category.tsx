import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { Header } from "@/components/header";
import { BottomNavigation } from "@/components/bottom-navigation";
import { VideoCard } from "@/components/video-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppState } from "@/hooks/use-app-state";
import type { Category, Video } from "@shared/schema";

export default function CategoryPage() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const { selectedAge, showCelebration } = useAppState();
  
  const categoryId = parseInt(params.id || "0");

  const { data: category } = useQuery<Category>({
    queryKey: ["/api/categories", categoryId],
    queryFn: async () => {
      const res = await fetch(`/api/categories/${categoryId}`);
      if (!res.ok) throw new Error("Category not found");
      return res.json();
    },
  });

  const { data: videos = [] } = useQuery<Video[]>({
    queryKey: ["/api/videos", { categoryId, ageGroup: selectedAge }],
    queryFn: async () => {
      const res = await fetch(`/api/videos?categoryId=${categoryId}&ageGroup=${selectedAge}`);
      if (!res.ok) throw new Error("Failed to fetch videos");
      return res.json();
    },
  });

  const handleVideoPlay = (videoId: number) => {
    showCelebration();
    setLocation(`/video/${videoId}`);
  };

  const handleBack = () => {
    setLocation("/");
  };

  if (!category) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-skyblue via-teal to-mint flex items-center justify-center">
        <div className="text-white text-center">
          <i className="fas fa-spinner fa-spin text-4xl mb-4"></i>
          <p className="text-xl">Lade Kategorie...</p>
        </div>
      </div>
    );
  }

  const getColorClass = (color: string) => {
    const colorMap: { [key: string]: string } = {
      coral: "bg-coral",
      teal: "bg-teal",
      skyblue: "bg-skyblue",
      mint: "bg-mint",
      sunny: "bg-sunny",
      pink: "bg-pink",
      kidblue: "bg-kidblue",
    };
    return colorMap[color] || "bg-coral";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-skyblue via-teal to-mint pb-24">
      <Header onOpenParentalDashboard={() => {}} />

      <main className="max-w-7xl mx-auto p-6">
        {/* Category Header */}
        <div className="bg-white rounded-3xl p-8 shadow-xl mb-8">
          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={handleBack}
              variant="ghost"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
            >
              <i className="fas fa-arrow-left"></i>
              <span>Zurück</span>
            </Button>
            
            <Badge className={`${getColorClass(category.color)} text-white px-4 py-2`}>
              {selectedAge} Jahre
            </Badge>
          </div>

          <div className="text-center">
            <div className={`${getColorClass(category.color)} rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4`}>
              <i className={`${category.icon} text-white text-4xl`}></i>
            </div>
            <h1 className="text-4xl font-fredoka text-darkgray mb-4">{category.name}</h1>
            <p className="text-xl text-gray-600 mb-6">{category.description}</p>
            
            <div className="flex items-center justify-center space-x-6 text-gray-500">
              <div className="flex items-center space-x-2">
                <i className="fas fa-play-circle"></i>
                <span>{videos.length} Videos</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fas fa-clock"></i>
                <span>{Math.floor(videos.reduce((sum, v) => sum + v.duration, 0) / 60)} Minuten</span>
              </div>
            </div>
          </div>
        </div>

        {/* Videos Grid */}
        {videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onPlay={() => handleVideoPlay(video.id)}
                showCategory={false}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 shadow-xl text-center">
            <div className="text-gray-400 mb-4">
              <i className="fas fa-video text-6xl"></i>
            </div>
            <h3 className="text-2xl font-fredoka text-darkgray mb-2">
              Keine Videos gefunden
            </h3>
            <p className="text-gray-600 mb-6">
              Für diese Kategorie und Altersgruppe sind noch keine Videos verfügbar.
            </p>
            <Button
              onClick={handleBack}
              className="bg-coral hover:bg-coral/90 text-white px-6 py-3 rounded-full"
            >
              Zurück zur Startseite
            </Button>
          </div>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
}
