import { Button } from "@/components/ui/button";
import { useAppState } from "@/hooks/use-app-state";

interface HeaderProps {
  onOpenParentalDashboard: () => void;
}

export function Header({ onOpenParentalDashboard }: HeaderProps) {
  const { selectedAge, toggleAgeGroup } = useAppState();

  return (
    <header className="bg-white shadow-lg rounded-b-3xl mx-4 mt-4 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-coral rounded-full p-3">
            <i className="fas fa-graduation-cap text-white text-2xl"></i>
          </div>
          <h1 className="text-3xl font-fredoka text-darkgray">KidsLernen</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Age Selector */}
          <Button
            onClick={toggleAgeGroup}
            className="bg-sunny hover:bg-sunny/90 text-darkgray rounded-full px-6 py-3 font-semibold hover:scale-105 transition-transform"
          >
            <i className="fas fa-child mr-2"></i>
            <span>{selectedAge} Jahre</span>
            <i className="fas fa-chevron-down ml-2"></i>
          </Button>
          
          {/* Parental Controls */}
          <Button
            onClick={onOpenParentalDashboard}
            className="bg-darkgray hover:bg-darkgray/90 text-white rounded-full p-3 hover:scale-105 transition-transform"
          >
            <i className="fas fa-user-shield text-xl"></i>
          </Button>
        </div>
      </div>
    </header>
  );
}
