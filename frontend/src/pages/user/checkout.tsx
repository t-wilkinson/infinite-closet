import { useSelector } from '@/utils/store'
import Checkout from '@/User/Checkout'
import Layout from '@/Layout'

const Page = ({ data }) => {
  const user = useSelector((state) => state.user.data)

  // TODO: allow guests
  if (!user) {
    return <div></div>
  }

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
