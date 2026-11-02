// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([globalIgnores(['dist', 'storybook-static']), {
  files: ['**/*.{ts,tsx}'],
  extends: [
    js.configs.recommended,
    tseslint.configs.recommended,
    reactHooks.configs.flat.recommended,
    reactRefresh.configs.vite,
    jsxA11y.flatConfigs.recommended,
  ],
  languageOptions: {
    globals: globals.browser,
  },
  rules: {
    "jsx-a11y/no-autofocus": "off",
    "jsx-a11y/label-has-associated-control": ["error", { controlComponents: ["Input", "Textarea", "Select", "NativeSelect"], depth: 3 }],
    "jsx-a11y/no-noninteractive-tabindex": ["error", { roles: ["tabpanel", "region"] }],
  },
}, {
  files: ['src/components/overlay/Menu.tsx', 'src/components/overlay/dialog/Dialog.tsx', 'src/components/layout/page-search/PageSearch.tsx', 'src/components/layout/saas/SaaSLayout.tsx'],
  rules: {
    "jsx-a11y/click-events-have-key-events": "off",
    "jsx-a11y/no-noninteractive-element-interactions": "off",
    "jsx-a11y/role-supports-aria-props": "off",
  },
}, ...storybook.configs["flat/recommended"]])
