import { Card } from "@/components/ui/card";
import { AccessibleButton } from "./AccessibleButton";
import { History, Trash2, Package } from "lucide-react";
import { useAudioFeedback } from "@/hooks/useAudioFeedback";

interface HistoryEntry {
  code: string;
  product_name: string;
  brands: string;
  scannedAt: string;
  image_url?: string;
}

interface HistoryListProps {
  history: HistoryEntry[];
  onClear: () => void;
  onSelect: (product: HistoryEntry) => void;
}

export const HistoryList = ({ history, onClear, onSelect }: HistoryListProps) => {
  const { speak } = useAudioFeedback();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (history.length === 0) {
    return (
      <Card className="p-8 bg-card shadow-lg border-2 border-primary/20">
        <div className="flex flex-col items-center gap-4 text-center">
          <History className="w-24 h-24 text-muted-foreground/50" />
          <h2 className="text-3xl font-bold text-foreground">Histórico vazio</h2>
          <p className="text-xl text-muted-foreground">
            Os produtos escaneados aparecerão aqui
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-4xl font-bold text-foreground mb-2">Histórico</h2>
          <p className="text-xl text-muted-foreground">{history.length} produto(s) escaneado(s)</p>
        </div>

        <AccessibleButton
          audioLabel="Limpar todo o histórico de produtos"
          onClickWithAudio={() => {
            onClear();
            speak("Histórico limpo com sucesso");
          }}
          variant="destructive"
          size="lg"
          className="text-xl"
        >
          <Trash2 className="w-6 h-6 mr-2" />
          Limpar Histórico
        </AccessibleButton>
      </div>

      {history.map((product) => (
        <Card 
          key={`${product.code}-${product.scannedAt}`} 
          className="p-6 bg-card shadow-lg border-2 border-primary/20"
          onMouseEnter={() => speak(`Produto escaneado: ${product.product_name}, marca ${product.brands}, escaneado em ${formatDate(product.scannedAt)}`)}
          onTouchStart={() => speak(`Produto escaneado: ${product.product_name}, marca ${product.brands}, escaneado em ${formatDate(product.scannedAt)}`)}
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
              <p className="text-sm text-muted-foreground">{formatDate(product.scannedAt)}</p>
            </div>

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
          </div>
        </Card>
      ))}
    </div>
  );
};
