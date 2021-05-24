import { useSelector } from '@/utils/store'

export const useAnalytics = () => {
  const enabledStatistics = useSelector(
    (state) => state.layout.cookieConsent.statistics,
  )
  const analytics = useSelector((state) => state.layout.analytics)

  if (enabledStatistics) return analytics
  else return null
}
export default useAnalytics
