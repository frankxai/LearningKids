import { Card, CardContent } from "@/components/ui/card";
import type { Category } from "@shared/schema";

interface CategoryCardProps {
  category: Category;
  videoCount: number;
  stars: number;
  onClick: () => void;
}

export function CategoryCard({ category, videoCount, stars, onClick }: CategoryCardProps) {
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
    <Card 
      className="bg-white rounded-3xl shadow-xl hover:scale-105 transition-transform cursor-pointer"
      onClick={onClick}
    >
      <CardContent className="p-6 text-center">
        <div className={`${getColorClass(category.color)} rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4`}>
          <i className={`${category.icon} text-white text-3xl`}></i>
        </div>
        <h3 className="text-2xl font-fredoka text-darkgray mb-2">{category.name}</h3>
        <p className="text-gray-600 mb-4">{category.description}</p>
        
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-500">
            {videoCount} Videos
          </span>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <i
                key={i}
                className={`fas fa-star ${
                  i < stars ? "text-sunny" : "text-gray-300"
                }`}
              ></i>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
