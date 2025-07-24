import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageJsonPath = path.resolve(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

export default defineConfig({
  integrations: [tailwind()],
  i18n: {
    defaultLocale: 'cy',
    locales: ['cy', 'en'],
    routing: {
      prefixDefaultLocale: false
    }
  },
  base: '/data-bardic/', // Replace 'directory' with your actual subdirectory name
  outDir: './dist', // This is where your built files will go
  build: {
    assets: 'assets'
  },
  vite: {
    define: {
      'import.meta.env.PUBLIC_APP_VERSION': JSON.stringify(packageJson.version),
      'import.meta.env.PUBLIC_BUILD_DATE': JSON.stringify(new Date().toISOString()),
    },
  }
});