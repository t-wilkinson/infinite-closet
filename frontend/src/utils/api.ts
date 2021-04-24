import axios from 'axios'

export function getURL(url: string) {
  if (url == null) {
    return null
  }

  // Return the full URL if the media is hosted on an external provider
  if (url.startsWith('http') || url.startsWith('//')) {
    return url
  }

  // Otherwise prepend the URL path with the Strapi URL
  return `${process.env.STRAPI_API_URL || 'http://localhost:1337'}${url}`
}

// Helper to make GET requests to Strapi
export async function fetchAPI(path: string) {
  const { data } = await axios({
    url: getURL(path),
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return data
}
