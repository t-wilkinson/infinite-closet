import { useSelector } from '@/utils/store'
import { layoutSelectors } from '@/Layout/slice'

export const useAnalytics = () => {
  const consent = useSelector(layoutSelectors.consent)
  const firebase = useSelector((state) => state.layout.firebase)
  const enabled = consent.statistics && process.env.NODE_ENV === 'production'

  let analytics = {
    grant() {
      if (enabled) {
        window?.fbq('consent', 'grant')
      }
    },
    revoke() {
      if (enabled) {
        window?.fbq('consent', 'revoke')
      }
    },
    logEvent(event: string, props: object) {
      if (enabled) {
        firebase?.logEvent(event, props)
        window?.fbq('trackCustom', event, props)
      }
    },
    setCurrentScreen(path: string) {
      if (enabled) {
        firebase?.setCurrentScreen(path)
        // window?.fbq('trackCustom', 'set_current_screen', {
        //   path,
        // })
      }
    },
    viewContent() {
      if (enabled) {
        window?.fbq('track', 'ViewContent')
      }
    },
  }

  return analytics
}
export default useAnalytics
