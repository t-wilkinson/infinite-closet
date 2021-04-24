const { colors } = require(`tailwindcss/defaultTheme`)
// https://tailwindcss.com/docs/customizing-colors#color-palette-reference

const palette = {
  pri1: '#e7ddcb',
  pri2: '#ad9253',
  sec1: '#a3bcb6',
  sec2: '#39603d',
  black: '#000000',
  white: '#ffffff',
  red: '#ff3f22',
}

module.exports = {
  mode: 'jit',
  purge: ['./components/**/*.{js,jsx,ts,tsx}', './pages/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ...palette,
        pri: {
          light: palette.pri2,
          default: palette.pri1,
        },
        sec: {
          light: palette.sec2,
          default: palette.sec1,
        },
        gray: {
          light: '#efefef',
          default: '#cccccc',
          dark: '#505050',
        },
        fg: palette.black,
        warning: palette.red,
      },
      container: {
        center: true,
        padding: {
          default: '1rem',
          md: '2rem',
        },
      },
      // TODO: font fall backs. optimize font loading. etc.
      fontFamily: {
        header: 'Cinzel, serif',
        subheader: 'Barlow, sans-serif',
        body: 'Lato, sans-serif',
      },
    },
  },
  variants: {
    extend: {
      border: ['hover'],
      borderWidth: ['hover'],
    },
  },
  variantOrder: [
    'first',
    'last',
    'odd',
    'even',
    'visited',
    'checked',
    'group-hover',
    'group-focus',
    'focus-within',
    'hover',
    'focus',
    'focus-visible',
    'active',
    'disabled',
  ],
  plugins: [require('@tailwindcss/aspect-ratio')],
}
