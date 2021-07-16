import { useSelector } from '@/utils/store'
import { layoutSelectors } from '@/Layout/slice'

export const useAnalytics = () => {
  const consent = useSelector(layoutSelectors.consent)
  const firebase = useSelector((state) => state.layout.firebase)

  let analytics = {
    logEvent(event: string, props: object) {
      if (consent.statistics) {
        firebase?.logEvent(event, props)
        window?.fbq('trackCustom', event, props)
      }
    },
    setCurrentScreen(path: string) {
      if (consent.statistics) {
        firebase?.setCurrentScreen(path)
        window?.fbq('trackCustom', 'set_current_screen', {
          path,
        })
      }
    },
  }

  return analytics
}
export default useAnalytics
