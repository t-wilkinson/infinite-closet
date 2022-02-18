import React from 'react'
import dynamic from 'next/dynamic'

import axios from '@/utils/axios'
import { useAnalytics } from '@/utils/useAnalytics'
import { useDispatch } from '@/utils/store'
import { StrapiDocument } from '@/types/models'
import { rootActions } from '@/slice'
import * as storage from '@/utils/storage'
const Markdown = dynamic(() => import('@/Components/Markdown'))

export const Banner = () => {
  const dispatch = useDispatch()
  const [loaded, setLoaded] = React.useState(false)
  const [data, setData] = React.useState<StrapiDocument>()
  const analytics = useAnalytics()

  React.useEffect(() => {
    axios
    .get('/documents?slug=main-banner', {withCredentials: false})
      .then((data) => data?.[0])
      .then((data) => {
        setLoaded(true)
        setTimeout(() => setData(data), 500)
      })
      .catch((e) => console.error(e))
  }, [])

  if (!loaded || !data?.content) {
    return null
  }

  return (
    <div
      className={`items-center px-2 py-1 bg-sec text-white flex-row w-full justify-center transform transition-all duration-500
        ${loaded && data.content ? 'translate-y-0' : '-translate-y-100'}
      `}
    >
      <button
        onClick={() => {
          dispatch(rootActions.showPopup('email'))
          storage.session.set('popup-form', true)
          analytics.logEvent('select_promotion', {
            promotion_id: data.slug,
            creative_name: data.slug,
            creative_slot: 'Popup banner',
            promotion_name: data.name,
          })
        }}
      >
        <Markdown content={data.content} />
      </button>
    </div>
  )
}

export default Banner
