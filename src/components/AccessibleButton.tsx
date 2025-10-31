import { Button } from "@/components/ui/button";
import { useAudioFeedback } from "@/hooks/useAudioFeedback";
import { ButtonHTMLAttributes, ReactNode } from "react";

interface AccessibleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  audioLabel: string;
  onClickWithAudio?: () => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export const AccessibleButton = ({ 
  children, 
  audioLabel, 
  onClickWithAudio, 
  variant, 
  size,
  className,
  ...props 
}: AccessibleButtonProps) => {
  const { speak, click } = useAudioFeedback();

  const handleInteraction = () => {
    click();
    speak(audioLabel);
  };

  const handleClick = () => {
    if (onClickWithAudio) {
      onClickWithAudio();
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onMouseEnter={handleInteraction}
      onFocus={handleInteraction}
      onClick={handleClick}
      aria-label={audioLabel}
      {...props}
    >
      {children}
    </Button>
  );
};
