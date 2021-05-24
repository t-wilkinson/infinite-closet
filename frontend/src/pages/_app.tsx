import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Provider } from 'react-redux'
import store from '@/utils/store'
import axios from 'axios'
import '@/styles/index.css'

import useAnalytics from '@/utils/useAnalytics'
import CookieConsent from '@/Layout/CookieConsent'
import { useDispatch, useSelector } from '@/utils/store'
import { accountActions } from '@/Account/slice'
import Popup from '@/Account/Popup'

axios.defaults.baseURL = process.env.NEXT_PUBLIC_STRAPI_API_URL
axios.defaults.headers.post['Content-Type'] = 'application/json'

const App = ({ Component, pageProps, router }) => {
  return (
    <>
      <Headers />
      <Provider store={store}>
        <Wrapper>
          <Component {...pageProps} />
        </Wrapper>
      </Provider>
    </>
  )
}
export default App

const Headers = () => (
  <Head>
    <meta
      name="description"
      content="Rent clothes from independent brands while cutting your carbon footprint, all while being more affordable. By creating an “unlimited” designer closet, we allow women to feel great every day."
    />
    <link rel="preconnect" href="https://fonts.gstatic.com" />
    <link rel="shortcut icon" href="/favicon.png" />
    <link
      href="https://fonts.googleapis.com/css2?family=Barlow:wght@200;300&family=Cinzel&family=Lato:wght@400;700&display=swap"
      rel="stylesheet"
    />
  </Head>
)

const Wrapper = ({ children }) => {
  useSaveScrollPos()
  const dispatch = useDispatch()
  const headerOpen = useSelector((state) => state.layout.headerOpen)
  const popup = useSelector((state) => state.account.popup)
  const app = useAnalytics()
  app?.setCurrentScreen(window.location.pathname)

  React.useEffect(() => {
    axios
      .post('/account/login', {}, { withCredentials: true })
      .then((res) => {
        if (res.data.user) {
          // loggedIn tracks if the user has logged into the web site
          window.localStorage.setItem('loggedIn', 'true')
          dispatch(accountActions.login(res.data.user))
        } else {
          const loggedIn = JSON.parse(window.localStorage.getItem('loggedIn'))
          if (!loggedIn) {
            dispatch(accountActions.showPopup('register'))
          }
        }
      })
      .catch((err) => console.error(err))
  }, [])

  return (
    <div
      className={`h-screen
        ${headerOpen ? 'overflow-hidden' : 'overflow-y-scroll'}
      `}
    >
      <CookieConsent />
      <Popup popup={popup} />
      <div className="min-h-screen">
        <Banner />
        {children}
      </div>
    </div>
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
