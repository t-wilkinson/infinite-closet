import Axios from 'axios'

export const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

axios.interceptors.response.use(
  (response): any => {
    return response.data
  },
  (error) => {
    // const message = error.response?.data?.message || error.message;
    // useNotificationStore.getState().addNotification({
    //   type: 'error',
    //   title: 'Error',
    //   message,
    // });

    let data = error.response?.data
    try {
      data.messages = data.message
        ?.map(({ messages }) => messages)
        .flat()
        .filter((v: any) => v)
        .map(({ message }) => message)
    } catch (e) {
      console.error('axios', e)
    }
    return Promise.reject(data)
  }
)

export function getURL(url: string) {
  if (url == null) {
    return null
  }

  if (url.startsWith('http') || url.startsWith('//')) {
    return url
  }

  return `${process.env.NEXT_PUBLIC_BACKEND}${url}`
}

export default axios
