export const capitalize = (s: string) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export const toTitleCase = (value: string) => {
  let titlecase = value.replace(/([A-Z])/g, ' $1').replace(/^ /, '')
  titlecase = titlecase.charAt(0).toUpperCase() + titlecase.slice(1)
  return titlecase
}

export const browserIs = (browser: string) =>
  RegExp(browser, 'i').test(window.navigator.userAgent)

export const fmtPrice = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
}).format

export const toFullname = (name: {
  firstName?: any
  lastName?: any
  [x: string]: any
}) => (name ? [name.firstName || '', name.lastName || ''].join(' ').trim() : '')


export const queryParamToArray = (param: string | string[]) => {
  if (Array.isArray(param)) {
    return param
  } else if (typeof param === 'string') {
    return [param]
  } else {
    return []
  }
}
