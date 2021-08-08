import React from 'react'
import useLoading from '@/utils/useLoading'
import { useDispatch } from '@/utils/store'

import { layoutActions, State } from './slice'

type Data = State['data']

// Update if
export const useData = (data: Data[keyof Data]) => {
  const loading = useLoading()
  const dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(layoutActions.dataReceived(data))
    dispatch(layoutActions.setLoading(loading))
  }, [loading, data])

  return loading
}

export default useData
