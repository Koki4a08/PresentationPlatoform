import { GlobalStyle } from '../src/styles/GlobalStyle';

export const decorators = [
  (Story) => (
    <>
      <GlobalStyle />
      <Story />
    </>
  ),
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  backgrounds: {
    default: 'light',
    values: [
      {
        name: 'light',
        value: '#f8f9fa',
      },
      {
        name: 'dark',
        value: '#1a1a1a',
      },
      {
        name: 'white',
        value: '#ffffff',
      },
    ],
  },
}; 