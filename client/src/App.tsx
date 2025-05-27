import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import CategoryPage from "@/pages/category";
import VideoPlayer from "@/pages/video-player";
import Favorites from "@/pages/favorites";
import Search from "@/pages/search";
import Profile from "@/pages/profile";
import Quiz from "@/pages/quiz";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/category/:id" component={CategoryPage} />
      <Route path="/video/:id" component={VideoPlayer} />
      <Route path="/favorites" component={Favorites} />
      <Route path="/search" component={Search} />
      <Route path="/profile" component={Profile} />
      <Route path="/quiz" component={Quiz} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
