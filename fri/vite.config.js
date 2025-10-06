import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// BASE_PATH akan dikirim dari GitHub Actions. Default '/' saat dev/local.
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  plugins: [react()],
  base,
});


