import React from 'react'

import { StrapiSize } from '@/utils/models'
import { Icon } from '@/components'
import { toTitleCase } from '@/utils/helpers'
import { normalizeSize } from '@/Products/helpers'

import { shopActions } from './slice'

export const SizeSelector = ({ product, state, dispatch }) => {
  const [sizeState, setSizeState] = React.useState(false)

  return (
    <div>
      <button
        tabIndex={0}
        aria-label="Dropdown product sizes"
        className="flex p-2 border border-gray relative cursor-pointer w-32 justify-between flex-row"
        onClick={() => setSizeState((state) => !state)}
      >
        {(state.size !== undefined &&
          product.sizes[state.size] !== undefined &&
          product.sizes[state.size].size) ||
          'Select Size'}
        <Icon name="down" size={16} className="mt-1" />
      </button>
      <div
        className={`
        w-32 absolute bottom-0 bg-white divide-y transform translate-y-full border border-gray z-10
        ${sizeState ? '' : 'hidden'}
        `}
      >
        {product.sizes.map((size: StrapiSize, index: number) => (
          <button
            key={size.id}
            tabIndex={0}
            aria-label="Dropdown sizes"
            onClick={() => {
              dispatch(shopActions.changeSize(index))
              setSizeState(false)
            }}
            className="flex justify-center cursor-pointer bg-white"
          >
            {size.size}
          </button>
        ))}
      </div>
    </div>
  )
}

export const SizeChart = ({
  product,
  sizeEnum,
  chart,
  close,
  measurements,
}) => {
  return (
    <div
      className="absolute bg-white border-gray border p-4 z-10 pt-8 space-y-4 overflow-y-scroll"
      style={{ maxHeight: 600 }}
    >
      <button onClick={close} className="absolute top-0 right-0">
        <div className="p-4">
          <Icon name="close" size={16} />
        </div>
      </button>

      <table className="table-fixed border border-gray-light">
        <thead className="border border-gray-light">
          <tr className="border-b border-gray-light">
            <th colSpan={chart.length + 1}>Womens Clothing</th>
          </tr>
          <tr className="border-b border-gray-light">
            <th scope="col" />
            {chart.map((item) => (
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
              {chart.map((item) => (
                <td key={item.name} className="text-center">
                  {item[size] || '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <SizeMeasurements
        chart={chart}
        measurements={measurements}
        product={product}
      />
    </div>
  )
}

const SizeMeasurements = ({ chart, measurements, product }) => (
  <table className="table-fixed border border-gray-light">
    <thead className="border border-gray-light">
      <tr className="border-b border-gray-light">
        <th className="text-center" colSpan={chart.length + 1}>
          {product.name} Measurements (cm)
        </th>
      </tr>
      <tr className="border-b border-gray-light">
        <th scope="col" />
        {measurements.map((measurement) => (
          <th key={measurement} className="text-center">
            {toTitleCase(measurement)}
          </th>
        ))}
      </tr>
    </thead>
    <tbody className="p-2">
      {product.sizes.map((size) => (
        <tr key={size.id} className="border-t border-gray-light">
          <th scope="row" className="p-1">
            {size.sizeRange
              ? `${normalizeSize(size.size)}/${normalizeSize(size.sizeRange)}`
              : size.size}
          </th>
          {measurements.map((measurement) => (
            <td key={measurement} className="text-center">
              {size[measurement] || '-'}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
)
