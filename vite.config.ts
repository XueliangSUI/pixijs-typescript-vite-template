import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    resolve: {
        alias: {
            '@src': path.resolve(__dirname, 'src'),
            '@shared': path.resolve(__dirname, 'src/shared'),
            '@ui': path.resolve(__dirname, 'src/ui'),
            '@classes': path.resolve(__dirname, 'src/ui/classes'),
        }
    }
});