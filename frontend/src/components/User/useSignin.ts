import { useDispatch } from '@/utils/store'

import { signin } from './api'

export const useSignin = () => {
  const dispatch = useDispatch()
  return () => signin(dispatch)
}

export default useSignin
