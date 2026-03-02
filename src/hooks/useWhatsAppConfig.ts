import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { whatsappApi } from '@/api/whatsapp';
import { useToast } from '@/hooks/use-toast';
import type { WhatsAppSetupRequest } from '@/types';

const WHATSAPP_KEY = ['whatsapp-config'] as const;

export function useWhatsAppConfig() {
  return useQuery({
    queryKey: WHATSAPP_KEY,
    queryFn: whatsappApi.getConfig,
    retry: false,
  });
}

export function useWhatsAppSetup() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: WhatsAppSetupRequest) => whatsappApi.setup(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: WHATSAPP_KEY });
      toast({ title: 'WhatsApp configured successfully' });
    },
  });
}
