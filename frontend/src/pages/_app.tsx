import React from 'react'
import dynamic from 'next/dynamic'
import { Provider } from 'react-redux'
import axios from 'axios'
import firebase from 'firebase/app'
import 'firebase/analytics'
import '@/styles/index.css'

import { accountActions } from '@/Account/slice'
import { CartUtils } from '@/Cart/slice'
import Banner from '@/Layout/Banner'
import SkipLink from '@/Layout/SkipLink'
import { layoutActions, layoutSelectors } from '@/Layout/slice'
import { useSignin } from '@/User'
import { browserIs } from '@/utils/helpers'
import { StrapiOrder } from '@/utils/models'
import * as storage from '@/utils/storage'
import store, { useDispatch, useSelector } from '@/utils/store'
import useAnalytics from '@/utils/useAnalytics'

const Popup = dynamic(() => import('@/Account/Popup'))
const FourOFour = dynamic(() => import('@/pages/404'))
const CookieConsent = dynamic(() => import('@/Layout/CookieConsent'))

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
  '/user/order-history',
  '/user/profile',
  '/account/checkout/register',
  '/account/checkout/signin',
  // '/review/[slug]',
  // '/review/thankyou',
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

  const handleRouteChange = (url) => {
    window.gtag('config', '[Tracking ID]', {
      page_path: url,
    });
  };

  React.useEffect(() => {
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

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
        cart.forEach((order: StrapiOrder) => {
          const valid = [
            'status',
            'size',
            'product',
            'startDate',
            'rentalLength',
          ].every((x) => order[x])
          const getId = (key: string) =>
            order[key].id ? order[key].id : order[key]
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
      // TODO:
      let cart = storage.get('cart') || []
      if (!Array.isArray(cart)) {
        storage.set('cart', [])
        cart = []
      }
      storage.set('cart', [])
      dispatch(CartUtils.insert(cart))
    } else {
      let cart = storage.get('cart') || []
      Promise.allSettled(
        cart.map(async (order: StrapiOrder, i: number) => {
          if (!order.id) {
            delete cart[i]
          } else {
            await axios
              .get(`/orders/${order.id}`, { withCredentials: true })
              .catch((err) => {
                if (err.response.status === 404) {
                  delete cart[i]
                }
              })
          }
        })
      ).then(() => {
        storage.set(
          'cart',
          cart.filter((v: StrapiOrder) => v)
        )
        dispatch(CartUtils.get())
        dispatch(CartUtils.view())
      })
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

  React.useEffect(() => {
    if (router && router.pathname === '/launch-party') {
      router.push('/')
    }
  }, [])

  if (
    !allowedPages.includes(router.pathname) &&
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
