import React from 'react'

import { useSelector } from '@/utils/store'

export const Home = () => {
  const layout = useSelector((state) => state.accounts)
  return (
    <div>
      HOME
      {JSON.stringify(layout)}
    </div>
  )
}
export default Home
