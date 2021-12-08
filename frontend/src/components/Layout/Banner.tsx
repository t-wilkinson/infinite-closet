import React from 'react'

import axios from '@/utils/axios'
import { useDispatch } from '@/utils/store'
import { accountActions } from '@/Account/slice'
import * as storage from '@/utils/storage'

export const Banner = () => {
  const dispatch = useDispatch()
  const [loaded, setLoaded] = React.useState(false)
  const [content, setContent] = React.useState()

  React.useEffect(() => {
    axios
    .get('/documents?slug=main-banner', {withCredentials: false})
      .then((data) => data?.[0])
      .then((data) => {
        setLoaded(true)
        setTimeout(() => setContent(data.content), 500)
      })
      .catch((e) => console.error(e))
  }, [])

  if (!loaded) {
    return null
  }

  return (
    <div
      className={`items-center px-2 py-1 bg-sec text-white flex-row w-full justify-center transform transition-all duration-500
        ${loaded && content ? 'translate-y-0' : '-translate-y-100'}
      `}
    >
      <button
        onClick={() => {
          dispatch(accountActions.showPopup('email'))
          storage.session.set('popup-form', true)
        }}
      >
        {content}
      </button>
    </div>
  )
}

export default Banner
