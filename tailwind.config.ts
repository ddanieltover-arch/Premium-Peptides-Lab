import type { Config } from 'tailwindcss';
import { tailwindThemeExtend } from './lib/design-system';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      ...tailwindThemeExtend,
    },
  },
  plugins: [],
};

export default config;
