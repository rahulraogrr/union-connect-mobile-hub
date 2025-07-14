import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import te from './locales/te.json';

// Get initial language safely
const getInitialLanguage = () => {
  try {
    return typeof window !== 'undefined' ? localStorage.getItem('language') || 'en' : 'en';
  } catch {
    return 'en';
  }
};

// Initialize i18n synchronously
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en
      },
      te: {
        translation: te
      }
    },
    lng: getInitialLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;