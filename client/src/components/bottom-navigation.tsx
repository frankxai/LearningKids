import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export function BottomNavigation() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", icon: "fas fa-home", label: "Start" },
    { path: "/search", icon: "fas fa-search", label: "Suchen" },
    { path: "/favorites", icon: "fas fa-heart", label: "Favoriten" },
    { path: "/chat", icon: "fas fa-comments", label: "Chat" },
    { path: "/profile", icon: "fas fa-user", label: "Profil" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg mx-4 mb-4 rounded-3xl p-4 z-40">
      <div className="flex justify-around items-center">
        {navItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <Button
              variant="ghost"
              className={`flex flex-col items-center space-y-1 p-3 rounded-2xl transition-colors ${
                location === item.path
                  ? "bg-coral text-white hover:bg-coral/90"
                  : "hover:bg-gray-100 text-gray-600 hover:text-gray-700"
              }`}
            >
              <i className={`${item.icon} text-xl`}></i>
              <span className="text-xs font-semibold">{item.label}</span>
            </Button>
          </Link>
        ))}
      </div>
    </nav>
  );
}
