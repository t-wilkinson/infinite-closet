import React from 'react'
import { useRouter } from 'next/router'

export const useLoading = () => {
  const router = useRouter()

  const [loading, setLoading] = React.useState(false)
  const startLoading = () => setLoading(true)
  const stopLoading = () => setLoading(false)

  React.useEffect(() => {
    router.events.on('routeChangeStart', startLoading)
    router.events.on('routeChangeComplete', stopLoading)
    return () => {
      router.events.off('routeChangeStart', startLoading)
      router.events.off('routeChangeComplete', stopLoading)
    }
  }, [])

  return loading
}

export default useLoading
