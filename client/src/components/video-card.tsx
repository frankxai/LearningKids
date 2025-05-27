import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppState } from "@/hooks/use-app-state";
import type { Video } from "@shared/schema";

interface VideoCardProps {
  video: Video;
  onPlay: () => void;
  showCategory?: boolean;
}

export function VideoCard({ video, onPlay, showCategory = false }: VideoCardProps) {
  const { favorites, addFavorite, removeFavorite } = useAppState();
  const [imageError, setImageError] = useState(false);
  
  const isFavorite = favorites.some(f => f.videoId === video.id);
  
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite) {
      removeFavorite(video.id);
    } else {
      addFavorite(video.id);
    }
  };

  const getAgeGroupColor = (ageGroup: string) => {
    return ageGroup === "2-3" ? "bg-coral" : "bg-kidblue";
  };

  return (
    <Card className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="relative mb-4" onClick={onPlay}>
          {!imageError ? (
            <img
              src={video.thumbnailUrl}
              alt={video.title}
              className="rounded-xl w-full h-32 object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="rounded-xl w-full h-32 bg-gray-200 flex items-center justify-center">
              <i className="fas fa-play-circle text-4xl text-gray-400"></i>
            </div>
          )}
          
          <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <Button size="sm" className="bg-coral hover:bg-coral/90 rounded-full w-12 h-12">
              <i className="fas fa-play text-white ml-1"></i>
            </Button>
          </div>
          
          <Button
            size="sm"
            variant="ghost"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full w-8 h-8 p-0"
            onClick={handleFavoriteToggle}
          >
            <i className={`fas fa-heart ${isFavorite ? 'text-coral' : 'text-gray-400'}`}></i>
          </Button>
        </div>
        
        <div onClick={onPlay}>
          <h4 className="font-fredoka text-darkgray mb-1 line-clamp-2">{video.title}</h4>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{video.description}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {video.ageGroups.map(age => (
                <Badge
                  key={age}
                  className={`${getAgeGroupColor(age)} text-white text-xs px-2 py-1 rounded-full`}
                >
                  {age} Jahre
                </Badge>
              ))}
              {showCategory && (
                <Badge variant="outline" className="text-xs">
                  {video.source}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">
                {formatDuration(video.duration)}
              </span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <i
                    key={i}
                    className={`fas fa-star text-xs ${
                      i < video.rating ? "text-sunny" : "text-gray-300"
                    }`}
                  ></i>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
