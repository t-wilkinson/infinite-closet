import axios from '@/utils/axios'

export async function getRecognitionFilters () {
    return await axios.get('/recognition/filters', {withCredentials: false})
}

export async function createWardrobeItem(data) {
    return axios.post<{ }>(`/recognition`, data)
}

