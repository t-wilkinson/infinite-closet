import React from 'react'

import { useSelector } from '@/utils/store'

export const useProtected = () => {
  const user = useSelector((state) => state.user.data)

  React.useEffect(() => {
    if (user === null) {
      window.location.pathname = '/account/signin'
    }
  }, [user])

  return user
}
