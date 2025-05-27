import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { UserSettings, UserProgress, Favorite } from "@shared/schema";

export function useAppState() {
  const queryClient = useQueryClient();

  // User Settings
  const { data: settings, isLoading: settingsLoading } = useQuery<UserSettings>({
    queryKey: ["/api/settings"],
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: Partial<UserSettings>) => {
      const res = await apiRequest("PATCH", "/api/settings", newSettings);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
    },
  });

  // User Progress
  const { data: progress = [] } = useQuery<UserProgress[]>({
    queryKey: ["/api/progress"],
  });

  const updateProgressMutation = useMutation({
    mutationFn: async (progressData: { videoId: number; watchedDuration: number; completed: boolean; starsEarned: number }) => {
      const res = await apiRequest("POST", "/api/progress", {
        ...progressData,
        watchedAt: new Date().toISOString(),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress"] });
    },
  });

  // Favorites
  const { data: favorites = [] } = useQuery<Favorite[]>({
    queryKey: ["/api/favorites"],
  });

  const addFavoriteMutation = useMutation({
    mutationFn: async (videoId: number) => {
      const res = await apiRequest("POST", "/api/favorites", {
        videoId,
        addedAt: new Date().toISOString(),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
    },
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: async (videoId: number) => {
      const res = await apiRequest("DELETE", `/api/favorites/${videoId}`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
    },
  });

  // Calculate statistics
  const totalVideosWatched = progress.filter(p => p.completed).length;
  const totalStarsEarned = progress.reduce((sum, p) => sum + p.starsEarned, 0);
  const totalWatchTime = progress.reduce((sum, p) => sum + p.watchedDuration, 0);

  // Age group cycling
  const [selectedAge, setSelectedAge] = useState(settings?.ageGroup || "2-3");

  useEffect(() => {
    if (settings) {
      setSelectedAge(settings.ageGroup);
    }
  }, [settings]);

  const toggleAgeGroup = () => {
    const newAge = selectedAge === "2-3" ? "4-6" : "2-3";
    setSelectedAge(newAge);
    updateSettingsMutation.mutate({ ageGroup: newAge });
  };

  // Celebration effect
  const showCelebration = () => {
    const celebration = document.createElement('div');
    celebration.innerHTML = '🌟';
    celebration.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl z-50 animate-celebrate pointer-events-none';
    document.body.appendChild(celebration);
    
    setTimeout(() => {
      celebration.remove();
    }, 1000);
  };

  return {
    // Settings
    settings,
    settingsLoading,
    updateSettings: updateSettingsMutation.mutate,
    
    // Progress
    progress,
    updateProgress: updateProgressMutation.mutate,
    totalVideosWatched,
    totalStarsEarned,
    totalWatchTime,
    
    // Favorites
    favorites,
    addFavorite: addFavoriteMutation.mutate,
    removeFavorite: removeFavoriteMutation.mutate,
    
    // Age selection
    selectedAge,
    toggleAgeGroup,
    
    // UI helpers
    showCelebration,
  };
}
