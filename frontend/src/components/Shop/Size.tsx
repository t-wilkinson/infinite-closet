import React from 'react'
import axios from 'axios'

import { StrapiProduct, StrapiSizeChart, StrapiSize } from '@/utils/models'
import { Icon } from '@/components'
import { toTitleCase } from '@/utils/helpers'
import * as sizing from '@/utils/sizing'
import { Size } from '@/Products/constants'

interface SizeSelector {
  product: StrapiProduct
  size: Size
  onChange: (size: Size) => void
}

export const SizeSelector = ({ product, size, onChange }: SizeSelector) => {
  const [sizeState, setSizeState] = React.useState(false)

  return (
    <div className="w-40 relative">
      <button
        tabIndex={0}
        aria-label="Dropdown product sizes"
        className="flex p-2 border border-gray relative cursor-pointer justify-between flex-row"
        onClick={() => setSizeState((state) => !state)}
        disabled={product.sizes.length === 0}
      >
        {product.sizes.length === 0
          ? 'No available sizes'
          : (sizing.index(product.sizes, size) !== undefined && size) ||
            'Select Size'}
        <Icon name="down" size={16} className="mt-1" />
      </button>
      {product.sizes.length > 0 && (
        <div
          className={`
        w-full absolute bottom-0 bg-white divide-y transform translate-y-full border border-gray z-10
        ${sizeState ? '' : 'hidden'}
        `}
        >
          {sizing.range(product.sizes).map((size: Size) => (
            <button
              key={size}
              tabIndex={0}
              aria-label="Dropdown sizes"
              onClick={() => {
                onChange(size)
                setSizeState(false)
              }}
              className="flex justify-center cursor-pointer bg-white"
            >
              {size}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export const SizeChart = ({ sizeEnum, chart }) => {
  return (
    <>
      <table className="table-fixed border border-gray-light">
        <thead className="border border-gray-light">
          <tr className="border-b border-gray-light">
            <th colSpan={chart.length + 1}>Womens Clothing</th>
          </tr>
          <tr className="border-b border-gray-light">
            <th scope="col" />
            {chart.map((item: StrapiSizeChart) => (
              <th key={item.name} scope="col" className="w-12">
                {item.name}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="p-2">
          {sizeEnum.map((size) => (
            <tr key={size} className="border-t border-gray-light">
              <th scope="row" className="p-1">
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

export const SizeMeasurements = ({ chart, measurements, product }) => (
  <table className="table-fixed border border-gray-light">
    <thead className="border border-gray-light">
      <tr className="border-b border-gray-light">
        <th className="text-center" colSpan={chart.length + 1}>
          {product.name} Measurements (cm)
        </th>
      </tr>
      <tr className="border-b border-gray-light">
        <th scope="col" />
        {measurements.map((measurement: string) => (
          <th key={measurement} className="text-center">
            {toTitleCase(measurement)}
          </th>
        ))}
      </tr>
    </thead>
    <tbody className="p-2">
      {product.sizes.map((size: StrapiSize) => (
        <tr key={size.id} className="border-t border-gray-light">
          <th scope="row" className="p-1">
            {size.sizeRange
              ? `${sizing.normalize(size.size)}/${sizing.normalize(
                  size.sizeRange
                )}`
              : size.size}
          </th>
          {measurements.map((measurement: string) => (
            <td key={measurement} className="text-center">
              {size[measurement] || '-'}
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
  const [sizeChart, setSizeChart] = React.useState()

  React.useEffect(() => {
    axios
      .get('/products/size-chart')
      .then((res) => res.data)
      .then(setSizeChart)
      .catch((err) => console.error(err))
  }, [])

  if (!sizeChart || !state) {
    return null
  } else {
    return (
      <div
        className="bottom-0 absolute bg-white border-gray border p-4 z-30 pt-8 space-y-4 overflow-y-auto w-96"
        style={{ maxHeight: 600 }}
      >
        <button
          onClick={() => setState(false)}
          className="absolute top-0 right-0"
        >
          <div className="p-4">
            <Icon name="close" size={16} />
          </div>
        </button>
        <SizeChart {...sizeChart} />
        {product && <SizeMeasurements {...sizeChart} product={product} />}
      </div>
    )
  }
}
