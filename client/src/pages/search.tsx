import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Header } from "@/components/header";
import { BottomNavigation } from "@/components/bottom-navigation";
import { VideoCard } from "@/components/video-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppState } from "@/hooks/use-app-state";
import type { Video } from "@shared/schema";

// Simple debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function Search() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const { selectedAge, showCelebration } = useAppState();
  
  const debouncedSearch = useDebounce(searchQuery, 300);

  const { data: searchResults = [], isLoading } = useQuery<Video[]>({
    queryKey: ["/api/videos/search", { q: debouncedSearch, ageGroup: selectedAge }],
    queryFn: async () => {
      if (!debouncedSearch.trim()) return [];
      const res = await fetch(`/api/videos/search?q=${encodeURIComponent(debouncedSearch)}&ageGroup=${selectedAge}`);
      if (!res.ok) throw new Error("Search failed");
      return res.json();
    },
    enabled: !!debouncedSearch.trim(),
  });

  const handleVideoPlay = (videoId: number) => {
    showCelebration();
    setLocation(`/video/${videoId}`);
  };

  const popularSearches = [
    "Alphabet", "Zahlen", "Farben", "Tiere", "Musik", "Spiele"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-skyblue via-teal to-mint pb-24">
      <Header onOpenParentalDashboard={() => {}} />

      <main className="max-w-7xl mx-auto p-6">
        {/* Search Header */}
        <div className="bg-white rounded-3xl p-8 shadow-xl mb-8">
          <div className="text-center mb-6">
            <div className="text-coral mb-4">
              <i className="fas fa-search text-6xl"></i>
            </div>
            <h1 className="text-4xl font-fredoka text-darkgray mb-4">Video Suche</h1>
            <p className="text-xl text-gray-600">
              Finde deine Lieblingsvideos! 🔍
            </p>
          </div>

          {/* Search Input */}
          <div className="relative max-w-2xl mx-auto">
            <Input
              type="text"
              placeholder="Nach Videos suchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-lg p-6 pr-16 rounded-2xl border-2 border-gray-200 focus:border-coral"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              {isLoading ? (
                <i className="fas fa-spinner fa-spin text-gray-400"></i>
              ) : (
                <i className="fas fa-search text-gray-400"></i>
              )}
            </div>
          </div>

          {/* Popular Searches */}
          {!searchQuery && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-darkgray mb-4 text-center">
                Beliebte Suchbegriffe:
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {popularSearches.map((term) => (
                  <Badge
                    key={term}
                    variant="secondary"
                    className="cursor-pointer hover:bg-coral hover:text-white transition-colors px-4 py-2"
                    onClick={() => setSearchQuery(term)}
                  >
                    {term}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div className="bg-white rounded-3xl p-8 shadow-xl">
            <h2 className="text-2xl font-fredoka text-darkgray mb-6">
              Suchergebnisse für "{searchQuery}"
              {searchResults.length > 0 && (
                <span className="text-lg text-gray-500 ml-2">
                  ({searchResults.length} Videos gefunden)
                </span>
              )}
            </h2>

            {isLoading ? (
              <div className="text-center py-12">
                <i className="fas fa-spinner fa-spin text-4xl text-coral mb-4"></i>
                <p className="text-xl text-gray-600">Suche läuft...</p>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {searchResults.map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    onPlay={() => handleVideoPlay(video.id)}
                    showCategory={true}
                  />
                ))}
              </div>
            ) : debouncedSearch ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-6">
                  <i className="fas fa-search text-8xl"></i>
                </div>
                <h3 className="text-2xl font-fredoka text-darkgray mb-4">
                  Keine Videos gefunden
                </h3>
                <p className="text-lg text-gray-600 mb-6">
                  Versuche es mit anderen Suchbegriffen.
                </p>
                <div className="space-y-4">
                  <p className="text-sm text-gray-500">Probiere es mit:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {popularSearches.map((term) => (
                      <Badge
                        key={term}
                        variant="outline"
                        className="cursor-pointer hover:bg-coral hover:text-white hover:border-coral transition-colors"
                        onClick={() => setSearchQuery(term)}
                      >
                        {term}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* No Search Query State */}
        {!searchQuery && (
          <div className="bg-white rounded-3xl p-12 shadow-xl text-center">
            <div className="text-coral mb-6">
              <i className="fas fa-keyboard text-8xl"></i>
            </div>
            <h3 className="text-3xl font-fredoka text-darkgray mb-4">
              Was möchtest du lernen?
            </h3>
            <p className="text-xl text-gray-600 mb-8">
              Gib oben ein Stichwort ein und finde tolle Lernvideos!
            </p>
            <Button
              onClick={() => setLocation("/")}
              className="bg-coral hover:bg-coral/90 text-white px-8 py-4 rounded-full text-lg font-semibold hover:scale-105 transition-transform"
            >
              <i className="fas fa-home mr-2"></i>
              Zurück zur Startseite
            </Button>
          </div>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
}
