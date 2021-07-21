import { useSelector } from '@/utils/store'

export const useProtected = () => {
  const user = useSelector((state) => state.user.data)

  if (user === null) {
    window.location.pathname = '/account/signin'
    return
  }

  return user
}
