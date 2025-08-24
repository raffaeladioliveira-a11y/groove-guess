import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface QuizCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'game' | 'option';
}

export function QuizCard({ children, className, variant = 'default' }: QuizCardProps) {
  const variantClasses = {
    default: 'shadow-card',
    game: 'shadow-glow border-primary/20',
    option: 'option-float cursor-pointer hover:border-primary/40'
  };

  return (
    <Card className={cn(
      'bg-card/50 backdrop-blur-sm border-border/50',
      variantClasses[variant],
      className
    )}>
      {children}
    </Card>
  );
}