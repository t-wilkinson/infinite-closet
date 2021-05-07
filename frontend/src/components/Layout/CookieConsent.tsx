import React from 'react'
import Head from 'next/head'

import { Checkbox } from '@/Form'
import useFields from '@/Form/useFields'
import { useDispatch, useSelector } from '@/utils/store'

import { layoutActions } from './slice'
import { CookieConsent as Consent } from './types'

export const CookieConsent = () => {
  const dispatch = useDispatch()
  const [givenConsent, setGivenConsent] = React.useState<boolean>(false)

  const consent = useSelector((state) => state.layout.cookieConsent)
  const setConsent = (consent: Consent) => {
    localStorage.setItem('cookieConsent', JSON.stringify(consent))
    dispatch(layoutActions.giveConsent(consent))
    setGivenConsent(true)
  }

  const fields = useFields({
    statistics: {
      label: 'Statistics',
    },
  })

  React.useEffect(() => {
    const consent = JSON.parse(localStorage.getItem('cookieConsent'))
    if (consent) {
      dispatch(layoutActions.giveConsent(consent))
      setGivenConsent(true)
    }
  }, [])

  if (givenConsent) {
    return <>{consent.statistics && <Statistics />}</>
  }

  return (
    <div className="fixed bottom-0 left-0 right-0">
      <Checkbox {...fields.statistics} />
    </div>
  )
}

const Statistics = () => {
  const dispatch = useDispatch()

  return (
    <Head>
      <script
        async={false}
        src="https://www.gstatic.com/firebasejs/8.4.1/firebase-app.js"
      />
      <script
        async={false}
        src="https://www.gstatic.com/firebasejs/8.4.1/firebase-analytics.js"
        onLoad={() => {
          // TODO: this is not run... not sure why
          window.firebase.initializeApp(process.env.NEXT_PUBLIC_FIREBASE_CONFIG)
          dispatch(layoutActions.loadAnalytics(window.firebase.analytics()))
        }}
      />
    </Head>
  )
}
export default CookieConsent
