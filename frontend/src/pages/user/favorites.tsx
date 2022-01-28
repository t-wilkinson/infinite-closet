import React from 'react'

import Layout from '@/Layout'
import User from '@/User'
import { CartUtils } from '@/Cart/slice'
import { useDispatch, useSelector } from '@/utils/store'
import { StrapiOrder } from '@/types/models'
import { Favorite } from '@/User/Favorites'

export const Page = () => {
  const favorites = useSelector((state) => state.cart.favorites)
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.data)

  React.useEffect(() => {
    dispatch(CartUtils.favorites())
  }, [user])

  return (
    <Layout>
      <User allowGuest>
        <Favorites favorites={favorites} />
      </User>
    </Layout>
  )
}

const Favorites = ({ favorites }) => {
  return (
    <div className="items-center flex-row flex-wrap">
      {favorites.map((order: StrapiOrder) => (
        <div key={order.id} className="w-1/2 md:w-1/3 pb-12">
          <Favorite order={order} />
        </div>
      ))}
    </div>
  )
}

export default Page
