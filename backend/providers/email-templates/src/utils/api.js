// const env = obj => obj[process.env.NODE_ENV]

const frontendOrigin = process.env.REACT_APP_FRONTEND_ORIGIN || 'http://ic.com'
const backendOrigin = process.env.REACT_APP_BACKEND_ORIGIN || 'http://api.ic.com'

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
