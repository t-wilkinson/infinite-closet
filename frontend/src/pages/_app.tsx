import React from 'react'
import dynamic from 'next/dynamic'
import { Provider } from 'react-redux'
import firebase from 'firebase/app'
import { ToastContainer } from 'react-toastify'
import 'firebase/analytics'
import 'react-toastify/dist/ReactToastify.css'
import '@/styles/index.css'

import { rootActions } from '@/slice'
import { OrderUtils } from '@/Order'
import Banner from '@/Layout/Banner'
import SkipLink from '@/Layout/SkipLink'
import { layoutActions, layoutSelectors } from '@/Layout/slice'
import useSignin from '@/User/useSignin'
import { browserIs } from '@/utils/helpers'
import * as storage from '@/utils/storage'
import store, { useDispatch, useSelector } from '@/utils/store'
import useAnalytics from '@/utils/useAnalytics'

const Popup = dynamic(() => import('@/Components/Popup'))
const FourOFour = dynamic(() => import('@/pages/404'))
const CookieConsent = dynamic(() => import('@/Layout/CookieConsent'))

const App = ({ router, Component, pageProps }) => {
  React.useEffect(() => {
    const sheet = document.styleSheets[1]

    if (browserIs('chrome')) {
      sheet.insertRule(
        `div, main {
					min-height: auto;
				}`
      )
    } else if (browserIs('safari')) {
      sheet.insertRule(
        `div, main {
					min-height: min-content;
				}`
      )
    }
  }, [])

  return (
    <>
      <Provider store={store}>
        <Wrapper router={router}>
          <Component {...pageProps} />
        </Wrapper>
      </Provider>
    </>
  )
}
export default App

const blockedPages = [
  // 'my-wardrobe'
]

const Wrapper = ({ router, children }) => {
  // useSaveScrollPos()
  const dispatch = useDispatch()
  const headerOpen = useSelector((state) => state.layout.headerOpen)
  const popup = useSelector((state) => state.root.popup)
  const analytics = useAnalytics()
  const consent = useSelector(layoutSelectors.consent)
  const user = useSelector((state) => state.user.data)
  const signin = useSignin()

  const showPopup = () => {
    window.setTimeout(() => {
      dispatch(rootActions.showPopup('email'))
      storage.session.set('popup-form', true)
    }, 5000)
    document.getElementById('_app').removeEventListener('scroll', showPopup)
  }

  const handleRouteChange = (url: string) => {
    window?.gtag('config', '[Tracking ID]', {
      page_path: url,
    })
  }

  React.useEffect(() => {
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  React.useEffect(() => {
    analytics.setCurrentScreen(router.asPath)
    if (!document.title) {
      document.title = 'Infinite Closet'
    }
  }, [consent.statistics, router.pathname])

  React.useEffect(() => {
    document
      .getElementById('_app')
      .scrollTo({ left: 0, top: 0, behavior: 'smooth' })
  }, [router.pathname])

  React.useEffect(() => {
    if (user) {
      document.getElementById('_app').removeEventListener('scroll', showPopup)
    }
  }, [user])

  React.useEffect(() => {
    dispatch(OrderUtils.count())
  }, [user])

  React.useEffect(() => {
    let cart = storage.get('cart')
    if (!Array.isArray(cart)) {
      storage.set('cart', [])
      cart = []
    }

    // Attach guest cart to current user cart
    if (user) {
      dispatch(OrderUtils.insert(cart)).then(() => storage.set('cart', []))
    }
  }, [user])

  React.useEffect(() => {
    if (window.fbq) {
      analytics.revoke()
    }

    if (firebase.apps.length === 0) {
      const firebaseConfig = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG.toString())
      firebase.initializeApp(firebaseConfig)
      if (process.env.NODE_ENV === 'development') {
        window.gtag?.('config', firebaseConfig.measurementId, { 'debug_mode':true });
      }
    }

    dispatch(layoutActions.loadFirebase(firebase.analytics()))
    signin().catch(() => {
      const loggedIn = storage.get('logged-in')

      const joinedWaitlist = storage.get('joined-waitlist')
      if (joinedWaitlist) {
        storage.session.set('popup-form', joinedWaitlist)
      }

      const popupForm = storage.session.get('popup-form')
      if (!loggedIn && !popupForm) {
        document.getElementById('_app').addEventListener('scroll', showPopup)
      }
    })
  }, [])

  React.useEffect(() => {
    if (consent.statistics) {
      analytics.grant()
    }
  }, [consent.statistics])

  React.useEffect(() => {
    if (router?.pathname === '/launch-party') {
      router.push('/')
    }
  }, [])

  if (
    blockedPages.includes(router?.pathname) &&
    process.env.NODE_ENV === 'production'
  ) {
    children = <FourOFour />
    router.push('/404')
  }

  return (
    <>
      <CookieConsent />
      <div
        id="_app"
        className={`h-screen
        ${headerOpen ? 'overflow-hidden' : 'overflow-y-auto'}
      `}
      >
        <ToastContainer />
        <SkipLink />
        <Popup popup={popup} />
        <Banner />
        {children}
      </div>
    </>
  )
}

// const useSaveScrollPos = () => {
//   const scrollState = React.useRef({}).current
//   const router = useRouter()

//   const startLoading = () => {
//     if (scrollState) scrollState[router.pathname] = window.scrollY
//   }

//   const completeLoading = () => {
//     if (scrollState[router.pathname])
//       window.scrollTo(0, scrollState[router.pathname])
//   }

//   React.useEffect(() => {
//     router.events.on('routeChangeStart', startLoading)
//     router.events.on('routeChangeComplete', completeLoading)
//     return () => {
//       router.events.off('routeChangeStart', startLoading)
//       router.events.off('routeChangeComplete', completeLoading)
//     }
//   }, [])
// }
