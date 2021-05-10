import React from 'react'
import Head from 'next/head'

import { Checkbox } from '@/Form'
import useFields from '@/Form/useFields'
import { useDispatch, useSelector } from '@/utils/store'
import { BlueLink } from '@/components'

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
    statistics: { label: 'Statistics' },
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
    <div className="fixed bottom-0 left-0 right-0 p-4 items-center bg-white z-50 border-t border-gray">
      <div className="max-w-screen-lg w-full flex-wrap items-center justify-between">
        <span className="">
          This site uses cookies to improve your experience. Find our more
          on&nbsp;
          <BlueLink href="/privacy-policy" label="how we use cookies" />.
        </span>
        <div className="h-4" />

        <div className="flex-row justify-center">
          <button
            className="bg-pri text-white p-2 rounded-sm m-1"
            onClick={() => {
              setConsent({ statistics: true })
            }}
          >
            Accept all cookies
          </button>
          <button
            className="border-black border p-1 rounded-sm m-1"
            onClick={() => {
              setConsent({ statistics: false })
            }}
          >
            Accept only necessary cookies
          </button>
        </div>

        {/* <Divider className="my-4" /> */}
        {/* <SelectCookies fields={fields} /> */}
      </div>
    </div>
  )
}

const SelectCookies = ({ fields }) => (
  <div className="flex-row justify-between">
    <div>
      <Checkbox value={true} onChange={() => {}} label="Necessary" />
      <Checkbox {...fields.statistics} />
    </div>
    <div>
      <button
        className="bg-pri text-white p-2 rounded-sm my-1"
        onClick={() => {}}
      >
        Allow all cookies
      </button>
      <button
        className="bg-pri text-white p-2 rounded-sm my-1"
        onClick={() => {}}
      >
        Allow selection
      </button>
      <button
        className="border-black border p-1 rounded-sm my-1"
        onClick={() => {}}
      >
        Allow only necessary
      </button>
    </div>
  </div>
)

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
