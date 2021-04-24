import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Provider } from 'react-redux'

import '@/styles/index.css'
import Header from '@/Header'
import Footer from '@/Footer'
import PreReleaseHeader from '@/Header/PreRelease'
import PreReleaseFooter from '@/Footer/PreRelease'
import store from '@/utils/store'
import { Divider } from '@/components'

const App = ({ Component, pageProps }) => {
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

  return (
    <div className="min-h-screen">
      <PreReleaseHeaders />
      <Banner />
      <Provider store={store}>
        {['/landing-page', '/coming-soon'].includes(router.pathname) ? (
          <PreReleaseHeader />
        ) : (
          <Header />
        )}

        <Component {...pageProps} />
        <Divider />
        {['/landing-page', '/coming-soon'].includes(router.pathname) ? (
          <PreReleaseFooter />
        ) : (
          <Footer />
        )}
      </Provider>
    </div>
  )
}

const PreReleaseHeaders = () => (
  <Head>
    <link rel="preconnect" href="https://fonts.gstatic.com" />
    <link
      href="https://fonts.googleapis.com/css2?family=Barlow:wght@200;300&family=Cinzel&family=Lato:wght@400;700&display=swap"
      rel="stylesheet"
    />

    <script src="https://www.gstatic.com/firebasejs/8.4.1/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/8.4.1/firebase-analytics.js"></script>
    <script
      dangerouslySetInnerHTML={{
        __html: `
        var firebaseConfig = {
        apiKey: "AIzaSyC3eakvWXGZVM2vKN69pXViyPsHyQghCys",
        authDomain: "infinite-closet-1614373277543.firebaseapp.com",
        projectId: "infinite-closet-1614373277543",
        storageBucket: "infinite-closet-1614373277543.appspot.com",
        messagingSenderId: "703454257680",
        appId: "1:703454257680:web:ffd5aeb011088bfe6b6095",
        measurementId: "G-K4XJMWSGN9"
        };
        firebase.initializeApp(firebaseConfig);
        firebase.analytics();
        `,
      }}
    />
  </Head>
)

const Banner = () => (
  <div className="items-center px-2 py-4 width-full bg-sec">
    <span className="text-lg font-header">COMING JULY 1, 2021</span>
    <div className="h-2" />
    <span className="text-center font-subheader-light">
      Discover and rent the latest trends from fashions rising
    </span>
  </div>
)

export default App
