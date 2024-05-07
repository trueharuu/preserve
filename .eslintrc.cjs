// @ts-check
module.exports = {
    env: {
        es2021: true,
        node: true,
    },
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
    overrides: [
        {
            env: {
                node: true,
            },
            files: ['.eslintrc.{js,cjs}'],
            parserOptions: {
                sourceType: 'script',
            },
        },
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint'],
    rules: {

        indent: ['error', 4],
        'linebreak-style': 'off',
        quotes: ['warn', 'single'],
        semi: ['error', 'always'],
        '@typescript-eslint/array-type': [
            'warn',
            { default: 'generic', readonly: 'generic' },
        ],
        '@typescript-eslint/explicit-function-return-type': [
            'warn',
            {
                allowConciseArrowFunctionExpressionsStartingWithVoid: true,
                allowDirectConstAssertionInArrowFunctions: true,
                allowExpressions: true,
                allowFunctionsWithoutTypeParameters: false,
                allowHigherOrderFunctions: false,
                allowIIFEs: true,
                allowTypedFunctionExpressions: true,
            },
        ],
        '@typescript-eslint/typedef': [
            'warn',
            {
                arrayDestructuring: false,
                arrowParameter: false,
                memberVariableDeclaration: true,
                objectDestructuring: false,
                parameter: true,
                propertyDeclaration: true,
                variableDeclaration: true,
                variableDeclarationIgnoreFunction: true,
                
            },
        ],
    },
};
