import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { BookingStatus, TenantStatus } from '@/types';

const statusStyles: Record<string, string> = {
  confirmed: 'bg-success/15 text-success border-success/30',
  completed: 'bg-primary/15 text-primary border-primary/30',
  pending: 'bg-warning/15 text-warning border-warning/30',
  cancelled: 'bg-destructive/15 text-destructive border-destructive/30',
  active: 'bg-success/15 text-success border-success/30',
  ready: 'bg-success/15 text-success border-success/30',
  configuring: 'bg-warning/15 text-warning border-warning/30',
  connected: 'bg-success/15 text-success border-success/30',
  disconnected: 'bg-muted text-muted-foreground border-border',
};

interface StatusBadgeProps {
  status: BookingStatus | TenantStatus | 'active' | 'inactive' | 'connected' | 'disconnected';
  label?: string;
  className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn('font-medium capitalize', statusStyles[status], className)}>
      {label || status}
    </Badge>
  );
}
