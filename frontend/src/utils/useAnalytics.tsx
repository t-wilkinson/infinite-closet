import { useSelector } from '@/utils/store'

export const useAnalytics = () => {
  const consent = useSelector((state) => state.layout.cookieConsent)
  const analytics = useSelector((state) => state.layout.analytics)

  if (consent.statistics) return analytics
  else return
}
export default useAnalytics
