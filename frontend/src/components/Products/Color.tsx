import React from 'react'

import { StrapiColor } from '@/utils/models'
import { Icon, Tooltip } from '@/components'
import { iconCheck } from '@/components/Icons'

const pickFgColorFromBgColor = (
  bgColor: string,
  lightColor: string,
  darkColor: string
) => {
  /* https://stackoverflow.com/questions/3942878/how-to-decide-font-color-in-white-or-black-depending-on-background-color */
  let color = bgColor.charAt(0) === '#' ? bgColor.substring(1, 7) : bgColor
  let r = parseInt(color.substring(0, 2), 16) // hexToR
  let g = parseInt(color.substring(2, 4), 16) // hexToG
  let b = parseInt(color.substring(4, 6), 16) // hexToB
  return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? darkColor : lightColor
}

const colorStyle = (color: StrapiColor) => ({
  background:
    color.slug === 'multicolor'
      ? `linear-gradient(
        45deg,
        rgba(255,0,0,1) 0%,
        rgba(255,154,0,1) 10%,
        rgba(208,222,33,1) 20%,
        rgba(79,220,74,1) 30%,
        rgba(63,218,216,1) 40%,
        rgba(47,201,226,1) 50%,
        rgba(28,127,238,1) 60%,
        rgba(95,21,242,1) 70%,
        rgba(186,12,248,1) 80%,
        rgba(251,7,217,1) 90%,
        rgba(255,0,0,1) 100%
      )`
      : color.slug === 'floral-print'
      ? 'center / contain url(/media/products/floral-print.jpg)'
      : color.value || color.slug.replace('-', ''),
  borderWidth: color.slug === 'white' || color.value === '#ffffff' ? 1 : 0,
})

const ColorCheck = ({ color }) => (
  <Icon
    icon={iconCheck}
    className="w-6 h-6 sm:w-4 sm:h-4"
    style={{
      color: pickFgColorFromBgColor(
        color.value || color.slug.replace('-', ''),
        '#ffffff',
        '#000000'
      ),
    }}
  />
)

export const Color = ({ panel, color }) => (
  <div className="m-1 relative" key={color.slug}>
    <button onClick={() => panel.toggle(color.slug)}>
      <Tooltip
        info={<span className="whitespace-no-wrap">{color.name}</span>}
        position="left-0 bottom-0"
      >
        <div
          className="rounded-full w-10 h-10 sm:w-8 sm:h-8 items-center justify-center border-gray"
          style={colorStyle(color)}
        >
          {panel.values.includes(color.slug) && <ColorCheck color={color} />}
        </div>
      </Tooltip>
    </button>
  </div>
)

export default Color
