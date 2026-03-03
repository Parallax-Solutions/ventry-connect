import { cn } from '@/lib/utils';

interface BrandMarkProps {
  className?: string;
  iconClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  subtitle?: string;
}

export function BrandMark({
  className,
  iconClassName,
  titleClassName,
  subtitleClassName,
  subtitle,
}: BrandMarkProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <img src="/favicon.svg" alt="Ventry" className={cn('h-8 w-8 rounded-lg', iconClassName)} />
      <div className="min-w-0">
        <div className={cn('font-display font-bold text-xl', titleClassName)}>Ventry</div>
        {subtitle ? (
          <p className={cn('text-[10px] uppercase tracking-wider text-muted-foreground', subtitleClassName)}>
            {subtitle}
          </p>
        ) : null}
      </div>
    </div>
  );
}
