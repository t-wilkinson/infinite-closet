import React from 'react'
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
import { useSignin } from '@/User'
const FourOFour = dynamic(() => import('@/pages/404'))
import { browserIs } from '@/utils/helpers'
import * as storage from '@/utils/storage'
import { CartUtils } from '@/Cart/slice'

axios.defaults.baseURL = process.env.NEXT_PUBLIC_BACKEND
axios.defaults.headers.post['Content-Type'] = 'application/json'

// TODO: fetch avaialable categories and similar for header etc.
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
  '/designers',
  '/designers/[slug]',
  '/faqs',
  '/launch-party',
  '/privacy',
  '/products/[...slug]',
  '/size-charts',
  '/shop/[designer]/[item]',
  '/terms-and-conditions',
  '/user/checkout',
  '/user/orders',
  '/user/profile',
  '/account/checkout/register',
  '/account/checkout/signin',
]

const Wrapper = ({ router, children }) => {
  // useSaveScrollPos()
  const dispatch = useDispatch()
  const headerOpen = useSelector((state) => state.layout.headerOpen)
  const popup = useSelector((state) => state.account.popup)
  const analytics = useAnalytics()
  const consent = useSelector(layoutSelectors.consent)
  const user = useSelector((state) => state.user.data)
  const signin = useSignin()

  const showPopup = () => {
    window.setTimeout(() => {
      dispatch(accountActions.showPopup('email'))
      storage.session.set('popup-form', true)
    }, 5000)
    document.getElementById('_app').removeEventListener('scroll', showPopup)
  }

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
    dispatch(CartUtils.count())
  }, [user])

  React.useEffect(() => {
    // for every order in local storage attached to user -> move cart to backend
    // guest -> do nothing

    if (!storage.get('reset-cart')) {
      storage.set('reset-cart', true)
      let cart = storage.get('cart')
      if (
        ['[object Array]', '[object Object]'].includes(
          Object.prototype.toString.call(cart)
        )
      ) {
        storage.set('cart', [])
        cart = Object.values(cart)
        cart.forEach((order) => {
          const valid = [
            'status',
            'size',
            'product',
            'startDate',
            'rentalLength',
          ].every((x) => order[x])
          const getId = (key) => (order[key].id ? order[key].id : order[key])
          if (valid) {
            const product = getId('product')
            dispatch(
              CartUtils.add({
                ...order,
                product,
              })
            )
          }
        })
      } else {
        storage.set('cart', [])
      }
    }

    // Attach guest cart to current user cart
    if (user) {
      let cart = storage.get('cart') || []
      if (!Array.isArray(cart)) {
        storage.set('cart', [])
        cart = []
      }

      storage.set('cart', [])
      dispatch(CartUtils.insert(cart))
    }
  }, [user])

  React.useEffect(() => {
    if (window.fbq) {
      analytics.revoke()
    }

    if (firebase.apps.length === 0) {
      firebase.initializeApp(
        JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG.toString())
      )
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

  if (router.pathname === '/launch-party') {
    router.push('/')
  }

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
