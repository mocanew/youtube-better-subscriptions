/** @type {import('eslint').Linter.Config} */
module.exports = {
    root: true,
    env: {
        'browser': true,
        'es6': true,
    },
    extends: [
        'eslint:recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'plugin:@typescript-eslint/recommended',
        'plugin:unicorn/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        'ecmaFeatures': {
            'jsx': true,
        },
        'ecmaVersion': 2018,
        'sourceType': 'module',
        'requireConfigFile': false,
    },
    plugins: [
        '@typescript-eslint',
        'import-newlines',
    ],
    overrides: [
        {
            files: ['.eslintrc.js'],
            env: {
                'node': true,
            },
        },
    ],
    rules: {
        'unicorn/prefer-query-selector': 'off',
        'brace-style': 'off',
        '@typescript-eslint/brace-style': ['error', 'stroustrup'],
        'comma-spacing': 'off',
        '@typescript-eslint/comma-spacing': 'error',
        'comma-dangle': 'off',
        '@typescript-eslint/comma-dangle': ['error', 'always-multiline'],
        'no-extra-parens': 'off',
        '@typescript-eslint/no-extra-parens': ['error', 'functions'],
        'func-call-spacing': 'off',
        '@typescript-eslint/func-call-spacing': ['error', 'never'],
        'keyword-spacing': 'off',
        '@typescript-eslint/keyword-spacing': 'error',
        'no-duplicate-imports': 'off',
        'no-extra-semi': 'off',
        '@typescript-eslint/no-extra-semi': 'error',
        'no-unused-expressions': 'off',
        '@typescript-eslint/no-unused-expressions': 'error',
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'error',
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': ['error', 'nofunc'],
        'quotes': 'off',
        '@typescript-eslint/quotes': ['error', 'single'],
        'space-before-function-paren': 'off',
        '@typescript-eslint/space-before-function-paren': [
            'error',
            {
                anonymous: 'never',
                named: 'never',
                asyncArrow: 'always',
            },
        ],
        'space-infix-ops': 'off',
        '@typescript-eslint/space-infix-ops': 'error',
        'camelcase': 'off',

        'unicorn/prefer-top-level-await': 'off',
        'unicorn/no-negated-condition': 'off',
        'unicorn/prefer-code-point': 'off',
        'unicorn/prevent-abbreviations': 'off',
        'unicorn/no-null': 'off',
        'unicorn/prefer-switch': 'off',
        'unicorn/prefer-ternary': 'off',
        'unicorn/no-nested-ternary': 'off',
        'unicorn/no-await-expression-member': 'off',
        'unicorn/filename-case': 'off',
        'unicorn/no-useless-undefined': ['error', {'checkArguments': false}],
        'unicorn/prefer-node-protocol': 'off',
        'unicorn/prefer-module': 'off',
        'unicorn/template-indent': 'off',
        'no-unsafe-optional-chaining': 'error',
        'curly': ['error', 'all'],

        'sort-imports': ['error', {
            ignoreCase: false,
            ignoreDeclarationSort: true,
            memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
        }],
        'import-newlines/enforce': [
            'error',
            {
                items: 10,
                'max-len': 150,
            },
        ],
        'semi': 'off',
        '@typescript-eslint/semi': ['error', 'always'],
        'object-curly-spacing': 'off',
        '@typescript-eslint/object-curly-spacing': ['error', 'never'],

        'import/named': 'off',
        'import/order': [
            'error',
            {
                groups: [
                    ['builtin', 'external'],
                    ['internal'],
                    ['parent'],
                    ['sibling', 'index'],
                    'object',
                ],
                pathGroups: [
                    {
                        pattern: '*.scss',
                        patternOptions: {
                            matchBase: true,
                        },
                        group: 'object',
                    },
                ],
                warnOnUnassignedImports: true,
                alphabetize: {
                    order: 'asc',
                    caseInsensitive: true,
                },
                'newlines-between': 'always',
            },
        ],
        'import/first': 'error',
        'import/no-duplicates': 'error',
        'import/newline-after-import': 'error',
        'import/no-extraneous-dependencies': 'error',
        'import/no-unassigned-import': ['error', {allow: ['**/*.scss', '**/*.css']}],
        'import/no-mutable-exports': 'error',
        'import/no-unresolved': 'error',
        'import/no-named-as-default': 'off',
        'import/namespace': 'off',
        'no-warning-comments': ['warn', {'terms': ['todo', 'fixme', 'bugbug'], 'location': 'start'}],
        'eol-last': ['error', 'always'],
        'function-paren-newline': ['error', 'multiline-arguments'],
        'operator-linebreak': [
            'error',
            'before',
            {
                overrides: {
                    '?': 'ignore',
                    ':': 'ignore',
                },
            },
        ],
        'id-denylist': ['error', 'Updates'],
        'no-unreachable': 'error',
        'no-multiple-empty-lines': ['error', {max: 2, maxBOF: 0}],
        'no-empty': ['error', {'allowEmptyCatch': true}],
        'no-empty-function': 'off',
        'no-return-await': 'error',
        'no-spaced-func': 'error',
        'no-unneeded-ternary': 'error',
        'prefer-arrow-callback': 'error',
        'prefer-promise-reject-errors': 'error',
        'prefer-rest-params': 'error',
        'prefer-spread': 'error',
        'require-await': 'error',
        'no-bitwise': 'error',
        'indent': ['error', 4],
        'arrow-spacing': 'error',
        'object-curly-newline': [
            'error',
            {
                ObjectExpression: {
                    multiline: true,
                    consistent: true,
                },
                ObjectPattern: {
                    multiline: true,
                    consistent: true,
                },
                ImportDeclaration: {
                    multiline: true,
                    minProperties: 11,
                    consistent: true,
                },
                ExportDeclaration: {
                    multiline: true,
                    consistent: true,
                },
            },
        ],
        'object-property-newline': ['error', {allowAllPropertiesOnSameLine: true}],
        'no-trailing-spaces': 'error',
        'no-multi-spaces': 'error',
        'object-shorthand': 'error',
        'key-spacing': 'error',
        'space-before-blocks': 'error',
        'array-bracket-spacing': ['error', 'never'],
        'space-in-parens': ['error', 'never'],
        'linebreak-style': ['error', 'unix'],
        'eqeqeq': 'error',
    },
};
