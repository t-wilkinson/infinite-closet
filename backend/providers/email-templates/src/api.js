export function getFrontendURL(url) {
  if (url == null) {
    return null
  }

  if (url.startsWith('http') || url.startsWith('//')) {
    return url
  }

  return `https://${process.env.FRONTEND_DOMAIN}${url}`
}

export function getBackendURL(url) {
  if (url == null) {
    return null
  }

  if (url.startsWith('http') || url.startsWith('//')) {
    return url
  }

  return `https://${process.env.BACKEND_DOMAIN}${url}`
}
