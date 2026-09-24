import type { Preview } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'
import '@/config/inter/internationalization'
import '@/style.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default preview;
