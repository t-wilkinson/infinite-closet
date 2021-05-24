import Legal from '@/Legal'
import Layout from '@/Layout'
import { policies } from '@/Legal/constants'

const Page = () => {
  return (
    <Layout title="Privacy Policy">
      <Legal {...policies} />
    </Layout>
  )
}

export default Page
