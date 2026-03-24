/**
 * @file vite.config.js
 * @description Vite build configuration.
 *              Sets up React plugin and path alias so we can import
 *              from '@/components/...' instead of relative paths.
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Allows clean imports: import { Button } from '@/components/ui/button'
      '@': path.resolve(__dirname, './src'),
    },
  },
});
