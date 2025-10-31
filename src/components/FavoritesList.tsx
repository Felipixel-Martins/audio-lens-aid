import { Card } from "@/components/ui/card";
import { AccessibleButton } from "./AccessibleButton";
import { Star, Trash2, Package } from "lucide-react";
import { useAudioFeedback } from "@/hooks/useAudioFeedback";

interface Product {
  code: string;
  product_name: string;
  brands: string;
  categories: string;
  image_url?: string;
}

interface FavoritesListProps {
  favorites: Product[];
  onRemove: (code: string) => void;
  onSelect: (product: Product) => void;
}

export const FavoritesList = ({ favorites, onRemove, onSelect }: FavoritesListProps) => {
  const { speak } = useAudioFeedback();

  if (favorites.length === 0) {
    return (
      <Card className="p-8 bg-card shadow-lg border-2 border-primary/20">
        <div className="flex flex-col items-center gap-4 text-center">
          <Star className="w-24 h-24 text-muted-foreground/50" />
          <h2 className="text-3xl font-bold text-foreground">Nenhum favorito ainda</h2>
          <p className="text-xl text-muted-foreground">
            Escaneie produtos e adicione aos favoritos para acesso rápido
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-4xl font-bold text-foreground mb-2">Produtos Favoritos</h2>
        <p className="text-xl text-muted-foreground">{favorites.length} produto(s) salvo(s)</p>
      </div>

      {favorites.map((product) => (
        <Card 
          key={product.code} 
          className="p-6 bg-card shadow-lg border-2 border-primary/20"
          onMouseEnter={() => speak(`Produto favorito: ${product.product_name}, marca ${product.brands}`)}
          onTouchStart={() => speak(`Produto favorito: ${product.product_name}, marca ${product.brands}`)}
        >
          <div className="flex gap-4">
            {product.image_url ? (
              <img 
                src={product.image_url} 
                alt={product.product_name}
                className="w-24 h-24 object-cover rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
            ) : (
              <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center">
                <Package className="w-12 h-12 text-muted-foreground" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h3 className="text-2xl font-bold text-foreground mb-1 truncate">
                {product.product_name}
              </h3>
              <p className="text-lg text-muted-foreground mb-1">{product.brands}</p>
              <p className="text-sm text-muted-foreground">{product.code}</p>
            </div>

            <div className="flex flex-col gap-2">
              <AccessibleButton
                audioLabel={`Ver detalhes de ${product.product_name}`}
                onClickWithAudio={() => {
                  onSelect(product);
                  speak(`Visualizando detalhes de ${product.product_name}`);
                }}
                variant="outline"
                size="lg"
                className="text-lg"
              >
                Ver Detalhes
              </AccessibleButton>

              <AccessibleButton
                audioLabel={`Remover ${product.product_name} dos favoritos`}
                onClickWithAudio={() => {
                  onRemove(product.code);
                  speak(`${product.product_name} removido dos favoritos`);
                }}
                variant="destructive"
                size="lg"
              >
                <Trash2 className="w-6 h-6" />
              </AccessibleButton>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
