const { colors } = require(`tailwindcss/defaultTheme`)
// https://tailwindcss.com/docs/customizing-colors#color-palette-reference

const palette = {
  pri1: '#ad9253',
  pri2: '#e7ddcb',
  pri3: '#f9f4eb',
  sec1: '#39603d',
  sec2: '#a3bcb6',
  black: '#000000',
  white: '#ffffff',
  red: '#ff3f22',
  red1: '#f99889',
  grayLight: '#efefef',
  grayDefault: '#5f6368',
  grayDark: '#505050',
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
      screens: {
        xs: '360px',
      },
      borderRadius: {
        m: '0.30rem',
      },
      height: {
        '80vh': '80vh',
      },
      maxWidth: {
        '2xs': '16rem',
        '3xs': '12rem',
        '4xs': '8rem',
        '5xs': '4rem',
        '6xs': '2rem',
      },
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
        512: '128rem',
      },
      colors: {
        ...palette,
        pri: {
          default: palette.pri1,
          light: palette.pri2,
          white: palette.pri3,
        },
        sec: {
          default: palette.sec1,
          light: palette.sec2,
        },
        gray: {
          ...colors.gray,
          light: palette.grayLight,
          '300': '#dfdfdf',
          default: palette.grayDefault,
          dark: palette.grayDark,
          black: '#393536',
        },
        fg: palette.black,
        warning: {
          light: palette.red1,
          default: palette.red,
        },
        blue: colors.blue,
      },
      container: {
        center: true,
        padding: {
          default: '1rem',
          md: '2rem',
        },
      },
      fontFamily: {
        header: 'Cinzel, serif',
        subheader: 'Barlow, sans-serif',
        body: 'Lato, sans-serif',
      },
      scale: {
        '-100': '-1',
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
