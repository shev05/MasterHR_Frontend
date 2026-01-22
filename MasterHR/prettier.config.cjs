module.exports = {
  plugins: ['prettier-plugin-tailwindcss'],
  //tailwind plugin region start
  tailwindAttributes: ['className'],
  tailwindFunctions: ['cn', 'clsx', 'cva', 'twMerge'],
  tailwindStylesheet: './src/app/globals.css',
  //tailwind plugin region end
  endOfLine: 'lf',
  semi: true,
  singleQuote: true,
  jsxSingleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  printWidth: 120,
};
