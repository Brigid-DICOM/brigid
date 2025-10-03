import { resolve } from "node:path";
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';

const isDev = process.env.NODE_ENV === 'development';

export default defineConfig({
  main: {
    build: {
      minify: !isDev,
      outDir: 'dist/main',
      sourcemap: isDev ? 'inline' : false,
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    },
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src/main'),
      }
    }
  },
  preload: {
    build: {
      minify: !isDev,
      outDir: 'dist/preload',
      sourcemap: isDev ? 'inline' : false,
    },
    plugins: [externalizeDepsPlugin()]
  }
})
