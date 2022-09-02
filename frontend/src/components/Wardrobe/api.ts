import axios from '@/utils/axios'
import { StrapiWardrobe } from '@/types/models'

export async function searchWardrobes(search: string, tags: string[]) {
  return await axios.get('/my-wardrobe/search', {
    params: { search, tags },
    withCredentials: true,
  })
}

export async function getProductWardrobes(productId: ID) {
  return await axios.get(`/my-wardrobe/items/${productId}`, { withCredentials: true })
}

export async function getWardrobeData(params: object, cookie: string) {
  return await axios.get(`/wardrobes/search`, {
    params,
    headers: {
      Cookie: cookie,
    },
    withCredentials: true,
  })
}

export async function addWardrobe(name: string) {
  return await axios.post(
    `/my-wardrobe`,
    { name },
    {
      withCredentials: true,
    }
  )
}

export async function removeWardrobe(slug: Slug) {
  return await axios.delete(`/my-wardrobe/${slug}`, {
    withCredentials: true,
  })
}

export async function createWardrobeItem(wardrobeId: ID, productId: ID) {
  return await axios.post(`/my-wardrobe/items`, {
    wardrobeId, productId
  }, {
    withCredentials: true,
  })
}

export async function removeWardrobeItem(wardrobeItemId: ID) {
  return await axios.delete(`/my-wardrobe/items/${wardrobeItemId}`, {
    withCredentials: true,
  })
}

export async function updateWardrobe(wardrobeId: ID, props: Partial<StrapiWardrobe>) {
  return await axios.post(`/wardrobes/${wardrobeId}`, props, {
    withCredentials: true,
  })
}
