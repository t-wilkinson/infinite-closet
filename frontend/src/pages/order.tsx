import { fetchAPI } from '@/utils/api'
import Checkout from '@/Account/Checkout'
import Layout from '@/Layout'
import { useSelector } from '@/utils/store'

const Page = ({ data }) => {
  const user = useSelector((state) => state.account.user)

  return (
    <Layout>
      <Checkout user={user} data={data} />
    </Layout>
  )
}
export default Page

export const getServerSideProps = async ({ params, query }) => {
  const [paymentMethods] = await Promise.all([
    fetchAPI('/stripe/payment_methods'),
  ])

  return {
    props: {
      data: { paymentMethods },
    },
  }
}
