import type { Preview } from '@storybook/react-vite'
import i18n from 'i18next'
import { initReactI18next, I18nextProvider } from 'react-i18next'
import { uiTranslations } from '../src/locales'
import '../src/style.css'

i18n.use(initReactI18next).init({ lng: 'pt-BR', resources: uiTranslations, interpolation: { escapeValue: false } })

const preview: Preview = {
  decorators: [(Story) => <I18nextProvider i18n={i18n}><Story /></I18nextProvider>],
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
};

export default preview;
