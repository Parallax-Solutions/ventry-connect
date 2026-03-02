import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from 'react-i18next';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  variant?: 'default' | 'destructive';
  withTextField?: boolean;
  textFieldLabel?: string;
  textFieldPlaceholder?: string;
  onConfirm: (textValue?: string) => void;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  variant = 'default',
  withTextField = false,
  textFieldLabel,
  textFieldPlaceholder,
  onConfirm,
}: ConfirmDialogProps) {
  const { t } = useTranslation('common');
  const [textValue, setTextValue] = useState('');

  const handleConfirm = () => {
    onConfirm(withTextField ? textValue : undefined);
    setTextValue('');
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        {withTextField && (
          <div className="py-2">
            {textFieldLabel && <Label className="mb-1.5">{textFieldLabel}</Label>}
            <Input
              value={textValue}
              onChange={(e) => setTextValue(e.target.value)}
              placeholder={textFieldPlaceholder}
            />
          </div>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={variant === 'destructive' ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : ''}
            disabled={withTextField && !textValue.trim()}
          >
            {confirmLabel || t('confirm', { defaultValue: 'Confirm' })}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
