import React from 'react'

import { useSelector } from '@/utils/store'

export const Home = () => {
  const layout = useSelector((state) => state.account)
  return (
    <div className="h-full items-center">
      HOME
      {JSON.stringify(layout)}
    </div>
  )
}
export default Home
