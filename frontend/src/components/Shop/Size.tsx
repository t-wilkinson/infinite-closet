import React from 'react'

import axios from '@/utils/axios'
import { Icon, iconClose } from '@/Icons'
import { toTitleCase } from '@/utils/helpers'
import * as sizing from '@/utils/sizing'
import { Size, SizeChart as SizeChartType, StrapiProduct, StrapiSizeChart, StrapiSize } from '@/types'

interface SizeSelector {
  product: StrapiProduct
  size: Size
  onChange: (size: Size) => void
}

export const SizeSelector = ({
  product,
  size: currentSize,
  onChange,
}: SizeSelector) => {
  return (
    <>
      {sizing.range(product.sizes).map((size: Size) => (
        <button
          key={size}
          tabIndex={0}
          aria-label="Dropdown sizes"
          type="button"
          onClick={() => {
            onChange(size)
          }}
          className={`flex border border-gray-dark w-10 h-10 items-center justify-center cursor-pointer rounded-md
        ${currentSize === size ? 'bg-pri-light font-bold' : ''}
      `}
        >
          {size}
        </button>
      ))}
    </>
  )
}

// export const _SizeSelector = ({ product, size, onChange }: SizeSelector) => {
//   const [sizeState, setSizeState] = React.useState(false)

//   return (
//     <div className="w-40 relative">
//       <button
//         tabIndex={0}
//         aria-label="Dropdown product sizes"
//         className="flex p-2 border border-gray relative cursor-pointer justify-between flex-row"
//         onClick={() => setSizeState((state) => !state)}
//         disabled={product.sizes.length === 0}
//       >
//         {product.sizes.length === 0
//           ? 'No available sizes'
//           : (sizing.index(product.sizes, size) !== undefined && size) ||
//             'Select Size'}
//         <Icon icon={iconDown} size={16} className="mt-1" />
//       </button>
//       {product.sizes.length > 0 && (
//         <div
//           className={`
//         w-full absolute bottom-0 bg-white divide-y transform translate-y-full border border-gray z-10
//         ${sizeState ? '' : 'hidden'}
//         `}
//         >
//           {sizing.range(product.sizes).map((size: Size) => (
//             <button
//               key={size}
//               tabIndex={0}
//               aria-label="Dropdown sizes"
//               onClick={() => {
//                 onChange(size)
//                 setSizeState(false)
//               }}
//               className="flex justify-center cursor-pointer bg-white"
//             >
//               {size}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

export const SizeChart = ({
  sizeEnum,
  chart,
}: {
  sizeEnum: typeof Size
  chart: StrapiSizeChart[]
}) => {
  return (
    <>
      <table className="table-fixed border border-gray-light">
        <thead className="border border-gray-light">
          <tr className="border-b border-gray-light">
            <th
              className="text-center font-bold text-lg py-2"
              colSpan={chart.length + 1}
            >
              Womens Clothing
            </th>
          </tr>
          <tr className="border-b border-gray-light">
            <th scope="col" />
            {chart.map((item: StrapiSizeChart) => (
              <th key={item.name} scope="col" className="w-12 font-bold">
                {item.name}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="p-2">
          {sizeEnum
            // .filter((size) => size !== 'ONESIZE')
            .map((size) => (
              <tr key={size} className="border-t border-gray-light">
                <th scope="row" className="w-16 p-1 font-bold">
                  {size}
                </th>
                {chart.map((item: StrapiSizeChart) => (
                  <td key={item.name} className="text-center">
                    {item[size] || '-'}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
    </>
  )
}

type Units = 'inches' | 'cm'
const convertUnits = (size: number, from: Units, to: Units) => {
  if (from === to) {
    return size
  }
  switch ([from, to].toString()) {
    case 'inches,cm':
      return size * 2.54
    case 'cm,inches':
      return size / 2.54
    default:
      return undefined
  }
}

/**
 * Size measurements of a product
 */
export const SizeMeasurements = ({ chart, measurements, product }) => (
  <table className="table-fixed border border-gray-light">
    <thead className="border border-gray-light">
      <tr className="border-b border-gray-light">
        <th
          className="text-center text-lg font-bold py-2"
          colSpan={chart.length + 1}
        >
          {product.name} Measurements (cm)
        </th>
      </tr>
      <tr className="border-b border-gray-light">
        <th scope="col" />
        {measurements.map((measurement: string) => (
          <th key={measurement} className="text-center font-bold">
            {toTitleCase(measurement)}
          </th>
        ))}
      </tr>
    </thead>
    <tbody className="p-2">
      {product.sizes.map((size: StrapiSize) => (
        <tr key={size.id} className="border-t border-gray-light">
          <th scope="row" className="p-1 font-bold">
            {size.sizeRange
              ? `${sizing.normalize(size.size)}/${sizing.normalize(
                  size.sizeRange
                )}`
              : size.size}
          </th>
          {measurements.map((measurement: string) => (
            <td key={measurement} className="text-center">
              {convertUnits(size[measurement], size.units, 'cm') || '-'}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
)

export const SizeChartPopup = ({
  state = false,
  setState,
  product = undefined,
}) => {
  const [sizeChart, setSizeChart] = React.useState<SizeChartType>()

  React.useEffect(() => {
    axios
      .get<SizeChartType>('/size-chart', { withCredentials: false })
      .then((sizeChart) => {
        if (
          !product?.designer?.oneSizeStart ||
          !product?.designer?.oneSizeEnd
        ) {
          return sizeChart
        }

        // ONESIZE size range differs per designer
        const start = product.designer.oneSizeStart
        const end = product.designer.oneSizeEnd
        sizeChart.sizeEnum.push('ONESIZE')

        sizeChart.chart.forEach((chart) => {
          chart['ONESIZE'] = `${chart[start]}-${chart[end]}`
        })

        return sizeChart
      })
      .then((sizeChart) => setSizeChart(sizeChart))
      .catch((err) => console.error(err))
  }, [])

  if (!sizeChart || !state) {
    return null
  } else {
    return (
      <div
        className="fixed inset-0 grid place-items-center z-30"
        style={{ backgroundColor: '#5f6368cc' }}
        onClick={(e) => {
          // @ts-ignore
          if (e.target === e.currentTarget) {
            setState(false)
          }
        }}
      >
        <div
          className="bg-gray-light border-gray border w-96"
          style={{ maxHeight: 600 }}
        >
          <button
            onClick={() => setState(false)}
            className="place-self-end"
            type="button"
          >
            <div className="p-4 pb-2">
              <Icon icon={iconClose} size={16} />
            </div>
          </button>
          <div className="overflow-y-auto space-y-8 px-8 pb-4">
            <div className="bg-white rounded-md">
              <SizeChart {...sizeChart} />
            </div>
            <div className="bg-white rounded-md">
              {product && <SizeMeasurements {...sizeChart} product={product} />}
            </div>
          </div>
          {product && <div className="pb-4" />}
        </div>
      </div>
    )
  }
}
