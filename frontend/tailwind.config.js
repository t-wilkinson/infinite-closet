const { colors } = require(`tailwindcss/defaultTheme`)
// https://tailwindcss.com/docs/customizing-colors#color-palette-reference

const palette = {
  pri1: '#ad9253',
  pri2: '#e7ddcb',
  sec1: '#39603d',
  sec2: '#a3bcb6',
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
      spacing: {
        px: '1px',
        72: '18rem',
        80: '20rem',
        96: '24rem',
        128: '32rem',
        256: '64rem',
      },
      colors: {
        ...palette,
        pri: {
          default: palette.pri1,
          light: palette.pri2,
        },
        sec: {
          default: palette.sec1,
          light: palette.sec2,
        },
        gray: {
          light: '#efefef',
          default: '#cccccc',
          dark: '#505050',
        },
        fg: palette.black,
        warning: palette.red,
        blue: colors.blue,
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
