// @ts-check

/** @type {import('prettier').Config} */
const overrides = {
  overrides: [
    { files: '*.md', options: { parser: 'markdown' } },
    {
      // package.json uses json-stringify for better formatting
      files: ['**/package.json'],
      options: { parser: 'json-stringify' },
    },
    {
      // tsconfig.json files allow comments (jsonc)
      files: ['tsconfig.json', 'tsconfig.*.json'],
      options: { parser: 'json' },
    },
    { files: ['**/*.{js,mjs,cjs,jsx}'], options: { parser: 'babel' } },
    { files: ['**/*.{ts,mts,cts,tsx}'], options: { parser: 'typescript' } },
  ],
}

/** @type {Partial<import('prettier-plugin-jsdoc').Options>} */
const prettierPluginJsdocOptions = {
  jsdocCommentLineStrategy: 'keep',
  jsdocCapitalizeDescription: false,
}

/** @type {import('prettier').Options} */
const config = {
  plugins: ['prettier-plugin-jsdoc'],
  ...prettierPluginJsdocOptions,
  arrowParens: 'always',
  bracketSameLine: false,
  bracketSpacing: true,
  insertPragma: false,
  jsxSingleQuote: true,
  printWidth: 80,
  proseWrap: 'preserve',
  quoteProps: 'consistent',
  requirePragma: false,
  semi: false,
  singleAttributePerLine: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  useTabs: false,
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  ...config,
  ...overrides,
}
