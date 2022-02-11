import React from 'react'

import Layout from '@/Layout'
import User from '@/User'
import { OrderUtils } from '@/Order'
import { useDispatch, useSelector } from '@/utils/store'
import { StrapiOrder } from '@/types/models'
import { Favorite } from '@/Order/Favorite'

export const Page = () => {
  const favorites = useSelector((state) => state.orders.favorites)
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.data)

  React.useEffect(() => {
    dispatch(OrderUtils.favorites())
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
