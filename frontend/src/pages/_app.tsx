import React from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { Provider } from 'react-redux'
import axios from 'axios'
import firebase from 'firebase/app'
import 'firebase/analytics'
import '@/styles/index.css'

import { layoutSelectors } from '@/Layout/slice'
import useAnalytics from '@/utils/useAnalytics'
import store, { useDispatch, useSelector } from '@/utils/store'
import CookieConsent from '@/Layout/CookieConsent'
import Popup from '@/Account/Popup'
import { accountActions } from '@/Account/slice'
import { layoutActions } from '@/Layout/slice'
import SkipLink from '@/Layout/SkipLink'
import Banner from '@/Layout/Banner'
import { signin } from '@/User'
const FourOFour = dynamic(() => import('@/pages/404'))
import { browser } from '@/utils/helpers'
import { userActions } from '@/User/slice'

axios.defaults.baseURL = process.env.NEXT_PUBLIC_BACKEND
axios.defaults.headers.post['Content-Type'] = 'application/json'

// TODO: fetch avaialable categories and similar for header etc.
const App = ({ router, Component, pageProps }) => {
  React.useEffect(() => {
    const sheet = document.styleSheets[1]

    if (browser('chrome')) {
      sheet.insertRule(
        `div, main {
					min-height: auto;
				}`
      )
    } else if (browser('safari')) {
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

const allowedPages = [
  '/',
  '/404',
  '/about-us',
  '/account/forgot-password',
  '/account/register',
  '/account/reset-password',
  '/account/signin',
  '/blogs',
  '/blogs/[slug]',
  '/contact-us',
  '/designers/[slug]',
  '/faqs',
  '/launch-party',
  '/privacy',
  '/products/[...slug]',
  '/shop/[designer]/[item]',
  '/terms-and-conditions',
  '/user/checkout',
  '/user/orders',
  '/user/profile',
]

const getStorage = (key: string) => JSON.parse(window.localStorage.getItem(key))
const setStorage = (key: string, value: any) =>
  window.localStorage.setItem(key, JSON.stringify(value))

const Wrapper = ({ router, children }) => {
  // useSaveScrollPos()
  const dispatch = useDispatch()
  const headerOpen = useSelector((state) => state.layout.headerOpen)
  const popup = useSelector((state) => state.account.popup)
  const analytics = useAnalytics()
  const consent = useSelector(layoutSelectors.consent)

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
    if (window.fbq) {
      window.fbq('consent', 'revoke')
    }

    if (firebase.apps.length === 0) {
      firebase.initializeApp(
        JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG.toString())
      )
    }

    const showPopup = () => {
      window.setTimeout(() => {
        dispatch(accountActions.showPopup('email'))
        setStorage('popup-form', true)
      }, 5000)
      document.getElementById('_app').removeEventListener('scroll', showPopup)
    }

    dispatch(layoutActions.loadFirebase(firebase.analytics()))
    signin(dispatch)
      .then(() => axios.get(`/orders/cart/count`, { withCredentials: true }))
      .then((res) => dispatch(userActions.countCart(res.data.count)))
      .catch(() => {
        const loggedIn = getStorage('logged-in')

        // TODO: temporary
        const joinedWaitlist = getStorage('joined-waitlist')
        if (joinedWaitlist) {
          setStorage('popup-form', joinedWaitlist)
        }

        const popupForm = getStorage('popup-form')
        if (!loggedIn && !popupForm) {
          document.getElementById('_app').addEventListener('scroll', showPopup)
        }
      })
  }, [])

  React.useEffect(() => {
    if (consent.statistics) {
      window.fbq('consent', 'grant')
    }
  }, [consent.statistics])

  if (
    !allowedPages.includes(router.pathname) &&
    process.env.NODE_ENV === 'production'
  ) {
    children = <FourOFour />
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
        <SkipLink />
        <Popup popup={popup} />
        <Banner />
        {children}
      </div>
    </>
  )
}

const useSaveScrollPos = () => {
  const scrollState = React.useRef({}).current
  const router = useRouter()

  const startLoading = () => {
    if (scrollState) scrollState[router.pathname] = window.scrollY
  }

  const completeLoading = () => {
    if (scrollState[router.pathname])
      window.scrollTo(0, scrollState[router.pathname])
  }

  React.useEffect(() => {
    router.events.on('routeChangeStart', startLoading)
    router.events.on('routeChangeComplete', completeLoading)
    return () => {
      router.events.off('routeChangeStart', startLoading)
      router.events.off('routeChangeComplete', completeLoading)
    }
  }, [])
}
