import { Card } from "@/components/ui/card";
import { AccessibleButton } from "./AccessibleButton";
import { ArrowLeft, Volume2, PackageOpen, Star } from "lucide-react";
import { useAudioFeedback } from "@/hooks/useAudioFeedback";
import { Separator } from "@/components/ui/separator";

interface Product {
  code: string;
  product_name: string;
  brands: string;
  categories: string;
  ingredients_text?: string;
  quantity?: string;
  nutriscore_grade?: string;
  image_url?: string;
}

interface ProductInfoProps {
  product: Product;
  onReset: () => void;
  onToggleFavorite: () => void;
  isFavorite: boolean;
}

export const ProductInfo = ({ product, onReset, onToggleFavorite, isFavorite }: ProductInfoProps) => {
  const { speak } = useAudioFeedback();

  const speakDetails = () => {
    const details = `
      Produto: ${product.product_name}.
      Marca: ${product.brands}.
      Categorias: ${product.categories}.
      ${product.quantity ? `Quantidade: ${product.quantity}.` : ''}
      ${product.nutriscore_grade ? `Nutri-Score: ${product.nutriscore_grade.toUpperCase()}.` : ''}
      ${product.ingredients_text ? `Ingredientes: ${product.ingredients_text}` : 'Ingredientes não disponíveis.'}
    `;
    
    speak(details);
  };

  return (
    <Card 
      className="p-8 bg-card shadow-lg border-2 border-primary/20 space-y-6"
      onMouseEnter={() => speak(`Informações do produto: ${product.product_name}, marca ${product.brands}`)}
      onTouchStart={() => speak(`Informações do produto: ${product.product_name}, marca ${product.brands}`)}
    >
      <div className="flex items-start gap-6">
        {product.image_url ? (
          <img 
            src={product.image_url} 
            alt={product.product_name}
            className="w-32 h-32 object-contain rounded-lg border-2 border-border shadow-md"
          />
        ) : (
          <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center border-2 border-border">
            <PackageOpen className="w-16 h-16 text-muted-foreground" />
          </div>
        )}
        
        <div className="flex-1 space-y-3">
          <h2 className="text-3xl font-bold text-foreground">
            {product.product_name || "Produto desconhecido"}
          </h2>
          
          {product.brands && (
            <p className="text-xl text-muted-foreground">
              <span className="font-semibold">Marca:</span> {product.brands}
            </p>
          )}
          
          {product.quantity && (
            <p className="text-xl text-muted-foreground">
              <span className="font-semibold">Quantidade:</span> {product.quantity}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <AccessibleButton
          audioLabel="Voltar para escanear outro produto"
          onClickWithAudio={() => {
            onReset();
            speak("Voltando para o scanner");
          }}
          size="lg"
          variant="outline"
          className="flex-1 text-xl py-8 font-bold border-2"
        >
          <ArrowLeft className="mr-3 h-8 w-8" />
          Voltar
        </AccessibleButton>

        <AccessibleButton
          audioLabel={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          onClickWithAudio={() => {
            onToggleFavorite();
            speak(isFavorite ? "Removido dos favoritos" : "Adicionado aos favoritos");
          }}
          size="lg"
          variant={isFavorite ? "default" : "outline"}
          className="flex-1 text-xl py-8 font-bold border-2"
        >
          <Star className={`mr-3 h-8 w-8 ${isFavorite ? "fill-current" : ""}`} />
          {isFavorite ? "Favorito" : "Favoritar"}
        </AccessibleButton>

        <AccessibleButton
          audioLabel="Ouvir todos os detalhes do produto"
          onClickWithAudio={speakDetails}
          size="lg"
          className="flex-1 text-xl py-8 font-bold bg-accent hover:bg-accent/90"
        >
          <Volume2 className="mr-3 h-8 w-8" />
          Detalhes
        </AccessibleButton>
      </div>

      <Separator className="bg-border" />

      {product.categories && (
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">Categoria</h3>
          <p className="text-lg text-muted-foreground">
            {product.categories.split(',')[0]}
          </p>
        </div>
      )}

      {product.nutriscore_grade && (
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">Nutri-Score</h3>
          <div className={`inline-block px-4 py-2 rounded-lg text-2xl font-bold text-white ${
            product.nutriscore_grade === 'a' ? 'bg-success' :
            product.nutriscore_grade === 'b' ? 'bg-green-500' :
            product.nutriscore_grade === 'c' ? 'bg-yellow-500' :
            product.nutriscore_grade === 'd' ? 'bg-orange-500' :
            'bg-destructive'
          }`}>
            {product.nutriscore_grade.toUpperCase()}
          </div>
        </div>
      )}

      {product.ingredients_text && (
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground">Ingredientes</h3>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {product.ingredients_text}
          </p>
        </div>
      )}
    </Card>
  );
};
