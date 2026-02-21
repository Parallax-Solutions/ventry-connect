import { useTranslation } from 'react-i18next';
import { MessageCircle } from 'lucide-react';

export function LandingFooter() {
  const { t } = useTranslation('landing');

  const productLinks = t('footer.productLinks', { returnObjects: true }) as string[];
  const companyLinks = t('footer.companyLinks', { returnObjects: true }) as string[];
  const legalLinks = t('footer.legalLinks', { returnObjects: true }) as string[];

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                <MessageCircle className="h-4 w-4 text-white" />
              </div>
              <span className="font-display font-bold text-xl">{t('footer.description', { defaultValue: 'Ventry' }).substring(0, 6)}</span>
            </div>
            <p className="text-sm text-background/60">{t('footer.description')}</p>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">{t('footer.product')}</h4>
            <ul className="space-y-2">
              {productLinks.map((link) => (
                <li key={link}><a href="#" className="text-sm text-background/60 hover:text-background transition-colors">{link}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">{t('footer.company')}</h4>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link}><a href="#" className="text-sm text-background/60 hover:text-background transition-colors">{link}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">{t('footer.legal')}</h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link}><a href="#" className="text-sm text-background/60 hover:text-background transition-colors">{link}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 text-center">
          <p className="text-sm text-background/50">{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
