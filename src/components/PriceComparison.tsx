import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AccessibleButton } from "./AccessibleButton";
import { TrendingUp, Plus, Trash2 } from "lucide-react";
import { useAudioFeedback } from "@/hooks/useAudioFeedback";

interface PriceEntry {
  id: string;
  storeName: string;
  price: number;
}

export const PriceComparison = () => {
  const [prices, setPrices] = useState<PriceEntry[]>([]);
  const [storeName, setStoreName] = useState("");
  const [price, setPrice] = useState("");
  const { speak } = useAudioFeedback();

  const addPrice = () => {
    if (!storeName || !price) {
      speak("Por favor, preencha o nome da loja e o preço");
      return;
    }

    const newEntry: PriceEntry = {
      id: Date.now().toString(),
      storeName,
      price: parseFloat(price)
    };

    setPrices([...prices, newEntry]);
    speak(`Adicionado: ${storeName}, preço ${formatPrice(parseFloat(price))}`);
    setStoreName("");
    setPrice("");
  };

  const removePrice = (id: string) => {
    const entry = prices.find(p => p.id === id);
    setPrices(prices.filter(p => p.id !== id));
    if (entry) {
      speak(`Removido: ${entry.storeName}`);
    }
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const bestPrice = prices.length > 0 
    ? prices.reduce((min, p) => p.price < min.price ? p : min)
    : null;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-4xl font-bold text-foreground mb-2">Comparação de Preços</h2>
        <p className="text-xl text-muted-foreground">
          Compare preços do mesmo produto em diferentes lojas
        </p>
      </div>

      <Card className="p-6 bg-card shadow-lg border-2 border-primary/20">
        <div className="space-y-4">
          <div
            onMouseEnter={() => speak("Campo para nome da loja")}
            onTouchStart={() => speak("Campo para nome da loja")}
          >
            <label className="block text-2xl font-semibold text-foreground mb-2">
              Nome da Loja
            </label>
            <Input
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="Ex: Supermercado ABC"
              className="text-xl h-14 border-2"
              aria-label="Nome da loja para comparação de preço"
              onFocus={() => speak("Digite o nome da loja")}
            />
          </div>

          <div
            onMouseEnter={() => speak("Campo para preço do produto")}
            onTouchStart={() => speak("Campo para preço do produto")}
          >
            <label className="block text-2xl font-semibold text-foreground mb-2">
              Preço (R$)
            </label>
            <Input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Ex: 10.50"
              className="text-xl h-14 border-2"
              aria-label="Preço do produto"
              onFocus={() => speak("Digite o preço do produto")}
            />
          </div>

          <AccessibleButton
            audioLabel="Adicionar preço à comparação"
            onClickWithAudio={addPrice}
            size="lg"
            className="w-full text-xl py-6"
          >
            <Plus className="w-6 h-6 mr-2" />
            Adicionar Preço
          </AccessibleButton>
        </div>
      </Card>

      {prices.length > 0 && (
        <>
          {bestPrice && (
            <Card className="p-6 bg-accent shadow-lg border-2 border-accent">
              <div className="flex items-center gap-4">
                <TrendingUp className="w-12 h-12 text-accent-foreground" />
                <div>
                  <h3 className="text-2xl font-bold text-accent-foreground mb-1">
                    Melhor Preço
                  </h3>
                  <p className="text-3xl font-bold text-accent-foreground">
                    {formatPrice(bestPrice.price)} - {bestPrice.storeName}
                  </p>
                </div>
              </div>
            </Card>
          )}

          <div className="space-y-3">
            {prices
              .sort((a, b) => a.price - b.price)
              .map((entry) => (
                <Card 
                  key={entry.id} 
                  className="p-6 bg-card shadow-lg border-2 border-primary/20"
                  onMouseEnter={() => speak(`${entry.storeName}, preço ${formatPrice(entry.price)}`)}
                  onTouchStart={() => speak(`${entry.storeName}, preço ${formatPrice(entry.price)}`)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-1">
                        {entry.storeName}
                      </h3>
                      <p className="text-3xl font-bold text-accent">
                        {formatPrice(entry.price)}
                      </p>
                    </div>

                    <AccessibleButton
                      audioLabel={`Remover ${entry.storeName} da comparação`}
                      onClickWithAudio={() => removePrice(entry.id)}
                      variant="destructive"
                      size="lg"
                    >
                      <Trash2 className="w-6 h-6" />
                    </AccessibleButton>
                  </div>
                </Card>
              ))}
          </div>
        </>
      )}

      {prices.length === 0 && (
        <Card className="p-8 bg-card shadow-lg border-2 border-primary/20">
          <div className="flex flex-col items-center gap-4 text-center">
            <TrendingUp className="w-24 h-24 text-muted-foreground/50" />
            <h3 className="text-3xl font-bold text-foreground">Nenhum preço cadastrado</h3>
            <p className="text-xl text-muted-foreground">
              Adicione preços de diferentes lojas para comparar
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};
