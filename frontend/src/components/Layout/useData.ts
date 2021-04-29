import React from 'react'
import useLoading from '@/utils/useLoading'
import { useDispatch } from '@/utils/store'
import { layoutActions } from '@/Layout/slice'

export const useData = (data: object) => {
  const loading = useLoading()
  const dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(layoutActions.dataReceived(data))
    dispatch(layoutActions.setLoading(loading))
  }, [loading, data])
  return loading
}
export default useData
