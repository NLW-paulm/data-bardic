import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  base: '/nlw-data', // Replace 'directory' with your actual subdirectory name
  outDir: './dist', // This is where your built files will go
  build: {
    assets: 'assets'
  }
});