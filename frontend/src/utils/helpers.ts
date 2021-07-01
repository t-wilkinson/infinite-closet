export const capitalize = (s: string) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export const toTitleCase = (value: string) => {
  let titlecase = value.replace(/([A-Z])/g, ' $1')
  titlecase = titlecase.charAt(0).toUpperCase() + titlecase.slice(1)
  return titlecase
}

export const browser = (browser: string) =>
  RegExp(browser, 'i').test(window.navigator.userAgent)
