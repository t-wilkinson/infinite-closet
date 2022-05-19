import axios from '@/utils/axios'

export async function getProductWardrobes(productId: ID) {
  return await axios.get(`/my-wardrobe/items/${productId}`, { withCredentials: true })
}

export async function getWardrobe(params, cookie) {
  return await axios.get(`/my-wardrobe/query`, {
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
