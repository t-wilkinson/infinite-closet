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
  future: {
    purgeLayersByDefault: true,
  },
  purge: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      opacity: {
        10: '0.10',
        20: '0.20',
        30: '0.30',
        40: '0.40',
        50: '0.50',
        60: '0.60',
        70: '0.70',
        80: '0.80',
        90: '0.90',
      },
      spacing: {
        pt: '1px',
        72: '18rem',
        80: '20rem',
        96: '24rem',
        128: '32rem',
        192: '48rem',
        256: '64rem',
      },
      colors: {
        ...palette,
        pri: {
          DEFAULT: palette.pri1,
          light: palette.pri2,
        },
        sec: {
          DEFAULT: palette.sec1,
          light: palette.sec2,
        },
        gray: {
          ...colors.gray,
          light: '#efefef',
          DEFAULT: '#5f6368',
          dark: '#505050',
        },
        fg: palette.black,
        warning: palette.red,
        blue: colors.blue,
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
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
  plugins: [],
}
