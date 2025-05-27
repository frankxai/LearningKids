import { useState } from "react";
import { Header } from "@/components/header";
import { BottomNavigation } from "@/components/bottom-navigation";
import { ParentalDashboard } from "@/components/parental-dashboard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useAppState } from "@/hooks/use-app-state";
import { useQuery } from "@tanstack/react-query";
import type { Category } from "@shared/schema";

export default function Profile() {
  const [showParentalDashboard, setShowParentalDashboard] = useState(false);
  
  const { 
    settings,
    totalVideosWatched, 
    totalStarsEarned, 
    totalWatchTime,
    progress 
  } = useAppState();

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  };

  // Calculate category progress
  const getCategoryProgress = (categoryId: number) => {
    const categoryProgress = progress.filter(p => {
      // This would need actual video data to match properly
      // For now, we'll simulate some progress
      return Math.random() > 0.5;
    });
    return categoryProgress.length;
  };

  const achievements = [
    {
      id: 1,
      title: "Erstes Video",
      description: "Du hast dein erstes Video angeschaut!",
      icon: "fas fa-play",
      unlocked: totalVideosWatched >= 1,
      color: "bg-coral"
    },
    {
      id: 2,
      title: "Alphabet Entdecker",
      description: "5 Alphabet-Videos angeschaut",
      icon: "fas fa-font",
      unlocked: totalVideosWatched >= 5,
      color: "bg-coral"
    },
    {
      id: 3,
      title: "Zahlen Meister",
      description: "10 Zahlen-Videos angeschaut",
      icon: "fas fa-calculator",
      unlocked: totalVideosWatched >= 10,
      color: "bg-kidblue"
    },
    {
      id: 4,
      title: "Sternen Sammler",
      description: "25 Sterne gesammelt",
      icon: "fas fa-star",
      unlocked: totalStarsEarned >= 25,
      color: "bg-sunny"
    },
    {
      id: 5,
      title: "Fleißiger Lerner",
      description: "1 Stunde gelernt",
      icon: "fas fa-clock",
      unlocked: totalWatchTime >= 3600,
      color: "bg-mint"
    },
    {
      id: 6,
      title: "Video Profi",
      description: "50 Videos angeschaut",
      icon: "fas fa-trophy",
      unlocked: totalVideosWatched >= 50,
      color: "bg-pink"
    }
  ];

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const nextAchievement = achievements.find(a => !a.unlocked);

  return (
    <div className="min-h-screen bg-gradient-to-br from-skyblue via-teal to-mint pb-24">
      <Header onOpenParentalDashboard={() => setShowParentalDashboard(true)} />

      <main className="max-w-7xl mx-auto p-6">
        {/* Profile Header */}
        <Card className="bg-white rounded-3xl shadow-xl mb-8">
          <CardContent className="p-8 text-center">
            <div className="bg-gradient-to-r from-coral to-pink rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-user text-white text-4xl"></i>
            </div>
            <h1 className="text-4xl font-fredoka text-darkgray mb-2">Mein Profil</h1>
            <p className="text-xl text-gray-600 mb-6">
              Altersgruppe: {settings?.ageGroup} Jahre
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-coral/10 rounded-2xl p-4">
                <div className="text-2xl font-fredoka text-coral">{totalVideosWatched}</div>
                <div className="text-sm text-gray-600">Videos angeschaut</div>
              </div>
              <div className="bg-sunny/10 rounded-2xl p-4">
                <div className="text-2xl font-fredoka text-orange-600">★ {totalStarsEarned}</div>
                <div className="text-sm text-gray-600">Sterne gesammelt</div>
              </div>
              <div className="bg-teal/10 rounded-2xl p-4">
                <div className="text-2xl font-fredoka text-teal">{formatTime(totalWatchTime)}</div>
                <div className="text-sm text-gray-600">Lernzeit</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Achievements */}
          <Card className="bg-white rounded-3xl shadow-xl">
            <CardContent className="p-8">
              <h2 className="text-3xl font-fredoka text-darkgray mb-6 text-center">
                🏆 Erfolge
              </h2>
              
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`flex items-center p-4 rounded-2xl transition-all ${
                      achievement.unlocked 
                        ? 'bg-gradient-to-r from-gray-50 to-white border-2 border-green-200' 
                        : 'bg-gray-100 opacity-60'
                    }`}
                  >
                    <div className={`${achievement.color} ${achievement.unlocked ? '' : 'bg-gray-400'} rounded-full w-12 h-12 flex items-center justify-center mr-4`}>
                      <i className={`${achievement.icon} text-white text-xl`}></i>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-fredoka text-darkgray">{achievement.title}</h3>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                    {achievement.unlocked && (
                      <div className="text-green-500">
                        <i className="fas fa-check-circle text-xl"></i>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Next Achievement */}
              {nextAchievement && (
                <div className="mt-6 p-4 bg-gradient-to-r from-coral/10 to-pink/10 rounded-2xl border-2 border-coral/20">
                  <h3 className="font-fredoka text-darkgray mb-2">🎯 Nächster Erfolg:</h3>
                  <div className="flex items-center">
                    <div className={`${nextAchievement.color} rounded-full w-10 h-10 flex items-center justify-center mr-3`}>
                      <i className={`${nextAchievement.icon} text-white`}></i>
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{nextAchievement.title}</div>
                      <div className="text-xs text-gray-600">{nextAchievement.description}</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Category Progress */}
          <Card className="bg-white rounded-3xl shadow-xl">
            <CardContent className="p-8">
              <h2 className="text-3xl font-fredoka text-darkgray mb-6 text-center">
                📊 Fortschritt
              </h2>
              
              <div className="space-y-6">
                {categories
                  .filter(cat => cat.ageGroups.includes(settings?.ageGroup || "2-3"))
                  .map((category) => {
                    const categoryProgress = getCategoryProgress(category.id);
                    const maxProgress = 10; // Mock max videos per category
                    const progressPercent = (categoryProgress / maxProgress) * 100;
                    
                    return (
                      <div key={category.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <i className={`${category.icon} text-xl`} style={{ color: `var(--${category.color})` }}></i>
                            <span className="font-semibold text-darkgray">{category.name}</span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {categoryProgress}/{maxProgress}
                          </span>
                        </div>
                        <Progress value={progressPercent} className="h-2" />
                      </div>
                    );
                  })}
              </div>

              {/* Settings Button */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <Button
                  onClick={() => setShowParentalDashboard(true)}
                  className="w-full bg-gradient-to-r from-teal to-mint hover:from-teal/90 hover:to-mint/90 text-white py-3 rounded-2xl font-semibold"
                >
                  <i className="fas fa-cog mr-2"></i>
                  Einstellungen
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <BottomNavigation />
      
      <ParentalDashboard
        open={showParentalDashboard}
        onOpenChange={setShowParentalDashboard}
      />
    </div>
  );
}
