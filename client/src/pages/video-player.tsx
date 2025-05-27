import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { Header } from "@/components/header";
import { BottomNavigation } from "@/components/bottom-navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAppState } from "@/hooks/use-app-state";
import { youtubeAPI } from "@/lib/youtube-api";
import type { Video } from "@shared/schema";

export default function VideoPlayer() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const { updateProgress, favorites, addFavorite, removeFavorite } = useAppState();
  
  const videoId = parseInt(params.id || "0");
  const [watchTime, setWatchTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const { data: video } = useQuery<Video>({
    queryKey: ["/api/videos", videoId],
    queryFn: async () => {
      const res = await fetch(`/api/videos/${videoId}`);
      if (!res.ok) throw new Error("Video not found");
      return res.json();
    },
  });

  const isFavorite = favorites.some(f => f.videoId === videoId);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && video) {
      interval = setInterval(() => {
        setWatchTime(prev => {
          const newTime = prev + 1;
          
          // Update progress every 10 seconds
          if (newTime % 10 === 0) {
            const completed = newTime >= video.duration * 0.8; // 80% completion
            const starsEarned = completed ? Math.min(3, Math.ceil(video.rating)) : 0;
            
            updateProgress({
              videoId: video.id,
              watchedDuration: newTime,
              completed,
              starsEarned,
            });
          }
          
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, video, updateProgress]);

  const handleBack = () => {
    if (video?.categoryId) {
      setLocation(`/category/${video.categoryId}`);
    } else {
      setLocation("/");
    }
  };

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      removeFavorite(videoId);
    } else {
      addFavorite(videoId);
    }
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = video ? (watchTime / video.duration) * 100 : 0;

  if (!video) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-skyblue via-teal to-mint flex items-center justify-center">
        <div className="text-white text-center">
          <i className="fas fa-spinner fa-spin text-4xl mb-4"></i>
          <p className="text-xl">Lade Video...</p>
        </div>
      </div>
    );
  }

  const extractYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const youtubeId = extractYouTubeId(video.videoUrl);

  return (
    <div className="min-h-screen bg-gradient-to-br from-skyblue via-teal to-mint pb-24">
      <Header onOpenParentalDashboard={() => {}} />

      <main className="max-w-6xl mx-auto p-6">
        {/* Video Player */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
          <div className="relative aspect-video bg-black">
            {youtubeId ? (
              <iframe
                src={youtubeAPI.getVideoEmbedUrl(youtubeId)}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={video.title}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center relative">
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/800x450/1F2937/FFFFFF?text=Video+Player";
                  }}
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Button
                    size="lg"
                    onClick={handlePlayPause}
                    className="bg-coral hover:bg-coral/90 rounded-full w-20 h-20 hover:scale-110 transition-transform"
                  >
                    <i className={`fas fa-${isPlaying ? 'pause' : 'play'} text-white text-2xl ${!isPlaying ? 'ml-1' : ''}`}></i>
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Video Controls */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Button
                onClick={handleBack}
                variant="ghost"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
              >
                <i className="fas fa-arrow-left"></i>
                <span>Zurück</span>
              </Button>
              
              <Button
                onClick={handleFavoriteToggle}
                variant="ghost"
                className={`rounded-full w-12 h-12 ${isFavorite ? 'text-coral' : 'text-gray-400'} hover:scale-110 transition-transform`}
              >
                <i className="fas fa-heart text-xl"></i>
              </Button>
            </div>

            <h1 className="text-3xl font-fredoka text-darkgray mb-4">{video.title}</h1>
            <p className="text-gray-600 mb-6">{video.description}</p>

            {/* Video Info */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {video.ageGroups.map(age => (
                <Badge key={age} className="bg-coral text-white">
                  {age} Jahre
                </Badge>
              ))}
              <Badge variant="outline">{video.source}</Badge>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <i
                    key={i}
                    className={`fas fa-star ${
                      i < video.rating ? "text-sunny" : "text-gray-300"
                    }`}
                  ></i>
                ))}
              </div>
              <span className="text-gray-500">{formatTime(video.duration)}</span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Fortschritt</span>
                <span>{formatTime(watchTime)} / {formatTime(video.duration)}</span>
              </div>
              <Progress value={Math.min(100, progressPercentage)} className="w-full" />
            </div>

            {/* Completion Celebration */}
            {progressPercentage >= 80 && (
              <div className="mt-6 bg-gradient-to-r from-coral to-pink rounded-2xl p-6 text-white text-center">
                <div className="text-4xl mb-2">🌟 🎉 🌟</div>
                <h3 className="text-xl font-fredoka mb-2">Gut gemacht!</h3>
                <p>Du hast das Video fast komplett angeschaut! Du bekommst {Math.min(3, Math.ceil(video.rating))} Sterne! ⭐</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
