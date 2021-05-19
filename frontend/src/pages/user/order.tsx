import { useSelector } from '@/utils/store'
import Checkout from '@/Account/Checkout'
import Layout from '@/Layout'

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
  return {
    props: {},
  }
}
