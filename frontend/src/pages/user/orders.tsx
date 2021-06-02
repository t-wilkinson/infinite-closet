import Orders from '@/User/Orders'
import User from '@/User'
import Layout from '@/Layout'

export const Page = () => {
  return (
    <Layout>
      <User>
        <Orders />
      </User>
    </Layout>
  )
}

export default Page
