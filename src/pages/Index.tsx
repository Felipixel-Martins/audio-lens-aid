import { useState } from "react";
import { BarcodeScanner } from "@/components/BarcodeScanner";
import { ProductInfo } from "@/components/ProductInfo";
import { Navigation } from "@/components/Navigation";
import { FavoritesList } from "@/components/FavoritesList";
import { HistoryList } from "@/components/HistoryList";
import { PriceComparison } from "@/components/PriceComparison";
import { useToast } from "@/hooks/use-toast";
import { useProductStorage } from "@/hooks/useProductStorage";
import { useAudioFeedback } from "@/hooks/useAudioFeedback";
import { ScanBarcode } from "lucide-react";

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

const Index = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [currentView, setCurrentView] = useState<"scanner" | "favorites" | "history" | "compare">("scanner");
  const { toast } = useToast();
  const { favorites, history, addToFavorites, removeFromFavorites, isFavorite, addToHistory, clearHistory } = useProductStorage();
  const { speak } = useAudioFeedback();

  const handleScan = async (barcode: string) => {
    setIsScanning(true);

    try {
      // Fetch product info from OpenFoodFacts API
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const data = await response.json();

      if (data.status === 1) {
        const productData: Product = {
          code: barcode,
          product_name: data.product.product_name,
          brands: data.product.brands,
          categories: data.product.categories,
          ingredients_text: data.product.ingredients_text,
          quantity: data.product.quantity,
          nutriscore_grade: data.product.nutriscore_grade,
          image_url: data.product.image_url,
        };

        setProduct(productData);
        addToHistory(productData);
        
        toast({
          title: "Produto encontrado!",
          description: `${productData.product_name} - ${productData.brands}`,
        });

        speak("Produto encontrado!");
      } else {
        throw new Error("Produto não encontrado");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      
      toast({
        title: "Erro ao buscar produto",
        description: "Não foi possível encontrar informações sobre este produto. Tente novamente.",
        variant: "destructive",
      });

      speak("Produto não encontrado. Tente escanear novamente.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleReset = () => {
    setProduct(null);
    setCurrentView("scanner");
    window.speechSynthesis.cancel();
  };

  const handleToggleFavorite = () => {
    if (product) {
      if (isFavorite(product.code)) {
        removeFromFavorites(product.code);
      } else {
        addToFavorites(product);
      }
    }
  };

  const handleSelectProduct = (selectedProduct: Product | any) => {
    setProduct(selectedProduct);
    setCurrentView("scanner");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header 
        className="bg-primary text-primary-foreground py-8 px-6 shadow-lg"
        onMouseEnter={() => speak("Leitor Acessível de Produtos - Sistema de reconhecimento por código de barras com áudio")}
        onTouchStart={() => speak("Leitor Acessível de Produtos - Sistema de reconhecimento por código de barras com áudio")}
      >
        <div className="container mx-auto flex items-center justify-center gap-4">
          <ScanBarcode className="w-12 h-12" />
          <h1 className="text-4xl md:text-5xl font-bold text-center">
            Leitor Acessível de Produtos
          </h1>
        </div>
        <p className="text-center text-xl mt-4 text-primary-foreground/90">
          Sistema de reconhecimento por código de barras com áudio
        </p>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12 pb-32">
        <div className="max-w-4xl mx-auto space-y-8">
          {currentView === "scanner" && (
            !product ? (
              <BarcodeScanner onScan={handleScan} isScanning={isScanning} />
            ) : (
              <ProductInfo 
                product={product} 
                onReset={handleReset}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={isFavorite(product.code)}
              />
            )
          )}

          {currentView === "favorites" && (
            <FavoritesList
              favorites={favorites}
              onRemove={removeFromFavorites}
              onSelect={handleSelectProduct}
            />
          )}

          {currentView === "history" && (
            <HistoryList
              history={history}
              onClear={clearHistory}
              onSelect={handleSelectProduct}
            />
          )}

          {currentView === "compare" && (
            <PriceComparison />
          )}
        </div>
      </main>

      {/* Navigation */}
      <Navigation currentView={currentView} onNavigate={setCurrentView} />

      {/* Footer */}
      <footer className="bg-muted py-6 px-6 mt-12">
        <div className="container mx-auto text-center">
          <p className="text-lg text-muted-foreground">
            Sistema desenvolvido para acessibilidade de pessoas com deficiência visual
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Dados fornecidos por OpenFoodFacts
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
