import axios from '@/utils/axios'
import { StrapiWardrobe } from '@/types/models'

export async function getWardrobeItems(productId: ID) {
  return await axios.get(`/wardrobes/items/${productId}`, {
    withCredentials: true,
  })
}

export async function createWardrobeItem(wardrobeId: ID, productId: ID) {
  return await axios.post(
    `/wardrobes/items`,
    {
      wardrobeId,
      productId,
    },
    {
      withCredentials: true,
    }
  )
}

export async function removeWardrobeItem(wardrobeItemId: ID) {
  return await axios.delete(`/wardrobes/items/${wardrobeItemId}`, {
    withCredentials: true,
  })
}

export async function getUserWardrobes(userId: ID) {
  return await axios.get(`/wardrobes/user/${userId}`, {
    withCredentials: true,
  })
}

export async function searchWardrobes(search: string, tags: string[]) {
  return await axios.get('/wardrobes/search', {
    params: { search, tags },
    withCredentials: true,
  })
}

export async function searchUserWardrobes(search: string, tags: string[]) {
  return await axios.get('/wardrobes/search/user', {
    params: { search, tags },
    withCredentials: true,
  })
}

export async function filterWardrobes(params: object, cookie: string) {
  return await axios.get(`/wardrobes/filter`, {
    params,
    headers: {
      Cookie: cookie,
    },
    withCredentials: true,
  })
}

export async function addWardrobe(name: string) {
  return await axios.post(
    `/wardrobes`,
    { name },
    {
      withCredentials: true,
    }
  )
}

export async function removeWardrobe(slug: Slug) {
  return await axios.delete(`/wardrobes/${slug}`, {
    withCredentials: true,
  })
}

export async function updateWardrobe(
  wardrobeId: ID,
  props: Partial<StrapiWardrobe>
) {
  return await axios.post(`/wardrobes/${wardrobeId}`, props, {
    withCredentials: true,
  })
}
