import React from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { Provider } from 'react-redux'
import axios from 'axios'
import firebase from 'firebase/app'
import 'firebase/analytics'
import '@/styles/index.css'

import useAnalytics from '@/utils/useAnalytics'
import store, { useDispatch, useSelector } from '@/utils/store'
import CookieConsent from '@/Layout/CookieConsent'
import Popup from '@/Account/Popup'
import { accountActions } from '@/Account/slice'
import { layoutActions } from '@/Layout/slice'
import { userActions } from '@/User/slice'
const FourOFour = dynamic(() => import('@/pages/404'))

axios.defaults.baseURL = process.env.NEXT_PUBLIC_STRAPI_API_URL
axios.defaults.headers.post['Content-Type'] = 'application/json'

// TODO: fetch avaialable categories and similar for header etc.
const App = ({ router, Component, pageProps }) => {
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
  '/404',
  '/about-us',
  '/account/forgot-password',
  '/account/register',
  '/account/reset-password',
  '/account/signin',
  '/contact-us',
  '/faqs',
  '/',
  '/privacy',
  '/products/[...slug]',
  '/shop/[designer]/[item]',
  '/terms-and-conditions',
  '/user/profile',
]

const Wrapper = ({ router, children }) => {
  // useSaveScrollPos()
  const dispatch = useDispatch()
  const headerOpen = useSelector((state) => state.layout.headerOpen)
  const popup = useSelector((state) => state.account.popup)
  const app = useAnalytics()

  React.useEffect(() => {
    app?.setCurrentScreen(router.asPath)
  }, [router.pathname])

  React.useEffect(() => {
    if (firebase.apps.length === 0) {
      firebase.initializeApp(
        JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG.toString()),
      )
    }

    dispatch(layoutActions.loadAnalytics(firebase.analytics()))
    axios
      .post('/account/signin', {}, { withCredentials: true })
      .then((res) => {
        if (false && res.data.user) {
          // loggedIn tracks if the user has logged into the web site
          // window.localStorage.setItem('loggedIn', 'true')
          // dispatch(userActions.signin(res.data.user))
        } else {
          const loggedIn = JSON.parse(window.localStorage.getItem('loggedIn'))
          const joinedWaitlist = JSON.parse(
            window.localStorage.getItem('joinedWaitlist'),
          )
          if (!loggedIn && !joinedWaitlist) {
            window.setTimeout(
              () => dispatch(accountActions.showPopup('email')),
              3000,
            )
          }
        }
      })
      .catch(() => {})
  }, [])

  if (!allowedPages.includes(router.pathname)) {
    children = <FourOFour />
  }

  return (
    <>
      <CookieConsent />
      <div
        id="_app"
        className={`h-screen
        ${headerOpen ? 'overflow-hidden' : 'overflow-y-scroll'}
      `}
      >
        <Popup popup={popup} />
        <div className="min-h-screen">
          <Banner />
          {children}
        </div>
      </div>
    </>
  )
}

const Banner = () => (
  <div className="items-center px-2 py-1 width-full bg-sec text-white">
    <span className="text-norm">COMING JULY 1</span>
  </div>
)

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
