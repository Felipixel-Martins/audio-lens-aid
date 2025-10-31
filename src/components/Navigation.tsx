import { Home, Star, History, TrendingUp } from "lucide-react";
import { AccessibleButton } from "./AccessibleButton";

interface NavigationProps {
  currentView: "scanner" | "favorites" | "history" | "compare";
  onNavigate: (view: "scanner" | "favorites" | "history" | "compare") => void;
}

export const Navigation = ({ currentView, onNavigate }: NavigationProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t-4 border-primary/20 shadow-lg z-50">
      <div className="container mx-auto flex justify-around items-center py-4 px-2">
        <AccessibleButton
          audioLabel="Ir para escaneamento de produtos"
          onClickWithAudio={() => onNavigate("scanner")}
          variant={currentView === "scanner" ? "default" : "ghost"}
          size="lg"
          className="flex-col h-auto py-3 px-4"
        >
          <Home className={`w-8 h-8 mb-1 ${currentView === "scanner" ? "text-primary-foreground" : "text-foreground"}`} />
          <span className="text-sm font-semibold">Escanear</span>
        </AccessibleButton>

        <AccessibleButton
          audioLabel="Ver produtos favoritos"
          onClickWithAudio={() => onNavigate("favorites")}
          variant={currentView === "favorites" ? "default" : "ghost"}
          size="lg"
          className="flex-col h-auto py-3 px-4"
        >
          <Star className={`w-8 h-8 mb-1 ${currentView === "favorites" ? "text-primary-foreground" : "text-foreground"}`} />
          <span className="text-sm font-semibold">Favoritos</span>
        </AccessibleButton>

        <AccessibleButton
          audioLabel="Ver histórico de produtos escaneados"
          onClickWithAudio={() => onNavigate("history")}
          variant={currentView === "history" ? "default" : "ghost"}
          size="lg"
          className="flex-col h-auto py-3 px-4"
        >
          <History className={`w-8 h-8 mb-1 ${currentView === "history" ? "text-primary-foreground" : "text-foreground"}`} />
          <span className="text-sm font-semibold">Histórico</span>
        </AccessibleButton>

        <AccessibleButton
          audioLabel="Comparar preços de produtos"
          onClickWithAudio={() => onNavigate("compare")}
          variant={currentView === "compare" ? "default" : "ghost"}
          size="lg"
          className="flex-col h-auto py-3 px-4"
        >
          <TrendingUp className={`w-8 h-8 mb-1 ${currentView === "compare" ? "text-primary-foreground" : "text-foreground"}`} />
          <span className="text-sm font-semibold">Comparar</span>
        </AccessibleButton>
      </div>
    </nav>
  );
};
