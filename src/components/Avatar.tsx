import { cn } from "@/lib/utils";

interface AvatarProps {
  name: string;
  url?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Avatar({ name, url, size = 'md', className }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-xl'
  };

  const initials = name
    .split(' ')
    .slice(0, 2)
    .map(word => word[0])
    .join('')
    .toUpperCase();

  if (url) {
    return (
      <img
        src={url}
        alt={name}
        className={cn(
          'rounded-full object-cover border-2 border-primary/20',
          sizeClasses[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full gradient-primary flex items-center justify-center font-bold text-primary-foreground border-2 border-primary/20',
        sizeClasses[size],
        className
      )}
    >
      {initials}
    </div>
  );
}