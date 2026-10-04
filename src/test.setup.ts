import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { uiTranslations } from './locales/index.js'

await i18n.use(initReactI18next).init({ lng: 'pt-BR', resources: uiTranslations, interpolation: { escapeValue: false } })
afterEach(cleanup)
