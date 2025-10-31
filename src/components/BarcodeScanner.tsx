import { useState } from "react";
import { Card } from "@/components/ui/card";
import { AccessibleButton } from "./AccessibleButton";
import { Camera, Loader2, ScanLine } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAudioFeedback } from "@/hooks/useAudioFeedback";

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  isScanning: boolean;
}

export const BarcodeScanner = ({ onScan, isScanning }: BarcodeScannerProps) => {
  const [demoMode, setDemoMode] = useState(false);
  const { toast } = useToast();
  const { speak } = useAudioFeedback();

  const handleDemoScan = () => {
    // Simulate barcode scan with a demo product
    const demoBarcodes = [
      "7891000100103", // Coca-Cola example
      "7891000244203", // Leite example
      "7891000053508", // Nescau example
    ];
    
    const randomBarcode = demoBarcodes[Math.floor(Math.random() * demoBarcodes.length)];
    
    setDemoMode(true);
    
    // Simulate scanning animation
    setTimeout(() => {
      onScan(randomBarcode);
      setDemoMode(false);
      speak("Código detectado. Buscando informações do produto.");
    }, 1500);
  };

  return (
    <Card 
      className="p-8 bg-card shadow-lg border-2 border-primary/20"
      onMouseEnter={() => speak("Área de escaneamento de código de barras")}
      onTouchStart={() => speak("Área de escaneamento de código de barras")}
    >
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-full aspect-square max-w-sm bg-muted rounded-2xl overflow-hidden border-4 border-primary/30 shadow-accent">
          {/* Scanner overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            {isScanning || demoMode ? (
              <div className="relative">
                <Loader2 className="w-24 h-24 text-accent animate-spin" />
                <ScanLine className="w-16 h-16 text-accent absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>
            ) : (
              <Camera className="w-32 h-32 text-muted-foreground/50" />
            )}
          </div>
          
          {/* Scanning lines effect */}
          {(isScanning || demoMode) && (
            <div className="absolute inset-0">
              <div className="h-1 w-full bg-accent/70 absolute animate-scan" 
                   style={{
                     animation: 'scan 2s ease-in-out infinite',
                   }}
              />
            </div>
          )}
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-foreground">
            {isScanning || demoMode ? "Escaneando..." : "Aponte para o código de barras"}
          </h2>
          <p className="text-xl text-muted-foreground">
            Posicione o produto em frente à câmera
          </p>
        </div>

        <AccessibleButton
          audioLabel="Iniciar escaneamento de código de barras em modo demonstração"
          onClickWithAudio={handleDemoScan}
          disabled={isScanning || demoMode}
          size="lg"
          className="w-full max-w-sm text-2xl py-8 font-bold bg-accent hover:bg-accent/90 text-accent-foreground shadow-accent transition-smooth"
        >
          {isScanning || demoMode ? (
            <>
              <Loader2 className="mr-3 h-8 w-8 animate-spin" />
              Escaneando...
            </>
          ) : (
            <>
              <Camera className="mr-3 h-8 w-8" />
              Escanear Produto (Demo)
            </>
          )}
        </AccessibleButton>

        <p className="text-sm text-muted-foreground text-center max-w-md">
          Na versão demo, clique no botão para simular a leitura de um código de barras
        </p>
      </div>

      <style>{`
        @keyframes scan {
          0% {
            top: 0;
          }
          50% {
            top: 100%;
          }
          100% {
            top: 0;
          }
        }
      `}</style>
    </Card>
  );
};
