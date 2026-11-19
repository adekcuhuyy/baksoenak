import { defineConfig } from 'vite';

// base '/' saat development, base relatif './' saat build agar artefak
// bisa disajikan dari subpath statis tanpa 404 pada aset gambar.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? './' : '/',
}));
