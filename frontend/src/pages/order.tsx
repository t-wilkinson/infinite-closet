import { fetchAPI } from '@/utils/api'
import Checkout from '@/Account/Checkout'
import Layout from '@/Layout'
import { useSelector } from '@/utils/store'

const Page = ({ data }) => {
  const user = useSelector((state) => state.account.user)
  console.log(user)

  return (
    <Layout>
      <Checkout user={user} data={data} />
    </Layout>
  )
}
export default Page

export const getServerSideProps = async ({ params, query }) => {
  const [] = await Promise.all([])

  return {
    props: {
      data: {},
    },
  }
}
