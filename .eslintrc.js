module.exports = {
    extends: ['eslint:recommended', 'plugin:prettier/recommended'],
    plugins: ['@typescript-eslint'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        sourceType: 'module',
        project: './tsconfig.json',
    },
    rules: {
        '@typescript-eslint/adjacent-overload-signatures': 'error',
        'no-undef': 'off',
        'no-console': 'off',
    },
    settings: {
        node: {
            tryExtensions: ['.ts', '.js', '.json', '.node'],
        },
    },
};
