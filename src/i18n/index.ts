import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enCommon from './locales/en/common.json';
import enLanding from './locales/en/landing.json';
import enDashboard from './locales/en/dashboard.json';
import enBackoffice from './locales/en/backoffice.json';

import esCommon from './locales/es/common.json';
import esLanding from './locales/es/landing.json';
import esDashboard from './locales/es/dashboard.json';
import esBackoffice from './locales/es/backoffice.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        landing: enLanding,
        dashboard: enDashboard,
        backoffice: enBackoffice,
      },
      es: {
        common: esCommon,
        landing: esLanding,
        dashboard: esDashboard,
        backoffice: esBackoffice,
      },
    },
    defaultNS: 'common',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
