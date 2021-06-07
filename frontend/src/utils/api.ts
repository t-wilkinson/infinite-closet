import axios from 'axios'

export function getURL(url: string) {
  if (url == null) {
    return null
  }

  if (url.startsWith('http') || url.startsWith('//')) {
    return url
  }

  return `${process.env.NEXT_PUBLIC_BACKEND}${url}`
}

// Helper to make GET requests to Strapi
export async function fetchAPI(path: string) {
  const { data } = await axios.get(path, {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return data
}
