// @ts-check

/** @type {import('prettier').Config} */
const overrides = {
  overrides: [
    { files: ['*.astro'], options: { parser: 'astro' } },
    { files: '*.vue', options: { parser: 'vue' } },
    { files: ['*.htm', '*.html', '*.htmlx'], options: { parser: 'html' } },
    { files: '*.scss', options: { parser: 'scss' } },
    { files: '*.css', options: { parser: 'css' } },
    { files: '*.md', options: { parser: 'markdown' } },
    { files: '*.mdx', options: { parser: 'mdx' } },
    { files: '*.yaml', options: { parser: 'yaml' } },
    {
      // some files like package.json do not allow comments because they are json
      // `'json-stringify'` can make, for example, `['foo', 'bar']` into multiple lines,
      // which makes it easier to add or delete elements
      files: ['**/package.json'],
      options: { parser: 'json-stringify' },
    },
    {
      files: [
        'i18n/**/*.json',
        'i18n/*.json',
        'locales/**/*.json',
        'locales/*.json',
      ],
      options: { parser: 'json' },
    },
    {
      // some files like tsconfig.json are written in jsonc so comments are allowed
      files: ['.oxlintrc.json', 'tsconfig.json', 'tsconfig.*.json'],
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
  plugins: ['prettier-plugin-jsdoc', 'prettier-plugin-tailwindcss'],
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
