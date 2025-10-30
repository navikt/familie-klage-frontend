import reactHooks from 'eslint-plugin-react-hooks';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import jsxA11y from 'eslint-plugin-jsx-a11y';

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    react.configs.flat.recommended,
    jsxA11y.flatConfigs.recommended,
    eslintPluginPrettierRecommended,
    {
        languageOptions: {
            parserOptions: { ecmaFeatures: { jsx: true } },
        },
    },
    {
        plugins: {
            'react-hooks': reactHooks, // TODO : Bytt til recommended når errors er fikset, se https://github.com/facebook/react/tree/HEAD/packages/eslint-plugin-react-hooks#installation
        },
        rules: {
            // Core hooks rules
            'react-hooks/rules-of-hooks': 'warn', // TODO: Endre til error når feilene er fikset.
            'react-hooks/exhaustive-deps': 'warn',

            // React Compiler rules
            'react-hooks/config': 'error',
            'react-hooks/error-boundaries': 'error',
            'react-hooks/component-hook-factories': 'error',
            'react-hooks/gating': 'error',
            'react-hooks/globals': 'error',
            'react-hooks/immutability': 'warn', // TODO: Endre til error når feilene er fikset.
            'react-hooks/preserve-manual-memoization': 'warn', // TODO: Endre til error når feilene er fikset.
            'react-hooks/purity': 'error',
            'react-hooks/refs': 'warn', // TODO: Endre til error når feilene er fikset.
            'react-hooks/set-state-in-effect': 'warn', // TODO: Endre til error når feilene er fikset.
            'react-hooks/set-state-in-render': 'error',
            'react-hooks/static-components': 'error',
            'react-hooks/unsupported-syntax': 'error',
            'react-hooks/use-memo': 'error',
            'react-hooks/incompatible-library': 'warn',

            'react/no-unescaped-entities': 'off',

            '@typescript-eslint/no-unused-expressions': 'off',
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    }
);
