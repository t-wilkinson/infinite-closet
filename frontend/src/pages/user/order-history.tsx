import OrderHistory from '@/Cart/OrderHistory'
import User from '@/User'
import Layout from '@/Layout'

export const Page = () => {
  return (
    <Layout>
      <User>
        <OrderHistory />
      </User>
    </Layout>
  )
}

export default Page
