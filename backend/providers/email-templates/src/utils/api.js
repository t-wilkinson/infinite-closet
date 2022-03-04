// const env = obj => obj[process.env.NODE_ENV]

const frontendOrigin = 'https://infinitecloset.co.uk'
const backendOrigin = 'https://api.infinitecloset.co.uk'

export function getFrontendURL(url) {
  if (url == null) {
    return null
  }

  if (url.startsWith('http') || url.startsWith('//')) {
    return url
  }

  return `${frontendOrigin}${url}`
}

export function getBackendURL(url) {
  if (url == null) {
    return null
  }

  if (url.startsWith('http') || url.startsWith('//')) {
    return url
  }

  return `${backendOrigin}${url}`
}

export function normalizeSize(size) {
  return size ? size.size.replace('_', '') : size
}
