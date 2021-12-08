import {useRouter} from 'next/router'
import { useSelector } from '@/utils/store'

export const useProtected = () => {
  const user = useSelector((state) => state.user.data)
  const router = useRouter()

  if (user === null) {
    router.push('/account/signin')
    return
  }

  return user
}
