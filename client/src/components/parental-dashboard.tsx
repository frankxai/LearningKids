import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppState } from "@/hooks/use-app-state";
import { useQuery } from "@tanstack/react-query";
import type { Category } from "@shared/schema";

interface ParentalDashboardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ParentalDashboard({ open, onOpenChange }: ParentalDashboardProps) {
  const { 
    settings, 
    updateSettings, 
    totalVideosWatched, 
    totalStarsEarned, 
    totalWatchTime 
  } = useAppState();

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  if (!settings) return null;

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}min`;
  };

  const handleTimeLimitChange = (value: number[]) => {
    updateSettings({ dailyTimeLimit: value[0] });
  };

  const handleWeekendModeChange = (checked: boolean) => {
    updateSettings({ weekendMode: checked });
  };

  const handleAgeGroupChange = (ageGroup: string) => {
    updateSettings({ ageGroup });
  };

  const handleCategoryToggle = (categoryName: string, checked: boolean) => {
    const currentCategories = settings.allowedCategories || [];
    const updatedCategories = checked
      ? [...currentCategories, categoryName.toLowerCase()]
      : currentCategories.filter(cat => cat !== categoryName.toLowerCase());
    
    updateSettings({ allowedCategories: updatedCategories });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-fredoka text-darkgray">
            Eltern Dashboard
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Progress Overview */}
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-coral to-pink rounded-2xl p-6 text-white">
              <h3 className="text-xl font-fredoka mb-4">Lernfortschritt diese Woche</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Videos angeschaut:</span>
                  <span>{totalVideosWatched}</span>
                </div>
                <div className="flex justify-between">
                  <span>Lernzeit gesamt:</span>
                  <span>{formatTime(totalWatchTime)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sterne gesammelt:</span>
                  <span>★ {totalStarsEarned}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-xl font-fredoka text-darkgray mb-4">Zeitlimits einstellen</h3>
              <div className="space-y-4">
                <div>
                  <Label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tägliche Lernzeit: {settings.dailyTimeLimit} Minuten
                  </Label>
                  <Slider
                    value={[settings.dailyTimeLimit]}
                    onValueChange={handleTimeLimitChange}
                    max={120}
                    min={15}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>15 min</span>
                    <span>120 min</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="weekendMode"
                    checked={settings.weekendMode}
                    onCheckedChange={handleWeekendModeChange}
                  />
                  <Label htmlFor="weekendMode" className="text-sm text-gray-700">
                    Längere Zeit am Wochenende
                  </Label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Content Controls */}
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-xl font-fredoka text-darkgray mb-4">Inhalte verwalten</h3>
              <div className="space-y-4">
                <div>
                  <Label className="block text-sm font-semibold text-gray-700 mb-2">
                    Altersgruppe
                  </Label>
                  <Select value={settings.ageGroup} onValueChange={handleAgeGroupChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2-3">2-3 Jahre</SelectItem>
                      <SelectItem value="4-6">4-6 Jahre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="block text-sm font-semibold text-gray-700 mb-2">
                    Erlaubte Kategorien
                  </Label>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category.id}`}
                          checked={settings.allowedCategories?.includes(category.name.toLowerCase()) || false}
                          onCheckedChange={(checked) => 
                            handleCategoryToggle(category.name, checked as boolean)
                          }
                        />
                        <Label htmlFor={`category-${category.id}`} className="text-sm">
                          {category.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-teal to-mint rounded-2xl p-6 text-white">
              <h3 className="text-xl font-fredoka mb-4">Wöchentlicher Bericht</h3>
              <p className="mb-4">
                Ihr Kind macht großartige Fortschritte! Diese Woche wurden {totalVideosWatched} Videos 
                angeschaut und {totalStarsEarned} Sterne gesammelt.
              </p>
              <Button 
                className="bg-white text-teal hover:bg-gray-100 transition-colors"
                onClick={() => {
                  // In a real app, this would generate and download a report
                  alert("Bericht wird erstellt...");
                }}
              >
                Vollständigen Bericht herunterladen
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
