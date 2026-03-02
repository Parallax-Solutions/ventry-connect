import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusStyles: Record<string, string> = {
  // Booking statuses
  PENDING: 'bg-warning/15 text-warning border-warning/30',
  CONFIRMED: 'bg-info/15 text-info border-info/30',
  COMPLETED: 'bg-success/15 text-success border-success/30',
  CANCELLED: 'bg-destructive/15 text-destructive border-destructive/30',
  NO_SHOW: 'bg-muted text-muted-foreground border-border',
  // Tenant statuses
  PROVISIONING: 'bg-info/15 text-info border-info/30',
  READY: 'bg-success/15 text-success border-success/30',
  SUSPENDED: 'bg-destructive/15 text-destructive border-destructive/30',
  DEACTIVATED: 'bg-muted text-muted-foreground border-border',
  // Client / User statuses
  ACTIVE: 'bg-success/15 text-success border-success/30',
  INACTIVE: 'bg-muted text-muted-foreground border-border',
  BLOCKED: 'bg-destructive/15 text-destructive border-destructive/30',
  // Legacy lowercase (landing page compatibility)
  pending: 'bg-warning/15 text-warning border-warning/30',
  confirmed: 'bg-info/15 text-info border-info/30',
  completed: 'bg-success/15 text-success border-success/30',
  cancelled: 'bg-destructive/15 text-destructive border-destructive/30',
  active: 'bg-success/15 text-success border-success/30',
  ready: 'bg-success/15 text-success border-success/30',
  configuring: 'bg-warning/15 text-warning border-warning/30',
  connected: 'bg-success/15 text-success border-success/30',
  disconnected: 'bg-muted text-muted-foreground border-border',
};

interface StatusBadgeProps {
  status: string;
  label?: string;
  className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn('font-medium', statusStyles[status], className)}>
      {label || status}
    </Badge>
  );
}
