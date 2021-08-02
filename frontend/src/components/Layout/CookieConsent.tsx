import React from 'react'

// import { Checkbox } from '@/Form'
// import useFields from '@/Form/useFields'
import { useDispatch, useSelector } from '@/utils/store'
import { BlueLink } from '@/components'
import * as storage from '@/utils/storage'

import { layoutActions } from './slice'
import { CookieConsent as Consent } from './types'

export const CookieConsent = () => {
  const dispatch = useDispatch()

  const consent = useSelector((state) => state.layout.cookieConsent)
  const setConsent = (consent: Omit<Consent, 'given'>) => {
    dispatch(layoutActions.giveConsent(consent))
  }

  React.useEffect(() => {
    if (consent.given !== null) {
      storage.set('cookie-consent', consent)
    }
  }, [consent])

  React.useEffect(() => {
    const consent = storage.get('cookie-consent')
    if (consent) {
      dispatch(layoutActions.giveConsent(consent))
    } else {
      dispatch(layoutActions.clearConsent())
    }
  }, [])

  if (consent.given === true || consent.given === null) {
    return null
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 items-center bg-white z-50 border-t border-gray">
      <div className="max-w-screen-lg w-full flex-wrap items-center justify-between">
        <span className="">
          This site uses cookies to improve your experience. Find our more
          on&nbsp;
          <BlueLink href="/privacy" label="how we use cookies" />.
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

// const SelectCookies = ({ fields }) => (
//   <div className="flex-row justify-between">
//     <div>
//       <Checkbox value={true} onChange={() => {}} label="Necessary" />
//       <Checkbox {...fields.statistics} />
//     </div>
//     <div>
//       <button
//         className="bg-pri text-white p-2 rounded-sm my-1"
//         onClick={() => {}}
//       >
//         Allow all cookies
//       </button>
//       <button
//         className="bg-pri text-white p-2 rounded-sm my-1"
//         onClick={() => {}}
//       >
//         Allow selection
//       </button>
//       <button
//         className="border-black border p-1 rounded-sm my-1"
//         onClick={() => {}}
//       >
//         Allow only necessary
//       </button>
//     </div>
//   </div>
// )

export default CookieConsent
