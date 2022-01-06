export * from './api'
export * from './date'

export const fmtPrice = (price=0, simple=false) => {
  const fmt = price % 1 === 0 && simple ? price.toString() : price.toFixed(2)
  return price >= 0 ? `£${fmt}` : `-£${fmt}`
}

