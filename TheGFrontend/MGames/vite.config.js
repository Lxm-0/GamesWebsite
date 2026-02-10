import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    base: '',
    define: {
        'window.IS_PRODUCTION': true, // Vite will replace this with true during build
    },
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                games: resolve(__dirname, 'src/Games.html'),
                teams: resolve(__dirname, 'Teams.html'),
                // Explicitly name output chunks to flatten structure if needed, 
                // but simple resolving usually preserves structure in 'src' or 'assets'.
                // We will rely on the router to handle the path difference.
                platformGame: resolve(__dirname, 'src/MainGames/platformgame/platformGame.html'),
            },
            output: {
                // Force specific naming to make production paths predictable
                entryFileNames: 'assets/[name]-[hash].js',
                chunkFileNames: 'assets/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash].[ext]',
            }
        },
    },
    server: {
        proxy: {
            '/TheGBackend': {
                target: 'http://localhost/GamesWebsite',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/TheGBackend/, 'TheGBackend'),
            },
        },
    },
});
