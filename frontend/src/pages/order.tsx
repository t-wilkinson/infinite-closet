import Order from '@/Account/Order'
import Layout from '@/Layout'

const Page = ({ data }) => {
  return (
    <Layout>
      <Order data={data} />
    </Layout>
  )
}
export default Page

export const getServerSideProps = ({ params, query }) => {
  return {
    props: {
      data: {
        cart: [],
        paymentMethods: [],
        addresses: [],
      },
    },
  }
}
