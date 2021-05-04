import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Provider } from 'react-redux'
import store from '@/utils/store'
import axios from 'axios'
import '@/styles/index.css'

import useAnalytics from '@/utils/useAnalytics'

import { useSelector } from '@/utils/store'

axios.defaults.baseURL = process.env.NEXT_PUBLIC_STRAPI_API_URL
axios.defaults.headers.post['Content-Type'] = 'application/json'

const App = ({ Component, pageProps }) => {
  const app = useAnalytics()
  app?.setCurrentScreen(window.location.pathname)

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
      content="Rent clothes from independent brands while cutting their carbon footprint, all while being more affordable. By creating an “unlimited” designer closet, we allow women to feel great every day."
    />
    <link rel="preconnect" href="https://fonts.gstatic.com" />
    <link rel="shortcut icon" href="/favicon.png" />
    <link
      href="https://fonts.googleapis.com/css2?family=Barlow:wght@200;300&family=Cinzel&family=Lato:wght@400;700&display=swap"
      rel="stylesheet"
    />
    <script src="https://www.gstatic.com/firebasejs/8.4.1/firebase-app.js" />
    <script src="https://www.gstatic.com/firebasejs/8.4.1/firebase-analytics.js" />
    <script
      dangerouslySetInnerHTML={{
        __html: process.env.NEXT_PUBLIC_FIREBASE_CONFIG,
      }}
    />
  </Head>
)

const Wrapper = ({ children }) => {
  // useSaveScrollPos()
  const headerOpen = useSelector((state) => state.layout.headerOpen)

  return (
    <div
      className={`h-screen
        ${headerOpen ? 'overflow-hidden' : 'overflow-y-scroll'}
      `}
    >
      <div className="min-h-screen">
        <Banner />
        {children}
      </div>
    </div>
  )
}

const Banner = () => (
  <div className="items-center px-2 py-4 width-full bg-sec-light">
    <span className="text-lg font-header">COMING JULY 1, 2021</span>
    <div className="h-2" />
    <span className="text-center font-subheader-light">
      Discover and rent the latest trends from fashions rising
    </span>
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
