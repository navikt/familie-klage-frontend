import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        setupFiles: ['./src/frontend/vitest-setup.ts'],
        environment: 'jsdom',
        typecheck: {
            tsconfig: './src/frontend/tsconfig.json',
        },
    },
});
