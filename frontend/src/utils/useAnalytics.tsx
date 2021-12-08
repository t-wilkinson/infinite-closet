import { useSelector } from '@/utils/store'
import { layoutSelectors } from '@/Layout/slice'

export interface Analytics {
  grant(): void
  revoke(): void
  logEvent(event: string, props: object): void
  setCurrentScreen(path: string): void
  viewContent(): void
}

// TODO: Runs many times on load
export const useAnalytics = (): Analytics => {
  const consent = useSelector(layoutSelectors.consent)
  const firebase = useSelector((state) => state.layout.firebase)
  const enabled = consent.statistics && process.env.NODE_ENV === 'production'

  let analytics = enabled
    ? {
        grant() {
          window?.fbq('consent', 'grant')
        },
        revoke() {
          window?.fbq('consent', 'revoke')
        },
        logEvent(event: string, props: object) {
          firebase?.logEvent(event, props)
          window?.fbq('trackCustom', event, props)
        },
        setCurrentScreen(path: string) {
          firebase?.setCurrentScreen(path)
          // window?.fbq('trackCustom', 'set_current_screen', {
          //   path,
          // })
        },
        viewContent() {
          window?.fbq('track', 'ViewContent')
        },
      }
    : {
        grant() {},
        revoke() {},
        logEvent() {},
        setCurrentScreen() {},
        viewContent() {},
      }

  return analytics
}
export default useAnalytics
